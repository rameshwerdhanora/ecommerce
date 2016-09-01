const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	users_id : String,
	category_id : String,
	sub_category_id : String,
	brand_id : String,
	name : String,
	blurb : String,
	sku : String,
	description : String,
	price : String,
	productview:String,
	is_featured : String,
	color : Array,
	attribute : Array,
	created : String,
	updated : String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
