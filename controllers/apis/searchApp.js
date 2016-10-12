/*
	@author : Cis Team
	@date : 10-Aug-2016
	@File : Create User from Application

*/

/* Load required library */
const async 		= require('async');
const dateFormat 	= require('dateformat');
const User 			= require('../../models/userApp');
const Brand         = require('../../models/brand');
const OrderDetails  = require('../../models/orderDetails');
const Product  		= require('../../models/product');
const Tag 			= require('../../models/tag');
const productHashTag	= require('../../models/productHashtag');
const ProductImage      = require('../../models/productsImages');

/**
 * POST /api/search/advancedsearch
 * Process for search people.
 */

exports.advanceSearch =  function(req,res)
{
	switch(req.body.type)
	{
		case 'people' : 
			searchUsers(req,res);
		break;

		case 'brand' : 
			searchBrands(req,res);
		break;

		case 'hashtag' : 
			searchHashtags(req,res);
		break;

		case 'goods' : 
			searchGoods(req,res);
		break;
	}
}

/**
 *  Process for search people.
 */

function searchUsers(req,res)
{
	if(req.body.device_token !== '')
  	{
  		var getusername = req.body.search;
  		User.find({user_name : { $regex : getusername }},function(error,fetchSearchUsers){

  			if(fetchSearchUsers.length > 0)
  			{	
  				var userDataArr = [];
  				async.eachSeries(fetchSearchUsers, function(UserData, callback)
				{
					var userDataObj = {};
					userDataObj._id 			= UserData._id;
					userDataObj.first_name 		= UserData.first_name;
					userDataObj.last_name 		= UserData.last_name;
					userDataObj.email 			= UserData.email_id;
					userDataObj.dob 			= dateFormat(parseInt(UserData.dob),'dd-mmmm-yyyy');
					userDataObj.gender 			= UserData.gender;
					userDataObj.profile_image 	= UserData.profile_image;
					userDataObj.user_name 		= UserData.user_name;
					userDataArr.push(userDataObj);
					callback();
				},
				function(error)
				{	
					return res.json({"status":'success',"msg":'found user list.',userdata:userDataArr});
				});
  			}
  			else 
  			{
  				return res.json({"status":'error',"msg":'Unable to found any user according to your search.'});
  			}

  		});
  	}
  	else 
  	{
  		return res.json({"status":'error',"msg":'Device Token is not available.'});
  	}

}


/**
 *  Process for search brands.
 */

function searchBrands(req,res)
{
	if(req.body.device_token !== '')
  	{
  		var brandname = req.body.search;
  		Brand.find({brand_name : { $regex : brandname }},function(error,fetchBrandsDetails)
  		{
			if(fetchBrandsDetails.length > 0)
  			{	
  				var brandDatafinalObj = {};	
  				
  				var brandDataArr = [];
  				brandDatafinalObj.trending = fetchBrandsDetails;

  				
  				async.eachSeries(fetchBrandsDetails, function(BrandData, callback)
				{
					
					async.parallel
					(
						[
							function(callback)
							{	
								OrderDetails.count({brand_id:BrandData._id},function(error,countAccToBid)
								{	
									var brandObj 		= {}
									Brand.find({_id : BrandData._id},function(error,fetchBrandsDetailsas)
			  						{
			  							brandObj.id 		= BrandData._id;
			  							brandObj.counter 	= countAccToBid;
			  							brandObj.data 		= fetchBrandsDetailsas;
			  							brandDataArr.push(brandObj);
			  						});
									callback();
								});
							}
						],
						function(error)
						{
							callback();
						}
					)
				},
				function(error)
				{	
					brandDatafinalObj.top_seller = brandDataArr;
					return res.json({"status":'success',"msg":'found brand list.',userdata:brandDatafinalObj});
				});
  			}
  			else 
  			{
  				return res.json({"status":'error',"msg":'Unable to found any brand according to your search.'});
  			}

  		}).limit('6').sort("-brand_view");
  	}
  	else 
  	{
  		return res.json({"status":'error',"msg":'Device Token is not available.'});
  	}

}

/**
 *  Process for search hashtags.
 */

function searchHashtags(req,res)
{	
	if(req.body.device_token !== '')
  	{
  		var productHTkey = req.body.search;
  		Tag.find({name : { $regex : productHTkey }},function(error,fetchHashtags)
  		{
  			if(fetchHashtags.length > 0)
  			{
  				var hashTagDatafinalObj = {};	
  				var hashTagDataArr = [];
  				var hashTagTSDataArr = [];
  				async.eachSeries(fetchHashtags, function(HashTagData, callback)
  				{
  					async.parallel
  					(
  						[
  							function(callback)
		  					{
		  						productHashTag.count({hashtag_id:HashTagData._id},function(error,hasttagCount)
			  					{
			  						var hashtagTredObj 		= {};
			  						hashtagTredObj._id 		= HashTagData._id;
			  						hashtagTredObj.name 	= HashTagData.name;
			  						hashtagTredObj.count 	= hasttagCount;
			  						hashTagDataArr.push(hashtagTredObj);
			  						callback(error);
			  					});
		  					},
		  					function(callback)
		  					{
		  						productHashTag.find({hashtag_id:HashTagData._id},function(error,hasttagTopSealer)
			  					{
			  						var newArr = [];
			  						var hashtagTredObj 		= {};
			  						async.eachSeries(hasttagTopSealer, function(hasttagTopSealerData, callback)
  									{	
  										OrderDetails.count({product_id:hasttagTopSealerData.product_id},function(error,productCount)
  										{
  											if(productCount > 0)
  											{												
  												hashtagTredObj.name 	= HashTagData.name;
  											}
  											callback(error);
  										});
  										
  									},
  									function(error)
  									{
  										if(hashtagTredObj.name != undefined)
  										{
  											hashTagTSDataArr.push(hashtagTredObj);
  										}
  										callback(error);
  									});
			  					});
		  					}
  						],
	  					function(error)
	  					{
	  						hashTagDatafinalObj.trending = hashTagDataArr;
	  						hashTagDatafinalObj.topseller = hashTagTSDataArr;
	  						callback();
	  					}
  					);
  				},
  				function(error)
  				{
  					return res.json({"status":'success',"msg":'found hashtag.',hashtag:hashTagDatafinalObj});
  				})
  			}
  			else 
  			{
  				return res.json({"status":'error',"msg":'Unable to found any hashtag according to your search.'});
  			}
  		});
  	}
	else 
  	{
  		return res.json({"status":'error',"msg":'Device Token is not available.'});
  	}
}

/**
 *  Process for search goods.
 */

function searchGoods(req,res)
{
	if(req.body.device_token !== '')
  	{
  		var productSearch = req.body.search;
  		Product.find({name : { $regex : productSearch }},function(error,fetchSearchProducts)
  		{
  			 
  			var finalProductObj = {};
			var finalProductArr = [];
			var productDataArr = [];  

  			async.eachSeries(fetchSearchProducts, function(ProductData, callback)
  			{
  				var productDataObj 		= {};  
  				productDataObj._id 		= ProductData._id;
  				productDataObj.name 	= ProductData.name;
  				productDataObj.sku 		= ProductData.sku;
  				productDataObj.price 	= ProductData.price;
  				productDataObj.description = ProductData.description;
  				async.parallel
  				(
  					[
  						function(callback)
  						{
  							ProductImage.findOne({product_id:ProductData._id},function(error,productImage)
  							{
  								if(productImage)
  								{
  									productDataObj.image = productImage.thumb_image_1;
  								}
  								//console.log(productCount);
  							})
  							callback()
  						}
  					],
  					function(error)
  					{
  						productDataArr.push(productDataObj);
  						console.log(productDataArr);
  						callback(error);
  					}
  				)

  			},
  			function(error){

  			});
  		}).limit(6).sort("-productview");
  		//return res.json({"status":'success',"msg":'Working in progress.'});
  	}
	else 
  	{
  		return res.json({"status":'error',"msg":'Device Token is not available.'});
  	}
}


