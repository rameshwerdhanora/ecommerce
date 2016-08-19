const mongoose = require('mongoose');

const commonSchema = new mongoose.Schema({
	user_id : String,
	feedback_subject : String,
	feedback_description : String,
	created : String
});

const Common = mongoose.model('Common', commonSchema);

module.exports = Common;