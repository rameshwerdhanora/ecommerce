const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
	name : {type:String,default:''},
	description : {type:String,default:''},
	parent_id : {type:String,default:''},
	is_active : {type:String,default:''},
	created : {type:String,default:''},
	update : {type:String,default:''},
	user_id: {type:String,default:''}
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
