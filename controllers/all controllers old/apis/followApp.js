/*
	@author : Cis Team
	@date : 02-Sep-2016
	@File : Follow Un-follow
*/

const Follow 	= require('../../models/follow');

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
				return res.json({"status":'success',"msg":'This brand successfully in unfollow your list.'});
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

