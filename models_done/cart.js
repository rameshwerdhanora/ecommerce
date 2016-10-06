const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
	user_id : {type:String,default:''},
	product_id : {type:String,default:''},
	brand_id : {type:String,default:''},
	quantity:{type:String,default:''},
	size:{type:Array,default:[]},//Comma separated
	color_id:{type:String,default:''},
	appliedcoupon:{type:String,default:''},
	created:{type:Date,default:Date},
	updated:{type:Date,default:Date}
});


const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
