const mongoose = require('mongoose');

const userPermissionsSchema = new mongoose.Schema({
  user_id : {type:String,default:''},
  permission_id: {type:String,default:''},
  created : {type:String,default:''}
});

const UserPermissions = mongoose.model('UserPermissions', userPermissionsSchema);

module.exports = UserPermissions;