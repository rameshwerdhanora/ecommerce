const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
	user_id : {type:String,default:''},
	order_number : {type:String,default:''},
	payment_details : {type:Array,default:[]},
	shipping_address : {type:Array,default:[]},
	billing_address : {type:Array,default:[]},
	subtotal : {type:String,default:''},
	tax : {type:String,default:''},
	shipping_charges : {type:String,default:''},
	totalprice : {type:String,default:''},
	order_date : {type:String,default:''},
	status : {type:String,default:''},
	payment_status:{type:String,default:''},
	itemquantity:{type:String,default:''},
	finaldiscount:{type:String,default:''},
	shipping_array:{type:Array,default:[]}
});

const Orders = mongoose.model('Orders', ordersSchema);

module.exports = Orders;
