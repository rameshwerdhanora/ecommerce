const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
	name : String,
	logo : String,
	description : String,
	bio : String
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;