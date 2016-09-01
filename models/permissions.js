const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  parent_id:String,
  name: String
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;