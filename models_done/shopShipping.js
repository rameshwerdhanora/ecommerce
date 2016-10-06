const mongoose = require('mongoose');

const shopShippingSchema = new mongoose.Schema({
	shop_id : {type:String,default:''},
	address : {type:String,default:''},
	city : {type:String,default:''},
	zip_code : {type:String,default:''},
	state : {type:String,default:''},
	country : {type:String,default:''},
	shipping_account : {type:String,default:''},
	shipping_username : {type:String,default:''},
	shipping_password : {type:String,default:''},
});

const ShopShipping = mongoose.model('ShopShipping', shopShippingSchema);

module.exports = ShopShipping;
