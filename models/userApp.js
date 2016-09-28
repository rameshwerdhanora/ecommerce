const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userAppSchema = new mongoose.Schema({
    role_id : String,
    user_name : { type: String, unique: true },
    password : String,
    email_id : { type: String, unique: true },
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
    isFomo : String,
    is_deleted : String,
    created : String,
    updated : String,
    facebook:String,
    twitter:String,
    instagram:String,
    tumblr:String,
    pinterest:String,
    shop_id:String,// This is for Shop customer
    shop_name:String,
    
   
    

    address:String,
    city:String,
    state:String,
    zip:String,
    country:String,
    bio:String
  /*profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  }*/
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userAppSchema.pre('save', function (next) {
  const userApp = this;
  if (!userApp.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(userApp.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      userApp.password = hash;
      next();
    });
  });
});



/**
 * Helper method for validating user's password.
 */
userAppSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userAppSchema.methods.gravatar = function (size) {
  if (!size) {
    size = 200;
  }
  if (!this.email_id) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email_id).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const UserApp = mongoose.model('UserApp', userAppSchema);

module.exports = UserApp;