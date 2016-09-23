const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
	user_id : String,
	card_id : String,
	number : String,
	type : String,
	expire_date : String,
	data:Array,
	created : String,
	updated:String
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
