/* Add Color Model for DB connectivity  */
const Multer 	= require('multer');
const Color		= require('../models/color');

/* Define Folder name where our color image store */
var storage =   Multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/uploads/color_logo');
  },
  filename: function (req, file, callback) {
  	var realname = file.originalname.replace(/ /g,"_");
    callback(null, Date.now() + '_' + realname);
  }
});
/* Create Instance for upload folder */
var uploadColor = Multer({ storage : storage}).single('color_logo');

/* Get the list of all color name with imformation */
exports.listOfColor = (req, res) => {
	Color.find({},function(error,getAllColors){
		if(getAllColors)
		{
			res.render('color/list', { title: 'Color',getAllColors:getAllColors,activeClass:3});
		}
	});	
 
};

// /* Add Color page  */
// exports.addColor = (req, res) => {
//   res.render('color/add_color', {
//     title: 'Color'
//   });
// };

/* Save Color Information */
exports.saveColor = (req,res) => {

	uploadColor(req,res,function(err) 
	{
		if(err) {
            return res.end("Error uploading file.");
        }

        var fileName 			= req.file.path.replace('public/','');
	    var colorIns 			= new Color();
	    colorIns.color_logo 	= fileName;
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
	    		res.redirect('/color/list');
	    	}
	    });
   	});
};

/* Remove Color */
exports.removeColor = (req,res) => {
	Color.remove({_id:req.params.colorId},function(error,removeColor)
	{
		if(error)
		{
			req.flash('message', 'Something Wrong!!');
		}
		else
		{
			req.flash('message', 'Remove Successfully.');
		}
		return res.redirect('/color/list');
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

	uploadColor(req,res,function(err) 
	{
		if(err) 
		{
            return res.end("Error uploading file.");
        }

        var fineName 		= req.file.path.replace('public/','');
		updateData = {
			'color_logo' 	: fineName,
			'color_name'	: req.body.color_name,
		    'user_id'		: req.body.user_id 
		};
		Color.findByIdAndUpdate(req.body._id,updateData, function(error, updateRes)
		{
			res.redirect('/listofcolor');
		});
	});
};







