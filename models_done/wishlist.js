const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
	user_id : {type:String,default:''},
	product_id : {type:String,default:''},
	date : {type:String,default:''}
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;