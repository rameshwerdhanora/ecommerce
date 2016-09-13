const mongoose = require('mongoose');

const customerAddressSchema = new mongoose.Schema({
	user_id : String,
	address_type : String,
	contact_no1 : String,
	contact_no2 : String,
	address_line1 : String,
	address_line2 : String,
	city : String,
	postal_code : String,
	city : String,
	country : String
});

const CustomerAddress = mongoose.model('CustomerAddress', customerAddressSchema);

module.exports = CustomerAddress;
