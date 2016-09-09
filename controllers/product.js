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
var uploadProductImage = Multer({ storage : storage}).single('product_image',4);

/* List of all Products  */
exports.listOfProducts = (req, res) => {
	Product.find({},function(error,fetchAllProducts)
	{
		//console.log(fetchAllProducts);
                Category.find({is_active:1},function(error,fetchCategories)
	{
		SubCategory.find({is_active:1},function(error,fetchSubCategories)
		{
			Brand.find({},function(error,fetchAllBrands)
			{
				Attribute.find({},function(error,fetchAllAttributes)
				{
					Color.find({},function(error,fetchAllColors)
					{
                                                /*
						res.render('product/add_product', {
                                                    title: 'Product',
                                                    allBrands : fetchAllBrands,
                                                    fetchCategories:fetchCategories,
                                                    fetchSubCategories:fetchSubCategories,
                                                    fetchAllAttributes:fetchAllAttributes,
                                                    fetchAllColors:fetchAllColors
						});*/
                                                
                                                res.render('product/list', 
                                                {
                                                        title: 'Product',
                                                        fetchAllProducts:fetchAllProducts,
                                                        activeClass:1,
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
        
		
	});	
};

/* Create new Product */
exports.addProduct = (req, res) => {
	Category.find({is_active:1},function(error,fetchCategories)
	{
		SubCategory.find({is_active:1},function(error,fetchSubCategories)
		{
			Brand.find({},function(error,fetchAllBrands)
			{
				Attribute.find({},function(error,fetchAllAttributes)
				{
					Color.find({},function(error,fetchAllColors)
					{
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

	Category.find({is_active:1},function(error,fetchCategories)
	{
		SubCategory.find({is_active:1},function(error,fetchSubCategories)
		{
			Color.find({},function(error,fetchAllColors)
			{
				Attribute.find({},function(error,fetchAllAttributes)
				{
					Brand.find({},function(error,fetchAllBrands)
					{
						Product.findOne({_id:req.params.productId},function(error,fetchEditProduct)
						{
							if(fetchEditProduct)
							{	
								ProductImage.find({product_id:req.params.productId},function(error,fetchImageOfProducts)
								{	
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
							}
							else 
							{
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
exports.saveProduct = (req, res) => 
{
	uploadProductImage(req,res,function(err) 
	{
		if(err) 
		{
			return res.end("Error uploading file.");
		}

		var fineSku 				= req.body.sku.replace(' ','-');
		var productIns 				= new Product();
		productIns.name 			= req.body.name
		productIns.sku  			= fineSku;
		productIns.description 		= req.body.description;
		productIns.category_id 		= req.body.category_id;
		productIns.sub_category_id 	= req.body.sub_category_id;
		productIns.brand_id 		= req.body.brand_id;
		productIns.is_featured 		= req.body.is_featured;
		productIns.price 			= req.body.price;
		productIns.color 			= req.body.color;
		productIns.productview 		= '0';
		productIns.attribute 		= req.body.selectedAttr;
		productIns.user_id 			= req.user._id; 
		productIns.created 			= Date.now();
		productIns.update 			= '';
		productIns.save(function(err) 
		{
			if (err)
			{
			    res.send({status:'error',error:err});
			}
			else 
			{
				var finePath 					= req.file.path.replace('public/','');
				var productImageIns 			= new ProductImage();
				productImageIns.product_id 		= productIns._id;
				productImageIns.thumb_image 	= finePath;
				productImageIns.large_image 	= finePath;
				productImageIns.image_name 		= req.file.filename;
				productImageIns.save(function(err) 
				{
					if (err)
					{
					    res.send({status:'error',error:err});
					}
					else 
					{
						res.redirect('/product/list');
					}
				});
			}
		});

	});
}; 

/* Update Product */
exports.updateProduct = (req, res) => 
{
	uploadProductImage(req,res,function(err) 
	{
		if(err) 
		{
			return res.end("Error uploading file.");
		}

		updateFineSku = req.body.sku.replace(' ','-');
		updateProductData = {
			'name'				: req.body.name,
			'sku'  				: updateFineSku,
			'description' 		: req.body.description,
			'category_id' 		: req.body.category_id,
			'sub_category_id'	: req.body.sub_category_id,
			'brand_id' 			: req.body.brand_id,
			'is_featured'		: req.body.is_featured,
			'price' 			: req.body.price,
			'user_id' 			: req.user._id,
			'update' 			: Date.now()
		};
		 

		Product.findByIdAndUpdate(req.body._id,updateProductData, function(error, updateProductRes)
		{
			if(req.file)
			{
				var finePath 			= req.file.path.replace('public/','');
				var updateProductImage 	= 
				{
					'product_id'	: req.body._id,
					'thumb_image'	: finePath,
					'large_image'	: finePath,
					'image_name'	: req.file.filename 
				}
				ProductImage.update(req.body._id,updateProductImage, function(error, updateProductImageRes)
				{
					if(updateProductImageRes)
					{
						req.flash('msg', 'Update product images successfully.');
					}
					else 
					{
						req.flash('msg', 'Update product details successfully.');
						res.redirect('/product/list');
					}
				});
			}
			else 
			{
				req.flash('msg', 'Update product details successfully.');
				res.redirect('/product/list');
			}

			
		});
		 
		
		 

	});	
};

/* Remove Product */
exports.removeProduct = (req, res) => {

	Product.remove({_id:req.params.productId}, function(error, removeProductId)
	{
		if(error)
		{
			res.send({status:'error',msg:error});
		}
		else
		{
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
	
	AttributeOption.find({attribute_id:req.params.attrId},function(error,fetchAttrValues)
	{
		if(fetchAttrValues)
		{
			res.send({status:'success',msg:'Fetch all attribute value.',fetchAttrValues:fetchAttrValues});
		}
		else 
		{
			res.send({status:'error',msg:'Not found any attibute options.'});
		}
	});
};





	



 