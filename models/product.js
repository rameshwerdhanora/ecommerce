const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
        name : String,
        blurb : String,
        gender : String,
        category_id : String,
	sub_category_id : String,
	brand_id : String,
        sku : String,
        price : String,
        description : String,
	users_id : String,
	description : String,
	productview:String,
	is_featured : String,
	color : Array,
	attribute : Array,// It's attribute option iD's
	created : String,
	updated : String,
	dis_name : String,
	dis_type : String,
	dis_amount : String,
        shop_id:String // This is for shop id
        
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
