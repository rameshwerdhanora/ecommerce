const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
	user_id : {type:String,default:''},
	brand_id : {type:String,default:''}
});

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;