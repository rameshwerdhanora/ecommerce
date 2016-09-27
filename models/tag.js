const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
	name: String,
  	createdAt:String,
  	updatedAt:String,
});

const Tag = mongoose.model('hashtag', tagSchema);

module.exports = Tag;