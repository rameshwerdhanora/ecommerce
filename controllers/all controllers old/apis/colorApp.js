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
			res.json({status:'success',msg:'Successfully fetch all colors.',getAllColors:getAllColors});
		}
		else 
		{
			res.json({status:'error',msg:'Unable to found any colors.'});
		}
	});	
 
};






