const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
	brand_name : String,
	brand_cover : String,
	brand_logo : String,
	brand_desc : String,
	user_id : String
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;