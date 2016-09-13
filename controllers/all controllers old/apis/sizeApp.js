/* Add Size Model for DB connectivity  */
const Size				= require('../../models/size');
const Attribute			= require('../../models/attribute');
const AttributeOption	= require('../../models/attributeOption');
const async 			= require('async');

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
			var listofattrmap = fetchAttributeRes.listofattrmap.split(','); 
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


 
 







