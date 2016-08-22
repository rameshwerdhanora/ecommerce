const mongoose = require('mongoose');

const productsImagesSchema = new mongoose.Schema({
	product_id : String,
	thumb_image : String,
	large_image : String,
	image_name : String
});

const ProductsImages = mongoose.model('ProductsImages', productsImagesSchema);

module.exports = ProductsImages;

