const Tag = require('../models/tag');
const Constants 		= require('../constants/constants');

/**
 * GET /
 * Email Template list
 */
exports.list = (req, res) => {
    var dateFormat = require('dateformat');
    var page = (req.query.page == undefined)?1:req.query.page;
    page = (page == 0)?1:page;
    var skipRecord = (page-1)*Constants.RECORDS_PER_PAGE;
    
    
    Tag.count(function(err, totalRecord) { 
        
        var totalPage = Math.ceil(totalRecord/Constants.RECORDS_PER_PAGE);
        Tag.find()
                .limit(Constants.RECORDS_PER_PAGE)
                .skip(skipRecord)
                .sort('-_id')
                .exec(function(error,resAllTag){
            if(resAllTag){
                res.render('tag/list', {title: 'Has tage List',activeFlag:1,resultRes:resAllTag, currentPage:page, totalRecord:totalRecord, totalPage:totalPage,left_activeClass:3,dateFormat:dateFormat});
            }
        });
    });
};


/**
 * get
 * add email Template
 */
exports.add = (req,res) => {
    res.render('tag/add', {title: 'Add hash tag',activeFlag:2,left_activeClass:3});
}


/**
 * Post
 * Save email Template 
 */
exports.save = (req,res) => {
    console.log(req.body.name);
    var TagModel = new Tag();
    TagModel.name = req.body.name;
    TagModel.createdAt = Date.now();
    TagModel.updatedAt = Date.now();
    TagModel.save(function(err) {
        if (err){
            req.flash('errors', ['There is some error occured']);
            res.send({status:'error',error:err});
        }else{
            req.flash('success', ['Hash tag added successfully']);
            res.redirect('/tag/list');
        }
    });
}



/**
 * GET /
 * Email Template Update Detail
 */
exports.edit = (req, res) => {
    Tag.findOne({_id:req.params.tagId},function(error,tagRes){
        if(error){
            req.flash('errors', ['No record found']);
            res.redirect('/tag/list');
        }else {
            
            res.render('tag/edit', {title: 'Edit tag',result:tagRes,left_activeClass:3,activeFlag:1});
        }
    });
};


/**
 * Post
 * Save email Template
 */
exports.update = (req,res) => {
    updateData = {
        name : req.body.name,
        updatedAt : Date.now()
    };
    Tag.findByIdAndUpdate(req.body.tagId,updateData, function(error, updateRes)
    {
        req.flash('success', ['Tag updated successfully']);
        res.redirect('/tag/list');
    });
}