const Tag = require('../models/tag');
const Constants 		= require('../constants/constants');

/**
 * GET /
 * Email Template list
 */
exports.list = (req, res) => {
    var dateFormat = require('dateformat');
    var page = (req.query.page == undefined)?1:req.query.page;
    page = (page == 0)?1:page;
    var skipRecord = (page-1)*Constants.RECORDS_PER_PAGE;
    
    
    Tag.count(function(err, totalRecord) { 
        
        var totalPage = Math.ceil(totalRecord/Constants.RECORDS_PER_PAGE);
        Tag.find()
                .limit(Constants.RECORDS_PER_PAGE)
                .skip(skipRecord)
                .sort('-_id')
                .exec(function(error,resAllTag){
            if(resAllTag){
                res.render('tag/list', {title: 'Has tage List',activeFlag:1,resultRes:resAllTag, currentPage:page, totalRecord:totalRecord, totalPage:totalPage,left_activeClass:3,dateFormat:dateFormat});
            }
        });
    });
};


/**
 * get
 * add email Template
 */
exports.add = (req,res) => {
    res.render('tag/add', {title: 'Add hash tag',activeFlag:2,left_activeClass:3});
}


/**
 * Post
 * Save email Template 
 */
exports.save = (req,res) => {
    Tag.count({name:req.body.name},function(error,tagRes){
        if(tagRes == 0){
            req.assert('name', 'Hash tag is required').notEmpty();
            var errors = req.validationErrors();  
            if( !errors){   //No errors were found.  Passed Validation!
                var TagModel = new Tag();
                TagModel.name = req.body.name;
                TagModel.createdAt = Date.now();
                TagModel.updatedAt = Date.now();
                TagModel.save(function(err) {
                    if (err){
                        req.flash('errors', ['There is some error occured']);
                        res.redirect('/tag/add');
                    }else{
                        req.flash('success', ['Hash tag added successfully']);
                        res.redirect('/tag/list');
                    }
                });
            }else{
                var er = new Array();
                for(var i = 0;i<errors.length;i++){
                    er.push(errors[i].msg);
                }
                req.flash('errors',er);
                res.redirect('/tag/add');
            }
        }else{
            req.flash('errors', ['Hash tag is already exist']);
            res.redirect('/tag/list');
        }
    });
}



/**
 * GET /
 * Email Template Update Detail
 */
exports.edit = (req, res) => {
    Tag.findOne({_id:req.params.tagId},function(error,tagRes){
        if(error){
            req.flash('errors', ['No record found']);
            res.redirect('/tag/list');
        }else {
            
            res.render('tag/edit', {title: 'Edit tag',result:tagRes,left_activeClass:3,activeFlag:1});
        }
    });
};


/**
 * Post
 * Save email Template
 */
exports.update = (req,res) => {
    req.assert('name', 'Hash tag is required').notEmpty();
    var errors = req.validationErrors();  
    if( !errors){   //No errors were found.  Passed Validation!
        Tag.count({name:req.body.name,_id:{$ne:req.body.tagId}},function(error,tagRes){
            if(tagRes == 0){

                updateData = {
                    name : req.body.name,
                    updatedAt : Date.now()
                };
                Tag.findByIdAndUpdate(req.body.tagId,updateData, function(error, updateRes)
                {
                    req.flash('success', ['Tag updated successfully']);
                    res.redirect('/tag/list');
                });
            }else{
                req.flash('errors', ['Hash tag is already exist']);
                res.redirect('/tag/edit/'+req.body.tagId);
            }
        });
    }else{
        var er = new Array();
        for(var i = 0;i<errors.length;i++){
            er.push(errors[i].msg);
        }
        req.flash('errors',er);
        res.redirect('/tag/edit/'+req.body.tagId);
    }
}

exports.test = (req, res) => {
    var paypal = require('paypal-rest-sdk');
    paypal.configure({
        'mode': 'sandbox', //sandbox or live
        'client_id': 'AZQKMZDbPg-LJg1oc5yrzBvqqT5pl5H-6s3ihXaqhBtTjuhF0KDMLsH0rS1FPlhoO_EvU9PFOSjtevfr',
        'client_secret': 'EPCj5dRWe7OBG8Da0_H3Fk9pf275jJl88nyGvtfo9resg0NnBCOU5feCg4Efhyw0pwrz66ZlVPFNqzN1'
    });
    
    var creditCardId = "CARD-7HB0913066314063MK7SQMTI";
    //CARD-7HB0913066314063MK7SQMTI

    paypal.creditCard.get(creditCardId, function (error, credit_card) {
        if (error) {
            //throw error;
            console.log(error);
        } else {
            console.log("Retrieve Credit Card Response");
            console.log(JSON.stringify(credit_card));
            //res.redirect('/tag/list');
        }
    });
      
    console.log('ok');
    //res.redirect('/tag/list');
};