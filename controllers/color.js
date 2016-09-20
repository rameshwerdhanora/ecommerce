/* Add Color Model for DB connectivity  */
const Multer 	= require('multer');
const Color		= require('../models/color');
const Constants 		= require('../constants/constants');

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
    var page = (req.query.page == undefined)?1:req.query.page;
    page = (page == 0)?1:page;
    var skipRecord = (page-1)*Constants.RECORDS_PER_PAGE;    
    console.log(req.params.colorId);
    Color.count(function(err, totalRecord) {
        var totalPage = Math.ceil(totalRecord/Constants.RECORDS_PER_PAGE);
        Color.find()
            .limit(Constants.RECORDS_PER_PAGE)
            .skip(skipRecord)
            .sort('-_id')
            .exec(function(error,getAllColors){
            if(req.params.colorId){
                Color.findOne({_id:req.params.colorId},function(error,resColor){
                    if(error){
                        req.flash('errors', 'Something went wrong!!');
                    }else{
                        res.render('color/list', { title: 'Color',getAllColors:getAllColors,activeClass:3,editRes:resColor,currentPage:page, totalRecord:totalRecord, totalPage:totalPage,left_activeClass:3});
                    }
                });
            }else{
                res.render('color/list', { title: 'Color',getAllColors:getAllColors,activeClass:3,currentPage:page, totalRecord:totalRecord, totalPage:totalPage,left_activeClass:3});
            }
        });
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
    uploadColor(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        var fileName = req.file.path.replace('public/','');
        var colorIns  = new Color();
        colorIns.color_logo = fileName;
        colorIns.color_name  = req.body.color_name;
        colorIns.user_id = req.user._id; 
        colorIns.save(function(err){
            if (err){
                req.flash('errors',['Some thing goes wronge']);
                res.send({status:'error',error:err});
            }else{
                req.flash('success',['Color has been added successfully']);
                res.redirect('/color/list');
            }
        });
    });
};

/* Remove Color */
exports.removeColor = (req,res) => {
    Color.remove({_id:req.params.colorId},function(error,removeColor){
        if(error){
            req.flash('errors', 'Something Wrong!!');
        }else{
            req.flash('message', 'Remove Successfully.');
        }
        return res.redirect('/color/list');
    });
};
 
/* Edit Color */
exports.editColor = (req,res) => {
    Color.findOne({_id:req.params.colorId},function(error,fetchColor){
        if(error){
            req.flash('errors', 'Something Wrong!!');
            res.send({status:'error',msg:error});
        }else {
            res.render('color/edit_color', { title: 'Color',fetchColor:fetchColor});
        }
    });
};

/* Update edit details */
exports.updateColor = (req,res) => {
    uploadColor(req,res,function(err) {
        if(err) {
            req.flash('errors', 'Something Wrong!!');
            return res.end("Error uploading file.");
        }
        updateData = {
            'color_name'	: req.body.color_name,
            'user_id'		: req.body.user_id 
        };
        if(req.file){
            updateData.color_logo = req.file.path.replace('public/','');
        }
        Color.findByIdAndUpdate(req.body.colorId,updateData, function(error, updateRes){
            req.flash('success',['Color updated successfully']);
            res.redirect('/color/list');
        });
    });
};







