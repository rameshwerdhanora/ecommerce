const EmailTemplate = require('../models/emailTemplate');
const Constants 		= require('../constants/constants');

/**
 * GET /
 * Email Template list
 */
exports.list = (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    
    
    var page = (req.query.page == undefined)?1:req.query.page;
    page = (page == 0)?1:page;
    var skipRecord = (page-1)*Constants.RECORDS_PER_PAGE;
    
    EmailTemplate.count(function(err, totalRecord) { 
        var totalPage = Math.ceil(totalRecord/Constants.RECORDS_PER_PAGE);
        EmailTemplate.find()
                .limit(Constants.RECORDS_PER_PAGE)
                .skip(skipRecord)
                .sort('-_id')
                .exec(function(error,getAllTemplate){
            if(getAllTemplate){
                res.render('emailtemplate/list', {title: 'Email Template List',activeFlag:1,resultRes:getAllTemplate, currentPage:page, totalRecord:totalRecord, totalPage:totalPage,});
            }
        });
    });
};


/**
 * get
 * add email Template
 */
exports.addTemplate = (req,res) => {
    res.render('emailtemplate/add', {title: 'Add Email Template',activeFlag:2});
}


/**
 * Post
 * Save email Template 
 */
exports.saveTemplate = (req,res) => {
    var emailTempModel = new EmailTemplate();
    emailTempModel.name = req.body.name;
    emailTempModel.subject = req.body.subject;
    emailTempModel.content = req.body.content; 
    emailTempModel.user_id = 1;
    emailTempModel.save(function(err) {
        if (err){
            req.flash('errors', ['There is some error occured']);
            res.send({status:'error',error:err});
        }else{
            req.flash('success', ['Email template added successfully']);
            res.redirect('/emailtemplate/list');
        }
    });
}



/**
 * GET /
 * Email Template Update Detail
 */
exports.edit = (req, res) => {
    if (!req.user) {
      return res.redirect('/login');
    }
    EmailTemplate.findOne({_id:req.params.templateId},function(error,templateRes){console.log(templateRes);
        if(error){
            req.flash('errors', ['No record found']);
            res.redirect('/emailtemplate/list');
        }else {
            
            res.render('emailtemplate/edit', {title: 'Edit Email Template',result:templateRes});
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
        subject : req.body.subject,
        content : req.body.content, 
        user_id : 1,
    };
    EmailTemplate.findByIdAndUpdate(req.body.template_id,updateData, function(error, updateRes)
    {
        req.flash('success', ['Email template updated successfully']);
        res.redirect('/emailtemplate/list');
    });
}