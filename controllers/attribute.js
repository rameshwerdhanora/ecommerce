/* Add Size Model for DB connectivity  */

const Attribute		= require('../models/attribute');
const AttributeOption   = require('../models/attributeOption');
const passport = require('passport');
const Constants 		= require('../constants/constants');
const flash = require('connect-flash');

/* Get the list of all color name with imformation */
exports.list = (req, res) => {
    
    var page = (req.query.page == undefined)?1:req.query.page;
    page = (page == 0)?1:page;
    var skipRecord = (page-1)*Constants.RECORDS_PER_PAGE;
    
    Attribute.count(function(err, totalRecord) { 
        //if(totalRecord > 0){
            var totalPage = Math.ceil(totalRecord/Constants.RECORDS_PER_PAGE);
            Attribute.find()
                    .limit(Constants.RECORDS_PER_PAGE)
                    .skip(skipRecord)
                    .sort('-_id')
                    .exec(function(error,getAllAttributes){
                if(getAllAttributes){
                    //var msg = req.flash('message');
                    res.render('attribute/list', {title: 'Attribute List', getAllAttributes:getAllAttributes, currentPage:page, totalRecord:totalRecord, totalPage:totalPage, activeClass:6,left_activeClass:3 });
                }
            });
        /*}else{
            res.render('attribute/list',{title: 'Attribute List',activeClass:6});
        }*/
        
    });
    
};

/* Add Attribute page  */
exports.create = (req, res) => {
  res.render('attribute/create', {   
    title: 'Create Attribute',
    left_activeClass:3,
    activeClass:6
  });
};

/* To get attribute options*/
exports.getAttributeOptions = (req,res) =>{
    var attribId = req.body.attribId;    
    //var attrbModel = new AttributeOption();
    AttributeOption.find({attribute_id:attribId},function(error,allAttributeOptions){
        if(allAttributeOptions){
            res.send({status:'success',data:allAttributeOptions});
        }
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
   	attrIns.save(function(err,rm){
    	if (err)
    	{
            req.flash('errors', ['There is some error occured']);
            res.redirect('/attribute/list');
            //res.send({status:'error',error:err});
    	}
    	else 
    	{   
            
            if(req.body.type == 'select' || req.body.type == 'multiselect'){
                var attribOptions = req.body.optionName;
                for(var i=0;i < attribOptions.length;i++){
                    var attrbModel = new AttributeOption();
                    attrbModel.value = attribOptions[i];
                    attrbModel.attribute_id = rm._id;
                    attrbModel.save(function(err){});
                }
            }
            req.flash('success', ['Attribute saved successfully']);
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
                    //req.flash('errors', ['There is no such attribute found']);
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
			req.flash('errors', ['There is no such attribute found']);
                        res.redirect('/attribute/list');
		}
		else 
		{
                    
                    res.render('attribute/edit', { left_activeClass:3,title: 'Edit Attribute',fetchAttribute:fetchAttribute});
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
            req.flash('success', ['Attribute updated successfully']);
            res.redirect('/attribute/list');
	});
};

/* To delete attribute option */
exports.deleteAttributeOption = (req,res) => {
    AttributeOption.remove({_id:req.body.attributeOptionId},function(error,deleteAttributeOption){
        if(error){
                res.send({status:'error',msg:error});
        }else{
                res.send({flag:1, status:'success',msg:'Attribute option deleted Successfully.'});
        }
    });
};

/* To delete attribute option */
exports.updateAttributeOption = (req,res) => {
        updateData = {'value' :  req.body.optionNm};
	AttributeOption.findByIdAndUpdate(req.body.attributeOptionId,updateData, function(error, updateRes)
	{
            res.send({flag:1, status:'success',msg:'Attribute option updated Successfully.'});
	});
};

/* To add new attribut option */
exports.addAttributeOption = (req,res) => {
    
    var attributeOptionModel = new AttributeOption();
        attributeOptionModel.value = req.body.optionNm;
        attributeOptionModel.attribute_id = req.body.attributeId;
   	attributeOptionModel.save(function(err,attributeOptionResult){
    	if (err){
            res.send({flag:0, status:'error',msg:'Attribute option not saved'});
    	}else{
            res.send({flag:1, status:'success',msg:'Attribute option saved successfully.',attribOptionId:attributeOptionResult._id});
    	}
    });
    
};