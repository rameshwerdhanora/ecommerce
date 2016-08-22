const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	parent_id : String,
	global_setting_id : String,
	name : String,
	description : String,
	is_active : String,
	created : String
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
