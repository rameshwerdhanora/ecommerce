const mongoose = require('mongoose');

const orderDetailsSchema = new mongoose.Schema({
	order_id : {type:String,default:''},
	index : {type:String,default:''},
	brand_id:{type:String,default:''},
	user_id:{type:String,default:''},
	shop_id:{type:String,default:''},
	product_id:{type:String,default:''},
	data : {type:Array,default:[]} 
});

const OrderDetails = mongoose.model('OrderDetails', orderDetailsSchema);

module.exports = OrderDetails;
 
