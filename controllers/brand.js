/* Add Multer Library for upload image */
const Multer 	= require('multer');
const Brand		= require('../models/brand');
const Constants 		= require('../constants/constants');

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
    
    var page = (req.query.page == undefined)?1:req.query.page;
    page = (page == 0)?1:page;
    var skipRecord = (page-1)*Constants.RECORDS_PER_PAGE;
    
    
    Brand.count(function(err, totalRecord) { 
        var totalPage = Math.ceil(totalRecord/Constants.RECORDS_PER_PAGE);
        Brand.find()
                .limit(Constants.RECORDS_PER_PAGE)
                .skip(skipRecord)
                .sort('-_id')
                .exec(function(error,getAllBrands){
            if(req.params.brandId){
                Brand.findOne({_id:req.params.brandId},function(error,brandRes){
                    if(error){
                        req.flash('errors', 'Something went wrong!!');
                    }else{
                        res.render('brand/list', { title: 'Brand',getAllBrands:getAllBrands,activeClass:5,editRes:brandRes,currentPage:page, totalRecord:totalRecord, totalPage:totalPage,left_activeClass:3});
                    }
                });
            }else{
                res.render('brand/list', { title: 'Brand',getAllBrands:getAllBrands,activeClass:5,editRes:false,currentPage:page, totalRecord:totalRecord, totalPage:totalPage,left_activeClass:3});
            }
        });
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
    
    /***To create directory if not exist***/
    var fs = require('fs');
    var dirBrandLogo = './public/uploads/brands_logo';
    var dirProfileImg = './public/uploads/profile_images';

    if (!fs.existsSync(dirBrandLogo)){
        fs.mkdirSync(dirBrandLogo);
    }

    if (!fs.existsSync(dirProfileImg)){
        fs.mkdirSync(dirProfileImg);
    }
    
    uploadBrand(req,res,function(err) {
        req.assert('brand_name', 'Brand name is required').notEmpty();
        req.assert('brand_desc', 'Brand description is required').notEmpty();
        var errors = req.validationErrors();  
        if( !errors){   //No errors were found.  Passed Validation!
            Brand.count({brand_name:req.body.brand_name},function(error,brandCount){
                
            
                if(brandCount == 0){


                    if(err) {
                        req.flash('errors',['Some error is occured please try again']);
                        res.redirect('/brand/list');
                    }
                    var brandIns 		= new Brand();
                    if(req.files.length > 0){
                        for(var i = 0;i < req.files.length;i++){
                            switch(req.files[i].fieldname){
                                case 'brand_logo':
                                    brandIns.brand_logo = req.files[i].path.replace('public','');
                                    break;
                                case 'brand_cover':
                                    brandIns.brand_cover = req.files[i].path.replace('public','');
                                    break;
                            }
                        }
                    }
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
                            req.flash('success',['Brand added successfully']);
                            res.redirect('/brand/list');
                        }
                    });
                }else{
                    req.flash('errors',['Brand already exist']);
                    res.redirect('/brand/list');
                }
            });
        }else{
            var er = new Array();
            for(var i = 0;i<errors.length;i++){
                er.push(errors[i].msg);
            }
            req.flash('errors',er);
            res.redirect('/brand/list');
        }
    });
};

/* Update edit details */

exports.updateBrand = (req,res) => {
	uploadBrand(req,res,function(err) {
            if(err) {
                req.flash('errors',['Some error is occured please try again']);
                res.redirect('/brand/list/'+req.body.brandId);
            }
            
            updateData = {

                'brand_name'	: req.body.brand_name,
                'brand_desc'	: req.body.brand_desc,
                'user_id'		: req.body.user_id 
            };
            if(req.files.length > 0){
                for(var i = 0;i < req.files.length;i++){
                    switch(req.files[i].fieldname){
                        case 'brand_logo':
                            updateData.brand_logo = req.files[i].path.replace('public','');
                            break;
                        case 'brand_cover':
                            updateData.brand_cover = req.files[i].path.replace('public','');
                            break;
                    }
                }
            }
            Brand.findByIdAndUpdate(req.body.brandId,updateData, function(error, updateRes)
            {
                req.flash('success',['Brand has been updated successfully']);
                res.redirect('/brand/list');
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






