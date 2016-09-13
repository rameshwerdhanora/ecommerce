/* Add Multer Library for upload image */
const Category		= require('../models/category');


/* Get the list of all Categories name with imformation */
exports.listOfCategories = (req, res) => {
	Category.find({},function(error,getAllCategories){
		if(getAllCategories)
		{
			res.render('category/list', { title: 'Category',getAllCategories:getAllCategories,activeClass:2});
		}
	});	
 
};

/* Add Category page  */
exports.addCategory = (req, res) => {
  res.render('category/add_category', {
    title: 'Category'
  });
};

/* Save Category Information */
exports.saveCategory = (req,res) => {

		var categoryIns 		= new Category();
		categoryIns.name 		= req.body.name;
		categoryIns.description = req.body.description;
		categoryIns.is_active 	= req.body.is_active;
		categoryIns.created 	= Date.now();
       	categoryIns.save(function(err) 
        {
        	if (err)
        	{
                res.send({status:'error',error:err});
        	}
        	else 
        	{
        		res.redirect('/category/list');
        	}
        });
 
};

/* Remove Category */
exports.removeCategory = (req,res) => {
	Category.remove({_id:req.params.catId},function(error,removeCategory)
	{
		if(error)
		{
			req.flash('message', 'Something Wrong!!');
		}
		else
		{
			req.flash('message', 'Remove Successfully.');
		}
		return res.redirect('/category/list');
	});
};
 
/* Edit Category */
exports.editCategory = (req,res) => {
	Category.findOne({_id:req.params.catId},function(error,fetchCategory)
	{
		if(error)
		{
			res.send({status:'error',msg:error});
		}
		else 
		{
			res.render('category/edit_category', { title: 'Category',fetchCategory:fetchCategory});
		}
	});
};

/* Update edit details */

exports.updateCategory = (req,res) => {
 
		updateData = {
			'name' 			: req.body.name,
			'description'	: req.body.description,
		    'is_active'		: req.body.is_active,
		    'update'		: Date.now()
		};
		Category.findByIdAndUpdate(req.body._id,updateData, function(error, updateRes)
		{
			res.redirect('/category/list');
		});
};