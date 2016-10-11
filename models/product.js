const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : {type:String,default:''},
    blurb : {type:String,default:''},
    gender : {type:String,default:''},
    category_id : {type:String,default:''},
    sub_category_id : {type:String,default:''},
    brand_id : {type:String,default:''},
    sku : {type:String,default:''},
    price : {type:String,default:''},
    description : {type:String,default:''},
    user_id : {type:String,default:''},
    description : {type:String,default:''},
    productview:{type:String,default:''},
    is_featured : {type:String,default:''},
    color : {type:Array,default:[]},
    attribute : {type:Array,default:[]},// It's attribute option iD's
    created : {type:String,default:''},
    updated : {type:String,default:''},
    dis_name : {type:String,default:''},
    dis_type : {type:String,default:''},
    dis_amount : {type:String,default:''},
    shop_id:{type:String,default:''}, // This is for shop id
    address:{type:String,default:''},
    weight:{type:String,default:''},
    dimension:{type:String,default:''},
        
        
        
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;