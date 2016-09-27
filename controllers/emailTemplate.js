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
                res.render('emailtemplate/list', {title: 'Email Template List',activeFlag:1,resultRes:getAllTemplate, currentPage:page, totalRecord:totalRecord, totalPage:totalPage,left_activeClass:6});
            }
        });
    });
};


/**
 * get
 * add email Template
 */
exports.addTemplate = (req,res) => {
    res.render('emailtemplate/add', {title: 'Add Email Template',activeFlag:2,left_activeClass:6,emailTemplateType:Constants.EMAILTEMPLATETYPE});
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
    emailTempModel.mobile_content = req.body.mobile_content; 
    emailTempModel.template_type = req.body.template_type; 
    emailTempModel.user_type = req.body.user_type;
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
            console.log(templateRes);
            res.render('emailtemplate/edit', {title: 'Edit Email Template',result:templateRes,emailTemplateType:Constants.EMAILTEMPLATETYPE});
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
        mobile_content : req.body.mobile_content, 
        user_type : req.body.user_type,
        template_type : req.body.template_type
    };
    EmailTemplate.findByIdAndUpdate(req.body.template_id,updateData, function(error, updateRes)
    {
        req.flash('success', ['Email template updated successfully']);
        res.redirect('/emailtemplate/list');
    });
}