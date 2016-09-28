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
const Tag				= require('../models/tag');
const ProductsHashtag		= require('../models/productHashtag');


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
    // If Super user trying to create product then give deny him
    if(req.user.role_id == Constants.MASTERROLE && req.params.productId == 'add'){
        req.flash('errors', ['Super admin can not create product. This feature is only for the Shop user']);
        return res.redirect('/product/list');
    }
    
    var page = (req.query.page == undefined)?1:req.query.page;
    page = (page == 0)?1:page;
    var skipRecord = (page-1)*Constants.RECORDS_PER_PAGE;
    
     if(req.user.role_id==1){
            Product.count(function(error, totalRecord) {
            var totalPage = Math.ceil(totalRecord/Constants.RECORDS_PER_PAGE);
            Product.find()
                .limit(Constants.RECORDS_PER_PAGE)
                .skip(skipRecord)
                .sort('-_id')
                .exec(function(error,fetchAllProducts){
                Category.find({is_active:1},function(error,fetchCategories){
                    SubCategory.find({is_active:1},function(error,fetchSubCategories){
                        Brand.find({},function(error,fetchAllBrands){
                            Attribute.find({},function(error,fetchAllAttributes){
                                Color.find({},function(error,fetchAllColors){
                                    Tag.find({},function(error,fetchAllTags){
                                        ProductImage.find({},function(error,fetchImagesOfProducts){
                                            AttributeOption.find({},function(error,fetchAttrOptionValues){
                                            
                                                var tempBrand = {};
                                                if(fetchAllBrands){
                                                    for(var i = 0;i< fetchAllBrands.length;i++){
                                                        tempBrand[fetchAllBrands[i]._id] = fetchAllBrands[i].brand_name;
                                                    }
                                                }
                                                
                                                var tempCategory = {};
                                                if(fetchCategories){
                                                    for(var i = 0;i< fetchCategories.length;i++){
                                                        tempCategory[fetchCategories[i]._id] = fetchCategories[i].name;
                                                    }
                                                }

                                                var tempSubCategory = {};
                                                if(fetchSubCategories){
                                                    for(var i = 0;i< fetchSubCategories.length;i++){
                                                        tempSubCategory[fetchSubCategories[i]._id] = fetchSubCategories[i].name;
                                                    }
                                                }
                                                
                                                var tempProductImages = {};
                                                if(fetchImagesOfProducts){
                                                    for(var i = 0;i< fetchImagesOfProducts.length;i++){
                                                        tempProductImages[fetchImagesOfProducts[i].product_id] = fetchImagesOfProducts[i].thumb_image_4;
                                                    }
                                                }
                                                
                                                var tempAttrOptionValues = {};
                                                if(fetchAttrOptionValues){
                                                    for(var i = 0;i< fetchAttrOptionValues.length;i++){
                                                        tempAttrOptionValues[fetchAttrOptionValues[i]._id] = fetchAttrOptionValues[i].value;
                                                    }
                                                    console.log(tempAttrOptionValues);
                                                }
                                                
                                                
                                                
                                                
                                                res.render('product/admin_list',{
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
                                                    categoryAr:tempCategory,
                                                    subcategoryAr:tempSubCategory,
                                                    fetchAllTags:fetchAllTags,
                                                    productImagesArr :tempProductImages,
                                                    attrOptionValuesArr :tempAttrOptionValues
                                                });
                                            });
                                        }); 
                                    });	
                                }); 
                            });
                        });
                    });
                });
            });	
        });
     }else{
            Product.count(function(error, totalRecord) {
            var totalPage = Math.ceil(totalRecord/Constants.RECORDS_PER_PAGE);
            Product.find()
                .limit(Constants.RECORDS_PER_PAGE)
                .skip(skipRecord)
                .sort('-_id')
                .exec(function(error,fetchAllProducts){
                Category.find({is_active:1},function(error,fetchCategories){
                    SubCategory.find({is_active:1},function(error,fetchSubCategories){
                        Brand.find({},function(error,fetchAllBrands){
                            Attribute.find({},function(error,fetchAllAttributes){
                                Color.find({},function(error,fetchAllColors){
                                    Tag.find({},function(error,fetchAllTags){
                                        var tempBrand = {};
                                        for(var i = 0;i< fetchAllBrands.length;i++){
                                            tempBrand[fetchAllBrands[i]._id] = fetchAllBrands[i].brand_name;
                                        }
                                        var tempCategory = {};
                                        for(var i = 0;i< fetchCategories.length;i++){
                                            tempCategory[fetchCategories[i]._id] = fetchCategories[i].name;
                                        }
                                        if(req.params.productId && req.params.productId != 'add'){
                                            Product.findOne({_id:req.params.productId},function(error,productRes){
                                                   ProductsHashtag.find({product_id:req.params.productId},{hashtag_id:true, _id:false},function(error,selectedHashtag){
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
                                                        categoryAr:tempCategory,
                                                        fetchAllTags:fetchAllTags,
                                                        selectedHashtag:selectedHashtag,
                                                        addFlag :false
                                                    });
                                                });
                                            });
                                        }else{
                                            var addFlag = (req.params.productId == 'add')?true:false;
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
                                                categoryAr:tempCategory,
                                                fetchAllTags:fetchAllTags,
                                                addFlag :addFlag
                                            });
                                        }
                                    });	
                                }); 
                            });
                        });
                    });
                });
            });	
        });
     }
    
    
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
    
    // If Super user trying to create product then give deny him
    if(req.user.role_id == Constants.MASTERROLE && req.params.productId == 'add'){
        req.flash('errors', ['Super admin can not create product. This feature is only for the Shop user']);
        return res.redirect('/product/list');
    }
    
    uploadProductImage(req,res,function(err){
        if(err){
            return res.end("Error uploading file.");
        }
        
        /*const readChunk = require('read-chunk'); // npm install read-chunk 
        const fileType = require('file-type');
        const buffer = readChunk.sync(req.body.product_image, 0, 262);
        
        console.log(fileType(buffer));*/
        
        req.assert('name', 'Product name is required').notEmpty();    
        req.assert('blurb', 'Product blurb is required').notEmpty();    
        req.assert('sku', 'Sku ID is required').notEmpty();
        req.assert('gender', 'Gender is required').notEmpty();
        req.assert('category_id', 'Category is required').notEmpty();
        req.assert('price', 'Price is required').notEmpty();
        req.assert('color', 'Color is required').notEmpty();
        var errors = req.validationErrors();  
        if(!errors){ 
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
            productIns.shop_id = req.user.shop_id;
            


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
                             hashtagIdArr = req.body.hash_tag;
                                if(hashtagIdArr){
                                   hashtagIdArr.forEach(function(hashtagId) {
                                     var productsHashtagIns = new ProductsHashtag();
                                     productsHashtagIns.product_id = productIns._id;
                                     productsHashtagIns.hashtag_id = hashtagId;
                                     productsHashtagIns.save();
                                  });
                             }
                             req.flash('success', ['Product added successfully.']);
                             res.redirect('/product/list');
                        }
                    });
                }
            });
        }else{
            var er = new Array();
            for(var i = 0;i<errors.length;i++){
                er.push(errors[i].msg);
            }
            req.flash('errors',er);
            res.redirect('/product/list');
        }
        
    });
}; 

/* Update Product */
exports.updateProduct = (req, res) => {
    uploadProductImage(req,res,function(err) {
        if(err){
                return res.end("Error uploading file.");
        }
 
        req.assert('name', 'Product name is required').notEmpty();    
        req.assert('blurb', 'Product blurb is required').notEmpty();    
        req.assert('sku', 'Sku ID is required').notEmpty();
        req.assert('gender', 'Gender is required').notEmpty();
        req.assert('category_id', 'Category is required').notEmpty();
        req.assert('price', 'Price is required').notEmpty();
        req.assert('color', 'Color is required').notEmpty();
        var errors = req.validationErrors();  
        if(!errors){ 
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
                   ProductsHashtag.remove({product_id:req.body.productId}, function(error, removeHashtag){
                     if(error){
                        res.send({status:'error',msg:error});
                     }else{
                        hashtagIdArr = req.body.hash_tag;
                        if(hashtagIdArr){
                            hashtagIdArr.forEach(function(hashtagId) {
                               var productsHashtagIns = new ProductsHashtag();
                               productsHashtagIns.product_id = req.body.productId;
                               productsHashtagIns.hashtag_id = hashtagId;
                               productsHashtagIns.save();
                            });
                        }
                     }
                  });
                    req.flash('success', ['Update product details successfully.']);
                    res.redirect('/product/list');
                }
            });
        }else{
            var er = new Array();
            for(var i = 0;i<errors.length;i++){
                er.push(errors[i].msg);
            }
            req.flash('errors',er);
            res.redirect('/product/list');
        }
    });
};

/* Remove Product */
exports.removeProduct = (req, res) => {
    Product.remove({_id:req.params.productId}, function(error, removeProductId){
        ProductsHashtag.remove({product_id:req.params.productId}, function(err, removeHashtag){
            if(err){
                res.send({status:'error',msg:error});
            }else{
                res.send({status:'success',msg:'Remove Successfully.'});
            }
       }); 
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
    //Get Size for the Gender
    Size.find({gender:req.body.gender},function(error,sizeRes){
        var sizeAr = new Array();
        if(sizeRes !== undefined){
            for(var i=0;i < sizeRes.length;i++){
                for(j=0;j < sizeRes[i].listofattrmap.length;j++){
                    sizeAr.push(sizeRes[i].listofattrmap[j]);
                }
            }
            // Get Attribute for the Sizes
            Attribute.find({_id:{$in:sizeAr}},function(error,attributRes){
                var attribAr = new Array();
                if(attributRes !== undefined){
                  for(var i=0;i < attributRes.length;i++){
                    attribAr.push(attributRes[i]._id);
                  }
                }
                
                AttributeOption.find({attribute_id:{$in:attribAr}},function(error,attribOptionRes){
                    var mainResult = new Array();
                    
                    for(var i=0;i < sizeRes.length;i++){
                        var result = {};
                        result.size = sizeRes[i].size_name;
                        result.attributes = new Array();
                        // Sizes
                        for(j=0;j < sizeRes[i].listofattrmap.length;j++){
                            if(attributRes){
                                //Attributes
                                for(var k=0;k<attributRes.length;k++){
                                    if(attributRes[k]._id == sizeRes[i].listofattrmap[j]){
                                        var rs1 = {};
                                        rs1.attribute = attributRes[k].name;
                                        rs1.attributeId = attributRes[k]._id;
                                        rs1.type = attributRes[k].type;
                                        //Attributes Options
                                        if(attributRes[k].type == 'select' || attributRes[k].type == 'multiselect'){
                                            rs1.options = new Array();
                                            if(attribOptionRes){
                                               for(var l=0;l < attribOptionRes.length; l++){
                                                    if(attributRes[k]._id  == attribOptionRes[l].attribute_id){
                                                        var tempOption = {};
                                                        tempOption.id= attribOptionRes[l]._id;
                                                        tempOption.value= attribOptionRes[l].value;
                                                        rs1.options.push(tempOption);
                                                    }
                                               }  
                                            }
                                        }
                                        //console.log(rs1);
                                        result.attributes.push(rs1);
                                    }
                                }
                            }
                        }
                        //console.log(result);
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
