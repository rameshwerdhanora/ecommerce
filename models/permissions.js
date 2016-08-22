const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: String,
  display_name : String,
  description : String,
  created : String
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;