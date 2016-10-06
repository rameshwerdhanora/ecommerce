const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
	size_name : {type:String,default:''},
	gender : {type:String,default:''},
	listofattrmap : {type:Array,default:[]},
	is_published : {type:String,default:''},
	user_id : {type:String,default:''} 
});

const Size = mongoose.model('Size', sizeSchema);

module.exports = Size;

