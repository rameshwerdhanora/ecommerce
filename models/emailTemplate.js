const mongoose = require('mongoose');

const emailtemplateSchema = new mongoose.Schema({
	name: String,
  	subject:String,
  	content:String,
  	user_id:String,
});

const EmailTemplate = mongoose.model('EmailTemplate', emailtemplateSchema);

module.exports = EmailTemplate;