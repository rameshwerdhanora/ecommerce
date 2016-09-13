const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
	user_id : String,
	enablenotification : Boolean,

	news : Array,
	shipped : Array,
	delivery : Array,
	promocode : Array,
	new_arrival : Array,// email,mobile

	date : String  
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
