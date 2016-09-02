const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
	name : String,
	description : String,
	parent_id : String,
	is_active : String,
	created : String,
	update : String,
	user_id: String
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
