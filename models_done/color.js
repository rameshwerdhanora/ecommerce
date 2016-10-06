const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
	color_logo : {type:String,default:''},
	color_name : {type:String,default:''},
	user_id : {type:String,default:''} 
});

const Color = mongoose.model('Color', colorSchema);

module.exports = Color;
