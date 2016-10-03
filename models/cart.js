const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
	user_id : String,
	product_id : String,
	brand_id : String,
	quantity:String,
	size:Array,//Comma separated
	color_id:String,
	appliedcoupon:String,
	created:Date,
	updated:Date
});


const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
