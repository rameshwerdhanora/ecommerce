const User = require('../models/userApp');
const Permission = require('../models/permissions');
const UserPermission = require('../models/userPermissions');

/**
 * GET /signup/vendor
 * Signup user page.
 */
exports.signupUser = (req, res) => {
	Permission.find({},function(error,getPermissions){
		if(getPermissions)
		{
			//console.log(getPermissions);
			res.render('user/create', { title: 'Signup',getPermissions:getPermissions});
		}
	});
};

/**
 * POST /signup/saveuser
 * Save users .
 */
exports.saveUser = (req, res) => {
	User.findOne({ email_id: req.body.email_id }, function(err, existingEmail){
		if(existingEmail) 
		{
			//console.log(req.body);
			req.flash('error', 'Email address already exists.');
			//req.flash('data',req.body);
      		return res.render('user/create',{data: req.body});
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
      				return res.redirect('/signup/user');
				}
				else 
				{
					req.flash('error', 'Something wrong!!');
      				return res.render('user/create');
				}
		    }); 
		}
	});
};

/**
 * GET /customer/list
 * Customer List user page.
 */
exports.customerList = (req, res) => {
	User.find({role_id:4},function(error,getCustomers){
		if(getCustomers)
		{
			res.render('user/customer_list', { title: 'Customer',getCustomers:getCustomers});
		}
	});	
};

/**
 * GET /customer/view
 * Customer user view page.
 */
exports.customerView = (req, res) => {
	User.find({_id:req.params.id},function(error,getCustomerDetails){
		if(getCustomerDetails)
		{
			//console.log(getCustomerDetails);
			res.render('user/customer_view', { title: 'Customer View',getCustomerDetails:getCustomerDetails});
		}
	});	
};


/**
 * GET /customer/edit
 * Customer user view page in edit mode.
 */
exports.customerEdit = (req, res) => {
	User.find({_id:req.params.id},function(error,getCustomerDetails){
		if(getCustomerDetails)
		{
			res.render('user/customer_edit', { title: 'Customer Edit',getCustomerDetails:getCustomerDetails});
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