const mongoose = require('mongoose');

const shopShippingSchema = new mongoose.Schema({
	shop_id : String,
	address : String,
	city : String,
	zip_code : String,
	state : String,
	country : String,
	shipping_account : String,
	shipping_username : String,
	shipping_password : String,
});

const ShopShipping = mongoose.model('ShopShipping', shopShippingSchema);

module.exports = ShopShipping;
