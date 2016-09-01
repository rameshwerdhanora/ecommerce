/*
	@author : Cis Team
	@date : 18-Aug-2016
	@File : All Product related task are in this file.

*/

const async = require('async');
const Like 		      = require('../../models/like');
const Wishlist      = require('../../models/wishlist');
const Product       = require('../../models/product');
const ProductImage  = require('../../models/productsImages');
const Brand         = require('../../models/brand');
const User          = require('../../models/userApp');



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

  Like.findOne({user_id:req.params.userId},function(error,fetchAllLikeByUser)
  {
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

function fetchingAllImage(pid, callback)
{
  ProductImage.find({product_id:pid},function(error,fetchallAllOfProduct)
  {
    callback(error,fetchallAllOfProduct);
  });
}


/**
 * GET /api/product/fits/:userId/:config
 * Process for Fetch all Fits products.
 * Use AsyncLoop method for waiting data before fetching value
 */

exports.listofAllItFitsProd = (req, res) => {

  /*var fetchConfigDetails = [];
  if(req.params.config == 1)
  {

    UserDetails.findOne({user_id:req.params.userId},function(error,fetchConfigDetailsOfUser)
    {
      userCofigDetails = [];
      if(fetchConfigDetailsOfUser)
      {
        //console.log(fetchConfigDetailsOfUser.configDetail[0].Size);
        userCofigDetails['sizes'] = fetchConfigDetailsOfUser.configDetail[0].Size;
        userCofigDetails['brand'] = fetchConfigDetailsOfUser.configDetail[1].brands;
        
      }

    });
    fetchConfigDetails['pp'] = userCofigDetails;
  }
  else 
  {
     
  }*/
 
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
                  fetchingImage(fetchProductImage._id, function(err, fetchImagePath)
                  {
                    image.push({productId:fetchProductImage._id,imagePath:fetchImagePath});
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
 * GET /api/product/chkfomoalert/:userId 
 * Process for Check its fits configuration.
 */

exports.checkFomoAlertAccToUser = (req, res) => { 

  User.findOne({_id:req.params.userId},function(error,fetchConfigDetailsOfUser)
  { 
    var iFomo = fetchConfigDetailsOfUser.isFomo == '1' ?  true : false ; 
    return res.json({"status":'success',"msg":'Fomo.',isFomo:iFomo});
  });
};

/**
 * GET /api/product/details/:productId
 * Process for Fetch perticlular product details.
 */

exports.productDetailView = (req, res) => { 
  

  Product.findOne({_id:req.params.productId},function(error,fetchAProductDetails)
  {
    var productArray = {};
    if(fetchAProductDetails)
    {
      productArray._id           = fetchAProductDetails._id;
      productArray.name          = fetchAProductDetails.name;
      productArray.sku           = fetchAProductDetails.sku;
      productArray.p_desc        = fetchAProductDetails.description;
      productArray.price         = fetchAProductDetails.price;
      productArray.is_featured   = fetchAProductDetails.is_featured;

      async.parallel([
          function(callback) 
          {
              fetchingBrand(fetchAProductDetails.brand_id,function(err, fetchBrandDetails)
              {
                if(fetchBrandDetails)
                {
                  productArray.brand_name = fetchBrandDetails.brand_name;
                  productArray.brand_logo = fetchBrandDetails.brand_logo;
                  productArray.brand_desc = fetchBrandDetails.brand_desc;
                }   
                callback(err); 
              });
          },
          function(callback) 
          {
             fetchingAllImage(fetchAProductDetails._id, function(err, fetchImagesOfProduct)
             {
              productArray.allImages  = fetchImagesOfProduct;
              callback(err); //Forgot to add
             });
          },
          function(callback) 
          {
             fetchingRelatedProducts(fetchAProductDetails.brand_id,req.params.productId, function(err, fetchRelatedProducts)
             {
              productArray.relatedProducts  = fetchRelatedProducts;
              callback(err); //Forgot to add
             });
          }
      ], 
      function(err, results) 
      {
        //Product.update({_id:req.params.productId},{$inc: {productview: 1}}, { upsert: true, safe: true }, null);
        return res.json({"status":'success',"msg":'fetch product details.',fetchProductDetails:productArray})
      });
    }
    else 
    {
      return res.json({"status":'error',"msg":'Unable to found any details for selected product.'})
    }

  });
};

function fetchingRelatedProducts(bid,pid,callback)
{
  Product.find({brand_id:bid,_id: { $ne: pid }},function(error,fetchallFeatProds)
  {
    var relatedProductsArray = []; 
    async.eachSeries(fetchallFeatProds, function(ProductId, callback)
    {
        var productObj              = {};
        productObj._id              = ProductId._id;
        productObj.name             = ProductId.name;
        productObj.sku              = ProductId.sku;
        productObj.description      = ProductId.description;
        productObj.price            = ProductId.price;

        /* Use asyn Parallel method for waiting those functions value */
        async.parallel
        (
          [
             function(callback)
             {
                fetchingImage(ProductId._id, function(err, res){
                  productObj.large_image  = res;
                  callback(err);  
                });
              } 
          ], 
          function(err)
          {
            relatedProductsArray.push(productObj);
            callback(err); 
          }
        )
      }, 
      function(err)
      {
         callback(error,relatedProductsArray);
      });
  }).limit(2);  
}

/**
 * POST /api/product/fetchfilter
 * Process for fetch Filter values.
 */

function fetchingFilterProduct(bid,catId,subCatId,minPrice,maxPrice,color,callback)
{
  Product.find({brand_id:bid,category_id:catId,subCatId:{$in:subCatId},price:{$gt:minPrice},price:{$lt:maxPrice}},function(error,fetchallFeatProds)
  {
    callback(error,fetchallFeatProds);
  });
}

exports.fetchFilterValues = (req, res) => { 

  Brand.findOne({_id:req.body.brand_id},function(error,fetchAllBrands)
  { 
      if(fetchAllBrands)
      {
        var filterObj                 = {};
        var image                     = [];
        filterObj._id                 = fetchAllBrands._id;
        filterObj.brand_name          = fetchAllBrands.brand_name;
        filterObj.brand_description   = fetchAllBrands.brand_desc;
        filterObj.brand_logo          = fetchAllBrands.brand_logo;


        /* Use asyn Parallel method for waiting those functions value */
        async.parallel
        ([
          function(callback)
          {
            fetchingFilterProduct(fetchAllBrands._id,req.body.catId,req.body.subcatid,req.body.minprice,req.body.maxprice,req.body.color, function(err, fetchAllProducts)
            {
              filterObj.product = fetchAllProducts;
              async.eachSeries(fetchAllProducts, function(fetchProductImage, callback)
              {
                fetchingImage(fetchProductImage._id, function(err, fetchImagePath)
                {
                  image.push({productId:fetchProductImage._id,imagePath:fetchImagePath});
                  callback(err); 
                })

              }, function(err)
              {
                filterObj.image = image;
                callback(err);
              });

            });
          }
        ],
        function(err)
        {
          //console.log(filterObj);
          return res.json({"status":'success',"msg":'Fetch all products.',listAccToBrand:filterObj});
        })
      }
      else 
      {
        return res.json({"status":'error',"msg":'Brand is not avaible in admin.'})
      }
  });
};


/**
 * POST /api/product/fetchsort
 * Process for Sort Product according to select
 */

function fetchingSortProduct(bid,type,callback)
{
  //var typeSort = (type == 'latest') ? "{ _id:-1 }" : "{ productview :-1 }";
  //var priceSort = (price == 'low') ? "{price: 1 }" : "{ price :-1 }";

  Product.find({brand_id:bid},{},function(error,fetchallFeatProds)
  {
    callback(error,fetchallFeatProds);
  }).sort( {_id:-1,price:-1} );
}

exports.fetchSortValues = (req, res) => { 

  Brand.findOne({_id:req.body.brand_id},function(error,fetchAllBrands)
  { 
      if(fetchAllBrands)
      {
        var filterObj                 = {};
        var image                     = [];
        filterObj._id                 = fetchAllBrands._id;
        filterObj.brand_name          = fetchAllBrands.brand_name;
        filterObj.brand_description   = fetchAllBrands.brand_desc;
        filterObj.brand_logo          = fetchAllBrands.brand_logo;

        /* Use asyn Parallel method for waiting those functions value */
        async.parallel
        ([
          function(callback)
          { // ,req.params.price,req.body.itfits
            fetchingSortProduct(fetchAllBrands._id,req.body.type,req.body.price,req.body.itfits, function(err, fetchAllProducts)
            {
              filterObj.product = fetchAllProducts;
              async.eachSeries(fetchAllProducts, function(fetchProductImage, callback)
              {
                fetchingImage(fetchProductImage._id, function(err, fetchImagePath)
                {
                  image.push({productId:fetchProductImage._id,imagePath:fetchImagePath});
                  callback(err); 
                })

              }, function(err)
              {
                filterObj.image = image;
                callback(err);
              });

            });
          }
        ],
        function(err)
        {
          //console.log(filterObj);
          return res.json({"status":'success',"msg":'Fetch all products.',listAccToBrand:filterObj});
        })
      }
      else 
      {
        return res.json({"status":'error',"msg":'Brand is not avaible in admin.'})
      }
  });
};

/**
 * GET /api/brand/details/:brandId
 * Process for Fetch Brand Product
 */

exports.BrandDetailView = (req, res) => { 

  Brand.findOne({_id:req.params.brandId},function(error,fetchAllBrands)
  { 
    if(fetchAllBrands)
    {
      var filterObj                 = {};
      var image                     = [];
      filterObj._id                 = fetchAllBrands._id;
      filterObj.brand_name          = fetchAllBrands.brand_name;
      filterObj.brand_description   = fetchAllBrands.brand_desc;
      filterObj.brand_logo          = fetchAllBrands.brand_logo;


      /* Use asyn Parallel method for waiting those functions value */
      async.parallel
      ([
        function(callback)
        {
          fetchingProduct(fetchAllBrands._id, function(err, fetchAllProducts)
          {
            filterObj.product = fetchAllProducts;
            async.eachSeries(fetchAllProducts, function(fetchProductImage, callback)
            {
              fetchingImage(fetchProductImage._id, function(err, fetchImagePath)
              {
                filterObj.product.image = fetchAllProducts;
                image.push({productId:fetchProductImage._id,imagePath:fetchImagePath});
                callback(err); 
              })

            }, function(err)
            {
              filterObj.image = image;
              callback(err);
            });

          });
        }
      ],
      function(err)
      {
        //console.log(filterObj);
        return res.json({"status":'success',"msg":'Fetch all products.',listAccToBrand:filterObj});
      })
    }
    else 
    {
      return res.json({"status":'error',"msg":'Brand is not avaible in admin.'})
    }
  });  
};