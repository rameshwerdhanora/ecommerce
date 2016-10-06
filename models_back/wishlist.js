const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
	user_id : String,
	product_id : String,
	date : String
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;