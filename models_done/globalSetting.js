const mongoose = require('mongoose');

const globalSettingSchema = new mongoose.Schema({
	key : {type:String,default:''},
	value : {type:String,default:''}
});

const GlobalSetting = mongoose.model('GlobalSetting', globalSettingSchema);

module.exports = GlobalSetting;
