const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userAppSchema = new mongoose.Schema({
    role_id : {type:String,default:''},
    user_name : { type: String, unique: true },
    password : {type:String,default:''},
    email_id : { type: String, unique: true },
    first_name : {type:String,default:''},
    last_name : {type:String,default:''},
    contact_no : {type:String,default:''},
    dob : {type:String,default:''},
    gender : {type:String,default:''},
    bio : {type:String,default:''},
    cover_image : {type:String,default:''},
    profile_image : {type:String,default:''},
    social_type : {type:String,default:''},
    social_id : {type:String,default:''},
    access_token : {type:String,default:''},
    is_active : {type:String,default:''},
    isFomo : {type:String,default:''},
    is_deleted : {type:String,default:''},
    created : {type:String,default:''},
    updated : {type:String,default:''},
    facebook:{type:String,default:''},
    twitter:{type:String,default:''},
    instagram:{type:String,default:''},
    tumblr:{type:String,default:''},
    pinterest:{type:String,default:''},
    shop_id:{type:String,default:''},// This is for Shop customer
    shop_name:{type:String,default:''},
    address:{type:String,default:''},
    city:{type:String,default:''},
    state:{type:String,default:''},
    zip:{type:String,default:''},
    country:{type:String,default:''},
    bio:{type:String,default:''},
    shop_logo:{type:String,default:''}
    
    
  /*profile: {
    name: { type: {type:String,default:''}, default: '' },
    gender: { type: {type:String,default:''}, default: '' },
    location: { type: {type:String,default:''}, default: '' },
    website: { type: {type:String,default:''}, default: '' },
    picture: { type: {type:String,default:''}, default: '' }
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