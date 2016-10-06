const mongoose = require('mongoose');

const customerAddressSchema = new mongoose.Schema({
	user_id : {type:String,default:''},
	firstname:{type:String,default:''},
	lastname:{type:String,default:''},
	shiptype:{type:String,default:''},
	address_line1 : {type:String,default:''},
	address_line2 : {type:String,default:''},
	contact_no : {type:String,default:''},
	city : {type:String,default:''},
	postal_code : {type:String,default:''},
	city : {type:String,default:''},
	country : {type:String,default:''},
	billmode:{type:Boolean,default:''},
	add_type : {type:String,default:''},
    is_default: {type:String,default:''},
    state: {type:String,default:''}
});

const CustomerAddress = mongoose.model('CustomerAddress', customerAddressSchema);

module.exports = CustomerAddress;
