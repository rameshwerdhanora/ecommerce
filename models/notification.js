const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
	user_id : String,
	enablenotification : Boolean,
	news : String,
	shipped : String,
	delivery : String,
	promocode : String,
	new_arrival : String,
	date : String  
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
