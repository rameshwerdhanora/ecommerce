/*
	@author : Cis Team
	@date : 18-Aug-2016
	@File : All Product related task are in this file.

*/

const Like 		      = require('../../models/like');
const Wishlist      = require('../../models/wishlist');
const Product       = require('../../models/product');
const ProductImage  = require('../../models/productsImages');
const Brand         = require('../../models/brand');
const async = require('async');


exports.getProducts = (req, res) => {
  console.log('aa gaya');
};

/**
 * GET /api/product/like/:UserId/:productId
 * Process for like product by any user.
 */
exports.likeProductByUser = (req, res) => {
  Like.findOne({user_id:req.params.userId,product_id:req.params.productId},function(error,fetchLike){
  	if(fetchLike)
  	{
  		Like.remove({user_id:req.params.userId,product_id:req.params.productId},function(error,removeLike)
  		{
  			return res.json({"status":'success',"msg":'This Product successfully dislike from your list.'});
  		})
  	}
  	else 
  	{
  		var likeIns			     = new Like();
  		likeIns.user_id 	   = req.params.userId;
  		likeIns.product_id 	 = req.params.productId;
  		likeIns.user_id 	   = Date.now();
  		likeIns.save(function(error)
  		{
  			if(error)
  			{
  				return res.json({"status":'error',"msg":'Not added in your like list.'});
  			}
  			else 
  			{
  				return res.json({"status":'success',"msg":'This Product successfully in like your list.'});
  			}
  		});
  		 
  	}
  })
};

/**
 * GET /api/product/wishlist/:UserId/:productId
 * Process for like product by any user.
 */
exports.wishListProductByUser = (req, res) => {
  Wishlist.findOne({user_id:req.params.userId,product_id:req.params.productId},function(error,fetchLike){
  	if(fetchLike)
  	{
  		Wishlist.remove({user_id:req.params.userId,product_id:req.params.productId},function(error,removeLike)
  		{
  			return res.json({"status":'success',"msg":'This Product successfully remove from your wishlist.'});
  		})
  	}
  	else 
  	{
  		var wishlistIns			     = new Wishlist();
  		wishlistIns.user_id 	   = req.params.userId;
  		wishlistIns.product_id 	 = req.params.productId;
  		wishlistIns.user_id 	   = Date.now();
  		wishlistIns.save(function(error)
  		{
  			if(error)
  			{
  				return res.json({"status":'error',"msg":'Not added in your like wishlist.'});
  			}
  			else 
  			{
  				return res.json({"status":'success',"msg":'This Product successfully added your wishlist.'});
  			}
  		});
  		 
  	}
  })
};

/**
 * GET /api/product/allwishlist/:userId
 * Process for like product by any user.
 */

exports.listOfAllWishlist = (req, res) => {
  Wishlist.findOne({user_id:req.params.userId},function(error,fetchAllWishlistByUser){
    if(fetchAllWishlistByUser)
    {
      /* Now we have send only user id and product id. We have to send all products as well (Its remaining for now) */
      return res.json({"status":'success',"msg":'Fetch all your wishlist products.',fetchAllWishlistByUsers:fetchAllWishlistByUser});
    }
    else
    {
      return res.json({"status":'error',"msg":error});
    }
  });
};
 
/**
 * GET /api/product/alllike/:userId
 * Process for like product by any user.
 */

exports.listOfAllLike = (req, res) => {
  Like.findOne({user_id:req.params.userId},function(error,fetchAllLikeByUser){
    if(fetchAllLikeByUser)
    {
      /* Now we have send only user id and product id. We have to send all products as well (Its remaining for now) */
      return res.json({"status":'success',"msg":'Fetch all your like products.',fetchAllLikeByUsers:fetchAllLikeByUser});
    }
    else
    {
      return res.json({"status":'error',"msg":error});
    }
  });
};

function fetchingImage(pid, callback)
{
   ProductImage.findOne({product_id:pid},function(error,fetchallFeatProdsImgs)
   {
     callback(error,fetchallFeatProdsImgs.large_image);
   });
}

function fetchingBrand(bid, callback)
{
  Brand.findOne({_id:bid},function(error,fetchAllBrands)
  { 
    callback(error,fetchAllBrands);
  });
}

/**
 * GET /api/product/featured/:userId
 * Process for Fetch all featured products.
 * Use AsyncLoop method for waiting data before fetching value
 */

exports.listofAllFeaturedProd = (req, res) => {

  Product.find({is_featured:'1'},function(error,fetchallFeatProds)
  {
    var temp = []; 
    async.eachSeries(fetchallFeatProds, function(ProductId, callback)
    {
        var pArr              = {};
        pArr._id              = ProductId._id;
        pArr.name             = ProductId.name;
        pArr.sku              = ProductId.sku;
        pArr.description      = ProductId.description;
        pArr.price            = ProductId.price;

        /* Use asyn Parallel method for waiting those functions value */
        async.parallel
        (
          [
             function(callback)
             {
                fetchingImage(ProductId._id, function(err, res){
                pArr.large_image  = res;
                  callback(err); //Forgot to add
                });
              },
              function(callback)
              {
                fetchingBrand(ProductId.brand_id,function(err, res){
                   pArr.brand = res;
                   callback(err); //Forgot to add
                });
              },
          ], 
          function(err)
          {
            temp.push(pArr);
            callback(err); 
          }
        )
      }, 
      function(err)
      {
        // console.log(temp); //This should give you desired result
        return res.json({"status":'success',"msg":'Fetch all products.',productslist:temp});
      });
  });  
}; 


function fetchingProduct(bid, callback)
{

  Product.find({brand_id:bid},function(error,fetchallFeatProds)
  {
    callback(error,fetchallFeatProds);
  });
}


/**
 * GET /api/product/fits/:userId
 * Process for Fetch all Fits products.
 * Use AsyncLoop method for waiting data before fetching value
 */

exports.listofAllItFitsProd = (req, res) => {

  var allBrdProd = new Array();
  Brand.find({},function(error,fetchAllBrands)
  { 
      if(fetchAllBrands)
      {
        async.eachSeries(fetchAllBrands, function(Brand, callback)
        {

          var bArr                = {};
          var image               = [];
          bArr._id                = Brand._id;
          bArr.brand_name         = Brand.brand_name;
          bArr.brand_description  = Brand.brand_desc;
          bArr.brand_logo         = Brand.brand_logo;

          /* Use asyn Parallel method for waiting those functions value */
          async.parallel
          ([
            function(callback)
            {
              fetchingProduct(Brand._id, function(err, fetchAllProducts)
              {

                bArr.product = fetchAllProducts;
                async.eachSeries(fetchAllProducts, function(fetchProductImage, callback)
                {
                  fetchingImage(fetchProductImage._id, function(err, wer)
                  {
                    image.push({productId:fetchProductImage._id,imagePath:wer});
                    callback(err); 
                  })

                }, function(err)
                {
                  bArr.image = image;
                  callback(err);
                });

              });
            }
          ],
          function(err)
          {
            allBrdProd.push(bArr);
            callback(err);
          })
        }, 
        function(err)
        {
          // console.log(allBrdProd); //This should give you desired result
          return res.json({"status":'success',"msg":'Fetch all products.',listAccToBrand:allBrdProd});
        });
      }
      else 
      {
        return res.json({"status":'error',"msg":'Brand is not avaible in admin.'})
      }
  });
};

/**
 * GET /api/product/details/:productId
 * Process for Fetch perticlular product details.
 */

exports.productDetailView = (req, res) => { 
  
  Product.findOne({_id:productId},function(error,fetchAProductDetails)
  {
    if(fetchAProductDetails)
    {
        var pArr              = {};
        pArr._id              = ProductId._id;
        pArr.name             = ProductId.name;
        pArr.sku              = ProductId.sku;
        pArr.description      = ProductId.description;
        pArr.price            = ProductId.price;

        /* Use asyn Parallel method for waiting those functions value */
        async.parallel
        (
          [
             function(callback)
             {
                fetchingImage(ProductId._id, function(err, res){
                pArr.large_image  = res;
                  callback(err); //Forgot to add
                });
              },
              function(callback)
              {
                fetchingBrand(ProductId.brand_id,function(err, res){
                   pArr.brand = res;
                   callback(err); //Forgot to add
                });
              },
          ], 
          function(err)
          {
            temp.push(pArr);
            callback(err); 
          }
        )
    }
    else 
    {
      return res.json({"status":'error',"msg":'Unable to found any details for selected product.'})
    }

  });
};