/* Add Color Model for DB connectivity  */

const Color		= require('../models/color');


/* Get the list of all color name with imformation */
exports.listOfColor = (req, res) => {
	Color.find({},function(error,getAllColors){
		if(getAllColors)
		{
			res.render('color/list', { title: 'Color',getAllColors:getAllColors});
		}
	});	
 
};

/* Add Color page  */
exports.addColor = (req, res) => {
  res.render('color/add_color', {
    title: 'Color'
  });
};

/* Save Color Information */
exports.saveColor = (req,res) => {

    var colorIns 			= new Color();
    colorIns.color_code 	= req.body.color_code;
    colorIns.color_name  	= req.body.color_name;
   	colorIns.user_id 		= req.user._id; 
   	colorIns.save(function(err) 
    {
    	if (err)
    	{
            res.send({status:'error',error:err});
    	}
    	else 
    	{
    		res.redirect('/listofcolor');
    	}
    });
};

/* Remove Color */
exports.removeColor = (req,res) => {
	Color.remove({_id:req.params.colorId},function(error,removeColor)
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
 
/* Edit Color */
exports.editColor = (req,res) => {
	Color.findOne({_id:req.params.colorId},function(error,fetchColor)
	{
		if(error)
		{
			res.send({status:'error',msg:error});
		}
		else 
		{
			res.render('color/edit_color', { title: 'Color',fetchColor:fetchColor});
		}
	});
};

/* Update edit details */

exports.updateColor = (req,res) => {

	updateData = {
		'color_code' 	: req.body.color_code,
		'color_name'	: req.body.color_name,
	    'user_id'		: req.body.user_id 
	};
	Color.findByIdAndUpdate(req.body._id,updateData, function(error, updateRes)
	{
		res.redirect('/listofcolor');
	});
};

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






