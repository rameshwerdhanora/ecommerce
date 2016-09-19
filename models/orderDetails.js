const mongoose = require('mongoose');

const orderDetailsSchema = new mongoose.Schema({
	order_id : String,
	index : String,
	data : Array 
});

const OrderDetails = mongoose.model('OrderDetails', orderDetailsSchema);

module.exports = OrderDetails;
