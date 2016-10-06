const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
	user_id : {type:String,default:''},
	enablenotification : {type:String,default:''},
	news : {type:Array,default:[]},
	shipped : {type:Array,default:[]},
	delivery : {type:Array,default:[]},
	promocode : {type:Array,default:[]},
	new_arrival : {type:Array,default:[]},// email,mobile
	date : {type:String,default:''}  
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
