const mongoose = require('mongoose');

const attributeOptionSchema = new mongoose.Schema({
	attribute_id : String,
	value : String
});


const AttributeOption = mongoose.model('AttributeOption', attributeOptionSchema);

module.exports = AttributeOption;

