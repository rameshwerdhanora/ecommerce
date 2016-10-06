/* Add required Models */
const User      = require('../models/userApp');
const Product	= require('../models/product');
const Order		= require('../models/orders');
const async 	= require('async');
const dateFormat = require('dateformat');

/* List of all Products  */
exports.searchResult = (req, res) => {

	var searchVar = req.body.search;
	var finalSearchVar = {};
	
	async.parallel(
		[
			function(callback)
			{
				User.find({first_name : { $regex : searchVar }},function(error,fetchSearchUsers){
					if(fetchSearchUsers)
					{	
						var userDataArr = [];
						async.eachSeries(fetchSearchUsers, function(UserData, callback)
    					{
    						var userDataObj = {};
							userDataObj._id 		= UserData._id;
							userDataObj.first_name 	= UserData.first_name;
							userDataObj.last_name 	= UserData.last_name;
							userDataObj.email 		= UserData.email_id;
							userDataObj.dob 		= dateFormat(parseInt(UserData.dob),'dd-mmmm-yyyy');
							userDataObj.gender 		= UserData.gender;
							userDataObj.profile_image = UserData.profile_image;
							userDataArr.push(userDataObj);
							callback();
						},
						function(error)
						{	
							finalSearchVar.userData = userDataArr;
						});
					}
					else 
					{
						finalSearchVar.userData = '';
					}
					callback(error);
				})
			},
			function(callback)
			{
				Product.find({name : { $regex : searchVar }},function(error,fetchSearchProduct)
				{
					if(fetchSearchProduct)
					{
						var productDataArr = [];
						async.eachSeries(fetchSearchProduct, function(ProductData, callback)
    					{
    						var productDataObj = {};
							productDataObj._id 			= ProductData._id;
							productDataObj.name 		= ProductData.name;
							productDataObj.sku 			= ProductData.sku;
							productDataObj.price 		= ProductData.price;
							productDataObj.created 		= dateFormat(parseInt(ProductData.created),'dd-mmmm-yyyy');
							productDataObj.gender		= ProductData.gender;;
							productDataArr.push(productDataObj);
							callback();
						},
						function(error)
						{	
							finalSearchVar.productData = productDataArr;
						});
						//finalSearchVar.productData = fetchSearchProduct;
					}
					else 
					{
						finalSearchVar.productData = '';
					}
					callback(error);
				})
			},
			function(callback)
			{
				Order.find({order_number : { $regex : searchVar }},function(error,fetchSearchOrder){
					if(fetchSearchOrder)
					{
						var orderDataArr = [];
						async.eachSeries(fetchSearchOrder, function(OrderData, callback)
    					{
    						var orderDataObj = {};
							orderDataObj._id 			= OrderData._id;
							orderDataObj.order_number 	= OrderData.order_number;
							orderDataObj.order_date		= dateFormat(parseInt(OrderData.order_date),'dd-mmmm-yyyy');;
							orderDataObj.status 		= OrderData.status;
							orderDataObj.totalprice 	= OrderData.totalprice;
							orderDataArr.push(orderDataObj);
							callback();
						},
						function(error)
						{	
							finalSearchVar.orderData = orderDataArr;
						});
					}
					else 
					{
						finalSearchVar.orderData = '';
					}
					callback(error);
				})
			}
		],
		function (error) {
			res.render('search/list', { title: 'Search',left_activeClass:0,searchdata:finalSearchVar,postData:req.body.search});
			console.log(finalSearchVar);
		}
	)

}
