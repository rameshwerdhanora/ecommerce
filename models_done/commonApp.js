const mongoose = require('mongoose');

const commonAppSchema = new mongoose.Schema({
	user_id : {type:String,default:''},
	email : {type:String,default:''},
	//feedback_subject : {type:String,default:''},
	feedback_description : {type:String,default:''},
	created : {type:String,default:''}
});

const CommonApp = mongoose.model('CommonApp', commonAppSchema);

module.exports = CommonApp;
