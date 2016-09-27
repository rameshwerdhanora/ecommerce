const User = require('../models/userApp');
const nodemailer = require('nodemailer');

// Send email to user with email template
exports.emailTemplate = function(templateSubject, templateMessage, userId) {
     User.findOne({_id:userId},function(error,getCustomerDetails){
        if(getCustomerDetails)
        {   
           const transporter =  nodemailer.createTransport('smtps://rdtestcis@gmail.com:download1@smtp.gmail.com'); 
            
           const mailOptions = {
                    to: getCustomerDetails.email_id,
                    subject: templateSubject,
                    text: templateMessage
           };
           transporter.sendMail(mailOptions, function(error, info) {
                if(error){
                    req.flash('error', err.message);
                }
                //console.log('Message sent: ' + info.response);
            });    
        }
    });	
};

// Send SMS Using Twilio API to perticular user mobile number
exports.sendSms = (req, res, smsContent, userId) => {
    
    const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

    User.findOne({_id:userId},function(error,getCustomerDetails){
        if(getCustomerDetails)
        {   
            var mobileNumber = getCustomerDetails.mobileNumber;
            if (mobileNumber) {
               const message = {
                  to: mobileNumber,
                  from: '+15005550006',
                  body: smsContent
               };
              twilio.sendMessage(message, (err, responseData) => {
              if (err) { req.flash('error', err.message); }
                //console.log(responseData);
              });
            }
        }
    });	
};

// Send SMS Using Twilio API to perticular user mobile number
/*exports.sendSms = function(smsContent, userId) {
    
    const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    
     User.findOne({_id:userId},function(error,getCustomerDetails){
        if(getCustomerDetails)
        {   
            var mobileNumber = getCustomerDetails.mobileNumber;
            if (mobileNumber) {
                const message = {
                  to: mobileNumber,
                  from: '+15005550006',
                  body: smsContent
              };
              
              twilio.sendMessage(message, (err, responseData) => {
              if (err) { req.flash('error', err.message); }
                console.log(responseData);
              });
            }
        }
    });	
};*/