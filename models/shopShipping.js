const mongoose = require('mongoose');

const shopShippingSchema = new mongoose.Schema({
	user_id : String,
	address : String,
	city : String,
	postal_code : String,
	state : String,
	country : String,
	shipping_account : String,
	shipping_username : String,
	shipping_password : String,
});

const ShopShipping = mongoose.model('ShopShipping', shopShippingSchema);

module.exports = ShopShipping;
