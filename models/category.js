const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name : String,
	description : String,
	is_active : String,
	created : String,
	update : String,
	user_id: String,
        gender:String
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
