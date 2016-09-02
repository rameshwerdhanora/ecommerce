/* Add Multer Library for upload image */
const Category		= require('../models/category');
const SubCategory	= require('../models/subCategory');


/* Get the list of all Sub Categories name with imformation */
exports.listOfSubCategories = (req, res) => {
	SubCategory.find({},function(error,getAllSubCategories){
		if(getAllSubCategories)
		{
			res.render('subCategory/list', { title: 'SubCategory',getAllSubCategories:getAllSubCategories});
		}
	});	
 
};

/* Add Sub Category page  */
exports.addSubCategory = (req, res) => {
	Category.find({},function(error,getAllCategories){
	  res.render('subCategory/add_subcategory', {
	    title: 'SubCategory',
	    getAllCategories : getAllCategories
	  });		
	});
};

/* Save Sub Category Information */
exports.saveSubCategory = (req,res) => {

		var subCategoryIns 			= new SubCategory();
		subCategoryIns.name 		= req.body.name;
		subCategoryIns.description 	= req.body.description;
		subCategoryIns.is_active 	= req.body.is_active;
		subCategoryIns.parent_id 	= req.body.parent_id;
		subCategoryIns.created 		= Date.now();
       	subCategoryIns.save(function(err) 
        {
        	if (err)
        	{
                res.send({status:'error',error:err});
        	}
        	else 
        	{
        		res.redirect('/listofsubcategories');
        	}
        });
 
};

/* Remove Sub Category */
exports.removeSubCategory = (req,res) => {
	SubCategory.remove({_id:req.params.subcatId},function(error,removeSubCategory)
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
 
/* Edit Sub Category */
exports.editSubCategory = (req,res) => {
	SubCategory.findOne({_id:req.params.subcatId},function(error,fetchSubCategory)
	{
		Category.find({},function(error,getAllCategories)
		{
			if(error)
			{
				res.send({status:'error',msg:error});
			}
			else 
			{
				res.render('subCategory/edit_subcategory', { title: 'SubCategory',fetchSubCategory:fetchSubCategory,getAllCategories:getAllCategories});
			}
		});
	});
};

/* Update edit details */

exports.updateSubCategory = (req,res) => {

	updateData = {
		'name' 			: req.body.name,
		'description'	: req.body.description,
	    'is_active'		: req.body.is_active,
	    'parent_id'		: req.body.parent_id,
	    'update'		: Date.now()
	};

	SubCategory.findByIdAndUpdate(req.body._id,updateData, function(error, updateRes)
	{
		res.redirect('/listofsubcategories');
	});
 
};

