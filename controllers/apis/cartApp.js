/*
	@author : Cis Team
	@date : 10-Aug-2016
	@File : Create User from Application

*/

/* Load required library */
const Constants 		= require('../../constants/constants');
const Cart   = require('../../models/cart');
const Product   = require('../../models/product');
const Color   = require('../../models/color');
const AttributOption   = require('../../models/attributeOption');
const Attribut   = require('../../models/attribute');
const async = require('async');
const ProductImage   = require('../../models/productsImages');




/*
 * Web service to send all the product exist in the cart
 */
function getProduct(pid, callback){
   Product.findOne({_id:pid},function(error,productRes){
       if(error != null){
           callback(error,new Array());
       }else{
           callback(error,productRes);
        }
   });
}

function getProductColor(cid, callback){
   Color.findOne({_id:cid},function(error,colorRes){
        if(error != null){
           callback(error,new Array());
        }else{
           callback(error,colorRes);
        }
   });
}
function getOptAttribute(opId, callback){
   AttributOption.find({_id: {$in : opId}},function(error,opRes){
        if(error != null){
           callback(error,new Array());
        }else{
           callback(error,opRes);
        }
   });
}
function getAttrib(attributIds,callback){
    Attribut.find({_id: {$in : attributIds}},function(error,attribRes){
       if(error != null){
           callback(error,new Array());
       }else{
           callback(error,attribRes);
        }
   });
}

function fetchingImage(pid, callback){
    ProductImage.findOne({product_id:pid},function(error,fetchallFeatProdsImgs){
        if(error != null){
            callback(error,'');
        }else{
            callback(error,fetchallFeatProdsImgs.large_image_1);
        }
    });
}

exports.getCartProduct = (req,res) => {
    if(req.body.device_token !== ''){ 
        Cart.find({ user_id: req.body.user_id}, function(error, cartRes) {
            var tempCartProduct = [];
            var totalPrice = 0; 
            async.eachSeries(cartRes, function(CproductRes, callback){
                var pArr = {};
                pArr._id  = CproductRes._id;
                pArr.quantity = CproductRes.quantity;

                /* Use asyn Parallel method for waiting those functions value */
                async.parallel(
                    [
                        function(callback){// To get product name
                            getProduct(CproductRes.product_id, function(err, pres){
                                if(err){
                                    pArr.name = '';
                                    pArr.sku = '';
                                    pArr.price = 0;
                                }else{
                                    pArr.name = pres.name;
                                    pArr.sku = pres.sku;
                                    pArr.price = pres.price;
                                    totalPrice+=parseInt(pres.price);
                                }
                                
                                callback(err);
                            });
                        },
                        function(callback){
                            fetchingImage(CproductRes.product_id, function(err, res){
                                pArr.image  = res;
                                callback(err);  
                            });
                        },
                        function(callback){// To get product color and color code
                            getProductColor(CproductRes.color_id, function(err, cres){
                                if(cres.length == 0){
                                    //pArr.colorcode = '';
                                    pArr.color = '';
                                }else{
                                    //pArr.colorcode = cres.color_code;
                                    pArr.color = cres.color_name;
                                }
                                callback(err);
                            });
                        },
                        function(callback){// To get attribut name and option name
                            var optionIds = CproductRes.size.split(',');
                            getOptAttribute(optionIds,function(err,opRes){
                                var tmpAttributeKey = new Array();
                                var tmpOptionValue = new Array();
                                for(var kk=0;kk<opRes.length;kk++){
                                    tmpAttributeKey[kk] = opRes[kk].attribute_id;
                                    tmpOptionValue[kk] = opRes[kk].value;
                                }
                                var tmpOoptionFinalAr = new Array();
                                getAttrib(tmpAttributeKey,function(err,attribRes){
                                    for(var i=0;i<tmpAttributeKey.length;i++){
                                        for(j=0;j<attribRes.length;j++){
                                            if(attribRes[j]._id == tmpAttributeKey[i]){
                                                tmpOoptionFinalAr[i] = new Array();
                                                tmpOoptionFinalAr[i][0] = attribRes[j].name; 
                                                tmpOoptionFinalAr[i][1] = tmpOptionValue[i];
                                            }
                                        }
                                    }
                                    pArr.options = tmpOoptionFinalAr;
                                    callback(err);
                                });
                                
                            });
                        }
                    ], 
                    function(err){
                        tempCartProduct.push(pArr);
                        callback(err); 
                    }
                )
            }, 
            function(err){
              // console.log(temp); //This should give you desired result
              return res.json({"status":'success',"msg":'Fetch all products.',data:tempCartProduct,'subTotal':totalPrice-(totalPrice-90),'tax':totalPrice-90,'total':totalPrice});
            });
        });
    }else{
        return res.json({"status":'error',"msg":'Device Token is not available.'});
    }
}

/*
 *Web serive to save user address into database 
 */
exports.addTocart = (req,res) => {
    if(req.body.device_token !== ''){
        var cartModel  = new Cart();
        cartModel.user_id = req.body.user_id;
        cartModel.product_id =  req.body.product_id;
        cartModel.quantity= req.body.quantity;
        var quamaSepSize = '';
        var size = req.body.size;
        for(var i = 0; i<size.length;i++){
            quamaSepSize+=size[i];
        }
        quamaSepSize = quamaSepSize.substring(0, quamaSepSize.length - 1);
        cartModel.size= quamaSepSize;//Comma separated
        cartModel.color_id= req.body.color_id;
        cartModel.created= new Date();
        cartModel.updated= new Date();
        cartModel.save(function(err,addressObject){
            if (err){
                return res.send({status:'error',error:err});
            }else {
                return res.json({"status":'success',"msg":'Product has been added successfully'});
            }
        });
    }else{
        return res.json({"status":'error',"msg":'Device Token is not available.'});
    }
}


/* Delete address */
exports.deleteFromCart = (req,res) => {
    if(req.body.device_token !== ''){
        Cart.remove({_id:req.body.id, user_id: req.body.user_id},function(error,deleteProduct){
            if(error){
                return res.send({status:'error',msg:error});
            }else{
                return res.send({status:'success',msg:'Product removed from cart.'});
            }
        });
    }else{
        return res.json({"status":'error',"msg":'Device Token is not available.'});
    }
};

/* Delete address */
exports.emptyCart = (req,res) => {
    if(req.body.device_token !== ''){
        Cart.remove({user_id: req.body.user_id},function(error,emptyCartRes){
            if(error){
                return res.send({status:'error',msg:error});
            }else{
                return res.send({status:'success',msg:'Cart has been empty successfully'});
            }
        });
    }else{
        return res.json({"status":'error',"msg":'Device Token is not available.'});
    }
};

/*
 *Web serive to save user address into database 
 */
exports.updateIntoCart = (req,res) => {
    if(req.body.device_token !== ''){
        updateData = {
            quantity : req.body.quantity
        };
        if(req.body.quantity){
            CustomerAddress.findByIdAndUpdate(req.body.id,updateData,function(err,updateRes){
                if (err){
                    return res.send({status:'error',error:err});
                }else{
                    return res.json({"status":'success',"msg":'Cart updated successfully'});
                }
            });
        }else{// if 0 quantity set then delete the product from the cart.
            Cart.remove({_id:req.body.id, user_id: req.body.user_id},function(error,deleteProduct){
                if(error){
                    return res.send({status:'error',msg:error});
                }else{
                    return res.send({status:'success',msg:'Product removed from cart.'});
                }
            });
        }
    }else{
        return res.json({"status":'error',"msg":'Device Token is not available.'});
    }
}