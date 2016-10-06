const mongoose = require('mongoose');

const attributeOptionSchema = new mongoose.Schema({
	attribute_id : {type:String,default:''},
	value : {type:String,default:''}
});


const AttributeOption = mongoose.model('Attribute_Options', attributeOptionSchema);

module.exports = AttributeOption;

