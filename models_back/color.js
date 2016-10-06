const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
	color_logo : String,
	color_name : String,
	user_id : String 
});

const Color = mongoose.model('Color', colorSchema);

module.exports = Color;
