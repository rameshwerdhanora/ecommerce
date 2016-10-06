const mongoose = require('mongoose');

const privacySchema = new mongoose.Schema({
  user_id: {type:String,default:''},
  language : {type:String,default:''},
  currency : {type:String,default:''},
  privacytype : {type:String,default:''},
  useageanalytics:{type:String,default:''},
  celldata:{type:String,default:''}
});

const Privacy = mongoose.model('Privacy', privacySchema);

module.exports = Privacy;
