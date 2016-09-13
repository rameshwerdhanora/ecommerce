/* Add Size Model for DB connectivity  */

const Size			= require('../models/size');
const Attribute		= require('../models/attribute');

/* Get the list of all color name with imformation */
exports.listOfSize = (req, res) => {
	Size.find({},function(error,getAllSizes){
		if(getAllSizes)
		{
			res.render('size/list', { title: 'Size',getAllSizes:getAllSizes});
		}
	});	
 
};

/* Add Size page  */
exports.addSize = (req, res) => {
	Attribute.find({},function(error,fetchAllAttribute){
		res.render('size/add_size', {
		    title: 'Size',
		    fetchAllAttribute:fetchAllAttribute
		});	
	})	
  
};

/* Save Size Information */
exports.saveSize = (req,res) => {

    var sizeIns 			= new Size();
    sizeIns.size_name 		= req.body.size_name;
    sizeIns.gender			= req.body.gender,
    sizeIns.listofattrmap	= req.body.listofattrmap,
    sizeIns.is_published	= req.body.is_published,
   	sizeIns.user_id 		= req.user._id; 
   	sizeIns.save(function(err) 
    {
    	if (err)
    	{
            res.send({status:'error',error:err});
    	} 
    	else 
    	{
    		res.redirect('/size/list');
    	}
    });
};

/* Remove Size */
exports.removeSize = (req,res) => {
	Size.remove({_id:req.params.sizeId},function(error,removeSize)
	{
		if(error)
		{
			//res.send({status:'error',msg:error});
			req.flash('error', 'Not deleted');
			res.redirect('/size/list');
		}
		else
		{
			req.flash('success', 'Remove Successfully.');
			res.redirect('/size/list');
			// res.send({status:'success',msg:'Remove Successfully.'});
		}
	});
};
 
/* Edit Size */
exports.editSize = (req,res) => {
	
	Size.findOne({_id:req.params.sizeId},function(error,fetchSize)
	{
		Attribute.find({},function(error,fetchAllAttribute)
		{
			if(error)
			{
				res.send({status:'error',msg:error});
			}
			else 
			{
				res.render('size/edit_size', { title: 'Size',fetchSize:fetchSize,fetchAllAttribute:fetchAllAttribute});
			}
		});	
	});
};

/* Update edit details */

exports.updateSize = (req,res) => {

	console.log(req.body);
	updateData = {
		'size_name' 		: req.body.size_name,
		'gender'			: req.body.gender,
		'is_published'		: req.body.is_published,
		'listofattrmap'		: req.body.listofattrmap,
	    'user_id'			: req.body.user_id 
	};
	Size.findByIdAndUpdate(req.body._id,updateData, function(error, updateRes)
	{
		res.redirect('/size/list');
	});
};


/**
* GET /api/listofsize
* Fetch All Sizes from Application for user configuration
*/


exports.listOfAllSize = (req, res) => {
	Size.find({},function(error,getAllSizes){
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
 
 







