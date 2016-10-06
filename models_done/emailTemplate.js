const mongoose = require('mongoose');

const emailtemplateSchema = new mongoose.Schema({
	name: {type:String,default:''},
  	subject:{type:String,default:''},
  	content:{type:String,default:''},
        template_type:{type:String,default:''},
  	user_id:{type:String,default:''},
  	mobile_content:{type:String,default:''},
        user_type:{type:String,default:''}
});

const EmailTemplate = mongoose.model('EmailTemplate', emailtemplateSchema);

module.exports = EmailTemplate;