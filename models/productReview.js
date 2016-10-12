const mongoose = require('mongoose');

const productReviewSchema = new mongoose.Schema({
	user_id : {type:String,default:''},
	order_id : {type:String,default:''},
	order_detail_id : {type:String,default:''},
	rating : {type:String,default:''},
	comment : {type:String,default:''},
        createAt:{ type: Date},
        
        updateAt:{type: Date,default:new Date()}
});

const ProductReview = mongoose.model('ProductReview', productReviewSchema);
module.exports = ProductReview;