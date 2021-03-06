/* Add Size Model for DB connectivity  */

const Attribute		= require('../models/attribute');
const AttributeOption   = require('../models/attributeOption');
const Size   = require('../models/size');
const passport = require('passport');
const Constants 		= require('../constants/constants');
const flash = require('connect-flash');






/* Get the list of all color name with imformation */
exports.list = (req, res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051ec43592d87b0e6f609') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
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
    }
    
};

/* Add Attribute page  */
exports.create = (req, res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051ec43592d87b0e6f609') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        res.render('attribute/create', {   
          title: 'Create Attribute',
          left_activeClass:3,
          activeClass:6
        });
    }
};

/* To get attribute options*/
exports.getAttributeOptions = (req,res) =>{
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051ec43592d87b0e6f609') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        var attribId = req.body.attribId;    
        //var attrbModel = new AttributeOption();
        AttributeOption.find({attribute_id:attribId},function(error,allAttributeOptions){
            if(allAttributeOptions){
                res.send({status:'success',data:allAttributeOptions});
            }
        });
    }
};

/* Save Attribute Information */
exports.saveAttribute = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051ec43592d87b0e6f609') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        req.assert('attr_name', 'Attribute is required').notEmpty();
        var errors = req.validationErrors();  
        if( !errors){   //No errors were found.  Passed Validation!
            Attribute.count({name:req.body.attr_name},function(error,attribCount){
                if(attribCount == 0){
                    var attrIns 		= new Attribute();
                    attrIns.name 		= req.body.attr_name;
                    attrIns.type  		= req.body.type;
                    attrIns.is_required  	= req.body.is_required;
                    attrIns.is_post_feed	= req.body.is_post_feed,
                    attrIns.product_manager     = req.body.product_manager; 
                    attrIns.display_type 	= req.body.display_type; 
                    attrIns.is_published 	= req.body.is_published; 
                    attrIns.save(function(err,rm){
                        if (err){
                            req.flash('errors', ['There is some error occured']);
                            res.redirect('/attribute/list');
                        }else{   

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
                 }else{
                    req.flash('errors',['Attribute is already exist!']);
                    res.redirect('/attribute/add');
                }
            });
        }else{
            var er = new Array();
            for(var i = 0; i < errors.length; i++){
                er.push(errors[i].msg);
            }
            req.flash('errors',er);
            res.redirect('/attribute/add');
        }
    }
};

/* Delete Attribute */
exports.deleteAttribute = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051ec43592d87b0e6f609') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        Size.find({listofattrmap:{$in:[req.params.attributeId]}},function(error,attrRes){
           if(error == null){
               if(attrRes && attrRes.length > 0 ){
                    var tempAttr = [];
                    for(var i = 0; i < attrRes.length; i++){
                        if(attrRes[i].listofattrmap && attrRes[i].listofattrmap.length){
                            for(var j = 0; j < attrRes.length; j++){
                                tempAttr.push(String(attrRes[i].listofattrmap[j]));
                            }
                        }
                    }
                    var deleteAr = [];
                    var matchFlag = false;
                    if(tempAttr.indexOf(String(req.params.attributeId)) == -1){
                         deleteAr.push(req.params.attributeId);
                    }else{
                        matchFlag = true;
                    }
                    if(deleteAr.length > 0){
                        Attribute.remove({_id:{$in:deleteAr}},function(error,removeRes){
                            if(error == null){
                                if(matchFlag){
                                    req.flash('success',['Removed only those attribut which are not associated with any of the sizes!']);
                                }else{
                                    req.flash('success',['Attribut has been removed successfully']);
                                }
                                res.send({status:'success',data:'Deleted'});
                            }
                        });
                    }else{
                        var msg = 'Attribute associated with Sizes! So it can not be removed.';
                        req.flash('errors',[msg]);
                        res.send({status:'error',data:msg});
                    }
                }else{
                    Attribute.remove({_id:{$in:req.body.deleteArr}},function(error,removeRes){
                        if(error == null){
                            req.flash('success',['Attribute has been removed successfully']);
                            res.send({status:'success',data:'Deleted'});
                        }else{
                            req.flash('errors',['Something went wronge!']);
                            res.send({status:'error',data:error});
                        }
                    });
                }
            }else{
                 req.flash('errors',['Something went wronge!']);
                 res.send({status:'error',data:error});
            }
        });
    }
};
 
/* Edit Attribute */
exports.edit = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051ec43592d87b0e6f609') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
	Attribute.findOne({_id:req.params.attributeId},function(error,fetchAttribute)
	{
		if(error)
		{
			req.flash('errors', ['There is no such attribute found']);
                        res.redirect('/attribute/list');
		}
		else 
		{
                    
                    res.render('attribute/edit', { left_activeClass:3,title: 'Edit Attribute',fetchAttribute:fetchAttribute,activeClass:6});
		}
	});
    }
};

/* Update edit details */

exports.updateAttribute = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051ec43592d87b0e6f609') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        req.assert('attr_name', 'Attribute is required').notEmpty();
        var errors = req.validationErrors();  
        if( !errors){   //No errors were found.  Passed Validation!
            Attribute.count({name:req.body.attr_name,_id:{$ne:req.body._id}},function(error,attribCount){
                if(attribCount == 0){
                    updateData = {
                        'name' :  req.body.attr_name,
                        'is_required' 	: req.body.is_required,
                        'is_post_feed'	: req.body.is_post_feed,
                        'product_manager'	: req.body.product_manager,
                        'display_type'	: req.body.display_type,
                        'is_published'	: req.body.is_published 
                    };
                    Attribute.findByIdAndUpdate(req.body._id,updateData, function(error, updateRes)
                    {
                        req.flash('success', ['Attribute updated successfully']);
                        res.redirect('/attribute/list');
                    });
                }else{
                    req.flash('errors',['Attribute is already exist!']);
                    res.redirect('/attribute/edit/'+req.body._id);
                }
            });
        }else{
            var er = new Array();
            for(var i = 0; i < errors.length; i++){
                er.push(errors[i].msg);
            }
            req.flash('errors',er);
            res.redirect('/attribute/edit/'+req.body._id);
        }
    }
};

/* To delete attribute option */
exports.deleteAttributeOption = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051ec43592d87b0e6f609') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        AttributeOption.remove({_id:req.body.attributeOptionId},function(error,deleteAttributeOption){
            if(error){
                    res.send({status:'error',msg:error});
            }else{
                    res.send({flag:1, status:'success',msg:'Attribute option deleted Successfully.'});
            }
        });
    }
};

/* To delete attribute option */
exports.updateAttributeOption = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051ec43592d87b0e6f609') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        updateData = {'value' :  req.body.optionNm};
	AttributeOption.findByIdAndUpdate(req.body.attributeOptionId,updateData, function(error, updateRes)
	{
            res.send({flag:1, status:'success',msg:'Attribute option updated Successfully.'});
	});
    }
};

/* To add new attribut option */
exports.addAttributeOption = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051ec43592d87b0e6f609') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
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
    }
};