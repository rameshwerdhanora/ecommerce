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
   if(req.body.device_token != '')
   {
      var CommonIns                  = new Common;
      CommonIns.user_id              = req.body.user_id;
      CommonIns.email                = req.body.email;
      //CommonIns.feedback_subject     = req.body.feedback_subject;
      CommonIns.feedback_description = req.body.feedback_description;
      CommonIns.created              = Date.now();

      CommonIns.save(function(error)
      {
         if(error)
         {
            return res.json({"status":'error',"msg":error});
         }
         else 
         {
            return res.json({"status":'success',"msg":'Thank you for giving us feedback.'});
         }
      });      
   }
   else 
   {
      return res.json({"status":'error',"msg":'Device Token is not available.'});
   }

}

