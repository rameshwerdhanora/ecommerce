/* Add Size Model for DB connectivity  */
const async 		= require('async');
const Size		= require('../../models/size');
const Attribute		= require('../../models/attribute');
const AttributeOption	= require('../../models/attributeOption');
const User 		= require('../../models/userApp');
const UserDetails 	= require('../../models/usersDetails');

/**
* GET /api/listofsize
* Fetch All Sizes from Application for user configuration
*/

exports.listOfAllSize = (req, res) => 
{
	Size.find({is_published:'true'},function(error,getAllSizes){
		if(getAllSizes)
		{
			res.send({status:'success',msg:'Successfully fetch all sizes.',getAllSizes:getAllSizes});
		}
		else 
		{
			res.send({status:'error',msg:'Unable to found any sizes.'});
		}
	});	
};

function fetchingAllAttrVal(attId, callback)
{
	AttributeOption.find({attribute_id:attId},function(error,fetchAllAttributeOptions)
	{
		callback(error,fetchAllAttributeOptions);
	});
}

/**
* GET /api/size/:sizeId
* Fetch All sizes attributes by selected size Id 
*/

exports.listOfSizeAttribute = (req, res) => {

	Size.findOne({_id:req.params.sizeId},function(error,fetchAttributeRes)
	{
		if(fetchAttributeRes)
		{
			var mainArr = new  Array();
			var listofattrmap = fetchAttributeRes.listofattrmap.toString().split(','); 

			Attribute.find({_id : { $in: listofattrmap}},function(error,fetchAttributeRes)
			{
				async.eachSeries(fetchAttributeRes, function(AttrId, callback)
	    		{
	    			 
	    			var attr 				= {};
	        		attr['aid']				= AttrId._id;
	        		attr['name']			= AttrId.name;
	        		attr['display_type']	= AttrId.display_type;

	        		async.parallel
	        		(
			          	[
			            	function(callback)
			             	{
			                	fetchingAllAttrVal(AttrId._id, function(err, res){
			                		attr['values'] = res;
			                  		callback(err);  
			                	});
			              	}
			          	], 
			          	function(err)
			          	{
			            	mainArr.push(attr);
			            	callback(err); 
			          	}
			        )
	        	}, 
		      	function(err)
		      	{
					//console.log(mainArr); //This should give you desired result
		        	return res.json({"status":'success',"msg":'Fetch all attributes.',sizeAttribute:mainArr});
		      	}); 	
			});
		}
	});
};


/**
* GET /api/size/fetchcofiguration/:userId
* Process to Save user configuration from Application.
*/

exports.fetchCofiguration = function(req,res){

	User.findOne({_id:req.params.userId}, { isFomo: true, _id: false } ,function(error,checkFomoSetting)
	{
		if(checkFomoSetting.isFomo == '1')
		{
			UserDetails.findOne({user_id:req.params.userId},function(error,fetchUserConfigDetails)
			{
			 	if(fetchUserConfigDetails.configDetail)
			 	{	
			 		var finalAr 		= new Array();
			 		var saveAttr 		= new Array();
			 		var tempAttribAr 	= new Array();
			 		var userSize 		= fetchUserConfigDetails.configDetail[0].Size;
			 		for (var w = 0; w < userSize.length; w++) 
	    			{
	    				tempAttribAr.push(userSize[w].attributeId);
	    				saveAttr[userSize[w].attributeId] = userSize[w].attributeSizes;
	    			}

	    			Size.find({is_published:'true'},function(error,getAllSizes)
	    			{
	    				async.eachSeries(getAllSizes, function(sizeId, callback)
			    		{
			    			var tmpAr 			= {};
			    			tmpAr['id'] 		= sizeId._id;
			    			tmpAr['size_name'] 	= sizeId.size_name;
			    			tmpAr['gender'] 	= sizeId.gender;

			    			async.parallel
			        		(
					          	[
					            	function(callback)
					             	{
				             			if(tempAttribAr[0] == sizeId._id)
				             			{
				             				tempAttribAr.shift();
					             			fetchingAllAttrValue(saveAttr[sizeId._id], function(err, res)
					             			{
							                	if(res)
							                	{
						                			tmpAr['values'] = res;
						                		}
						                  		callback(err);  
						                	});
					             		}
					             		else
					             		{
					             			tmpAr['values'] = new Array;
					             			callback();  
					             		}
					             	}	
					          	], 
					          	function(err)
					          	{
					            	finalAr.push(tmpAr);
					            	//console.log( tmpAr);
					            	callback(err); 
					          	}
					        )
			    		}, 
				      	function(err)
				      	{
				        	return res.json({"status":'success',"msg":'Fetch all attributes.',sizeAttribute:finalAr});
				      	}); 
	    			});
			 	}
			 	else
			 	{
			 		return res.json({"status":'error',"msg":'Something Wrong with configuration setting.'});
			 	}
			});
		}
		else 
		{
			return res.json({"status":'error',"msg":'Your have not select your configuration.'});
		}

	});
}


function fetchingAllAttrValue(attributeSizes, callback)
{
	AttributeOption.find({_id:{$in:attributeSizes}},function(error,fetchAllAttributeOptions)
	{
		callback(error,fetchAllAttributeOptions);
	});
}
 

/**
* GET /api/size/fetchselectedsize/:sizeId/:userId
* Process to Save user configuration from Application.
*/

 exports.fetchSelectedSize = (req, res) => {

 	UserDetails.findOne({user_id:req.params.userId},function(error,fetchUserConfigDetails)
	{
		 
		if(fetchUserConfigDetails.configDetail)
	 	{	
	 		var userSize = fetchUserConfigDetails.configDetail[0].Size;
	 		/*var saveAttr 		= new Array();
	 		for (var w = 0; w < userSize.length; w++) 
			{	
				if(userSize[w].attributeSizes)
				{
					saveAttr.push(userSize[w].attributeSizes);
				} 
				
			}
			saveAttrJoin = saveAttr.join(',');
			console.log(saveAttrJoin);*/

	 		Size.findOne({_id:req.params.sizeId},function(error,fetchAttributeRes)
			{
				var mainArr = new  Array();
				var listofattrmap = fetchAttributeRes.listofattrmap.toString().split(','); 
				Attribute.find({_id : { $in: listofattrmap}},function(error,fetchAttributeRes)
				{
					async.eachSeries(fetchAttributeRes, function(AttrId, callback)
		    		{

		    			var attr 				= {};
		        		attr['aid']				= AttrId._id;
		        		attr['name']			= AttrId.name;
		        		attr['display_type']	= AttrId.display_type;

		        		async.parallel
		        		(
				          	[
				            	function(callback)
				             	{
				                	fetchingAllSelectedAttrValue(AttrId._id, function(err, res){
				                		attr['values'] = res;
				                  		callback(err);  
				                	});
				              	}
				          	], 
				          	function(err)
				          	{
				            	mainArr.push(attr);
				            	callback(err); 
				          	}
				        )
		        	}, 
			      	function(err)
			      	{
						//console.log(mainArr); //This should give you desired result
			        	return res.json({"status":'success',"msg":'Fetch all attributes.',sizeAttribute:mainArr,selectedsize:userSize});
			      	}); 	
				});
			});
	 	};	

	});

	

};

/**
* POST /api/size/updateusersizes
* Process to Save user configuration from Application.
*/

exports.updateUserSizes = function(req,res)
{
	if(req.body.device_token !== '')
  	{
  		var newSelectedVal 	= req.body.new_size;
  		var oldSelectedVal 	= req.body.selected_size;
  		var user_id 		= req.body.user_id;

  		UserDetails.findOne({user_id:user_id},function(error,fetchUserSizeData)
  		{	
  			var tempSize 		= [];
  			var temSize 		= fetchUserSizeData.configDetail[0].Size;
  			var configDetailArr = new Array();

  			var flag = false;
	  		for(i=0; i<temSize.length;i++)
	  		{	
	  			var tmp = {};
	  			tmp.attributeId = temSize[i].attributeId;
	  			
	  			if(newSelectedVal[0].attributeId == temSize[i].attributeId)
	  			{	
	  				flag = true;
	  				tmp.attributeSizes  = newSelectedVal[0].attributeSizes;
	  			}
	  			else
	  			{
	  				tmp.attributeSizes  = temSize[i].attributeSizes;
	  			}
	  			tempSize.push(tmp);
	  		}

	  		if(flag == false)
	  		{
	  			tempSize.push(newSelectedVal[0]);
	  		}
	  		//console.log(tempSize);

  			var sizeObj 		= {};
  			sizeObj.Size  		= tempSize;
  			configDetailArr.push(sizeObj);

  			var sizeObj 		= {};
  			sizeObj.brands 		= fetchUserSizeData.configDetail[1].brands;
  			configDetailArr.push(sizeObj);

  			var updateData = 
  			{
  				'configDetail' : configDetailArr
  			}

 			UserDetails.findByIdAndUpdate(fetchUserSizeData._id,updateData,function(error,saveexistingValues)
	  		{
	  			if(error)
	  			{
	  				return res.json({"status":'error',"msg":'Something Wrong.'});
	  			}
	  			else 
	  			{
	  				return res.json({"status":'success',"msg":'Your size changes Successfully updated'});
	  			}
	  		})
  		})	
  	}
  	else
  	{
  		return res.json({"status":'error',"msg":'Device Token is not available.'});
  	}
}



function fetchingAllSelectedAttrValue(attId, callback)
{
	AttributeOption.find({attribute_id:attId},function(error,fetchAllAttributeOptions)
	{	
		callback(error,fetchAllAttributeOptions);
	});
}







