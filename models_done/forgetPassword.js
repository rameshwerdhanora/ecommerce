const mongoose = require('mongoose');

const forgetPasswordSchema = new mongoose.Schema({
	email : {type:String,default:''},
	send_token : {type:String,default:''},
	send_time : {type:String,default:''}
});

const ForgetPassword = mongoose.model('ForgetPassword', forgetPasswordSchema);

module.exports = ForgetPassword;
