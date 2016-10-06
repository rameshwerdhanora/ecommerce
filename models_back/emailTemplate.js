const mongoose = require('mongoose');

const emailtemplateSchema = new mongoose.Schema({
	name: String,
  	subject:String,
  	content:String,
        template_type:String,
  	user_id:String,
  	mobile_content:String,
        user_type:String
});

const EmailTemplate = mongoose.model('EmailTemplate', emailtemplateSchema);

module.exports = EmailTemplate;