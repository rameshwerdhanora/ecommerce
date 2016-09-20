/*
	@author : Cis Team
	@date : 19-Sep-2016
	@File : Order Details

*/

/* Load required library */
const async             = require('async');
const Constants 		= require('../../constants/constants');
const Cart 				= require('../../models/cart');
const Order 			= require('../../models/orders');
const OrderDetails 		= require('../../models/orderDetails');
const Product           = require('../../models/product');
const Color             = require('../../models/color');
const AttributOption    = require('../../models/attributeOption');
const Attribut          = require('../../models/attribute');
const ProductImage      = require('../../models/productsImages');
const Brand             = require('../../models/brand');

/**
 * POST /api/order/saveorder
 * Process for Save Order for user
 */

exports.saveUserFinalOrder = (req,res) => {

	if(req.body.device_token != '')
	{	
		var orderNumber = randomString(Constants.ORDERNUMBERLEN);

		var orderIns 				= new Order;
		orderIns.user_id 			= req.body.user_id;
		orderIns.order_number 		= orderNumber;
		orderIns.payment_details 	= req.body.payment_details;
		orderIns.shipping_address 	= req.body.shipping_address;

		orderIns.save(function(error,saveOrder)
		{
			if(saveOrder)
			{
				Cart.find({user_id:req.body.user_id},function(error,fetchAllDetailsOfUserCart)
				{
					if(fetchAllDetailsOfUserCart)
					{
						async.eachSeries(fetchAllDetailsOfUserCart, function(CartRes, callback)
		                {
		                	var finalCartObj = {}; 
		                	var totalPrice = '';

		                	async.parallel
		                        (
		                            [
		                            	function(callback)
		                            	{
		                            		Product.findOne({_id:CartRes.product_id},function(error,fetchProductDataForCart)
		                            		{
		                            			if(fetchProductDataForCart)
		                            			{
		                            				finalCartObj.product 		= fetchProductDataForCart;
		                            				finalCartObj.real_price 	= parseInt(fetchProductDataForCart.price);
		                            				finalCartObj.price_quan		= parseInt(fetchProductDataForCart.price) * CartRes.quantity;
		                            				finalCartObj.quantity		= CartRes.quantity;
		                            				totalPrice				   += parseInt(fetchProductDataForCart.price) * CartRes.quantity;
		                            				callback();
			                           			}
		                            		});
		                            	},
		                            	function(callback)
		                            	{
		                            		ProductImage.findOne({product_id:CartRes.product_id},function(error,fetchallFeatProdsImgs)
		                            		{
										         if(fetchallFeatProdsImgs)
										         {
										         	finalCartObj.productImages = fetchallFeatProdsImgs;
										         	callback();
										         }
										         else 
										         {
										         	finalCartObj.productImages = '';
										         	callback();
										         }
										    });
		                            	},
		                            	function(callback)
		                            	{
		                            		Color.findOne({_id:CartRes.color_id},function(error,fetchProductColorForCart)
		                            		{
		                            			if(fetchProductColorForCart)
		                            			{
		                            				finalCartObj.color = fetchProductColorForCart;
		                            				callback();
			                           			}
			                           			else 
			                           			{
			                           				finalCartObj.color = '';
		                            				callback();
			                           			}
		                            		});
		                            	},
		                            	function(callback)
		                            	{
		                            		Brand.findOne({_id:CartRes.brand_id},function(error,fetchProductBrandForCart)
		                            		{
		                            			if(fetchProductBrandForCart)
		                            			{
		                            				finalCartObj.brand = fetchProductBrandForCart;
		                            				callback();
			                           			}
			                           			else 
			                           			{
			                           				finalCartObj.brand = '';
		                            				callback();
			                           			}
		                            		});
		                            	},
		                            	function(callback)
		                            	{
		                            		var optionIds = CartRes.size.split(',');
			                                getOptAttribute(optionIds,function(err,opRes)
			                                {
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
			                                        finalCartObj.options = tmpOoptionFinalAr;
			                                        callback(err);
			                                    });

			                                });
		                            	}
		                            ],
		                            function(err)
		                            {	

		                            	var orderDetailsIns = new OrderDetails;
		                            	orderDetailsIns.order_id 	= orderIns._id;
		                            	orderDetailsIns.index 		= 'product';
		                            	orderDetailsIns.data 		= finalCartObj;
		                            	orderDetailsIns.save(function(error,saveOrderDetails){})
		                            	//console.log(finalCartObj);
		                            	callback();
		                            }
		                        )
		                },
		                function(err){
		                	return res.json({"status":'success',"msg":'Order placed successfully.',order_id:orderIns._id})
		                });
					}
					else 
					{
						return res.json({"status":'error',"msg":'Unable to found any product of this brand.'})
					}
				});
			}
		});
	}
	else 
	{
		return res.json({"status":'error',"msg":'Device token is not avaible unable to place your order.'})
	}

}

function getOptAttribute(opId, callback){
   AttributOption.find({_id: {$in : opId}},function(error,opRes){
        if(error){
           callback(error,new Array());
        }else{
           callback(error,opRes);
        }
   });
}
function getAttrib(attributIds,callback){
    Attribut.find({_id: {$in : attributIds}},function(error,attribRes){
       if(error){
           callback(error,new Array());
       }else{
           callback(error,attribRes);
        }
   });
}

function randomString(length) 
{
    mask = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
}
 