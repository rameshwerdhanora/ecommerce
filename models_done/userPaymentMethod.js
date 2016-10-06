const mongoose = require('mongoose');

const userPaymentMethodSchema = new mongoose.Schema({
	user_id : {type:String,default:''},
	payment_type : {type:String,default:''},
	paypal_email : {type:String,default:''},
	venmo_email : {type:String,default:''},
	direct_deposit_bank_name : {type:String,default:''},
	direct_deposit_account_no : {type:String,default:''},
	direct_deposit_routing_no : {type:String,default:''}
});

const PaymentMethod = mongoose.model('UserPaymentMethod', userPaymentMethodSchema);

module.exports = PaymentMethod;
