const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
	user_id : {type:String,default:''},
	card_id : {type:String,default:''},
	number : {type:String,default:''},
	type : {type:String,default:''},
	expire_date : {type:String,default:''},
	data:{type:Array,default:[]},
	created : {type:String,default:''},
	holdername:{type:String,default:''},
	updated:{type:String,default:''}
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
