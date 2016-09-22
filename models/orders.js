const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
	user_id : String,
	order_number : String,
	payment_details : Array,
	shipping_address : Array,
	billing_address : Array,
	subtotal : String,
	tax : String,
	shipping_charges : String,
	totalprice : String,
	order_date : String,
	status : String,
	payment_status:String,
	itemquantity:String,
	shipping_array:Array
});

const Orders = mongoose.model('Orders', ordersSchema);

module.exports = Orders;
