const mongoose = require('mongoose');

const customerAddressSchema = new mongoose.Schema({
	user_id : String,
	firstname:String,
	lastname:String,
	shiptype:String,
	address_one : String,
	address_two : String,
	contact_no : String,
	city : String,
	postal_code : String,
	city : String,
	country : String,
	billmode:Boolean,
	add_type : String
});

const CustomerAddress = mongoose.model('CustomerAddress', customerAddressSchema);

module.exports = CustomerAddress;
