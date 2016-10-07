/* Add Multer Library for upload image */
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const Constants 		= require('../constants/constants');



/* Save Sub Category Information */
exports.saveSubCategory = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c0519c43592d87b0e6f605') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        req.assert('name', 'Sub Category is required').notEmpty();
        req.assert('parent_id', 'Category is required').notEmpty();
        var errors = req.validationErrors();  
        if( !errors){   //No errors were found.  Passed Validation!
            SubCategory.count({name:req.body.name,parent_id:req.body.parent_id},function(error,subCategoryCount){
                if(subCategoryCount == 0){
                    var subCategoryIns = new SubCategory();
                    subCategoryIns.name = req.body.name;
                    subCategoryIns.description = req.body.description;
                    subCategoryIns.is_active = req.body.is_active;
                    subCategoryIns.parent_id = req.body.parent_id;
                    subCategoryIns.created = Date.now();
                    subCategoryIns.save(function(err){
                        if (err){
                            //res.send({status:'error',error:err});
                            req.flash('errors',['Something went wronge!']);
                            res.redirect('/category/list');
                        }else{
                            //res.redirect('/listofsubcategories');
                            req.flash('success',['Subcategory added successfully']);
                            res.redirect('/category/list');
                        }
                    });
                }else{
                    req.flash('errors',['Sub Category already exist!']);
                    res.redirect('/category/list');
                }
            });
        }else{
            var er = new Array();
            for(var i = 0;i<errors.length;i++){
                er.push(errors[i].msg);
            }
            req.flash('errors',er);
            res.redirect('/category/list');
        }
    }
};



/* Update edit details */
exports.updateSubCategory = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c0519c43592d87b0e6f605') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        req.assert('name', 'Sub Category is required').notEmpty();
        req.assert('parent_id', 'Category is required').notEmpty();
        var errors = req.validationErrors();  
        if( !errors){   //No errors were found.  Passed Validation!
            SubCategory.count({name:req.body.name,parent_id:req.body.parent_id,_id:{$ne:req.body.subCatId}},function(error,subCategoryCount){
                if(subCategoryCount == 0){
                    updateData = {
                        'name' 	 : req.body.name,
                        'description' : req.body.description,
                        'is_active' : req.body.is_active,
                        'parent_id' : req.body.parent_id,
                        'update' : Date.now()
                    };
                    console.log(updateData);
                    console.log(req.body.subCatId);
                    SubCategory.findByIdAndUpdate(req.body.subCatId,updateData, function(error, updateRes){
                        req.flash('success',['Subcategory updated successfully']);
                        res.redirect('/category/list');
                    });
                }else{
                    req.flash('errors',['Sub Category already exist!']);
                    res.redirect('/category/list');
                }
            });
        }else{
            var er = new Array();
            for(var i = 0;i<errors.length;i++){
                er.push(errors[i].msg);
            }
            req.flash('errors',er);
            res.redirect('/category/list');
        }
    }
};


/* Get the list of all Sub Categories name with imformation 
exports.listOfSubCategories = (req, res) => {
    SubCategory.find({},function(error,getAllSubCategories){
        if(getAllSubCategories){
                res.render('subCategory/list', { title: 'SubCategory',getAllSubCategories:getAllSubCategories});
        }
    });	
};

/* Add Sub Category page  
exports.addSubCategory = (req, res) => {
    Category.find({},function(error,getAllCategories){
        res.render('subCategory/add_subcategory', {
            title: 'SubCategory',
            getAllCategories : getAllCategories
        });		
    });
};



/* Remove Sub Category 
exports.removeSubCategory = (req,res) => {
    SubCategory.remove({_id:req.params.subcatId},function(error,removeSubCategory){
        if(error){
            res.send({status:'error',msg:error});
        }else{
            res.send({status:'success',msg:'Remove Successfully.'});
        }
    });
};
 
/* Edit Sub Category 
exports.editSubCategory = (req,res) => {
    SubCategory.findOne({_id:req.params.subcatId},function(error,fetchSubCategory){
        Category.find({},function(error,getAllCategories){
            if(error){
                res.send({status:'error',msg:error});
            }else{
                res.render('subCategory/edit_subcategory', { title: 'SubCategory',fetchSubCategory:fetchSubCategory,getAllCategories:getAllCategories});
            }
        });
    });
};

*/