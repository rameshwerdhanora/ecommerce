/* Add Size Model for DB connectivity  */

const Size		= require('../models/Size');

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
  res.render('size/add_size', {
    title: 'Size'
  });
};

/* Save Size Information */
exports.saveSize = (req,res) => {
    var SizeIns 			= new Size();
    SizeIns.size_name 		= req.body.size_name;
    SizeIns.size_code  		= req.body.size_code;
    SizeIns.size_label  	= req.body.size_label;
    SizeIns.gender			= req.body.gender,
   	SizeIns.user_id 		= req.user._id; 
   	SizeIns.save(function(err) 
    {
    	if (err)
    	{
            res.send({status:'error',error:err});
    	}
    	else 
    	{
    		res.redirect('/listofsize');
    	}
    });
};

/* Remove Size */
exports.removeSize = (req,res) => {
	Size.remove({_id:req.params.sizeId},function(error,removeSize)
	{
		if(error)
		{
			res.send({status:'error',msg:error});
		}
		else
		{
			res.send({status:'success',msg:'Remove Successfully.'});
		}
	});
};
 
/* Edit Size */
exports.editSize = (req,res) => {
	Size.findOne({_id:req.params.sizeId},function(error,fetchSize)
	{
		if(error)
		{
			res.send({status:'error',msg:error});
		}
		else 
		{
			res.render('size/edit_size', { title: 'Size',fetchSize:fetchSize});
		}
	});
};

/* Update edit details */

exports.updateSize = (req,res) => {

	UpdateData = {
		'size_name' 	: req.body.size_name,
		'size_code'		: req.body.size_code,
		'size_label'	: req.body.size_label,
		'gender'		: req.body.gender,
	    'user_id'		: req.body.user_id 
	};
	Size.findByIdAndUpdate(req.body._id,UpdateData, function(error, updateRes)
	{
		res.redirect('/listofsize');
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
 
 







