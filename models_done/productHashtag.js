const mongoose = require('mongoose');

const productHashtagSchema = new mongoose.Schema({
	product_id : {type:String,default:''},
	hashtag_id : {type:String,default:''},
	
});

const ProductHashtag = mongoose.model('ProductHashtag', productHashtagSchema);

module.exports = ProductHashtag;

