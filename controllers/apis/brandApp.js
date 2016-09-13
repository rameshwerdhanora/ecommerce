/* Add Multer Library for upload image */
const Brand		= require('../../models/brand');

/**
* GET /api/listofbrand
* Fetch All Brands from Application for user configuration
*/

exports.listOfAllBrand = (req, res) => {
	Brand.find({},function(error,getAllBrands){
		if(getAllBrands)
		{
			res.send({status:'success',msg:'Successfully fetch all brands.',getAllBrands:getAllBrands});
		}
		else 
		{
			res.send({status:'error',msg:'Unable to found any brands.'});
		}
	});	
 
};