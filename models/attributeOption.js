const mongoose = require('mongoose');

const attributeOptionSchema = new mongoose.Schema({
	attribute_id : String,
	value : String
});

<<<<<<< HEAD
const Attribute_option = mongoose.model('Attribute_option', attributeOptionSchema);

module.exports = Attribute_option;
=======
const AttributeOption = mongoose.model('AttributeOption', attributeOptionSchema);

module.exports = AttributeOption;
>>>>>>> eadfc303cbd32eeddb936750b9824fa24f33dd99
