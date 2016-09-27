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
    
    var card_data = {
        "type": "visa",
        "number": "4111111111111111",
        "expire_month": "11",
        "expire_year": "2018",
        "cvv2": "123",
        "first_name": "Joe",
        "last_name": "Shopper"
      };

      paypal.creditCard.create(card_data, function(error, credit_card){
        if (error) {
          console.log(error);
          throw error;
        } else {
          console.log("Create Credit-Card Response");
          console.log(credit_card);
          res.send(JSON.stringify(credit_card));
        }
      });
};
exports.test1 = (req, res) => {
    var paypal = require('paypal-rest-sdk');
    paypal.configure({
        'mode': 'sandbox', //sandbox or live
        'client_id': 'AZQKMZDbPg-LJg1oc5yrzBvqqT5pl5H-6s3ihXaqhBtTjuhF0KDMLsH0rS1FPlhoO_EvU9PFOSjtevfr',
        'client_secret': 'EPCj5dRWe7OBG8Da0_H3Fk9pf275jJl88nyGvtfo9resg0NnBCOU5feCg4Efhyw0pwrz66ZlVPFNqzN1'
    });
    
    

    var creditCardId = "CARD-2UT54514WP8055149K7VEPCQ";
    //CARD-7HB0913066314063MK7SQMTI

    paypal.creditCard.get(creditCardId, function (error, credit_card) {
        if (error) {
            //throw error;
            console.log(error);
        } else {
            console.log("Retrieve Credit Card Response");
            console.log(JSON.stringify(credit_card));
            res.send(JSON.stringify(credit_card));
            //res.redirect('/tag/list');
        }
    });
      
};

exports.test2 = (req, res) => {
    var paypal = require('paypal-rest-sdk');
    paypal.configure({
        'mode': 'sandbox', //sandbox or live
        'client_id': 'AZQKMZDbPg-LJg1oc5yrzBvqqT5pl5H-6s3ihXaqhBtTjuhF0KDMLsH0rS1FPlhoO_EvU9PFOSjtevfr',
        'client_secret': 'EPCj5dRWe7OBG8Da0_H3Fk9pf275jJl88nyGvtfo9resg0NnBCOU5feCg4Efhyw0pwrz66ZlVPFNqzN1'
    });
    
    
    var savedCard = {
        "intent": "sale",
        "payer": {
            "payment_method": "credit_card",
            "funding_instruments": [{
                "credit_card_token": {
                    "credit_card_id": "CARD-2UT54514WP8055149K7VEPCQ"
                }
            }]
        },
       
    
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "23.93",
                /*"details": {
                    "subtotal": "19.94",
                     "shipping": "3.99",
                     "tax": "0"
                }*/
            },
            "description": "KapdeCheckout",
            "invoice_number": "1420219038",
            "item_list": {
                "items": [{
                   "quantity": "1",
                   "name": "item name 1",
                   "description": "description 1",
                   "price": "23.93",
                   "currency": "USD",
                   "sku": "sku 1"
               }],
            "shipping_address": {
                "recipient_name": "The Recipient",
                "line1": "123 Ship City",
                "city": "Ship City",
                "country_code": "US",
                "postal_code": "30303",
                "state": "GA"
            }
        }
     }]
 
 
    };
    paypal.payment.create(savedCard, function (error, payment) {
        if (error) {
            console.log(error);
            res.send(JSON.stringify(error));
            //throw error;
        } else {
            console.log("Pay with stored card Response");
            console.log(JSON.stringify(payment));
            res.send(JSON.stringify(payment));
        }
    });
      
};