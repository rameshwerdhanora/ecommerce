const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
	user_id : String,
	card_name : String,
	card_number : String,
	card_date : String,
	card_type : String,
	created : String,
	updated:String
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;