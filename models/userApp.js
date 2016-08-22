const mongoose = require('mongoose');

const userAppSchema = new mongoose.Schema({
  role_id : String,
  user_name : String,
  password : String,
  email_id : String,
  first_name : String,
  last_name : String,
  contact_no : String,
  dob : String,
  gender : String,
  bio : String,
  cover_image : String,
  profile_image : String,
  social_type : String,
  social_id : String,
  access_token : String,
  is_active : String,
  is_deleted : String,
  created : String,
  updated : String 
});

const UserApp = mongoose.model('UserApp', userAppSchema);

module.exports = UserApp;