const mongoose = require('mongoose');

const userPermissionsSchema = new mongoose.Schema({
  user_id : String,
  permission_id: String,
  created : String
});

const UserPermissions = mongoose.model('UserPermissions', userPermissionsSchema);

module.exports = UserPermissions;