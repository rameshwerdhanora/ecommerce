const mongoose = require('mongoose');

const globalSettingSchema = new mongoose.Schema({
	key : String,
	value : String
});

const GlobalSetting = mongoose.model('GlobalSetting', globalSettingSchema);

module.exports = GlobalSetting;
