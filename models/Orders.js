const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
	customer_id : String,
	order_number : String,
	payment_type : String,
	card_type : String,
	card_number : String,
	card_holder_name : String,
	sub_total : String,
	tax : String,
	shipping_charges : String,
	order_date : String
});

const Orders = mongoose.model('Orders', ordersSchema);

module.exports = Orders;
