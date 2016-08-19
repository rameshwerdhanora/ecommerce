const mongoose = require('mongoose');

const rolesSchema = new mongoose.Schema({
  name: String
});

const Roles = mongoose.model('User', rolesSchema);

module.exports = Roles;