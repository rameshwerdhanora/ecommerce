const mongoose = require('mongoose');

const productHashtagSchema = new mongoose.Schema({
	product_id : String,
	hashtag_id : String,
	
});

const ProductHashtag = mongoose.model('ProductHashtag', productHashtagSchema);

module.exports = ProductHashtag;

