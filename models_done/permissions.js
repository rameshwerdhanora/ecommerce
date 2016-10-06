const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: {type:String,default:''},
  display_name : {type:String,default:''},
  description : {type:String,default:''},
  created : {type:String,default:''},
  parent_id:{type:String,default:''}
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;