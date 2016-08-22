const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
	size_name : String,
	gender : String,
	size_code : Array,
	size_label : Array,
	user_id : String 
});

const Size = mongoose.model('Size', sizeSchema);

module.exports = Size;
