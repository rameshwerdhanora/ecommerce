const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
	user_id : String,
	product_id : String,
	date : String
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;