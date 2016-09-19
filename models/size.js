const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
	size_name : String,
	gender : String,
	listofattrmap : Array,
	is_published : String,
	user_id : String 
});

const Size = mongoose.model('Size', sizeSchema);

module.exports = Size;

