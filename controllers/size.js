/* Add Size Model for DB connectivity  */

const Size			= require('../models/size');
const Attribute		= require('../models/attribute');
const AttributeOptions		= require('../models/attributeOption');
const Constants 		= require('../constants/constants');
const async = require('async');



function getAttributeOptions(attributIds,callback){
    AttributeOptions.find({attribute_id: {$in : attributIds}},function(error,attribOptionRes){
       if(error){
           callback(error,new Array());
       }else{
           callback(error,attribOptionRes);
        }
   });
}

/* Get the list of all color name with imformation */
exports.listOfSize = (req, res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051d843592d87b0e6f608') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        var finalRs = new Array();
        finalRs[0] = new Array();
        finalRs[1] = new Array();
        finalRs[2] = new Array();
        Size.find({},function(error,sizeResult){
            async.eachSeries(sizeResult, function(record, callback){
                var tmpAr = {};
                tmpAr['id']  = record._id;
                tmpAr['name'] = record.size_name;

                /* Use asyn Parallel method for waiting those functions value */
                async.parallel(
                    [
                        function(callback){// To get attribut name and option name
                            if(record.listofattrmap != null){
                                //var attributes = record.listofattrmap.split(',');
                                getAttributeOptions(record.listofattrmap,function(err,opRes){
                                    if(opRes.length){
                                        //var optionFilter = {};
                                        var optionFilter = new Array();
                                        for(var i = 0;i<opRes.length;i++){
                                            /*if (opRes[i].attribute_id in optionFilter){
                                                optionFilter[opRes[i].attribute_id].push(opRes[i].value);
                                            }else{
                                                optionFilter[opRes[i].attribute_id] = new Array();
                                                optionFilter[opRes[i].attribute_id].push(opRes[i].value);
                                            }*/
                                            optionFilter.push(opRes[i].value);
                                        }
                                        tmpAr['options'] = optionFilter;
                                    }else{
                                        tmpAr['options'] = new Array();
                                    }
                                    switch(record.gender){
                                        case 'male':
                                            finalRs[0].push(tmpAr);
                                            break;
                                        case 'female':
                                            finalRs[1].push(tmpAr);
                                            break;
                                        case 'unisex':
                                            finalRs[2].push(tmpAr);
                                            break;
                                    }
                                    callback(err); 
                                });
                            }else{
                                callback(); 
                            }
                        }
                    ], 
                    function(err){
                        callback(err); 
                    }
                )
            }, 
            function(err){
                //console.log(finalRs[0]);
                /*
                for(var i =0;i<finalRs.length;i++){
                    console.log(finalRs[i]);
                    console.log(finalRs[i].length);
                    for(var cr=0;cr<finalRs[i].length;cr++){
                        console.log(finalRs[i][cr].id);
                        console.log(finalRs[i][cr].name);
                        for(var jj=0;jj<finalRs[i][cr].options.length;jj++){
                            console.log( finalRs[i][cr].options[jj] );
                        }
                    }
                }
                */
                res.render('size/list', {
                    title: 'Size',
                    fetchAllAttribute:finalRs,
                    result:finalRs,
                    activeClass:4,
                    left_activeClass:3
                });
            }); 
        });
    }
};

/* Add Size page  */
exports.addSize = (req, res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051d843592d87b0e6f608') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
	Attribute.find({},function(error,fetchAllAttribute){
            res.render('size/add_size', {
                title: 'Size',
                fetchAllAttribute:fetchAllAttribute,
                left_activeClass:3,
                activeClass:4,
            });	
	})	
    }
};

/* Save Size Information */
exports.saveSize = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051d843592d87b0e6f608') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        Size.count({size_name:req.body.size_name},function(error,sizeCount){
            if(sizeCount == 0){
                req.assert('size_name', 'Size is required').notEmpty();
                req.assert('gender', 'Gender is required').notEmpty();
                req.assert('listofattrmap', 'Attribute is required').notEmpty();
                req.assert('is_published', 'Publish is required').notEmpty();
                var errors = req.validationErrors();  
                if( !errors){   //No errors were found.  Passed Validation!
                    var sizeIns = new Size();
                    sizeIns.size_name = req.body.size_name;
                    sizeIns.gender = req.body.gender,
                    sizeIns.listofattrmap = req.body.listofattrmap,
                    sizeIns.is_published = req.body.is_published,
                    sizeIns.user_id = req.user._id; 
                    sizeIns.save(function(err) {
                        if (err){
                            res.send({status:'error',error:err});
                        }else{
                            res.redirect('/size/list');
                        }
                    });
                }else{
                    var er = new Array();
                    for(var i = 0;i<errors.length;i++){
                        er.push(errors[i].msg);
                    }
                    req.flash('errors',er);
                    res.redirect('/size/add');
                }
            }else{
                req.flash('errors',['Size is already exist!']);
                res.redirect('/size/add');
            }
        });
    }
};

/* Remove Size */
exports.removeSize = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051d843592d87b0e6f608') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
	Size.remove({_id:req.params.sizeId},function(error,removeSize){
            if(error){
                res.send({status:'error',msg:error});
            }else{
                res.send({status:'success',msg:'Remove Successfully.'});
            }
	});
    }
};
 
/* Edit Size */
exports.editSize = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051d843592d87b0e6f608') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
	Size.findOne({_id:req.params.sizeId},function(error,fetchSize)
	{
		Attribute.find({},function(error,fetchAllAttribute)
		{
                    if(error)
                    {
                            res.send({status:'error',msg:error});
                    }
                    else 
                    {
                            res.render('size/edit_size', { title: 'Size',fetchSize:fetchSize,fetchAllAttribute:fetchAllAttribute,left_activeClass:3,
                    activeClass:4});
                    }
		});	
	});
    }
};

/* Update edit details */

exports.updateSize = (req,res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051d843592d87b0e6f608') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        Size.count({$and:[{size_name:req.body.size_name,gender:{$ne:req.body.gender}}],_id:{$ne:req.body._id}},function(error,sizeCount){
            if(sizeCount == 0){
                updateData = {
                    'size_name' : req.body.size_name,
                    'gender'	: req.body.gender,
                    'is_published' : req.body.is_published,
                    'listofattrmap' : req.body.listofattrmap,
                    'user_id' : req.body.user_id 
                };
                Size.findByIdAndUpdate(req.body._id,updateData, function(error, updateRes){
                    req.flash('success',['Size updated successfully!']);
                    res.redirect('/size/list');
                });
            }else{
                req.flash('errors',['Size is already exist!']);
                res.redirect('/size/edit/'+req.body._id);
            }
        });
    }
};


/**
* GET /api/listofsize
* Fetch All Sizes from Application for user configuration
*/


exports.listOfAllSize = (req, res) => {
    if(req.user.role_id == 6 || ((req.user.role_id == 3 || req.user.role_id == 4 ) && req.user.userPermissions.indexOf('57c051d843592d87b0e6f608') == -1)){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
	Size.find({},function(error,getAllSizes){
		if(getAllSizes)
		{
			res.send({status:'success',msg:'Successfully fetch all sizes.',getAllSizes:getAllSizes});
		}
		else 
		{
			res.send({status:'error',msg:'Unable to found any sizes.'});
		}
	});
    }
};
 
 







