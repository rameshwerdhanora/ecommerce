/*
	@author : Cis Team
	@date : 01-Sep-2016
	@File : All Product related task are in this file.

*/

const async = require('async');
const Category   	= require('../../models/category');
const SubCategory   = require('../../models/subCategory');
const Color 	  	= require('../../models/color');


/**
 * GET /api/filter/fetchfilter
 * Process for fetch Filter Options.
 */

exports.fetchFilterOptions = (req, res) => { 
  
  Category.find({is_active:1},function(error,fetchAllCategories)
  {
  	if(fetchAllCategories)
  	{	
  		SubCategory.find({is_active:1},function(error,fetchAllSubCategories)
		{
			Color.find({},function(error, fetchAllColors)
			{
				return res.json({
					"status":'success',
					"msg":'Found filter values.',
					categories:fetchAllCategories,
					subCategories:fetchAllSubCategories,
					colors:fetchAllColors,
					priceMin:'20',
					priceMax:'999'})
			});
		});
  	}
  	else
  	{
  		return res.json({"status":'error',"msg":'Admin not create any category.'})
  	}
  });
};

/**
 * GET /api/filter/category/:catId
 * Process for fetch Filter Options.
 */

exports.fetchSelectedSubCategory = (req, res) => { 
  
  	SubCategory.find({parent_id:req.params.catId,is_active:'1'},function(error,fetchSubCategory)
	{
		if(fetchSubCategory)
		{
			res.send({status:'success',msg:'Fetch all sub categories.',fetchSubCategory:fetchSubCategory});
		}
		else 
		{
			res.send({status:'error',msg:'Not any sub category created in selected category.'});
		}
	});
};






