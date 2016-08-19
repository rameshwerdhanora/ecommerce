/* Add Multer Library for upload image */
const multer 	= require('multer');
const Brand		= require('../models/Brand');


/* Define Folder name where our user porfile stored */
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/profile_images');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
/* Create Instance for upload folder */
var uploadProfile = multer({ storage : storage}).single('brand_logo');

/* Get the list of all brand name with imformation */
exports.listOfBrand = (req, res) => {
	Brand.find({},function(error,getAllBrands){
		if(getAllBrands)
		{
			res.render('brand/list', { title: 'Brand',getAllBrands:getAllBrands});
		}
	});	
 
};

/* Add Brand page  */
exports.addBrand = (req, res) => {
  res.render('brand/add_brand', {
    title: 'Brand'
  });
};

/* Save Brand Information */
exports.saveBrand = (req,res) => {
    uploadProfile(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }

        var BrandIns 			= new Brand();
        BrandIns.brand_logo 	= req.file.path;
        BrandIns.brand_name  	= req.body.brand_name;
       	BrandIns.brand_desc 	= req.body.brand_desc;
       	BrandIns.user_id 		= req.user._id; 
       	BrandIns.save(function(err) 
        {
        	if (err)
        	{
                res.send({status:'error',error:err});
        	}
        	else 
        	{
        		res.redirect('/listofbrand');
        	}
        });
         
    });
};

/* Remove Brand */
exports.removeBrand = (req,res) => {
	Brand.remove({_id:req.params.brandId},function(error,removeBrand)
	{
		if(error)
		{
			res.send({status:'error',msg:error});
		}
		else
		{
			res.send({status:'success',msg:'Remove Successfully.'});
		}
	});
};
 
/* Edit Brand */
exports.editBrand = (req,res) => {
	Brand.findOne({_id:req.params.brandId},function(error,fetchBrand)
	{
		if(error)
		{
			res.send({status:'error',msg:error});
		}
		else 
		{
			res.render('brand/edit_brand', { title: 'Brand',fetchBrand:fetchBrand});
		}
	});
};

/* Update edit details */

exports.updateBrand = (req,res) => {

	uploadProfile(req,res,function(err) 
	{
		UpdateData = {
			'brand_logo' 	: req.file.path,
			'brand_name'	: req.body.brand_name,
		    'brand_desc'	: req.body.brand_desc,
		    'user_id'		: req.body.user_id 
		};
		Brand.findByIdAndUpdate(req.body._id,UpdateData, function(error, updateRes)
		{
			res.redirect('/listofbrand');
		});
	});
};

/**
* GET /api/listofbrand
* Fetch All Brands from Application for user configuration
*/

exports.listOfAllBrand = (req, res) => {
	Brand.find({},function(error,getAllBrands){
		if(getAllBrands)
		{
			res.send({status:'success',msg:'Successfully fetch all brands.',getAllBrands:getAllBrands});
		}
		else 
		{
			res.send({status:'error',msg:'Unable to found any brands.'});
		}
	});	
 
};






