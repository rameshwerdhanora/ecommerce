const mongoose = require('mongoose');

const orderDetailsSchema = new mongoose.Schema({
	order_id : String,
        shop_id : String,
        user_id : String,
	index : String,
	brand_id:String,
	user_id:String,
	shop_id:String,
	data : Array 
});

const OrderDetails = mongoose.model('OrderDetails', orderDetailsSchema);

module.exports = OrderDetails;
 
