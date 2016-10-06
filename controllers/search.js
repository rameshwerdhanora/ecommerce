/* Add required Models */
const User      = require('../models/userApp');
const Product	= require('../models/product');
const Order		= require('../models/orders');
const async 	= require('async');

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
						finalSearchVar.userData = fetchSearchUsers;
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
				Product.find({name : { $regex : searchVar }},function(error,fetchSearchProduct){
					if(fetchSearchProduct)
					{
						finalSearchVar.productData = fetchSearchProduct;
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
						finalSearchVar.orderData = fetchSearchOrder;
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
			res.render('search/list', { title: 'Search',left_activeClass:0,searchdata:finalSearchVar});
			console.log(finalSearchVar);
		}
	)

}