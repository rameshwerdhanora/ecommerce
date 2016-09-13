const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
	
	user_id : String,
	address_type : String,
	first_name : String,
	last_name : String,
	contact_no1 : String,
	contact_no2 : String,
	address_line1 : String,
	address_line2 : String,
	city : String,
	postal_code : String,
	city : String,
	state : String,
	country : String
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
