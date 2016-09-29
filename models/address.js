const mongoose = require('mongoose');

const customerAddressSchema = new mongoose.Schema({
	user_id : String,
	firstname:String,
	lastname:String,
	shiptype:String,
	address_line1 : String,
	address_line2 : String,
	contact_no : String,
	city : String,
	postal_code : String,
	city : String,
	country : String,
	billmode:Boolean,
	add_type : String,
	is_default: String,
	state: String
});

const CustomerAddress = mongoose.model('CustomerAddress', customerAddressSchema);

module.exports = CustomerAddress;
