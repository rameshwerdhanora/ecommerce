/* Add Size Model for DB connectivity  */

const Attribute		= require('../models/attribute');
const passport = require('passport');

/* Get the list of all color name with imformation */
exports.list = (req, res) => {
	Attribute.find({},function(error,getAllAttributes){
		if(getAllAttributes)
		{
			res.render('attribute/list', { title: 'Attribute List',getAllAttributes:getAllAttributes});
		}
	});	
 
};

/* Add Attribute page  */
exports.create = (req, res) => {
  res.render('attribute/create', {   
    title: 'Create Attribute'
  });
};

/* Save Attribute Information */
exports.saveAttribute = (req,res) => {
	//console.log(req.body);
    var attrIns 			= new Attribute();
    attrIns.name 			= req.body.attr_name;
    attrIns.type  			= req.body.type;
    attrIns.is_required  	= req.body.is_required;
    attrIns.is_post_feed	= req.body.is_post_feed,
   	attrIns.product_manager = req.body.product_manager; 
   	attrIns.display_type 	= req.body.display_type; 
   	attrIns.is_published 	= req.body.is_published; 
   	attrIns.save(function(err) 
    {
    	if (err)
    	{
            res.send({status:'error',error:err});
    	}
    	else 
    	{
    		res.redirect('/attribute/list');
    	}
    });
};

/* Delete Attribute */
exports.deleteAttribute = (req,res) => {
	Attribute.remove({_id:req.params.attributeId},function(error,deleteAttribute)
	{
		if(error)
		{
			res.send({status:'error',msg:error});
		}
		else
		{
			res.send({status:'success',msg:'Attribute deleted Successfully.'});
		}
	});
};
 
/* Edit Attribute */
exports.edit = (req,res) => {
	Attribute.findOne({_id:req.params.attributeId},function(error,fetchAttribute)
	{
		if(error)
		{
			res.send({status:'error',msg:error});
		}
		else 
		{
			res.render('attribute/edit', { title: 'Edit Attribute',fetchAttribute:fetchAttribute});
		}
	});
};

/* Update edit details */

exports.updateAttribute = (req,res) => {

	updateData = {
		'name' :  req.body.attr_name,
		'is_required' 	: req.body.is_required,
		'is_post_feed'		: req.body.is_post_feed,
		'product_manager'	: req.body.product_manager,
		'display_type'		: req.body.display_type,
	    'is_published'		: req.body.is_published 
	};
	Attribute.findByIdAndUpdate(req.body._id,updateData, function(error, updateRes)
	{
		res.redirect('/attribute/list');
	});
};
 







