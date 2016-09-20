const mongoose = require('mongoose');

const userPaymentMethodSchema = new mongoose.Schema({
	user_id : String,
	payment_type : String,
	paypal_email : String,
	venmo_email : String,
	direct_deposit_bank_name : String,
	direct_deposit_account_no : String,
	direct_deposit_routing_no : String
});

const PaymentMethod = mongoose.model('UserPaymentMethod', userPaymentMethodSchema);

module.exports = PaymentMethod;
