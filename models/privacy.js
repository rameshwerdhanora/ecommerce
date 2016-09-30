const mongoose = require('mongoose');

const privacySchema = new mongoose.Schema({
  user_id: String,
  language : String,
  currency : String,
  privacytype : String,
  useageanalytics:String,
  celldata:String
});

const Privacy = mongoose.model('Privacy', privacySchema);

module.exports = Privacy;
