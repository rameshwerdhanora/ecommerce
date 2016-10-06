const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
	name: {type:String,default:''},
  	createdAt:{type:String,default:''},
  	updatedAt:{type:String,default:''},
});

const Tag = mongoose.model('hashtag', tagSchema);

module.exports = Tag;