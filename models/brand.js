const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
	brand_name : {type:String,default:''},
	brand_cover : {type:String,default:''},
	brand_logo : {type:String,default:''},
	brand_desc : {type:String,default:''},
	brand_view  :{type:String,default:'1'},
	user_id : {type:String,default:''}
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
