/* Add Multer Library for upload image */
const Multer 			= require('multer');
const async 			= require('async');
const Product			= require('../models/product');
const ProductImage		= require('../models/productsImages');
const Brand				= require('../models/brand');
const Category			= require('../models/category');
const SubCategory		= require('../models/subCategory');
const Attribute			= require('../models/attribute');
const AttributeOption	= require('../models/attributeOption');
const Color				= require('../models/color');
const Constants 		= require('../constants/constants');
const Size 		= require('../models/size');




/* Define Folder name where our user porfile stored */
var storage =   Multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/uploads/product_images');
  },
  filename: function (req, file, callback) {
  	var realname = file.originalname.replace(/ /g,"_");
    callback(null, Date.now() + '_' + realname);
  }
});
/* Create Instance for upload folder */
var uploadProductImage = Multer({ storage : storage}).any();


/* List of all Products  */
exports.listOfProducts = (req, res) => {
    
    var page = (req.query.page == undefined)?1:req.query.page;
    page = (page == 0)?1:page;
    var skipRecord = (page-1)*Constants.RECORDS_PER_PAGE;
    
    Product.count(function(error, totalRecord) {
        var totalPage = Math.ceil(totalRecord/Constants.RECORDS_PER_PAGE);
        Product.find()
            .limit(Constants.RECORDS_PER_PAGE)
            .skip(skipRecord)
            .sort('-_id')
            .exec(function(error,fetchAllProducts){
            //console.log(fetchAllProducts);
            Category.find({is_active:1},function(error,fetchCategories){
                SubCategory.find({is_active:1},function(error,fetchSubCategories){
                    Brand.find({},function(error,fetchAllBrands){
                        Attribute.find({},function(error,fetchAllAttributes){
                            Color.find({},function(error,fetchAllColors){
                                /*
                                res.render('product/add_product', {
                                    title: 'Product',
                                    allBrands : fetchAllBrands,
                                    fetchCategories:fetchCategories,
                                    fetchSubCategories:fetchSubCategories,
                                    fetchAllAttributes:fetchAllAttributes,
                                    fetchAllColors:fetchAllColors
                                });*/
                                var tempBrand = {};
                                for(var i = 0;i< fetchAllBrands.length;i++){
                                    tempBrand[fetchAllBrands[i]._id] = fetchAllBrands[i].brand_name;
                                }
                                var tempCategory = {};
                                for(var i = 0;i< fetchCategories.length;i++){
                                    tempCategory[fetchCategories[i]._id] = fetchCategories[i].name;
                                }
                                if(req.params.productId){
                                    //Category.find({is_active:1},function(error,fetchCategories){
                                        //SubCategory.find({is_active:1},function(error,fetchSubCategories){
                                            //Brand.find({},function(error,fetchAllBrands){
                                                //Attribute.find({},function(error,fetchAllAttributes){
                                                    //Color.find({},function(error,fetchAllColors){
                                                        Product.findOne({_id:req.params.productId},function(error,productRes){
                                                            //Color.find(_id:{$in:{productRes.color}},function(error,selectedColor){
                                                                
                                                                res.render('product/list', {
                                                                    title: 'Update product',
                                                                    fetchAllProducts:fetchAllProducts,
                                                                    activeClass:1,
                                                                    left_activeClass:3,
                                                                    allBrands : fetchAllBrands,
                                                                    fetchCategories:fetchCategories,
                                                                    fetchSubCategories:fetchSubCategories,
                                                                    fetchAllAttributes:fetchAllAttributes,
                                                                    fetchAllColors:fetchAllColors,
                                                                    editProduct:true,
                                                                    productRes:productRes,
                                                                    brandAr:tempBrand,
                                                                    categoryAr:tempCategory
                                                                });
                                                            //});
                                                        });
                                                    //});	
                                                //});
                                            //});
                                        //});
                                    //});
                                }else{
                                    res.render('product/list',{
                                        title: 'Product',
                                        fetchAllProducts:fetchAllProducts,
                                        activeClass:1,
                                        left_activeClass:3,
                                        allBrands : fetchAllBrands,
                                        fetchCategories:fetchCategories,
                                        fetchSubCategories:fetchSubCategories,
                                        fetchAllAttributes:fetchAllAttributes,
                                        fetchAllColors:fetchAllColors,
                                        editProduct:false,
                                        brandAr:tempBrand,
                                        categoryAr:tempCategory
                                    });
                                }
                            });	
                        });
                    });
                });
            });
        });	
    });
};

/* Create new Product */
exports.addProduct = (req, res) => {
    Category.find({is_active:1},function(error,fetchCategories){
        SubCategory.find({is_active:1},function(error,fetchSubCategories){
            Brand.find({},function(error,fetchAllBrands){
                Attribute.find({},function(error,fetchAllAttributes){
                    Color.find({},function(error,fetchAllColors){
                        res.render('product/add_product', {
                            title: 'Product',
                            allBrands : fetchAllBrands,
                            fetchCategories:fetchCategories,
                            fetchSubCategories:fetchSubCategories,
                            fetchAllAttributes:fetchAllAttributes,
                            fetchAllColors:fetchAllColors
                        });
                    });	
                });
            });
        });
    });
	
};

/* Edit Existing Product */
exports.editProduct = (req, res) => {
    Category.find({is_active:1},function(error,fetchCategories){
        SubCategory.find({is_active:1},function(error,fetchSubCategories){
            Color.find({},function(error,fetchAllColors){
                Attribute.find({},function(error,fetchAllAttributes){
                    Brand.find({},function(error,fetchAllBrands){
                        Product.findOne({_id:req.params.productId},function(error,fetchEditProduct){
                            if(fetchEditProduct){	
                                ProductImage.find({product_id:req.params.productId},function(error,fetchImageOfProducts){	
                                    res.render('product/edit_product', {
                                        title: 'Product',
                                        fetchEditProduct:fetchEditProduct,
                                        fetchImageOfProducts:fetchImageOfProducts,
                                        allBrands : fetchAllBrands,
                                        fetchCategories:fetchCategories,
                                        fetchSubCategories:fetchSubCategories,
                                        fetchAllColors:fetchAllColors,
                                        fetchAllAttributes:fetchAllAttributes
                                    });
                                });	
                            }else {
                                req.flash('errors', error);
                                return res.redirect('/product/list');
                            }

                        }); 
                    });	
                });
            });	 
        });	 
    });
};


/* Save Product */
exports.saveProduct = (req, res) => {
    uploadProductImage(req,res,function(err){
        if(err){
            return res.end("Error uploading file.");
        }
        var fineSku = req.body.sku.replace(' ','-');
        var productIns = new Product();
        productIns.name  = req.body.name;
        productIns.blurb  = req.body.blurb;
        productIns.description = req.body.blurb;
        productIns.sku  = fineSku;
        productIns.gender = req.body.gender;
        productIns.category_id  = req.body.category_id;
        productIns.sub_category_id = req.body.sub_category_id;
        productIns.brand_id = req.body.brand_id;
        productIns.is_featured = req.body.is_featured;
        productIns.price  = req.body.price;
        productIns.color  = req.body.color;
        productIns.productview = '0';
        //productIns.attribute = req.body.selectedAttr;
        productIns.attribute = req.body.size;
        productIns.user_id = req.user._id; 
        productIns.created = Date.now();
        productIns.update = Date.now();
        productIns.users_id = 1;
        productIns.dis_name = req.body.add_dis_name;
        productIns.dis_type = req.body.add_dis_type;
        productIns.dis_amount = req.body.add_dis_amount;
        
        productIns.save(function(err){
            if (err){
                res.send({status:'error',error:err});
            }else {
                //var finePath = req.files[0].path.replace('public/','');
                var productImageIns = new ProductImage();
                productImageIns.product_id  = productIns._id;
                productImageIns.thumb_image_1 	= req.files[0].path.replace('public/','');;
                productImageIns.large_image_1 	= req.files[0].path.replace('public/','');;
                productImageIns.image_name_1 	= req.files[0].filename;
                productImageIns.thumb_image_2 	= req.files[1].path.replace('public/','');;
                productImageIns.large_image_2 	= req.files[1].path.replace('public/','');;
                productImageIns.image_name_2 	= req.files[1].filename;
                productImageIns.thumb_image_3 	= req.files[2].path.replace('public/','');;
                productImageIns.large_image_3 	= req.files[2].path.replace('public/','');;
                productImageIns.image_name_3 	= req.files[2].filename;
                productImageIns.thumb_image_4 	= req.files[3].path.replace('public/','');;
                productImageIns.large_image_4 	= req.files[3].path.replace('public/','');;
                productImageIns.image_name_4 	= req.files[3].filename;
                productImageIns.save(function(err){
                    if (err){
                        //res.send({status:'error',error:err});
                        req.flash('errors', ['Something went wronge']);
                        res.redirect('/product/list');
                    }else {
                        req.flash('success', ['Product added successfully.']);
                        res.redirect('/product/list');
                    }
                });
            }
        });
    });
}; 

/* Update Product */
exports.updateProduct = (req, res) => {
    uploadProductImage(req,res,function(err) {
        if(err){
                return res.end("Error uploading file.");
        }
        updateFineSku = req.body.sku.replace(' ','-');
        updateProductData = {
            'name'			: req.body.name,
            'blurb'                 : req.body.blurb,
            'sku'  			: updateFineSku,
            'description' 		: req.body.description,
            'category_id' 		: req.body.category_id,
            'sub_category_id'	: req.body.sub_category_id,
            'brand_id' 		: req.body.brand_id,
            'is_featured'		: req.body.is_featured,
            'price' 		: req.body.price,
            'user_id' 		: req.user.productId,
            'update' 		: Date.now(),
            'attribute'         : req.body.size,
            'color'             : req.body.color,
            'gender'            : req.body.gender,
            'dis_name'          : req.body.edit_dis_name,
            'dis_type'          : req.body.edit_dis_type,
            'dis_amount'        : req.body.edit_dis_amount
        };

        Product.findByIdAndUpdate(req.body.productId,updateProductData, function(error, updateProductRes){
            if(req.file){
                var finePath 			= req.file.path.replace('public/','');
                var updateProductImage 	= {
                    'product_id'	: req.body.productId,
                    'thumb_image'	: finePath,
                    'large_image'	: finePath,
                    'image_name'	: req.file.filename 
                }
                ProductImage.update(req.body.productId,updateProductImage, function(error, updateProductImageRes){
                    if(updateProductImageRes){
                            req.flash('success', ['Update product images successfully.']);
                    }else{
                            req.flash('success', ['Update product details successfully.']);
                            res.redirect('/product/list');
                    }
                });
            }else{
                req.flash('success', ['Update product details successfully.']);
                res.redirect('/product/list');
            }
        });
    });
};

/* Remove Product */
exports.removeProduct = (req, res) => {
    Product.remove({_id:req.params.productId}, function(error, removeProductId){
        if(error){
            res.send({status:'error',msg:error});
        }else{
            res.send({status:'success',msg:'Remove Successfully.'});
        }
    });
};


/**
 * GET /product/fetchselectedcategory/:catId
 * Process Fetch all sub categories of selected category
 */

exports.selectedCategory = (req,res) => {
	
	SubCategory.find({parent_id:req.params.catId,is_active:'1'},function(error,fetchSubCategory)
	{
		if(fetchSubCategory)
		{
			res.send({status:'success',msg:'Fetch all sub categories.',fetchSubCategory:fetchSubCategory});
		}
		else 
		{
			res.send({status:'error',msg:'Not any sub category created in selected category.'});
		}
	});
};


/**
 * GET /product/loadattrvalues/:attrId
 * Process for fetch all attributes value of selected attribute
 */

exports.loadAttrValues = (req,res) => {	
    AttributeOption.find({attribute_id:req.params.attrId},function(error,fetchAttrValues){
        if(fetchAttrValues){
            res.send({status:'success',msg:'Fetch all attribute value.',fetchAttrValues:fetchAttrValues});
        }else{
            res.send({status:'error',msg:'Not found any attibute options.'});
        }
    });
};

exports.getAttrib = (req,res)=>{
    Size.find({gender:req.body.gender},function(error,sizeRes){
        var sizeAr = new Array();
        if(sizeRes.length){
            for(var i=0;i < sizeRes.length;i++){
                for(j=0;j < sizeRes[i].listofattrmap.length;j++){
                    sizeAr.push(sizeRes[i].listofattrmap[j]);
                }
            }
            Attribute.find({_id:{$in:sizeAr}},function(error,attributRes){
                var attribAr = new Array();
                for(var i=0;i < attributRes.length;i++){
                    attribAr.push(attributRes[i]._id);
                }
                AttributeOption.find({attribute_id:{$in:attribAr}},function(error,attribOptionRes){
                    var mainResult = new Array();
                    var result = {};
                    for(var i=0;i < sizeRes.length;i++){
                        result.size = sizeRes[i].size_name;
                        result.attributes = new Array();
                        for(j=0;j < sizeRes[i].listofattrmap.length;j++){
                            for(var k=0;k<attributRes.length;k++){
                                if(attributRes[k]._id == sizeRes[i].listofattrmap[j]){
                                    var rs1 = {};
                                    rs1.attribute = attributRes[k].name;
                                    rs1.attributeId = attributRes[k]._id;
                                    rs1.options = new Array();
                                    for(var l=0;l < attribOptionRes.length; l++){
                                        if(attributRes[k]._id  == attribOptionRes[l].attribute_id){
                                            var tempOption = {};
                                            tempOption.id= attribOptionRes[l]._id;
                                            tempOption.value= attribOptionRes[l].value;
                                            rs1.options.push(tempOption);
                                        }
                                    }
                                    console.log(rs1);
                                    result.attributes.push(rs1);
                                }
                            }
                        }
                        console.log(result);
                        mainResult.push(result);
                    }
                    res.send({status:'success',data:mainResult});
                });	
            });
        }else{
            res.send({status:'error',data:{}});
        }
    });
};