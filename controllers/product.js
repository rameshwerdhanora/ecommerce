/* Add Multer Library for upload image */
const Multer 		= require('multer');
const Product		= require('../models/product');
const ProductImage	= require('../models/productsImages');
const Brand			= require('../models/brand');
const Category		= require('../models/category');
const SubCategory	= require('../models/subCategory');


const async = require('async');

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
		res.render('product/list', 
		{
			title: 'Product',
			fetchAllProducts:fetchAllProducts
		});
	});	
};

/* Create new Product */
exports.addProduct = (req, res) => {
	Category.find({is_active:1},function(error,fetchCategories){
		SubCategory.find({is_active:1},function(error,fetchSubCategories){
			Brand.find({},function(error,fetchAllBrands){
				res.render('product/add_product', {
		    		title: 'Product',
		    		allBrands : fetchAllBrands,
		    		fetchCategories:fetchCategories,
		    		fetchSubCategories:fetchSubCategories
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
							    fetchSubCategories:fetchSubCategories
							});
						});	
					}
					else 
					{
						req.flash('errors', error);
						return res.redirect('/listofproducts');
					}
				  
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
						res.redirect('/listofproducts');
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
						res.redirect('/listofproducts');
					}
				});
			}
			else 
			{
				req.flash('msg', 'Update product details successfully.');
				res.redirect('/listofproducts');
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



	



 