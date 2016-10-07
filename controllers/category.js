/* Add Multer Library for upload image */
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const Constants 		= require('../constants/constants');
/* Get the list of all Categories name with imformation */
exports.listOfCategories = (req, res) => {
    
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c0519c43592d87b0e6f605') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        Category.find({},function(error,getAllCategories){
            if(getAllCategories){
                var tempCat = new Array();
                for(var i=0;i < getAllCategories.length;i++){
                    tempCat.push(getAllCategories[i]._id);
                }
                SubCategory.find({parent_id: { $in:tempCat}},function(error,getAllSubCategories){
                    //categoryId?/:subCatFlag?
                    var tempResult = {};
                    tempResult.male = new Array();
                    tempResult.female = new Array();
                    for(var i = 0;i<getAllCategories.length;i++){
                        var tmpAr = {};
                        tmpAr.id = getAllCategories[i]._id;
                        tmpAr.name = getAllCategories[i].name;
                        tmpAr.subcategory = new Array();
                        for(j =0;j<getAllSubCategories.length;j++){
                            var subCatAr = {};
                            if(getAllSubCategories[j].parent_id == getAllCategories[i]._id){
                                subCatAr.id = getAllSubCategories[j]._id;
                                subCatAr.name = getAllSubCategories[j].name;
                                tmpAr.subcategory.push(subCatAr);
                            }
                        }
                        if(getAllCategories[i].gender == 'male'){
                            tempResult.male.push(tmpAr);
                        }else{
                            tempResult.female.push(tmpAr);
                        }
                    }
                    if(req.params.categoryId && req.params.subCatFlag){
                        SubCategory.findOne({_id:req.params.categoryId },function(error,subcatRs){
                            console.log(subcatRs);
                            res.render('category/list', { title: 'Category',result:tempResult,activeClass:2,getAllCategories:getAllCategories,catRs:subcatRs,subCatFlag:true,catFlag:false,left_activeClass:3});
                        });
                    }else if(req.params.categoryId){
                        Category.findOne({_id:req.params.categoryId },function(error,catRs){
                            console.log(catRs);
                            res.render('category/list', { title: 'Category',result:tempResult,activeClass:2,getAllCategories:getAllCategories,catRs:catRs,subCatFlag:false,catFlag:true,left_activeClass:3});
                        });
                    }else{
                        res.render('category/list', { title: 'Category',result:tempResult,activeClass:2,getAllCategories:getAllCategories,subCatFlag:false,catFlag:false,left_activeClass:3});
                    }
                });	
            }
        });	
    }
};


/* Add Category page  */
exports.addCategory = (req, res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c0519c43592d87b0e6f605') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        res.render('category/add_category', {
            title: 'Category',
            left_activeClass:3
        });
    }
};

/* Save Category Information */
exports.saveCategory = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c0519c43592d87b0e6f605') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        req.assert('name', 'Category is required').notEmpty();
        var errors = req.validationErrors();  
        if( !errors){   //No errors were found.  Passed Validation!
            Category.count({name:req.body.name,gender:req.body.gender},function(error,categoryCount){
                if(categoryCount == 0){
                    var categoryIns = new Category();
                    categoryIns.name = req.body.name;
                    categoryIns.description = req.body.description;
                    categoryIns.gender = req.body.gender;
                    categoryIns.is_active 	= req.body.is_active;
                    categoryIns.created 	= Date.now();
                    categoryIns.save(function(err){
                        if (err){
                            req.flash('errors',['Something went wronge!']);
                            res.redirect('/category/list');
                            //res.send({status:'error',error:err});
                        }else{
                            req.flash('success',['Category added successfully']);
                            res.redirect('/category/list');
                        }
                    });
                }else{
                    req.flash('errors',['Category already exist!']);
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

/* Remove Category */
exports.removeCategory = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c0519c43592d87b0e6f605') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        Category.remove({_id:req.params.catId},function(error,removeCategory){
            if(error){
                req.flash('message', 'Something Wrong!!');
            }else{
                req.flash('message', 'Remove Successfully.');
            }
            return res.redirect('/category/list');
        });
    }
};
 
/* Edit Category */
exports.editCategory = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c0519c43592d87b0e6f605') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        Category.findOne({_id:req.params.catId},function(error,fetchCategory){
            if(error){
                res.send({status:'error',msg:error});
            }else{
                res.render('category/edit_category', { title: 'Category',fetchCategory:fetchCategory});
            }
        });
    }
};

/* Update edit details */
exports.updateCategory = (req,res) => { 
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c0519c43592d87b0e6f605') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        req.assert('name', 'Category is required').notEmpty();
        var errors = req.validationErrors();  
        if( !errors){   //No errors were found.  Passed Validation!
            Category.count({name:req.body.name,gender:req.body.gender,_id:{$ne:req.body.CatId}},function(error,categoryCount){
                if(categoryCount == 0){
                    updateData = {
                        'name' 	: req.body.name,
                        'description'	: req.body.description,
                        'is_active': req.body.is_active,
                        'gender': req.body.gender,
                        'update' : Date.now()
                    };
                    Category.findByIdAndUpdate(req.body.CatId,updateData, function(error, updateRes){
                        req.flash('success', 'Category updated Successfully.');
                        res.redirect('/category/list');
                    });
                }else{
                    req.flash('errors',['Category already exist!']);
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