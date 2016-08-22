const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
	user_id : String,
	address_line1 : String,
	address_line2 : String,
	city : String,
	postal_code : String,
	country : String,
	website : String,
	shr_fb : String,
	shr_tw : String,
	shr_intg : String,
	enable_filter : String,
	configDetail:Array,
	created : String,
	updated : String
});

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

module.exports = UserDetails;

