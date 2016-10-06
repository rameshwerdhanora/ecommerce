const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
	user_id : String,
	order_id : String,
	email_address : String,
	message : String,
	created : String
});

const refund = mongoose.model('refund', refundSchema);

module.exports = refund;
