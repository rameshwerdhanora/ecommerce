/*
	@author : Cis Team
	@date : 18-Aug-2016
	@File : All Product related task are in this file.

*/

const Like 		= require('../../models/Like');
const Wishlist 	= require('../../models/Wishlist');

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
  		var LikeIns			= new Like();
  		LikeIns.user_id 	= req.params.userId;
  		LikeIns.product_id 	= req.params.productId;
  		LikeIns.user_id 	= Date.now();
  		LikeIns.save(function(error)
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
  		var WishlistIns			= new Wishlist();
  		WishlistIns.user_id 	= req.params.userId;
  		WishlistIns.product_id 	= req.params.productId;
  		WishlistIns.user_id 	= Date.now();
  		WishlistIns.save(function(error)
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
