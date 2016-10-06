const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
	user_id : {type:String,default:''},
	address_line1 : {type:String,default:''},
	address_line2 : {type:String,default:''},
	city : {type:String,default:''},
	postal_code : {type:String,default:''},
	country : {type:String,default:''},
	website : {type:String,default:''},
	shr_fb : {type:String,default:''},
	shr_tw : {type:String,default:''},
	shr_intg : {type:String,default:''},
	enable_filter : {type:String,default:''},
	configDetail:{type:Array,default:[]},
	created : {type:String,default:''},
	updated : {type:String,default:''}
});

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

module.exports = UserDetails;

