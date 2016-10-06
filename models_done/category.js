const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name : {type:String,default:''},
	description : {type:String,default:''},
	is_active : {type:String,default:''},
	created : {type:String,default:''},
	update : {type:String,default:''},
	user_id: {type:String,default:''},
        gender:{type:String,default:''}
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
