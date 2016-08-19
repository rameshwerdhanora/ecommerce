const mongoose = require('mongoose');

const forgetPasswordSchema = new mongoose.Schema({
	email : String,
	send_token : String,
	send_time : String
});

const ForgetPassword = mongoose.model('ForgetPassword', forgetPasswordSchema);

module.exports = ForgetPassword;
