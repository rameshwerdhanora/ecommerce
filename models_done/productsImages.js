const mongoose = require('mongoose');

const productsImagesSchema = new mongoose.Schema({
	product_id : {type:String,default:''},
	image_name_1 : {type:String,default:''},
	thumb_image_1 : {type:String,default:''},
	large_image_1 : {type:String,default:''},
	image_name_2 : {type:String,default:''},	
	thumb_image_2 : {type:String,default:''},
	large_image_2 : {type:String,default:''},
	image_name_3 : {type:String,default:''},	
	thumb_image_3 : {type:String,default:''},
	large_image_3: {type:String,default:''},
	image_name_4 : {type:String,default:''},
	thumb_image_4 : {type:String,default:''},
	large_image_4 : {type:String,default:''},
	
});

const ProductsImages = mongoose.model('ProductsImages', productsImagesSchema);

module.exports = ProductsImages;

