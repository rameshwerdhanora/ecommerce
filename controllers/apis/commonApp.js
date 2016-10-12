/*
	@author : Cis Team
	@date : 12-Aug-2016
	@File : Create Common controller for common methods

*/

/* Load required library */
const Common	     = require('../../models/commonApp');
const NodeMailer 	  = require('nodemailer');
const Cart          = require('../../models/cart');
const Order         = require('../../models/orders');
const async         = require('async');

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

/**
 * GET /api/menuclick/:userId
 * Process for taken counters
 */

exports.menuClick = function(req,res)
{
   var counters = {};
   async.parallel
   (
      [
      function(callback)
      {
         Cart.count({user_id:req.params.userId},function(error,cartCount)
         {
            counters.cartCounter = cartCount;
            callback(error);
         });
      },
      function(callback)
      {
         Order.count({user_id:req.params.userId,status:{ $ne: 'DELIVERED' }},function(error,cartCount)
         {
            counters.orderCounter = cartCount;
            callback(error);
         });
      },
      function(callback)
      {
         counters.activityCounter = 0;
         callback();
      }
      ],
      function(error)
      {
         return res.json({"status":'success',"msg":'Found your counters.',counters:counters});
      }
   );
}

