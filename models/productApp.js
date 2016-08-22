const mongoose = require('mongoose');

const productAppSchema = new mongoose.Schema({
	users_id : String,
	category_id : String,
	sub_category_id : String,
	brand_id : String,
	name : String,
	blurb : String,
	sku : String,
	description : String,
	price : String,
	is_featured : String,
	created : String,
	updated : String
});

const ProductApp = mongoose.model('ProductApp', productAppSchema);

module.exports = ProductApp;
