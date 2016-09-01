const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
	name : String,
	type : String,
<<<<<<< HEAD
	is_required : Boolean,
	is_post_feed : Boolean,
	product_manager : Boolean,
	display_type : String 
=======
	is_required : String,
	is_post_feed : String,
	product_manager : String,
	display_type : String,
	is_published : String 
>>>>>>> eadfc303cbd32eeddb936750b9824fa24f33dd99
});

const Attribute = mongoose.model('Attribute', attributeSchema);

module.exports = Attribute;
