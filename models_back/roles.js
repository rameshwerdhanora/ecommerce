const mongoose = require('mongoose');

const rolesSchema = new mongoose.Schema({
  name: String
});

const roles = mongoose.model('roles', rolesSchema);

module.exports = roles;