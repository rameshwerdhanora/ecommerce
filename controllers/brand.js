/* Add Multer Library for upload image */
const Multer 	= require('multer');
const Brand		= require('../models/brand');

/* Define Folder name where our user porfile stored */
var storage =   Multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/uploads/brands_logo');
  },
  filename: function (req, file, callback) {
  	var realname = file.originalname.replace(/ /g,"_");
    callback(null, Date.now() + '_' + realname);
  }
});
/* Create Instance for upload folder */
var uploadBrand = Multer({ storage : storage}).any();

/* Get the list of all brand name with imformation */
exports.listOfBrand = (req, res) => {
	Brand.find({},function(error,getAllBrands){
		if(getAllBrands)
		{
			res.render('brand/list', { title: 'Brand',getAllBrands:getAllBrands,activeClass:5});
		}
	});	
 
};

/* Add Brand page  */
// exports.addBrand = (req, res) => {
//   res.render('brand/add_brand', {
//     title: 'Brand'
//   });
// };

/* Save Brand Information */
exports.saveBrand = (req,res) => {
	uploadBrand(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        
        //var newname = req.file.path.replace('public/','');
        var brandIns 			= new Brand();
        brandIns.brand_logo 	= req.files[0].path.replace('public/','');
        brandIns.brand_cover 	= req.files[1].path.replace('public/','');
        brandIns.brand_name  	= req.body.brand_name;
       	brandIns.brand_desc 	= req.body.brand_desc;
       	brandIns.user_id 		= req.user._id; 
       	brandIns.save(function(err) 
        {
        	if (err)
        	{
                res.send({status:'error',error:err});
        	}
        	else 
        	{
        		res.redirect('/brand/list');
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
			req.flash('message', 'Something Wrong!!');
		}
		else
		{
			req.flash('message', 'Remove Successfully.');
		}
		return res.redirect('/brand/list');
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

	uploadBrand(req,res,function(err) 
	{
		//var newname = req.file.path.replace('public/','');
		updateData = {
			'brand_logo' 	: req.files[0].path.replace('public/',''),
			'brand_cover' 	: req.files[1].path.replace('public/',''),
			'brand_name'	: req.body.brand_name,
		    'brand_desc'	: req.body.brand_desc,
		    'user_id'		: req.body.user_id 
		};
		Brand.findByIdAndUpdate(req.body._id,updateData, function(error, updateRes)
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






