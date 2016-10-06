
const mongoose = require('mongoose');

const filterSortSchema = new mongoose.Schema({
	user_id : {type:String,default:''},
	filter : {type:Array,default:[]},
	sort : {type:Array,default:[]},
	brand_id:{type:String,default:''},
	date: {type:String,default:''} 
});

const FilterSort = mongoose.model('FilterSort', filterSortSchema);

module.exports = FilterSort;
