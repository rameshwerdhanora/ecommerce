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
const Refund            = require('../../models/refund');
const dateFormat = require('dateformat');

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
		orderIns.billing_address 	= req.body.billing_address;
		orderIns.subtotal 			= req.body.subtotal;
		orderIns.tax 				= req.body.tax;
		orderIns.shipping_charges 	= req.body.shipping_charges;
		orderIns.totalprice 		= req.body.totalprice;
		orderIns.shipping_array 	= req.body.shipping_array;
		orderIns.status 			= 'Unfullfilled';
		orderIns.itemquantity 		= req.body.itemquantity;
		orderIns.order_date 		= Date.now();

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
		                            				finalCartObj.brand_id = CartRes.brand_id;
		                            				callback();
			                           			}
			                           			else 
			                           			{
			                           				finalCartObj.brand = '';
			                           				finalCartObj.brand_id = CartRes.brand_id;
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
		                            	orderDetailsIns.brand_id 	= finalCartObj.brand_id;
		                            	orderDetailsIns.index 		= 'product';
		                            	orderDetailsIns.data 		= finalCartObj;
		                            	orderDetailsIns.save(function(error,saveOrderDetails){})
		                            	//console.log(finalCartObj);
		                            	callback();
		                            }
		                        )
		                },
		                function(err){
		                	Cart.remove({user_id:req.body.user_id},function(error,removedDataFromMyCart){
		                		if(error)
		                		{
		                			return res.json({"status":'error',"msg":'Unable to found remove your data from my cart.'})
		                		}
		                		else{
		                			return res.json({"status":'success',"msg":'Order placed successfully.',order_id:orderIns._id})
		                		}
		                	})
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

/**
 * GET /api/order/listoforder/:userId
 * Process for List for user order
 */

exports.listOfOrderWithStatus = (req,res) => {

	Order.find({user_id:req.params.userId},function(error,fetchAllOrdersOfUser)
	{
		if(fetchAllOrdersOfUser)
		{	
			var OrderArr = new Array();
			var count = 1;
			var index = 0;
			async.eachSeries(fetchAllOrdersOfUser, function(OrderRes, callback)
	        {
	        	var orderData = {};
	        	//var dateTime = new Date(parseInt(OrderRes.order_date));

	        	// var year  = dateTime.getFullYear();
        		// var month = dateTime.getMonth()+1;
        		// var date  = dateTime.getDate();
        		// finalDate = month+'/'+date+'/'+year

	        	orderData.order_number 	= OrderRes.order_number;
	        	orderData._id 			= OrderRes._id;
	        	orderData.status	    = OrderRes.status;
	        	orderData.itemquantity	= OrderRes.itemquantity;
	        	//orderData.order_date	= finalDate;
	        	orderData.order_date	= dateFormat(parseInt(OrderRes.order_date),'dd/mm/yyyy');
	        	index += count; 
	        	OrderArr.push(orderData);
	        	callback(error);
	        	count++;
	        },
	        function(err)
	        {

	        	return res.json({"status":'success',"msg":'Found your list of orders.',listOfOrders:OrderArr,countOrder:index})
	        });
		}
		else 
		{
			return res.json({"status":'error',"msg":'You have not created any order yet.'})
		}
	})
}

/**
 * GET /api/order/orderdetails/:orderId
 * Process for order details
 */

exports.detailsOfSelectedOrder = (req,res) => {

	Order.findOne({_id:req.params.orderId},function(error,fetchOrdersDetails)
	{
		if(fetchOrdersDetails)
		{	
			var OrderArr = new Array();
			var orderData = {};
			var ProductDetailsArr = new Array();

        	var dateTime = new Date(parseInt(fetchOrdersDetails.order_date));

        	var year  = dateTime.getFullYear();
    		var month = dateTime.getMonth()+1;
    		var date  = dateTime.getDate();
    		finalDate = month+'/'+date+'/'+year

        	orderData.order_number 		= fetchOrdersDetails.order_number;
        	orderData.user_id 			= fetchOrdersDetails.user_id;
        	orderData.totalprice 		= fetchOrdersDetails.totalprice;
        	orderData.shipping_charges 	= fetchOrdersDetails.shipping_charges;
        	orderData.tax				= fetchOrdersDetails.subtotal;
        	orderData.subtotal			= fetchOrdersDetails.subtotal;
        	orderData.itemquantity		= fetchOrdersDetails.itemquantity;
        	orderData.shipping_address	= fetchOrdersDetails.shipping_address;
        	orderData.billing_address	= fetchOrdersDetails.billing_address;
        	orderData.payment_details	= fetchOrdersDetails.payment_details;
        	orderData.order_date		= finalDate;
        	orderData.expected_date		= finalDate;

        	OrderDetails.find({order_id:fetchOrdersDetails._id},function(error,fetchOrdersProductDetails)
        	{
				//console.log(fetchOrdersProductDetails);
				if(fetchOrdersProductDetails)
				{
					async.eachSeries(fetchOrdersProductDetails, function(ProductDetails, callback)
	        		{
	        			var listofProducts = {};
	        			listofProducts.product_id 		= ProductDetails.data[0].product._id;
    					listofProducts.product_name 	= ProductDetails.data[0].product.name;
    					listofProducts.product_sku 		= ProductDetails.data[0].product.sku;
    					listofProducts.product_price 	= ProductDetails.data[0].real_price;
    					listofProducts.price_quan 		= ProductDetails.data[0].price_quan;
    					listofProducts.product_quantity	= ProductDetails.data[0].quantity;
    					listofProducts.productImages	= ProductDetails.data[0].productImages.thumb_image_1;
    					listofProducts.brand_id			= ProductDetails.data[0].brand._id;
    					listofProducts.brand_name		= ProductDetails.data[0].brand.brand_name;
    					listofProducts.size_option		= ProductDetails.data[0].options;
    					listofProducts.color			= ProductDetails.data[0].color;
    					ProductDetailsArr.push(listofProducts);
    					callback();
	        		},
	        		function(err)
	        		{
	        			orderData.alldetailsoforder = ProductDetailsArr;
	        			return res.json({"status":'success',"msg":'Found your list of orders.',listOfOrders:orderData}) 
	        		});
				}
				else 
				{

				}
			})
		}
		else 
		{
			return res.json({"status":'error',"msg":'Something Wrong.'})
		}
	});
}

/**
 * POST /api/order/refund
 * Process for order details
 */

exports.refundRequest = (req,res) => {

	if(req.body.device_token != '')
    { 
		var refundIns 		= new Refund;
		refundIns.user_id 	= req.body.user_id;
		refundIns.order_id 	= req.body.order_id;
		refundIns.email_address = req.body.email_address;
		refundIns.message 	= req.body.message;
		refundIns.created 	= Date.now();
		refundIns.save(function(error,saveRefundData){
			if(error)
			{
				return res.json({"status":'error',"msg":'Something Wrong.'})
			}
			else 
			{
				Order.findByIdAndUpdate(req.body.order_id,{status:'refund'},function(error,changeStatus){
					if(error)
					{
						return res.json({"status":'error',"msg":'Your Order status is not change.'})
					}
					else 
					{
						return res.json({"status":'success',"msg":'Your request is added.'})
					}
				});
			}
		});
	}
	else
	{
		return res.json({"status":'error',"msg":'Device token is not avaible.'})
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
 
