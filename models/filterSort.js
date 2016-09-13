
const mongoose = require('mongoose');

const filterSortSchema = new mongoose.Schema({
	user_id : String,
	filter : Array,
	sort : Array,
	brand_id:String,
	date: String 
});

const FilterSort = mongoose.model('FilterSort', filterSortSchema);

module.exports = FilterSort;
