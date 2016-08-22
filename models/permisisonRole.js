const mongoose = require('mongoose');

const permissionRolesSchema = new mongoose.Schema({
  permissionId: String,
  roleId : String,
  created : String
});

const PermissionRoles = mongoose.model('PermissionRoles', permissionRolesSchema);

module.exports = PermissionRoles;