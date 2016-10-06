const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
	user_id : {type:String,default:''},
	order_id : {type:String,default:''},
	email_address : {type:String,default:''},
	message : {type:String,default:''},
	created : {type:String,default:''}
});

const refund = mongoose.model('refund', refundSchema);

module.exports = refund;
