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
const Constants 		= require('../constants/constants');
const Multer 	= require('multer');

/* Define Folder name where our Shop image store */
var storage =   Multer.diskStorage({
  destination: function (req, file, callback) {
    if(file.fieldname == 'cover_image' || file.fieldname == 'shop_logo'){
       callback(null, 'public/uploads/shop_logo'); 
    }else if(file.fieldname == 'profile_image'){
       callback(null, 'public/uploads/profile_images');
    }
  },
  filename: function (req, file, callback) {
  	var realname = file.originalname.replace(/ /g,"_");
    callback(null, Date.now() + '_' + realname);
  }
});
/* Create Instance for upload folder */
var uploadShopImages = Multer({ storage : storage}).any();

/**
 * GET /customer/list
 * Customer List user page.
 */
exports.customerList = (req, res) => {
    if(req.user.role_id == 3 || req.user.role_id == 4 || req.user.role_id == 6){
        var page = (req.query.page == undefined)?1:req.query.page;
        page = (page == 0)?1:page;
        var skipRecord = (page-1)*Constants.RECORDS_PER_PAGE;
        Address.find({is_default:1, add_type:Constants.SHIPPING},function(error,fetchAddress){  
            User.find({role_id:5,is_deleted:false},function(error,fetchAllCustomers){  
                OrderDetails.find({shop_id:req.user._id},function(error,fetchOrderDetails){   
                    var tempShopUsers = {};
                    var tempShopUsersArr = [];
                    if(tempShopUsers){
                        for(var j = 0; j< fetchAllCustomers.length;j++){
                          for(var i = 0;i< fetchOrderDetails.length;i++){
                            if(fetchAllCustomers[j]._id == fetchOrderDetails[i].user_id){
                                tempShopUsersArr.push(fetchOrderDetails[i].user_id);
                            }
                          }
                        }
                    }
                    
                    User.find({role_id:5,is_deleted:false,_id:{$in:tempShopUsersArr}},function(error,countAllCustomers){  
                         var totalRecord = countAllCustomers.length;
                         var totalPage = Math.ceil(totalRecord/Constants.RECORDS_PER_PAGE);

                        User.find({role_id:5,is_deleted:false,_id:{$in:tempShopUsersArr}})
                            .limit(Constants.RECORDS_PER_PAGE)
                            .skip(skipRecord)
                            .sort('-_id')
                            .exec(function(error,getCustomers){
                               var tempAddressLine1 = {};
                               var tempCity = {};
                               var tempPostalCode = {};
                               var tempContactNo = {};
                               var tempCountry = {};
                               var tempState = {};
                               for(var i =0; i < getCustomers.length;i++){
                                   for(var j = 0;j< fetchAddress.length;j++){
                                       if(getCustomers[i]._id == fetchAddress[j].user_id){
                                           //getCustomers[i].push(fetchAddress[j]['address_line1']);
                                           tempAddressLine1[getCustomers[i]._id] = fetchAddress[j].address_line1;
                                           tempCity[getCustomers[i]._id] = fetchAddress[j].city;
                                           tempPostalCode[getCustomers[i]._id] = fetchAddress[j].postal_code;
                                           tempCountry[getCustomers[i]._id] = fetchAddress[j].country;
                                           tempContactNo[getCustomers[i]._id] = fetchAddress[j].contact_no;
                                           tempState[getCustomers[i]._id] = fetchAddress[j].state;
                                       }
                                   }
                               }

                            if(getCustomers) {
                                res.render('user/customer_list', { left_activeClass:4, title: 'Customer', currentPage:page, totalPage:totalPage, getCustomers:getCustomers, addressLine1:tempAddressLine1, city:tempCity,postalCode:tempPostalCode,country:tempCountry, contactNo:tempContactNo,state:tempState  });
                            }   
                        });    
                        
                    });  
                });    
            });
       });
    } else if(req.user.role_id == 1 || req.user.role_id == 2){ 
        var page = (req.query.page == undefined)?1:req.query.page;
        page = (page == 0)?1:page;
        var skipRecord = (page-1)*Constants.RECORDS_PER_PAGE;
        var getCustomers = [];
        User.count({role_id:5,is_deleted:false},function(error, totalRecord) {
            var totalPage = Math.ceil(totalRecord/Constants.RECORDS_PER_PAGE);

            User.find({role_id:5,is_deleted:false})
                    .limit(Constants.RECORDS_PER_PAGE)
                    .skip(skipRecord)
                    .sort('-_id')
                    .exec(function(error,getCustomers){
                    Address.find({is_default:1, add_type:Constants.SHIPPING},function(error,fetchAddress){        
                        
                        /*var newArray = [];
                         * var tempAddress = {};
                        if(tempAddress){
                            for(var i = 0;i< fetchAddress.length;i++){
                                tempAddress[fetchAddress[i].user_id] = fetchAddress[i];
                            }
                        }*/
                        
                        var tempAddressLine1 = {};
                        var tempCity = {};
                        var tempPostalCode = {};
                        var tempContactNo = {};
                        var tempCountry = {};
                        var tempState = {};
                        for(var i =0; i < getCustomers.length;i++){
                            for(var j = 0;j< fetchAddress.length;j++){
                                if(getCustomers[i]._id == fetchAddress[j].user_id){
                                    //getCustomers[i].push(fetchAddress[j]['address_line1']);
                                    tempAddressLine1[getCustomers[i]._id] = fetchAddress[j].address_line1;
                                    tempCity[getCustomers[i]._id] = fetchAddress[j].city;
                                    tempPostalCode[getCustomers[i]._id] = fetchAddress[j].postal_code;
                                    tempCountry[getCustomers[i]._id] = fetchAddress[j].country;
                                    tempContactNo[getCustomers[i]._id] = fetchAddress[j].contact_no;
                                    tempState[getCustomers[i]._id] = fetchAddress[j].state;
                                }
                            }
                        }
                            
                        if(getCustomers) {
                             res.render('user/customer_list', { left_activeClass:4, currentPage:page, totalPage:totalPage, title: 'Customer',getCustomers:getCustomers, addressLine1:tempAddressLine1, city:tempCity,postalCode:tempPostalCode,country:tempCountry, contactNo:tempContactNo,state:tempState  });
                         }     
                });
            });
        });
    }else{
        req.flash('errors', ['Unauthorised user role']);
        return res.redirect('/dashboard');
    }
         
};

/**
 * GET /customer/view
 * Customer user view page.
 */
exports.customerView = (req, res) => {
    User.findOne({_id:req.params.id},function(error,getCustomerDetails){
        Address.findOne({is_default:1, add_type:Constants.SHIPPING, user_id:req.params.id},function(error,fetchAddress){   
            if(getCustomerDetails)
            {
                if(fetchAddress == null){
                    fetchAddress = [];
                }
                res.render('user/customer_view', { title: 'Customer View',getCustomerDetails:getCustomerDetails,activeClass:1,left_activeClass:4, fetchAddress:fetchAddress});
            }
        });	
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
	    'city'		: req.body.city,
	    'state'		: req.body.state,
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
    updateData = {
        is_deleted:true
    }
    User.update({_id:req.params.customerId},updateData,function(error,customerDelete){
        if(error){
            req.flash('errors',['Something went wronge!']);
            res.redirect('/customer/list');
        }else{
            req.flash('success',['Customer has been removed Successfully.']);
            res.redirect('/customer/list');
        }
    });
    /*
    User.remove({_id:req.params.customerId},function(error,customerDelete){
            if(error){
                res.send({status:'errors',msg:error});
            }else{
                req.flash('success',['Remove Successfully.']);
                res.redirect('/customer/list');
            }
    });*/
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
            req.flash('success',['Added Successfully.']);
			res.redirect('/customer/address/'+req.params.customerId);
        }
    });
};


/**
 * GET /user/list
 * User List - here we need to get both users and customers in seprate columns
 */
exports.userList = (req, res) => {
    if(req.user.role_id != 1 && req.user.role_id != 2){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
       var dateFormat = require('dateformat');
       
       /** For users pagination **/
       var page       = (req.query.page == undefined)?1:req.query.page;
           page       = (page == 0)?1:page;
       var skipRecord = (page-1)*Constants.RECORDS_PER_PAGE;
       
       /** For shop pagination **/
       var pagesecond       = (req.query.pagesecond == undefined)?1:req.query.pagesecond;
           pagesecond       = (pagesecond == 0)?1:pagesecond;
       var skipRecordSecond = (pagesecond-1)*Constants.RECORDS_PER_PAGE;
       
       
        User.find({role_id:6,is_deleted:false},function(error,countAllCustomers){  
            var totalRecord = countAllCustomers.length;
            var totalPage = Math.ceil(totalRecord/Constants.RECORDS_PER_PAGE);
                User.find({role_id:6,is_deleted:false})
                    .limit(Constants.RECORDS_PER_PAGE)
                    .skip(skipRecord)
                    .sort('-_id')
                    .exec(function(error,getCustomers){   

                    User.find({role_id:{$in : [3,4]},is_deleted:false},function(error,countAllUsers){
                        var totalRecordSecond = countAllUsers.length;
                        var totalPageSecond = Math.ceil(totalRecordSecond/Constants.RECORDS_PER_PAGE);
                        User.find({role_id:{$in : [3,4]},is_deleted:false})
                            .limit(Constants.RECORDS_PER_PAGE)
                            .skip(skipRecordSecond)
                            .sort('-_id')
                            .exec(function(error,getUsers){
                        
                            res.render('user/user_list', { title: 'User List',getCustomers:getCustomers,getUsers:getUsers,left_activeClass:5,dateFormat:dateFormat, currentPage:page, totalPage:totalPage, currentPageSecond:pagesecond, totalPageSecond:totalPageSecond});
                        });    
                    });
                    
               });
         });
     }
};



/**
 * GET /signup/vendor
 * Signup user page.
 */
exports.userAdd = (req, res) => {
    if(((req.user.role_id == 3 || req.user.role_id == 4) && req.user.userPermissions.indexOf('57f624d3ed308fea1f7b23c6') == -1)  || req.user.role_id == 6){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        if(req.user.role_id == Constants.MASTERROLE || req.user.role_id == Constants.ADMINROLE){
            var permissionType = 'SHOPADMIN';
        }else{
            var permissionType = 'SHOPUSER';
        }
        Permission.find({type:permissionType},function(error,getPermissions){
            if(getPermissions){
                var flag=true;
                var finalPermission = new Array();
                var takenElement = new Array();
                var taa= 0;
                while(flag){
                    flag = false;
                    for(i=0;i<getPermissions.length;i++){
                        var takenFlag = false;
                        // To check element is already added into final result or not
                        for(var tke = 0; tke < takenElement.length; tke++){
                            if(getPermissions[i]._id == takenElement[tke]){
                                takenFlag = true;
                            }
                        }
                        if(!takenFlag){
                            // If parent id is null then added them on root
                            if(getPermissions[i].parent_id == 0 || getPermissions[i].parent_id == undefined){
                                takenElement.push(getPermissions[i]._id);// Array is used to check the element is added or not
                                var tmp = {};
                                tmp.id = getPermissions[i]._id;
                                tmp.name = getPermissions[i].name;
                                //tmp.parent_id = getPermissions[i].parent_id;
                                tmp.options = new Array();
                                flag = true;
                                finalPermission.push(tmp);
                            }else{
                                for(j=0;j<finalPermission.length;j++){
                                    if(finalPermission[j].id == getPermissions[i].parent_id){
                                        takenElement.push(getPermissions[i]._id);// Array is used to check the element is added or not
                                        var tmp = {};
                                        tmp.id = getPermissions[i]._id;
                                        tmp.name = getPermissions[i].name;
                                        //tmp.parent_id = getPermissions[i].parent_id;
                                        tmp.options = new Array();
                                        flag = true;
                                        finalPermission[j].options.push(tmp);
                                    }
                                    if(finalPermission[j].options.length > 0){
                                        for(m = 0;m < finalPermission[j].options.length; m++){
                                            if(finalPermission[j].options[m].id == getPermissions[i].parent_id){
                                                takenElement.push(getPermissions[i]._id);// Array is used to check the element is added or not
                                                var tmp = {};
                                                tmp.id = getPermissions[i]._id;
                                                tmp.name = getPermissions[i].name;
                                                //tmp.parent_id = getPermissions[i].parent_id;
                                                tmp.options = new Array();
                                                flag = true;
                                                finalPermission[j].options[m].options.push(tmp);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                res.render('user/user_add', { title: 'New User',getPermissions:finalPermission,left_activeClass:5});
            }
        });
    }
};

/**
 * POST /signup/saveuser
 * Save users .
 */

exports.userSave = (req, res) => {
    if(((req.user.role_id == 3 || req.user.role_id == 4) && req.user.userPermissions.indexOf('57f624d3ed308fea1f7b23c6') == -1)  || req.user.role_id == 6){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        uploadShopImages(req,res,function(err) {
             if(err) {
                return res.end("Error uploading file.");
             }
             
            User.findOne({$or: [ { email_id: req.body.email_id.trim() }, { user_name: req.body.user_name.trim()}] }, function(err, existingEmail){
                if(existingEmail){
                    if(existingEmail.email_id == req.body.email_id.trim()){
                        req.flash('errors', ['Email address already exists.']);
                    }else{
                        req.flash('errors', ['Username already exists.']);
                    }
                    if(req.user.role_id == Constants.MASTERROLE || req.user.role_id == Constants.ADMINROLE){
                        var permissionType = 'SHOPADMIN';
                    }else{
                        var permissionType = 'SHOPUSER';
                    }
                    Permission.find({type:permissionType},function(error,getPermissions){
                        if(getPermissions){
                            return res.render('user/user_add',{title: 'New User', data: req.body,getPermissions:getPermissions,left_activeClass:5});
                        }else{
                            var tmp = new Array();
                            return res.render('user/user_add',{title: 'New User', data: req.body,getPermissions:tmp,left_activeClass:5});
                        }
                    });
                }else{
                    var userIns        		= new User();
                    if(req.files.length > 0){
                        for(var i = 0;i < req.files.length;i++){
                            switch(req.files[i].fieldname){
                                case 'cover_image':
                                    userIns.cover_image = req.files[i].path.replace('public','');
                                    break;
                                case 'profile_image':
                                    userIns.profile_image = req.files[i].path.replace('public','');
                                    break;
                            }
                        }
                    }

                    userIns.shop_name   	= req.body.shop_name.trim();
                    userIns.user_name   	= req.body.user_name.trim();
                    userIns.password    	= req.body.password.trim();
                    userIns.email_id       	= req.body.email_id.trim();
                    userIns.first_name  	= req.body.first_name.trim();
                    userIns.last_name   	= req.body.last_name.trim();
                    userIns.contact_no  	= req.body.contact_no.trim();
                    userIns.dob   		= '';
                    userIns.gender   		= '';
                    userIns.bio   		= '';
                    userIns.social_type   	= '';
                    userIns.social_id   	= '';
                    userIns.access_token   	= '';
                    userIns.is_active   	= true;
                    userIns.is_deleted   	= false;
                    userIns.created        	= Date.now();
                    userIns.updated        	= Date.now();

                    userIns.address        	= req.body.address.trim();
                    userIns.city        	= req.body.city.trim();
                    userIns.state        	= req.body.state.trim();
                    userIns.country        	= req.body.country.trim();
                    userIns.zip                 = req.body.zip.trim();
                    userIns.bio                 = req.body.bio.trim();

                    userIns.shop_id = '';
                    userIns.role_id = '';


                    userIns.save(function(error){
                        if(error === null){
                            if(req.user.role_id == Constants.MASTERROLE || req.user.role_id == Constants.ADMINROLE){
                                userIns.shop_id = userIns._id;
                                userIns.role_id = req.body.role_id;
                            }else{
                                userIns.shop_id = req.user.shop_id;
                                userIns.role_id = Constants.SHOP_EMPLOYEE;
                            }

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
                            req.flash('success', ['User information saved successfully.']);
                            if(req.user.role_id == Constants.MASTERROLE || req.user.role_id == Constants.ADMINROLE){
                                return res.redirect('/user/list');
                            }else if(req.user.role_id == 3 || req.user.role_id == 4 || req.user.role_id == 6){
                                return res.redirect('/user/shop_user_list');
                            }
                        }else{
                            req.flash('error', 'Something wrong!!');
                            if(req.user.role_id == Constants.MASTERROLE || req.user.role_id == Constants.ADMINROLE){
                                return res.redirect('/user/list');
                            }else if(req.user.role_id == 3 || req.user.role_id == 4 || req.user.role_id == 6){
                                return res.redirect('/user/shop_user_list');
                            }
                        }
                    }); 
                }
            });
        });
    }
};

/*
 * GET /user/view
 * user view page.
*/
exports.userView = (req, res) => {
	User.findOne({_id:req.params.id},function(error,getUserDetails){
		if(getUserDetails)
		{
			res.render('user/user_view', { title: 'User View',getUserDetails:getUserDetails,activeClass:1,left_activeClass:5});

		}
	});	
};

/*
 * GET /user/Shopview
 * user view page.
*/
exports.shopProfile = (req, res) => {
    User.findOne({_id:req.user._id},function(error,getUserDetails){
        if(getUserDetails){
            res.render('user/shopProfile', { title: 'Shop view',getUserDetails:getUserDetails,activeClass:1,left_activeClass:5});
        }
    });	
};


/**
 * GET /user/edit
 * user view page in edit mode.
 */ 
exports.userEdit = (req, res) => {
    User.findOne({_id:req.params.id},function(error,getUserDetails){
        if(getUserDetails){
            res.render('user/customer_edit', { title: 'Customer Edit',getCustomerDetails:getUserDetails,activeClass:1,left_activeClass:5});
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
			req.flash('success',['Remove Successfully.']);

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
            req.flash('success',['Shipping Saved Successfully.']);
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
            req.flash('success',['Payment Method Saved Successfully.']);
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
			res.render('user/user_product_review', { title: 'User Payment Review',getUserDetails:getUserDetails,activeClass:5,left_activeClass:5});
		}
	});
};

/* User Account */
exports.userAccount = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
		if(getUserDetails)
		{
			res.render('user/user_account', { title: 'User Account',getUserDetails:getUserDetails,activeClass:6,left_activeClass:5});
		}
	});
};

/* User Linked Account */
exports.userLinkedAccount = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
		if(getUserDetails)
		{
			res.render('user/user_linked_account', { title: 'User Linked Account',getUserDetails:getUserDetails,activeClass:7,left_activeClass:5});
		}
	});
};

/* User Notifications */
/*
exports.userNotifications = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
        if(getUserDetails){
            res.render('user/user_notifications', { title: 'User Notifications',getUserDetails:getUserDetails,activeClass:8,left_activeClass:5});
        }
    });
};*/

exports.userNotifications = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
        Notification.findOne({user_id:req.params.userId},function(error,resultRes){
            if(getUserDetails){
                if(resultRes){
                    res.render('user/user_notifications', { title: 'User Notifications',getUserDetails:getUserDetails,activeClass:8,left_activeClass:5,result:resultRes});
                }else{
                    resultRes = { _id: req.params.userId,
                        user_id: req.params.customerId,
                        new_arrival: [],
                        promocode: [],
                        delivery: [],
                        shipped: [],
                        news: [] ,
                        user_id:req.params.customerId
                    };
                    res.render('user/user_notifications', { title: 'User Notifications',getUserDetails:getUserDetails,activeClass:8,left_activeClass:5,result:resultRes});
                }
            }
        });
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
        if(getProfileDetails){
            res.render('user/myprofile_view', { title: 'My Profile',getProfileDetails:getProfileDetails});
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
                        new_arrival: [],
                        promocode: [],
                        delivery: [],
                        shipped: [],
                        news: [] ,
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
				                    	User.findOne({_id:fetchingAllOrderDetails.brand_id},function(error,fetchingShopDetails)
						                {
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


/**
 * POST /user/shopprofileupdate
 * Update user Information
*/
exports.shopPfofileUpdate = (req, res) => {

    /***To create directory if not exist***/
    var fs = require('fs');
    var dirCoverImg = './public/uploads/shop_logo';
    var dirProfileImg = './public/uploads/profile_images';

    if (!fs.existsSync(dirCoverImg)){
        fs.mkdirSync(dirCoverImg);
    }

    if (!fs.existsSync(dirProfileImg)){
        fs.mkdirSync(dirProfileImg);
    }
    
    uploadShopImages(req,res,function(err) {
     if(err) {
        return res.end("Error uploading file.");
     }  
         updateData = {
             //'first_name' 	: req.body.first_name,
             //'last_name'	: req.body.last_name,
             'address'	: req.body.address, 
             'city'          : req.body.city,
             'state'		: req.body.state,
             'zip'		: req.body.zip,
             'country'	: req.body.country,
             'bio'           : req.body.bio,
         };

         if(req.user._id == req.user.shop_id){
             if(req.files.length > 0){
                 for(var i = 0;i < req.files.length;i++){
                     switch(req.files[i].fieldname){
                         case 'cover_image':
                             updateData.cover_image = req.files[i].path.replace('public','');
                             break;
                         case 'profile_image':
                             updateData.profile_image = req.files[i].path.replace('public','');
                             break;
                     }
                 }
             }
         }else{
             if(req.files.length > 0){
                 var updateShopEmployeeData = {};
                 for(var i = 0;i < req.files.length;i++){
                     switch(req.files[i].fieldname){
                         case 'cover_image':
                             updateShopEmployeeData.cover_image = req.files[i].path.replace('public','');
                             break;
                         case 'profile_image':
                             updateData.profile_image = req.files[i].path.replace('public','');
                             break;
                     }
                 }
             }
         }

         if(req.user.role_id == 3 || req.user.role_id == 4){
             updateData.shop_name = req.body.shop_name;
         }
         User.findByIdAndUpdate(req.user._id,updateData, function(error, updateRes){
             if(updateShopEmployeeData!=''){
                 User.update({_id:req.user.shop_id},updateShopEmployeeData,function(error,updateRes){    

                 }); 
             }
             req.flash('success',['Profile updated successfully']);
             res.redirect('/user/shopprofile');
         });
     }); 
};

exports.shopShippingdetail = (req,res) =>{
    ShopShipping.findOne({ shop_id: req.user.shop_id}, function(error, shopShippingRes){
        if(shopShippingRes == null){
            shopShippingRes = [];
        }
        res.render('user/shop_shipping', { title: 'Shop Shipping',activeClass:2,availableShopShipping:shopShippingRes,left_activeClass:5});
    });
}
exports.shopShippingUpdate = (req,res) =>{
    updateData = {
        address     : req.body.address,
        city        :req.body.city,
        zip_code     :req.body.zip_code,
        state    	:req.body.state,
        country    	:req.body.country,
        shipping_account    : req.body.shipping_account,
        shipping_username   : req.body.shipping_username,
        shipping_password   : req.body.shipping_password,
    };

    ShopShipping.update({shop_id:req.user.shop_id},updateData,{upsert:true}, function(error, updateRes){
        if (error){
            req.flash('errors',['Some thing went wronge!']);
        }else{
            req.flash('success',['Shipping address updated successfully.']);
            
        }
        res.redirect('/user/shop_shippping_detail');
    });
}
exports.shop_product_review = (req,res) =>{
    res.render('user/shop_product_review', { title: 'Product review',activeClass:4,left_activeClass:5});
}
exports.shop_linked_account = (req,res) =>{
    res.render('user/shop_linked_account', { title: 'Linked Account',activeClass:6,left_activeClass:5});
}


/* User Account */
exports.shop_account = (req, res) => {
    User.findOne({_id:req.user._id},function(error,getUserDetails){
        if(getUserDetails){
            res.render('user/shop_account', { title: 'User Account',getCustomerDetails:getUserDetails,activeClass:5,left_activeClass:5});
        }
    });
};
/* User Account */
exports.shop_account_update = (req, res) => {
    if((req.user.role_id == 3 || req.user.role_id == 4 || req.user.role_id == 6) && req.user.userPermissions.indexOf('57c052ce43592d87b0e6f616') == -1){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{
        const bcrypt = require('bcrypt-nodejs');
        bcrypt.hash(req.body.password, null, null, function(err, hash) {
            updateData = {
                password  : hash 
            };
            User.update({_id:req.user._id},updateData, function(error, updateRes){
                if (error){
                    req.flash('errors',['Something went wronge!']);
                    res.redirect('/user/shop_account');
                }else{
                    req.flash('success',['Password updated successfully.']);
                    res.redirect('/user/shop_account');
                }
            });
        });
    }
};
exports.shop_notification = (req, res) => {
    //res.render('user/shop_linked_account', { title: 'Linked Account',activeClass:7,left_activeClass:5});
    Notification.findOne({user_id:req.user._id},function(error,resultRes){
        if(resultRes){
            res.render('user/shop_notification', { title: 'Shop User notification',activeClass:7, result:resultRes,left_activeClass:5 });
        }else{
            resultRes = {
                new_arrival: [],
                promocode: [],
                delivery: [],
                shipped: [],
                news: [] ,
            };
            res.render('user/shop_notification', { title: 'Shop User notification',activeClass:7,result:resultRes,left_activeClass:5 });
        }
    });
    
};

exports.shop_notification_update = (req, res) => {
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
    }
    
    if(req.body.shipped != undefined && req.body.shipped.length > 0){
        if(req.body.shipped[0] == 'mail' || req.body.shipped[1] == 'mail'){
            updateData.shipped.push('mail');
        }
    }
    
    if(req.body.deliver != undefined && req.body.deliver.length > 0){
        if(req.body.deliver[0] == 'mail' || req.body.deliver[1] == 'mail'){
            updateData.delivery.push('mail');
        }
    }
    
    if(req.body.promo != undefined && req.body.promo.length > 0){
        if(req.body.promo[0] == 'mail' || req.body.promo[1] == 'mail'){
            updateData.promocode.push('mail');
        }
        
    }
    if(req.body.news != undefined  && req.body.news.length > 0){
        if(req.body.news[0] == 'mail' || req.body.news[1] == 'mail'){
            updateData.news.push('mail');
        }
    }
    Notification.update({user_id:req.user._id},updateData,{upsert:true},function(error,updateRes){
        if(updateRes){
            req.flash('success',['Notification updated successfully!']);
            res.redirect('/user/shop_notification'); 
        }
    });
};


exports.shop_payment_method = (req, res) => {
    res.render('user/shop_payment_method', { title: 'Shop User notification',activeClass:3,availablePaymentMethod:'',left_activeClass:5 });
}
exports.shop_user_list = (req, res) => {
    var page = (req.query.page == undefined)?1:req.query.page;
    page = (page == 0)?1:page;
    var skipRecord = (page-1)*Constants.RECORDS_PER_PAGE;
    User.count({shop_id:req.user.shop_id},function(err, totalRecord) {
        var totalPage = Math.ceil(totalRecord/Constants.RECORDS_PER_PAGE);
        User.find({shop_id:req.user.shop_id})
            .limit(Constants.RECORDS_PER_PAGE)
            .skip(skipRecord)
            .sort('-_id')
            .exec(function(error,userRes){
                res.render('user/shop_user_list', { title: 'Shop User list',activeClass:1,result:userRes, left_activeClass:5,currentPage:page,  totalPage:totalPage});
        });
    });
}


exports.shop_user_view = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,userRes){
        if(req.user.role_id == Constants.MASTERROLE || req.user.role_id == Constants.ADMINROLE){
            var permissionType = 'SHOPADMIN';
        }else{
            var permissionType = 'SHOPUSER';
        }
	Permission.find({type:permissionType})
            .sort('parent_id')
            .exec(function(error,getPermissions){
            if(getPermissions){
                var flag=true;
                var finalPermission = new Array();
                var takenElement = new Array();
                var taa= 0;
                while(flag){
                    flag = false;
                    for(i=0;i<getPermissions.length;i++){
                        var takenFlag = false;
                        // To check element is already added into final result or not
                        for(var tke = 0; tke < takenElement.length; tke++){
                            if(getPermissions[i]._id == takenElement[tke]){
                                takenFlag = true;
                            }
                        }
                        if(!takenFlag){
                            // If parent id is null then added them on root
                            if(getPermissions[i].parent_id == 0){
                                takenElement.push(getPermissions[i]._id);// Array is used to check the element is added or not
                                var tmp = {};
                                tmp.id = getPermissions[i]._id;
                                tmp.name = getPermissions[i].name;
                                //tmp.parent_id = getPermissions[i].parent_id;
                                tmp.options = new Array();
                                flag = true;
                                finalPermission.push(tmp);
                            }else{
                                for(j=0;j<finalPermission.length;j++){
                                    if(finalPermission[j].id == getPermissions[i].parent_id){
                                        takenElement.push(getPermissions[i]._id);// Array is used to check the element is added or not
                                        var tmp = {};
                                        tmp.id = getPermissions[i]._id;
                                        tmp.name = getPermissions[i].name;
                                        //tmp.parent_id = getPermissions[i].parent_id;
                                        tmp.options = new Array();
                                        flag = true;
                                        finalPermission[j].options.push(tmp);
                                    }
                                    if(finalPermission[j].options.length > 0){
                                        for(m = 0;m < finalPermission[j].options.length; m++){
                                            if(finalPermission[j].options[m].id == getPermissions[i].parent_id){
                                                takenElement.push(getPermissions[i]._id);// Array is used to check the element is added or not
                                                var tmp = {};
                                                tmp.id = getPermissions[i]._id;
                                                tmp.name = getPermissions[i].name;
                                                //tmp.parent_id = getPermissions[i].parent_id;
                                                tmp.options = new Array();
                                                flag = true;
                                                finalPermission[j].options[m].options.push(tmp);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                UserPermission.find({user_id:req.params.userId},function(error,userPerRes){
                    var finalUserPremission = [];
                    if(userPerRes){
                        for(var i=0;i < userPerRes.length;i++){
                            finalUserPremission.push(userPerRes[i].permission_id);
                        }
                    }
                    res.render('user/shop_user_view', { title: 'Shop User View',activeClass:1,result:userRes,left_activeClass:5,getPermissions:finalPermission,userPermission:finalUserPremission});
                });
            }
        });
    });
}



exports.shop_payment_method = (req, res) => {
    PaymentMethod.findOne({ user_id: req.user.shop_id}, function(error, resRes){
        if(resRes == null){
            resRes = [];
        }
        res.render('user/shop_payment_method', { title: 'Shop Payment',activeClass:3,availablePaymentMethod:resRes,left_activeClass:5});
    });
};
/**
 * POST /user/paymentMethod/save/
 * User payment Method save
 */
exports.shop_payment_method_save = (req, res) => {
    updateData = {
        user_id  : req.user.shop_id,// Shop id of the Shop
        payment_type : req.body.payment_type,
        paypal_email : req.body.paypal_email,
        venmo_email   : req.body.venmo_email,
        direct_deposit_bank_name : req.body.direct_deposit_bank_name,
        direct_deposit_account_no : req.body.direct_deposit_account_no,
        direct_deposit_routing_no : req.body.direct_deposit_routing_no
    }
    PaymentMethod.update({user_id:req.user.shop_id},updateData,{upsert: true },function(error,paymentMethodObject){
        if (error){
            req.flash('errors',['Something went wronge!']);
        }else{
            req.flash('success',['Payment information saved successfully!']);
            res.redirect('/user/shop_payment_method');
        }
    });
};



exports.shopuser_profile = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,userRes){
        res.render('user/shopuser_profile', { title: 'Shop User Profile',activeClass:1,result:userRes,left_activeClass:5});
    });
}


exports.shopuser_profile_update = (req, res) => {
    updateData = {
        'first_name' 	: req.body.first_name.trim(),
        'last_name'	: req.body.last_name.trim(),
        'address'	: req.body.address.trim(),
        'city'		: req.body.city.trim(),
        'state'		: req.body.state.trim(),
        'zip'           : req.body.zip.trim(),
        'country'	: req.body.country.trim(),
        'bio'           : req.body.bio.trim()
    };
    User.findByIdAndUpdate(req.body.userId,updateData, function(error, updateRes){
        if(error == null){
            req.flash('errors',['Something went wronge!']);
        }else{
            req.flash('success',['User profile saved successfully!']);
        }
        res.redirect('/user/shopuser_profile/'+req.body.userId);
    });
}


exports.shopuser_notification_update = (req, res) => {
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
    }
    
    if(req.body.shipped != undefined && req.body.shipped.length > 0){
        if(req.body.shipped[0] == 'mail' || req.body.shipped[1] == 'mail'){
            updateData.shipped.push('mail');
        }
    }
    
    if(req.body.deliver != undefined && req.body.deliver.length > 0){
        if(req.body.deliver[0] == 'mail' || req.body.deliver[1] == 'mail'){
            updateData.delivery.push('mail');
        }
    }
    
    if(req.body.promo != undefined && req.body.promo.length > 0){
        if(req.body.promo[0] == 'mail' || req.body.promo[1] == 'mail'){
            updateData.promocode.push('mail');
        }
        
    }
    if(req.body.news != undefined  && req.body.news.length > 0){
        if(req.body.news[0] == 'mail' || req.body.news[1] == 'mail'){
            updateData.news.push('mail');
        }
    }
    Notification.update({user_id:req.body.userId},updateData,{upsert:true},function(error,updateRes){
        if(updateRes){
            req.flash('success',['Shopuser notification updated successfully!']);
            res.redirect('/user/shopuser_notification/'+req.body.userId); 
        }
    });
}



exports.shopuser_notification = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
        Notification.findOne({user_id:req.params.userId},function(error,resultRes){
            if(getUserDetails){
                if(resultRes){
                    res.render('user/shopuser_notification', { title: 'User Notifications',result:getUserDetails,activeClass:3,left_activeClass:5,notificationRes:resultRes});
                }else{
                    resultRes = { _id: req.params.userId,
                        user_id: req.params.customerId,
                        new_arrival: [],
                        promocode: [],
                        delivery: [],
                        shipped: [],
                        news: [] ,
                        user_id:req.params.customerId
                    };
                    res.render('user/shopuser_notification', { title: 'User Notifications',result:getUserDetails,activeClass:3,left_activeClass:5,notificationRes:resultRes});
                }
            }
        });
    });
};



/* User Account */
exports.shopuser_account = (req, res) => {
    User.findOne({_id:req.params.userId},function(error,getUserDetails){
        if(getUserDetails){
            res.render('user/shopuser_account', { title: 'User Account',result:getUserDetails,activeClass:2,left_activeClass:5});
        }
    });
};
/* User Account */
exports.shopuser_account_update = (req, res) => {
    const bcrypt = require('bcrypt-nodejs');
    bcrypt.hash(req.body.password, null, null, function(err, hash) {
        updateData = {
            password  : hash 
        };
        User.update({_id:req.body.userId},updateData, function(error, updateRes){
            if (error){
                req.flash('errors',['Something went wronge!']);
                
            }else{
                req.flash('success',['Password updated successfully.']);
            }
            res.redirect('/user/shopuser_account/'+req.body.userId);
        });
    });
};


/* Update Shop Log */
exports.updateShopLogo = (req, res) => {
    
    /***To create directory if not exist***/
    var fs = require('fs');
    var dirShopLogo = './public/uploads/shop_logo';
    if (!fs.existsSync(dirShopLogo)){
        fs.mkdirSync(dirShopLogo);
    }
    
    uploadShopImages(req,res,function(err) {
        if(err) {
           return res.end("Error uploading file.");
        }
        updateData = {};
        if(req.files.length > 0){
            var fileName = req.files[0].path.replace('public','');
            updateData.shop_logo = fileName;
            User.update({_id:req.user._id},updateData, function(error, updateRes){
                if (error){
                    req.flash('errors',['Something went wronge!']);

                }else{
                    req.flash('success',['Shop Logo updated successfully.']);
                }
                return res.redirect('/dashboard');
            });
        }else{
            req.flash('errors',['There is no any file is selected']);
            return res.redirect('/dashboard');
        }
    });
};


exports.updateShopProfile = (req, res) => {
    if(req.user.role_id == 6){
        req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
        res.redirect('/user/shopprofile');
    }else{    
        uploadShopImages(req,res,function(err) {
            if(err) {
                return res.end("Error uploading file.");
            }
            var userId = req.body.user_id;
            User.findOne({_id:{$ne:userId},$or: [ { email_id: req.body.email_id }, { user_name: req.body.user_name}] }, function(err, existingEmail){
                if(existingEmail){
                    if(existingEmail.email_id == req.body.email_id){
                        req.flash('errors', ['Email address already exists.']);
                    }else{
                        req.flash('errors', ['Username already exists.']);
                    }
                    return res.redirect('/user/shop_user_view/'+userId);

                }else{
                    var updateData = {};
                    if(req.files.length > 0){
                        for(var i = 0;i < req.files.length;i++){
                            switch(req.files[i].fieldname){
                                case 'cover_image':
                                    updateData.cover_image = req.files[i].path.replace('public','');
                                    break;
                                case 'profile_image':
                                    updateData.profile_image = req.files[i].path.replace('public','');
                                    break;
                            }
                        }
                    }
                    updateData.shop_name   	= req.body.shop_name;
                    updateData.user_name   	= req.body.user_name;
                    updateData.first_name  	= req.body.first_name;
                    updateData.last_name   	= req.body.last_name;
                    updateData.email_id       	= req.body.email_id;                
                    updateData.contact_no  	= req.body.contact_no;


                    updateData.address        	= req.body.address;
                    updateData.city        	= req.body.city;
                    updateData.state        	= req.body.state;
                    updateData.country        	= req.body.country;
                    updateData.zip             = req.body.zip;
                    updateData.bio             = req.body.bio;
                    updateData.updated        	= Date.now();


                    User.update({_id:userId},updateData,function(error){
                        if(error === null){
                            // Delete previous permission
                            UserPermission.remove({user_id:userId},function(error,delRes){
                                //-- save user permissions 
                                if(req.body.permissions){
                                    for(var i=0; i<req.body.permissions.length; i++){
                                        var userPermission = new UserPermission();
                                        userPermission.user_id = userId;
                                        userPermission.permission_id = req.body.permissions[i];
                                        userPermission.created = Date.now();
                                        userPermission.save();
                                    }
                                }
                                // Get the get template content for 'registration' and call the helper to send the email         
                                /*EmailTemplate.findOne({template_type:'registration'},function(error,getTemplateDetail){
                                    if(getTemplateDetail != null){
                                        var registerTemplateContent = getTemplateDetail.content;
                                        //dynamicTemplateContent= registerTemplateContent.replace(/{first_name}/gi, userIns.first_name).replace(/{last_name}/gi, userIns.last_name);
                                        dynamicTemplateContent = registerTemplateContent.replace(/{customer_name}/gi, userIns.first_name);
                                        if(dynamicTemplateContent){
                                            CommonHelper.emailTemplate(getTemplateDetail.subject, dynamicTemplateContent, userIns._id);      
                                        }
                                    }
                                });*/
                                // Send SMS Using Twilio API to perticular user mobile number
                                if((updateData.contact_no!='') && isNaN(updateData.contact_no)){
                                    //CommonHelper.sendSms(req, res, smsContent, userId);
                                }
                                req.flash('success', ['User information updated successfully.']);
                                return res.redirect('/user/shop_user_view/'+userId);
                            });
                        }else{
                            req.flash('error', 'Something wrong!!');
                            return res.redirect('/user/shop_user_view/'+userId);
                        }
                    });
                }
            });
        });  
    }
};

/* Remove Product */
exports.removeUsersAndShop = (req, res) => {
    updateData = {is_deleted:true};
    
    User.update({$or: [ { _id: {$in:req.body.deleteUserArr} }, { shop_id:{$in: req.body.deleteUserArr}}]},updateData, function(error, removeUserId){
        if(error == null){
            req.flash('success',['User removed successfully!']);
            res.send({status:'success',data:['Remove Successfully.']});
        }else{
            req.flash('errors',['Something went wronge!']);
            res.send({status:'error',data:error});
        }
    });
};
