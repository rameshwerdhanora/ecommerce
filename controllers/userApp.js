const User = require('../models/userApp');
const Permission = require('../models/permissions');
const UserPermission = require('../models/userPermissions');
const Notification = require('../models/notification');
const Address   = require('../models/address');
const ShopShipping   = require('../models/shopShipping');
const PaymentMethod   = require('../models/userPaymentMethod');



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
			res.render('user/customer_change_password', { title: 'Change Password',getCustomerDetails:getCustomerDetails});
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
	User.findByIdAndUpdate(req.body._id,updateData, function(error, updateRes)
	{
		res.redirect('/customer/view/'+req.body._id);
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
				  	if(availableUserAddresses[index].address_type == 'Shipping')
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
			res.render('user/user_list', { title: 'User List',getCustomers:getCustomers,getUsers:getUsers});
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
			res.render('user/user_add', { title: 'New User',getPermissions:getPermissions});
		}
	});
};

/**
 * POST /signup/saveuser
 * Save users .
 */
exports.userSave = (req, res) => {
	User.findOne({ email_id: req.body.email_id }, function(err, existingEmail){
		if(existingEmail) 
		{
			//console.log(req.body);
			req.flash('error', 'Email address already exists.');
			//req.flash('data',req.body);
      		return res.render('user/user_add',{data: req.body});
		} 
		else 
		{
			//console.log(req.body);
                    var userIns        		= new User();
                    userIns.role_id    		= req.body.role_id;
                    userIns.shop_name   	= req.body.shop_name;
                    userIns.user_name   	= '';
                    userIns.password    	= req.body.password;
		    userIns.email_id       	= req.body.email_id;
                    userIns.first_name  	= req.body.first_name;
		    userIns.last_name   	= req.body.last_name;
		    userIns.contact_no  	= '';
		    userIns.dob   			= '';
		    userIns.gender   		= '';
		    userIns.bio   			= '';
		    userIns.cover_image		= '';
		    userIns.profile_image   = '';
		    userIns.social_type   	= '';
		    userIns.social_id   	= '';
		    userIns.access_token   	= '';
		    userIns.is_active   	= true;
		    userIns.is_deleted   	= false;
		    userIns.created        	= Date.now();
		    userIns.updated        	= '';

		    userIns.save(function(error){
				if(error === null)
				{	
					//-- save user permissions
					for(var i=0; i<req.body.permissions.length; i++){
						var userPermission = new UserPermission();
						userPermission.user_id = userIns._id;
						userPermission.permission_id = req.body.permissions[i];
						userPermission.created = Date.now();
						userPermission.save();
					}
					
					// SendMailToUser(req.body);
					req.flash('error', 'Your details is successfully stored.');
      				return res.redirect('/user/list');
				}
				else 
				{
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
			res.render('user/user_view', { title: 'User View',getUserDetails:getUserDetails,activeClass:1});

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
			res.render('user/customer_edit', { title: 'Customer Edit',getCustomerDetails:getCustomerDetails,activeClass:1});

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
				res.render('user/user_shipping', { title: 'User Shipping',getUserDetails:getUserDetails,activeClass:2,availableShopShipping:availableShopShipping});
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
				res.render('user/user_payment_method', { title: 'User Payment Method',getUserDetails:getUserDetails,activeClass:3,availablePaymentMethod:availablePaymentMethod});
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

/* User ORder */
exports.userOrder = (req, res) => {
    res.render('user/user_order', { title: 'User Order',activeClass:4 });
};


/* User Product Review */
exports.userProductReview = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
		if(getUserDetails)
		{
			//console.log(getUserDetails);
			res.render('user/user_product_review', { title: 'User Payment Review',getUserDetails:getUserDetails,activeClass:5});
		}
	});
};

/* User Account */
exports.userAccount = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
		if(getUserDetails)
		{
			//console.log(getUserDetails);
			res.render('user/user_account', { title: 'User Account',getUserDetails:getUserDetails,activeClass:6});
		}
	});
};

/* User Linked Account */
exports.userLinkedAccount = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
		if(getUserDetails)
		{
			//console.log(getUserDetails);
			res.render('user/user_linked_account', { title: 'User Linked Account',getUserDetails:getUserDetails,activeClass:7});
		}
	});
};

/* User Notifications */
exports.userNotifications = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
		if(getUserDetails)
		{
			console.log(getUserDetails);
			res.render('user/user_notifications', { title: 'User Notifications',getUserDetails:getUserDetails,activeClass:8});
		}
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
 * POST /customer/customerChangePasswordSave
 * Update Customer Change Password Save
 */
exports.customerChangePasswordSave = (req, res) => {
	updateData = {
            'password' 	: req.body.password,
	};
	User.findByIdAndUpdate(req.body._id,updateData, function(error, updateRes)
	{
		res.redirect('/customer/view/'+req.body._id);
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
    console.log(req.body.user_id);
    if(req.body.arrival){
        var arrival_email = (req.body.arrival.email != 'undefined')?req.body.arrival.email:'0';
        var arrival_mob = (req.body.arrival.mob != 'undefined')?req.body.arrival.mob:'0';
    }else{
        var arrival_email = '0';
        var arrival_mob = '0';
    }
    if(req.body.shipped){
        var shipped_email = (req.body.shipped.email != 'undefined')?req.body.shipped.email:'0';
        var shipped_mob = (req.body.shipped.mob != 'undefined')?req.body.shipped.mob:'0';
    }else{
        var shipped_email = '0';
        var shipped_mob = '0';
    }
    
    if(req.body.deliver){
        var deliver_email = (req.body.deliver.email != 'undefined')?req.body.deliver.email:'0';
        var deliver_mob = (req.body.deliver.mob != 'undefined')?req.body.deliver.mob:'0';
    }else{
        var deliver_email = '0';
        var deliver_mob = '0';
    }
    if(req.body.promo){
        var promo_email = (req.body.promo.email != 'undefined')?req.body.promo.email:'0';
        var promo_mob = (req.body.promo.mob != 'undefined')?req.body.promo.mob:'0';
    }else{
        var promo_email = '0';
        var promo_mob = '0';
    }
    if(req.body.news){
        var news_email = (req.body.news.email != 'undefined')?req.body.news.email:'0';
        var news_mob = (req.body.news.mob != 'undefined')?req.body.news.mob:'0';
    }else{
        var news_email = '0';
        var news_mob = '0';
    }
    updateData = {
        delivery:{email:deliver_email, mobile:deliver_mob},
        shipped:{email: shipped_email, mobile:shipped_mob},
        new_arrival:{email:arrival_email, mobile:arrival_mob},
        promocode:{email:promo_email, mobile:promo_mob},
        news:{email:news_email, mobile:news_mob}
    };
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
    /*User.findOne({_id:req.params.customerId},function(error,userRes){
        if(userRes){
            res.render('user/accounts', { title: 'Customer accounts',activeClass:6,result:userRes });
        }
    });*/
    res.render('user/order', { title: 'Order',activeClass:4,left_activeClass:4 });
};

