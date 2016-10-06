const mongoose = require('mongoose');

const rolesSchema = new mongoose.Schema({
  name: {type:String,default:''}
});

const roles = mongoose.model('roles', rolesSchema);

module.exports = roles;