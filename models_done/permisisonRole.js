const mongoose = require('mongoose');

const permissionRolesSchema = new mongoose.Schema({
  permissionId: {type:String,default:''},
  roleId : {type:String,default:''},
  created : {type:String,default:''}
});

const PermissionRoles = mongoose.model('PermissionRoles', permissionRolesSchema);

module.exports = PermissionRoles;