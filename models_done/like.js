const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
	user_id : {type:String,default:''},
	product_id : {type:String,default:''},
	date : {type:String,default:''}
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;