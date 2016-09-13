/*
	@author : Cis Team
	@date : 12-Aug-2016
	@File : Create Common controller for common methods

*/

/* Load required library */
const Common	     = require('../../models/commonApp');
const NodeMailer 	  = require('nodemailer');


/**
 * POST /api/customer/postLeaveFeedback
 * Process to leave feedback from Application.
 */

exports.postLeaveFeedback = function(req,res)
{
	var feedbackData = {
		user_id				:req.body.user_id,
		email				:req.body.email, 
		feedback_subject	:req.body.feedback_subject, 
		feedback_description:req.body.feedback_description, 
		created				:Date.now() 
	};

   	Common.insert(feedbackData,function(error,insertFeedbackRes)
   	{
   		if(error)
   		{
   			return res.json({"status":'error',"msg":error});
   		}
   		else 
   		{
   			return res.json({"status":'success',"msg":'Thank you for giving us feedback. Our team will shortly connect with you.'});
   		}
   	});
}

