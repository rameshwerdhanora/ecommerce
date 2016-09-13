const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
	user_id : String,
	product_id : String,
	quantity:String,
	size:String,//Comma separated
	color_id:String,
	created:Date,
	updated:Date
});


const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
