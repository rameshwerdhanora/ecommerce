const mongoose = require('mongoose');

const customerAddressSchema = new mongoose.Schema({
	order_id : String,
	user_id : String,
	product : Array,
	created : String,
	updated : String
});

const CustomerAddress = mongoose.model('CustomerAddress', customerAddressSchema);

module.exports = CustomerAddress;
