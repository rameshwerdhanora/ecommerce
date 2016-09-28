/* Add model for calling */
const Privacy			= require('../../models/privacy');
const Notification		= require('../../models/notification');

/**
* GET /api/listofbrand
* Fetch All Brands from Application for user configuration
*/
 
exports.fetchPrivacySetting = (req, res) => {

	Privacy.findOne({user_id:req.params.userId},function(error,fetchUserPrivacy)
  	{
  		if(fetchUserPrivacy)
  		{
  			return res.json({"status":'success',"msg":'Fetch your privacy settings.',privacysetting:fetchUserPrivacy});
  		}
  		else 
  		{
  			return res.json({"status":'error',"msg":'You have not save your setting yet.'});
  		}
  	});
};

exports.privacySettingofUser = (req, res) => {

	if(req.body.device_token !== '')
	{
		Privacy.findOne({user_id:req.body.user_id},function(error,fetchUserPrivacy)
  		{
  			if(fetchUserPrivacy)
  			{	
  				updatePrivacyData = 
  				{
					'user_id' 			: req.body.user_id,
					'language'			: req.body.language,
				    'currency'			: req.body.currency,
				    'privacytype'		: req.body.privacytype,
				    'useageanalytics' 	: req.body.useageanalytics,
				    'celldata'			: req.body.celldata
				};
				Privacy.findByIdAndUpdate(fetchUserPrivacy._id,updatePrivacyData, function(error, updateExistingPrivacyVals)
  				{
  					if(error)
  					{
  						return res.json({"status":'error',"msg":'Something wrong with your setting.'});
  					}
  					else 
  					{
  						return res.json({"status":'success',"msg":'Privacy is updated successfully.'});
  					}
  				});
  			}
  			else 
  			{
  				var privacyIns			    = new Privacy();
		  		privacyIns.user_id 	   		= req.body.user_id;
		  		privacyIns.language 	 	= req.body.language;
		  		privacyIns.currency 	 	= req.body.currency;
		  		privacyIns.privacytype  	= req.body.privacytype;
		  		privacyIns.useageanalytics 	= req.body.useageanalytics;
		  		privacyIns.celldata 		= req.body.celldata;
		  		privacyIns.date 	       	= Date.now();
		  		privacyIns.save(function(error)
  				{
  					if(error)
		  			{
		  				return res.json({"status":'error',"msg":'Something wrong with your setting.'});
		  			}
		  			else 
		  			{
		  				return res.json({"status":'success',"msg":'Privacy is stored successfully.'});
		  			}
  				});
  			}
  		});
	}
	else 
	{
		return res.json({"status":'error',"msg":'Device Token is not available.'});
	}
}	

exports.fetchNotificationSetting = (req, res) => {

	Notification.findOne({user_id:req.params.userId},function(error,fetchUserNotification)
  	{
  		if(fetchUserNotification)
  		{
  			return res.json({"status":'success',"msg":'Fetch your notification settings.',notificationsetting:fetchUserNotification});
  		}
  		else 
  		{
  			return res.json({"status":'error',"msg":'You have not save your setting yet.'});
  		}
  	});
};

exports.notificationSettingofUser = (req, res) => {

	if(req.body.device_token !== '')
	{
		Notification.findOne({user_id:req.body.user_id},function(error,fetchUserNotification)
		{
			if(fetchUserNotification)
			{	
				updateNotificationData = 
				{
		          'user_id' 				    : req.body.user_id,
		          'enablenotification'			: req.body.enablenotification,
		          'news'					    : req.body.news,
		          'shipped'				      	: req.body.shipped,
		          'delivery' 				    : req.body.delivery,
		          'promocode' 			    	: req.body.promocode,
		          'new_arrival'			    	: req.body.new_arrival
    			};
			Notification.findByIdAndUpdate(fetchUserNotification._id,updateNotificationData, function(error, updateExistingNotiVals)
				{
					if(error)
					{
						return res.json({"status":'error',"msg":'Something wrong with your setting.'});
					}
					else 
					{
						return res.json({"status":'success',"msg":'Notification is updated successfully.'});
					}
				});
			}
			else 
			{
			var notificationIns			    	       = new Notification();
	  		notificationIns.enablenotification 	 = req.body.enablenotification;
	  		notificationIns.news 	   			       = req.body.news;
	  		notificationIns.shipped 	   		     = req.body.shipped;
	  		notificationIns.delivery 	   		     = req.body.delivery;
	  		notificationIns.promocode 	   		   = req.body.promocode;
	  		notificationIns.new_arrival 	   	   = req.body.new_arrival;
        	notificationIns.user_id              = req.body.user_id;
	  		notificationIns.date 	       		     = Date.now();
	  		notificationIns.save(function(error)
				{
					if(error)
	  			{
	  				return res.json({"status":'error',"msg":'Something wrong with your notificaiton setting.'});
	  			}
	  			else 
	  			{
	  				return res.json({"status":'success',"msg":'Notification is stored successfully.'});
	  			}
				});
			}
		});
	}
	else 
	{
		return res.json({"status":'error',"msg":'Device Token is not available.'});
	}
}	
