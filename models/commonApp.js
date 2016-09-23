const mongoose = require('mongoose');

const commonAppSchema = new mongoose.Schema({
	user_id : String,
	email : String,
	//feedback_subject : String,
	feedback_description : String,
	created : String
});

const CommonApp = mongoose.model('CommonApp', commonAppSchema);

module.exports = CommonApp;
