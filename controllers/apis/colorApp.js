/* Add Color Model for DB connectivity  */
const Color		= require('../../models/color');

/**
* GET /api/listofcolor
* Fetch All Brands from Application for user configuration.
*/

exports.listOfAllColor = (req, res) => {
	Color.find({},function(error,getAllColors){
		if(getAllColors)
		{
			res.send({status:'success',msg:'Successfully fetch all colors.',getAllColors:getAllColors});
		}
		else 
		{
			res.send({status:'error',msg:'Unable to found any colors.'});
		}
	});	
 
};






