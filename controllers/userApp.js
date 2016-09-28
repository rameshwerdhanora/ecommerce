const async           = require('async');
const User = require('../models/userApp');
const Permission = require('../models/permissions');
const UserPermission = require('../models/userPermissions');
const Notification = require('../models/notification');
const Address   = require('../models/address');
const ShopShipping   = require('../models/shopShipping');
const PaymentMethod   = require('../models/userPaymentMethod');
const EmailTemplate = require('../models/emailTemplate');
const CommonHelper = require('../helpers/commonHelper');
const Order           = require('../models/orders');
const OrderDetails    = require('../models/orderDetails');

/**
 * GET /customer/list
 * Customer List user page.
 */
exports.customerList = (req, res) => {
	User.find({role_id:5},function(error,getCustomers){
		if(getCustomers)
		{
			//console.log(getCustomers.length);
			res.render('user/customer_list', { left_activeClass:4, title: 'Customer',getCustomers:getCustomers});
		}
	});	
};

/**
 * GET /customer/view
 * Customer user view page.
 */
exports.customerView = (req, res) => {
    User.findOne({_id:req.params.id},function(error,getCustomerDetails){
            if(getCustomerDetails)
            {
                    //console.log(getCustomerDetails);
                    res.render('user/customer_view', { title: 'Customer View',getCustomerDetails:getCustomerDetails,activeClass:1,left_activeClass:4});
            }
    });	
};


/**
 * GET /customer/edit
 * Customer user view page in edit mode.
 */
exports.customerEdit = (req, res) => {
	User.findOne({_id:req.params.id},function(error,getCustomerDetails){
		if(getCustomerDetails)
		{
			res.render('user/customer_edit', { title: 'Customer Edit',getCustomerDetails:getCustomerDetails,activeClass:1});
		}
	});	
};

/**
 * POST /customer/customerUpdate
 * Update Customer Information
 */
exports.customerUpdate = (req, res) => {
	updateData = {
		'first_name' 	: req.body.first_name,
		'last_name'		: req.body.last_name,
	    'address'		: req.body.address, 
	    'city'			: req.body.city,
	    'state'			: req.body.state,
	    'zip_code'		: req.body.zip_code,
	    'country'		: req.body.country,
	};
	User.findByIdAndUpdate(req.body._id,updateData, function(error, updateRes)
	{
		res.redirect('/customer/list');
	});
};

/**
 * GET /customer/delete
 * Delete Customer Information
*/
exports.customerDelete = (req,res) => {
	User.remove({_id:req.params.customerId},function(error,customerDelete)
	{
		if(error)
		{
			res.send({status:'error',msg:error});
		}
		else
		{
			res.flash('success','Remove Successfully.');
			res.redirect('/customer/list');
		}
	});
};

/**
 * GET /customer/customerChangePassword
 * Customer Change Password
 */
exports.customerChangePassword = (req, res) => {
	User.findOne({_id:req.params.customerId},function(error,getCustomerDetails){
		if(getCustomerDetails)
		{
			res.render('user/customer_change_password', { title: 'Change Password',getCustomerDetails:getCustomerDetails,activeClass:1,left_activeClass:4});
		}
	});	
};

/**
 * POST /customer/customerChangePasswordSave
 * Update Customer Change Password Save
 */
exports.customerChangePasswordSave = (req, res) => {
	updateData = {
		'password' 		: req.body.password,
	};
	User.findByIdAndUpdate(req.params.customerId,updateData, function(error, updateRes)
	{
		res.redirect('/customer/view/'+req.params.customerId);
	});
};


/**
 * GET /customer/address/list
 * List of Customer Address page.
 */
exports.customerAddressList = (req, res) => {
	User.findOne({_id:req.params.customerId},function(error,getCustomerDetails){
		if(getCustomerDetails)
		{
			Address.find({ user_id: req.params.customerId}, function(error, availableUserAddresses)
	        {
	            //console.log(availableUserAddresses);
	            var shippingAddress =[];
	            var billingAddress = [];
	            availableUserAddresses.forEach(function(item, index) {
				  	if(availableUserAddresses[index].add_type == 'Shipping')
	            		shippingAddress.push(availableUserAddresses[index]);
	            	else
	            		billingAddress.push(availableUserAddresses[index]);
				});  

				res.render('user/customer_address', { title: 'Customer Address',getCustomerDetails:getCustomerDetails,activeClass:2,billingAddressObj:billingAddress,shippingAddressObj:shippingAddress,left_activeClass:4});
	        });
		}
	});	
};



/**
 * Post /customer/address/save
 * Save Customer information
 */
exports.customerAddressSave = (req, res) => {
	//console.log(req.body);
	var addressIns              = new Address();
    addressIns.user_id          = req.params.customerId;
    addressIns.address_type     = req.body.addressType;
    addressIns.first_name     	= req.body.first_name;
    addressIns.last_name     	= req.body.last_name;
    addressIns.contact_no1      = req.body.contact_no1;
    addressIns.contact_no2      = req.body.contact_no2;
    addressIns.address_line1    = req.body.address_line1;
    addressIns.address_line2    = req.body.address_line2;
    addressIns.city             = req.body.city;
    addressIns.state            = req.body.state;
    addressIns.country          = req.body.country;
    addressIns.postal_code      = req.body.postal_code;

    addressIns.save(function(error,addressObject)
    {
        if (error)
        {
            req.flash('error',error);
        }
        else
        {
            req.flash('success','Added Successfully.');
			res.redirect('/customer/address/'+req.params.customerId);
        }
    });
};


/**
 * GET /user/list
 * User List - here we need to get both users and customers in seprate columns
 */
exports.userList = (req, res) => {
    
	//-- get customers
	User.find({role_id:5},function(error,getCustomers){
		User.find({role_id:{$ne : 5}},function(error,getUsers){

		// if(getCustomers)
		// {
			//console.log(getUsers);
			res.render('user/user_list', { title: 'User List',getCustomers:getCustomers,getUsers:getUsers,left_activeClass:5});
		//}
		});
	});	
};


/**
 * GET /signup/vendor
 * Signup user page.
 */
exports.userAdd = (req, res) => {
	Permission.find({},function(error,getPermissions){
		if(getPermissions)
		{
			//console.log(getPermissions);
			res.render('user/user_add', { title: 'New User',getPermissions:getPermissions,left_activeClass:5});
		}
	});
};

/**
 * POST /signup/saveuser
 * Save users .
 */
exports.userSave = (req, res) => {
    User.findOne({ email_id: req.body.email_id }, function(err, existingEmail){
        if(existingEmail){
            req.flash('errors', ['Email address already exists.']);
            return res.render('user/user_add',{data: req.body});
        }else{
            //console.log(req.body);
            var userIns        		= new User();
            userIns.role_id    		= req.body.role_id;
            userIns.shop_name   	= req.body.shop_name;
            userIns.user_name   	= '';
            userIns.password    	= req.body.password;
            userIns.email_id       	= req.body.email_id;
            userIns.first_name  	= req.body.first_name;
            userIns.last_name   	= req.body.last_name;
            userIns.contact_no  	= req.body.contact_no;
            userIns.dob   		= '';
            userIns.gender   		= '';
            userIns.bio   		= '';
            userIns.cover_image		= '';
            userIns.profile_image       = '';
            userIns.social_type   	= '';
            userIns.social_id   	= '';
            userIns.access_token   	= '';
            userIns.is_active   	= true;
            userIns.is_deleted   	= false;
            userIns.created        	= Date.now();
            userIns.updated        	= Date.now();
            userIns.save(function(error){
                if(error === null){
                    userIns.shop_id = userIns._id;
                    userIns.save(function(error){});
                    //-- save user permissions 
                    if(req.body.permissions){
                        for(var i=0; i<req.body.permissions.length; i++){
                            var userPermission = new UserPermission();
                            userPermission.user_id = userIns._id;
                            userPermission.permission_id = req.body.permissions[i];
                            userPermission.created = Date.now();
                            userPermission.save();
                        }
                    }
                    // Get the get template content for 'registration' and call the helper to send the email         
                    EmailTemplate.findOne({template_type:'registration'},function(error,getTemplateDetail){
                        if(getTemplateDetail != null){
                            var registerTemplateContent = getTemplateDetail.content;
                            //dynamicTemplateContent= registerTemplateContent.replace(/{first_name}/gi, userIns.first_name).replace(/{last_name}/gi, userIns.last_name);
                            dynamicTemplateContent = registerTemplateContent.replace(/{customer_name}/gi, userIns.first_name);
                            if(dynamicTemplateContent){
                                CommonHelper.emailTemplate(getTemplateDetail.subject, dynamicTemplateContent, userIns._id);      
                            }
                        }
                    });
                    // Send SMS Using Twilio API to perticular user mobile number
                    if((userIns.contact_no!='') && isNaN(userIns.contact_no)){
                        //CommonHelper.sendSms(req, res, smsContent, userId);
                    }
                    req.flash('error', 'Your details is successfully stored.');
                    return res.redirect('/user/list');
                }else{
                    req.flash('error', 'Something wrong!!');
                    return res.render('user/user_add');
                }
            }); 
        }
    });
};

/*
 * GET /user/view
 * user view page.
*/
exports.userView = (req, res) => {
	User.findOne({_id:req.params.id},function(error,getUserDetails){
		if(getUserDetails)
		{
			//console.log(getUserDetails);
			res.render('user/user_view', { title: 'User View',getUserDetails:getUserDetails,activeClass:1,left_activeClass:5});

		}
	});	
};


/**
 * GET /user/edit
 * user view page in edit mode.
 */
exports.userEdit = (req, res) => {
	User.findOne({_id:req.params.id},function(error,getUserDetails){
		if(getUserDetails)
		{
			res.render('user/customer_edit', { title: 'Customer Edit',getCustomerDetails:getCustomerDetails,activeClass:1,left_activeClass:5});

			//res.render('user/user_edit', { title: 'User Edit',getUserDetails:getUserDetails,activeClass:req.params.activeClass});

		}
	});	
};

/**
 * POST /user/userUpdate
 * Update user Information
*/
exports.userUpdate = (req, res) => {
	updateData = {
		'first_name' 	: req.body.first_name,
		'last_name'		: req.body.last_name,
	    'address'		: req.body.address, 
	    'city'			: req.body.city,
	    'state'			: req.body.state,
	    'zip_code'		: req.body.zip_code,
	    'country'		: req.body.country,
	};
	User.findByIdAndUpdate(req.body._id,updateData, function(error, updateRes)
	{
                req.flash('success',['User information updated succcessfully!']);
		res.redirect('/user/list');
	});
};

/**
 * GET /user/delete
 * Delete user Information
*/
exports.userDelete = (req,res) => {
	User.remove({_id:req.params.userId},function(error,userDelete)
	{
		if(error)
		{
			res.send({status:'error',msg:error});
		}
		else
		{
			res.flash('success','Remove Successfully.');

			res.redirect('/customer/list');

			//res.redirect('/user/list');

		}
	});	
};

/* User Shipping */
exports.userShipping = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
		if(getUserDetails)
		{
			ShopShipping.findOne({ user_id: req.params.userId}, function(error, availableShopShipping)
	        {
				//console.log(availableShopShipping);
				if(availableShopShipping == null)
	        	{
	        		availableShopShipping = [];
	        	}
				res.render('user/user_shipping', { title: 'User Shipping',getUserDetails:getUserDetails,activeClass:2,availableShopShipping:availableShopShipping,left_activeClass:5});
			});
		}
	});
};

/**
 * POST /user/shipping/save/
 * User Shipping Save
 */
exports.userShippingSave = (req, res) => {
	var shippingInfo            	 = new ShopShipping();
    shippingInfo.user_id        	 = req.params.userId;
    shippingInfo.address        	 = req.body.address,
    shippingInfo.city    			 = req.body.city;
    shippingInfo.postal_code    	 = req.body.postal_code;
    shippingInfo.state    			 = req.body.state;
    shippingInfo.country    		 = req.body.country;
    shippingInfo.shipping_account    = req.body.shipping_account;
    shippingInfo.shipping_username   = req.body.shipping_username;
    shippingInfo.shipping_password   = req.body.shipping_password;

	shippingInfo.save(function(error,shippingObject)
    {
        if (error)
        {
            req.flash('error',error);
        }
        else
        {
            req.flash('success','Shipping Saved Successfully.');
			res.redirect('/user/shipping/'+req.params.userId);
        }
    });
};

/* User Payment Method */
exports.userPaymentMethod = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
		if(getUserDetails)
		{
			PaymentMethod.findOne({ user_id: req.params.userId}, function(error, availablePaymentMethod)
	        {
	        	if(availablePaymentMethod == null)
	        	{
	        		availablePaymentMethod = [];
	        	}
				//console.log(availablePaymentMethod);
				res.render('user/user_payment_method', { title: 'User Payment Method',getUserDetails:getUserDetails,activeClass:3,availablePaymentMethod:availablePaymentMethod,left_activeClass:5});
			});
			
		}
	});
};

/**
 * POST /user/paymentMethod/save/
 * User payment Method save
 */
exports.userPaymentMethodSave = (req, res) => {
	var paymentMethodInfo            	 = new PaymentMethod();
    paymentMethodInfo.user_id        	 = req.params.userId;
    paymentMethodInfo.payment_type    	 = req.body.payment_type,
    paymentMethodInfo.paypal_email 		 = req.body.paypal_email;
    paymentMethodInfo.venmo_email    	 = req.body.venmo_email;
    paymentMethodInfo.direct_deposit_bank_name  = req.body.direct_deposit_bank_name;
    paymentMethodInfo.direct_deposit_account_no = req.body.direct_deposit_account_no;
    paymentMethodInfo.direct_deposit_routing_no = req.body.direct_deposit_routing_no;

	paymentMethodInfo.save(function(error,paymentMethodObject)
    {
        if (error)
        {
            req.flash('error',error);
        }
        else
        {
            req.flash('success','Payment Method Saved Successfully.');
			res.redirect('/user/paymentMethod/'+req.params.userId);
        }
    });
};

/* User ORder 
exports.userOrder = (req, res) => {
    res.render('user/user_order', { title: 'User Order',activeClass:4,left_activeClass:5 });
};
*/

/* User Product Review */
exports.userProductReview = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
		if(getUserDetails)
		{
			//console.log(getUserDetails);
			res.render('user/user_product_review', { title: 'User Payment Review',getUserDetails:getUserDetails,activeClass:5,left_activeClass:5});
		}
	});
};

/* User Account */
exports.userAccount = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
		if(getUserDetails)
		{
			//console.log(getUserDetails);
			res.render('user/user_account', { title: 'User Account',getUserDetails:getUserDetails,activeClass:6,left_activeClass:5});
		}
	});
};

/* User Linked Account */
exports.userLinkedAccount = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
		if(getUserDetails)
		{
			//console.log(getUserDetails);
			res.render('user/user_linked_account', { title: 'User Linked Account',getUserDetails:getUserDetails,activeClass:7,left_activeClass:5});
		}
	});
};

/* User Notifications */
exports.userNotifications = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
		if(getUserDetails)
		{
			console.log(getUserDetails);
			res.render('user/user_notifications', { title: 'User Notifications',getUserDetails:getUserDetails,activeClass:8,left_activeClass:5});
		}
	});
};

/**
 * GET /user/userChangePassword
 * user Change Password
 */
exports.userChangePassword = (req, res) => {
	User.findOne({_id:req.params.userId},function(error,getUserDetails){
		if(getUserDetails)
		{
			res.render('user/user_change_password', { title: 'Change Password',getUserDetails:getUserDetails,activeClass:1,left_activeClass:5});
		}
	});	
};

/**
 * POST /user/userChangePasswordSave
 * Update user Change Password Save
 */
exports.userChangePasswordSave = (req, res) => {
	updateData = {
		'password' 		: req.body.password,
	};
	User.findByIdAndUpdate(req.params.userId,updateData, function(error, updateRes)
	{
		res.redirect('/user/view/'+req.params.userId);
	});
};

/**
 * GET myProfile
 * My Profile view page in edit mode.
 */
exports.myProfile = (req, res) => {
	User.findOne(req.body._id,function(error,getProfileDetails){
		if(getProfileDetails)
		{
			console.log(getProfileDetails);
			res.render('user/myprofile_view', { title: 'My Profile',getProfileDetails:getProfileDetails});

			//res.render('user/user_edit', { title: 'User Edit',getUserDetails:getUserDetails,activeClass:req.params.activeClass});

		}
	});	
};




/**

 * GET /customer/notifiaction
 * List of Customer Address page.
 */
exports.notification = (req, res) => {
    Notification.findOne({user_id:req.params.customerId},function(error,resultRes){
        User.findOne({_id:req.params.customerId},function(error,getCustomerDetails){
            if(getCustomerDetails){
                if(resultRes){
                    res.render('user/notification', { title: 'Customer notification',activeClass:8, getCustomerDetails:getCustomerDetails, result:resultRes,left_activeClass:4 });
                }else{
                    resultRes = { _id: '',
                        user_id: req.params.customerId,
                        new_arrival: [ { mobile: 0, email: 0 } ],
                        promocode: [ { mobile: 0, email: 0 } ],
                        delivery: [ { mobile: 0, email: 0 } ],
                        shipped: [ { mobile: 0, email: 0} ],
                        news: [ { mobile: 0, email: 0 } ] ,
                        user_id:req.params.customerId
                    };
                    res.render('user/notification', { title: 'Customer notification',activeClass:8, getCustomerDetails:getCustomerDetails,result:resultRes,left_activeClass:4 });
                }
            }
        });
    });
};

exports.saveNotification = (req, res) => {
   var updateData = {};
   updateData.delivery = new Array();
   updateData.shipped = new Array();
   updateData.new_arrival = new Array();
   updateData.promocode = new Array();
   updateData.news = new Array();
    if(req.body.arrival != undefined && req.body.arrival.length > 0){
        if(req.body.arrival[0] == 'mail' ||  req.body.arrival[1] == 'mail'){
            updateData.new_arrival.push('mail');
        }
        if(req.body.arrival[0] == 'mobile' ||  req.body.arrival[1] == 'mobile'){
            updateData.new_arrival.push('mobile');
        }
    }
    
    if(req.body.shipped != undefined && req.body.shipped.length > 0){
        if(req.body.shipped[0] == 'mail' || req.body.shipped[1] == 'mail'){
            updateData.shipped.push('mail');
        }
        if(req.body.shipped[0] == 'mobile' || req.body.shipped[1] == 'mobile'){
            updateData.shipped.push('mobile');
        }
    }
    
    if(req.body.deliver != undefined && req.body.deliver.length > 0){
        if(req.body.deliver[0] == 'mail' || req.body.deliver[1] == 'mail'){
            updateData.delivery.push('mail');
        }
        if(req.body.deliver[0] == 'mobile' || req.body.deliver[1] == 'mobile'){
            updateData.delivery.push('mobile');
        }
    }
    
    if(req.body.promo != undefined && req.body.promo.length > 0){
        if(req.body.promo[0] == 'mail' || req.body.promo[1] == 'mail'){
            updateData.promocode.push('mail');
        }
        if(req.body.promo[0] == 'mobile' || req.body.promo[1] == 'mobile' ){
            updateData.promocode.push('mobile');
        }
        
    }
    if(req.body.news != undefined  && req.body.news.length > 0){
        if(req.body.news[0] == 'mail' || req.body.news[1] == 'mail'){
            updateData.news.push('mail');
        }
        if(req.body.news[0] == 'mobile' || req.body.news[1] == 'mobile'){
            updateData.news.push('mobile');
        }
    }
    
//    
//    updateData = {
//        delivery:{email:deliver_email, mobile:deliver_mob},
//        shipped:{email: shipped_email, mobile:shipped_mob},
//        new_arrival:{email:arrival_email, mobile:arrival_mob},
//        promocode:{email:promo_email, mobile:promo_mob},
//        news:{email:news_email, mobile:news_mob}
//    };
    Notification.update({user_id:req.body.user_id},updateData,{upsert:true},function(error,updateRes){
        if(updateRes){
            req.flash('success',['User notification updated successfully!']);
            res.redirect('/customer/notification/'+req.body.user_id); 
        }
    });
};


exports.linkedAccounts = (req, res) => {
	User.findOne({_id:req.params.customerId},function(error,getCustomerDetails){
        if(getCustomerDetails){
            res.render('user/linkedaccounts', { title: 'Customer linked account',activeClass:7,getCustomerDetails:getCustomerDetails,left_activeClass:4});
        }
    });
	
};

exports.saveLinkedAccounts = (req, res) => {
    User.findOne({_id:req.params.customerId},function(error,getCustomerDetails){
        if(getCustomerDetails){
            res.render('user/customer_address', { title: 'Customer Address',getCustomerDetails:getCustomerDetails,activeClass:req.params.activeClass,availableUserAddresses:availableUserRecord,left_activeClass:4});
        }
    });
    res.render('user/linkedaccounts', { title: 'Customer linked account',activeClass:7,left_activeClass:4});
};

exports.accounts = (req, res) => {
    User.findOne({_id:req.params.customerId},function(error,getCustomerDetails){
        if(getCustomerDetails){
            res.render('user/accounts', { title: 'Customer accounts',activeClass:6,getCustomerDetails:getCustomerDetails,left_activeClass:4 });
        }
    });
};



exports.productPreview = (req, res) => {
    User.findOne({_id:req.params.customerId},function(error,getCustomerDetails){
        if(getCustomerDetails){
            res.render('user/productPreview', { title: 'Product review',getCustomerDetails:getCustomerDetails,activeClass:5,left_activeClass:4 });
        }
    });
};

exports.payments = (req, res) => {
    User.findOne({_id:req.params.customerId},function(error,getCustomerDetails){
        if(getCustomerDetails){
            res.render('user/payments', { title: 'Customer Payments',getCustomerDetails:getCustomerDetails,activeClass:3,left_activeClass:4 });
        }
    });
};

exports.order = (req, res) => {
    User.findOne({_id:req.params.customerId},function(error,getCustomerDetails){
        if(getCustomerDetails){

          Order.find({user_id:req.params.customerId},function(error,getAllOrders)
		  {
		      if(getAllOrders)
		      {
		        var finalOrderData = new Array();
		        async.eachSeries(getAllOrders, function(OrderIds, callback)
		        {
		          var orderObj = {};
		          var dateTime = new Date(parseInt(OrderIds.order_date));
		        
		          //var split = dateTime.split(' ');
		   
		          var year  = dateTime.getFullYear();
		          var month = dateTime.getMonth()+1;
		          var date  = dateTime.getDate();
		          finalDate = month+'/'+date+'/'+year 

		          orderObj._id = OrderIds._id;
		          orderObj.order_number = OrderIds.order_number;
		          orderObj.status       = OrderIds.status;
		          orderObj.totalprice   = OrderIds.totalprice;
		          orderObj.orderdate    = finalDate;

		          async.parallel
		          (
		            [
		                function(callback)
		                {
		                  User.findOne({_id:OrderIds.user_id},function(error,fetUserDetails)
		                  {
		                    if(fetUserDetails)
		                    {
		                      orderObj.user_id    = OrderIds.user_id;
		                      orderObj.user_name  = fetUserDetails.user_name;
		                      orderObj.email_id   = fetUserDetails.email_id;
		                      orderObj.first_name = fetUserDetails.first_name;
		                      orderObj.last_name  = fetUserDetails.last_name;
		                      orderObj.gender     = fetUserDetails.gender;
		                      OrderDetails.findOne({order_id:OrderIds._id},function(error,fetchingAllOrderDetails)
				                {
				                    if(fetchingAllOrderDetails)
				                    {
				                    	//console.log(fetchingAllOrderDetails);
				                    	User.findOne({_id:fetchingAllOrderDetails.brand_id},function(error,fetchingShopDetails)
						                {
						                	//console.log(fetchingShopDetails);
				                      		orderObj.shop_name   = fetchingShopDetails.first_name+' '+fetchingShopDetails.last_name;
						                });
				                    }
				                });
		                    }
		                    callback(error);
		                  });
		                }
		            ],
		            function(err)
		            {
		              finalOrderData.push(orderObj);
		              callback(err);
		            }
		          );
		          
		        },
		        function(err)
		        {
		        //	console.log(finalOrderData);
		          res.render('user/customer_order', { title: 'Customer Order',activeClass:4,left_activeClass:4,getCustomerDetails:getCustomerDetails,getAllOrders:finalOrderData });
		        });
		      }
		      else 
		      {
		        req.flash('success',['Order is not created.']);
		        res.render('user/customer_order', { title: 'Customer Order',activeClass:4,left_activeClass:4,getCustomerDetails:getCustomerDetails,getAllOrders:''});
		      }
		  });

 
        }
    });
};