const mongoose = require('mongoose');

const attributeOptionSchema = new mongoose.Schema({
	attribute_id : String,
	value : String
});

const Attribute_option = mongoose.model('Attribute_option', attributeOptionSchema);

module.exports = Attribute_option;
