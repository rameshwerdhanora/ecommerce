const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
	name : String,
	type : String,
	is_required : String,
	is_post_feed : String,
	product_manager : String,
	display_type : String,
	is_published : String 
});

const Attribute = mongoose.model('Attribute', attributeSchema);

module.exports = Attribute;

