const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
	name : String,
	type : String,
	is_required : Boolean,
	is_post_feed : Boolean,
	product_manager : Boolean,
	display_type : String 
});

const Attribute = mongoose.model('Attribute', attributeSchema);

module.exports = Attribute;
