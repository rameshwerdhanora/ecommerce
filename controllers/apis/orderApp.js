/*
	@author : Cis Team
	@date : 19-Sep-2016
	@File : Order Details

*/

/* Load required library */
const async             = require('async');
const Constants 		= require('../../constants/constants');
const Order 			= require('../../models/orders');
const OrderDetails 		= require('../../models/orderDetails');

/**
 * POST /api/order/saveorder
 * Process for Save Order for user
 */

exports.saveUserFinalOrder = (req,res) => {

	if(req.body.device_token != '')
	{
		var finalArray = req.body.mainorder;
		console.log(req.body);

	}
	else 
	{
		return res.json({"status":'error',"msg":'Device token is not avaible unable to place your order.'})
	}

}