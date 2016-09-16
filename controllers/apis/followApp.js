/*
	@author : Cis Team
	@date : 02-Sep-2016
	@File : Follow Un-follow
*/

const async 	= require('async');
const Follow 	= require('../../models/follow');
const Brand     = require('../../models/brand');

/**
 * GET /api/follow/:userId/:brandId
 * Process for follow unfollow brand.
 */


exports.followUnFollowBrand = (req, res) => {
	Follow.findOne({user_id:req.params.userId},function(error,fetchFollowBrand)
	{
		if(fetchFollowBrand)
		{
			Follow.remove({user_id:req.params.userId,brand_id:req.params.brandId},function(error,unfollowBrand)
			{
				return res.json({"status":'success',"msg":'This brand successfully unfollow from your list.'});
			});
		}
		else 
		{
			var followIns = new Follow;
			followIns.user_id = req.params.userId;
			followIns.brand_id = req.params.brandId;
			followIns.save(function(error)
	  		{
	  			if(error)
	  			{
	  				return res.json({"status":'error',"msg":'This brand is not added in your list.'});
	  			}
	  			else 
	  			{
	  				return res.json({"status":'success',"msg":'This brand successfully in added your follow list.'});
	  			}
	  		});

		}
	});
   
};




/**
 * GET /api/listoffollow/:userId
 * Process for follow unfollow brand.
 */

 exports.listOfFollowUser = (req, res) => {

 	Follow.find({user_id:req.params.userId},function(error,fetchFollowBrand)
	{
		if(fetchFollowBrand)
		{	
			var allFollowBrandList = [];
			var tempArr = []; 
			for (var i = 0; i < fetchFollowBrand.length; i++) {
				tempArr.push(fetchFollowBrand[i].brand_id);
			}

			Brand.find({_id:{$in:tempArr}},function(error,fetchBrandDetails)
			{
				 
		     	async.eachSeries(fetchBrandDetails, function(brandId, callback)
		    	{
		    		 
		    		var tempObj 		= {};
		    		tempObj._id 		= brandId._id;
			    	tempObj.brand_name 	= brandId.brand_name;
			    	tempObj.brand_logo 	= brandId.brand_logo;
			    	tempObj.brand_desc 	= brandId.brand_desc;
			    	allFollowBrandList.push(tempObj);
			    	callback();
		    	},
			    function(err)
			    {
			    	//console.log(allFollowBrandList);
			    	return res.json({"status":'success',"msg":'Found list of your follow brands.',brandList:allFollowBrandList});
			    });
			});
		}
		else 
		{
			return res.json({"status":'error',"msg":'You have not follow any brand yet.'});
		}
	});

 }
