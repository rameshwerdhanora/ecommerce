const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
	name : {type:String,default:''},
	type : {type:String,default:''},

	is_required : {type:String,default:''},
	is_post_feed : {type:String,default:''},
	product_manager : {type:String,default:''},
	display_type : {type:String,default:''},
	is_published : {type:String,default:''} 

});

const Attribute = mongoose.model('Attribute', attributeSchema);

module.exports = Attribute;

