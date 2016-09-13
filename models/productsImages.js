const mongoose = require('mongoose');

const productsImagesSchema = new mongoose.Schema({
	product_id : String,
	image_name_1 : String,
	thumb_image_1 : String,
	large_image_1 : String,
	image_name_2 : String,	
	thumb_image_2 : String,
	large_image_2 : String,
	image_name_3 : String,	
	thumb_image_3 : String,
	large_image_3: String,
	image_name_4 : String,
	thumb_image_4 : String,
	large_image_4 : String,
	
});

const ProductsImages = mongoose.model('ProductsImages', productsImagesSchema);

module.exports = ProductsImages;

