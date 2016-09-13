const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
	user_id : String,
	brand_id : String
});

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;