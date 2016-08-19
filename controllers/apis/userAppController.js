/*
	@author : Cis Team
	@date : 10-Aug-2016
	@File : Create User from Application

*/

/* Load required library */
const nodemailer 		= require('nodemailer');
const passport 			= require('passport');
const User 				= require('../../models/AppUser');
const ForgetPassword	= require('../../models/ForgetPassword');
const constants 		= require('../../constants/constants');
const UserDetails 		= require('../../models/UsersDetails');


/* Manually Sign Up from Application */
exports.postSignupManually = function(req,res)
{
  res.render('user', {
    title: 'Create Account'
  });
}

/**
 * POST /api/customer/SignupManuallySave
 * Process the Manually Sign Up from Application.
 */

exports.postSignupManuallySave = function(req,res)
{
  if(req.body.device_token !== '')
  {
	User.findOne({ email_id: req.body.email_id }, function(err, existingEmail){
		if(existingEmail) 
		{
			return res.json({"status":'error',"msg":'Email address already exists.'});
		} 
		else 
		{
			User.findOne({ user_name: req.body.user_name }, function(err, existingUserName) {
				if (existingUserName) 
				{
					return res.json({"status":'error',"msg":'Username already exists.'});
				}
				else 
				{
					var UserIns        		= new User();
					UserIns.role_id    		= constants.CUSTOMERROLE;
					UserIns.user_name   	= req.body.user_name;
					UserIns.password    	= req.body.password;
				    UserIns.email_id       	= req.body.email_id;
					UserIns.first_name  	= req.body.first_name;
				    UserIns.last_name   	= req.body.last_name;
				    UserIns.contact_no  	= '';
				    UserIns.dob   			= '';
				    UserIns.gender   		= req.body.gender;
				    UserIns.bio   			= '';
				    UserIns.cover_image		= '';
				    UserIns.profile_image   = '';
				    UserIns.social_type   	= '';
				    UserIns.social_id   	= '';
				    UserIns.access_token   	= '';
				    UserIns.is_active   	= true;
				    UserIns.is_deleted   	= false;
				    UserIns.created        	= Date.now();
				    UserIns.updated        	= '';

				    UserIns.save(function(error){
						if(error === null)
						{	
							// SendMailToUser(req.body);
							return res.json({"status":'success',"msg":'Your details is successfully stored.',"newId":UserIns._id});
						}
						else 
						{
							return res.json({"status":'error',"msg":error});
						}
				    }); 
				}
			});
		}

	});
  }
  else 
  {
    return res.json({"status":'error',"msg":'Device Token is not available.'});
  }
  
}


/**
* POST /api/customer/login
* Process to Login Manually
*/

exports.postLoginManually = function(req,res)
{
	if(req.body.device_token !== '')
  	{
  		User.findOne({ user_name: req.body.user_name,password: req.body.password}, function(error, checkForLogin) {
  			if(checkForLogin)
  			{
				return res.json({"status":'success',"msg":'Successfully login.',user_id:checkForLogin._id});
  			}
  			else 
  			{
  				return res.json({"status":'error',"msg":error});
  			}

  		});
  	}
	else 
	{
		return res.json({"status":'error',"msg":'Device Token is not available.'});
	}
}

/* Check username for unique*/

/*function checkUsername(req,res) 
{
	User.findOne({ user_name: req.body.user_name }, function(err, existingUserName) {
		if (existingUserName) 
		{
			return res.json({"status":'error',"msg":'Username already exists.'});
		}
		else 
		{
			return true;
		}
	});
}*/

/**
 * POST /api/customer/forgetpassword
 * Process for forget password and send token.
 */

exports.postForgetPassword = function(req,res)
{
	if(req.body.device_token !== '')
  	{
  		User.findOne({ email: req.body.email }, function(err, existingEmail){
			if(existingEmail) 
			{
				ForgetPasswordIns	 			= new ForgetPassword();
				ForgetPasswordIns.email 		= req.body.email;
				ForgetPasswordIns.send_token 	= new Buffer.from(req.body).toString('base64');
				ForgetPasswordIns.send_time		= Date.now();
				// SendMailToUser(req.body);
				// For Decode 
				// Buffer.from(req.body, 'base64').toString('ascii')
			}
			else
			{
				return res.json({"status":'error',"msg":'This Email address is not available.'});
			}
		});
  	}
  	else 
	{
		return res.json({"status":'error',"msg":'Device Token is not available.'});
	}
}

/**
 * POST /api/customer/changePassword
 * Process the Change password with valid token and new password.
 */

exports.postChangePassword = function(req,res)
{
	if(req.body.device_token !== '')
  	{
  		User.findOne({ email: req.body.email }, function(err, existingEmail){
			if(existingEmail) 
			{
				ForgetPassword.findOne({email: req.body.email,send_token:req.body.token},function(err, changePasswordRes){
					if(changePasswordRes)
					{
						var UserIns         = new User();
						UserIns.password 	= req.body.password;
						UserIns.updated     = Date.now();
						UserIns.save(function(error){
							if(error === null)
							{
								return res.json({"status":'success',"msg":'Your Password is successfully changed.'});
								ForgetPassword.remove({_id:changePasswordRes._id},function(){});
							}
						});
					}
					else 
					{
						return res.json({"status":'error',"msg":'Your Token is invalid.'});
					}
				});
			}
			else
			{
				return res.json({"status":'error',"msg":'This Email address is not available.'});
			}
		});
  	}
  	else 
	{
		return res.json({"status":'error',"msg":'Device Token is not available.'});
	}
}

/**
* POST /api/customer/fetchuserdetails/:userId
* Process to Fetch user details.
*/
exports.getUserProfile = function(req,res) 
{
	if(req.params.userId)
	{
		User.findOne({_id:req.params.userId},function(error,fetchSelectedUserDetails)
		{
			if(error)
			{
				return res.json({"status":'error',"msg":error});
			}
			else 
			{
				if(fetchSelectedUserDetails)
				{
					UserDetails.findOne({user_id:req.params.userId},function(error,fetchUserDetails)
					{
						if(error)
						{
							return res.json({"status":'error',"msg":error});
						}
						else 
						{	
							return res.json({"status":'success',"msg":'Fetching your details.',user:fetchSelectedUserDetails,details:fetchUserDetails});	
						}
					});
				}
				else 
				{
					return res.json({"status":'error',"msg":'Unable to find this user.'});
				}
				
			}
		});
	}
	else 
	{
		return res.json({"status":'error',"msg":'Unable to fetch user id.'});
	}
}

/**
* POST /api/customer/updateprofile
* Process to Update change user details.
*/

exports.postUpdateProfile = function(req,res) 
{
	if(req.body.device_token !== '')
  	{	
  		UpdateData = {
			'password' 	: req.body.password,
			'first_name': req.body.first_name,
		    'last_name'	: req.body.last_name,
		    'gender'	: req.body.gender,
		    'dob'		: req.body.dob,
		    'updated'	: Date.now()
		};

  		User.findByIdAndUpdate(req.body.userId,UpdateData, function(error, updateExistingVals)
  		{
			if(error) 
			{
				return res.json({"status":'error',"msg":error});
			}
			else 
			{
				UserDetails.findOne({user_id:req.params.userId},function(error,fetchUserDetails)
				{
					if(fetchUserDetails)
					{
						UpdateUserDetailsData = 
						{
							'shr_fb' 	: req.body.shr_fb,
							'shr_tw'	: req.body.shr_tw,
						    'shr_intg'	: req.body.shr_intg,
						    'enable_filter'	: req.body.enable_filter,
						    'updated'	: Date.now()
						};
						UserDetails.findByIdAndUpdate(req.body.userId,UpdateUserDetailsData, function(error, updateExistingVals)
  						{
  							return res.json({"status":'success',"msg":'Your details is successfully Updated.'});
  						});
					}
					else 
					{
						var UserDetailsIns  	= new UserDetails();
						UserDetailsIns.shr_fb 	= req.body.shr_fb;
						UserDetailsIns.shr_tw 	= req.body.shr_fb;
						UserDetailsIns.shr_intg = req.body.shr_fb;
						UserDetailsIns.enable_filter = req.body.shr_fb;
						UserDetailsIns.save(function(error){
							if(error)
							{	
								return res.json({"status":'error',"msg":error});
							}
							else 
							{
								return res.json({"status":'success',"msg":'Your details is successfully Updated.'});
							}
					    }); 
					}
				});
			}
		});	
  	}
  	else 
  	{
  		return res.json({"status":'error',"msg":'Device Token is not available.'});
  	}
}


/**
* POST /api/customer/create/facebook
* Process to Create User By Facebook.
*/


function SignUpFromSocial(req,res,constants)
{

	var email_id = (req.body.email_id) ?  req.body.email_id : '';
	var UserIns        		= new User();
	UserIns.role_id    		= constants.CUSTOMERROLE;
	UserIns.user_name   	= '';
	UserIns.password    	= '';
    UserIns.email       	= email_id;
	UserIns.first_name  	= '';
    UserIns.last_name   	= '';
    UserIns.contact_no  	= '';
    UserIns.dob   			= '';
    UserIns.gender   		= '';
    UserIns.bio   			= '';
    UserIns.cover_image		= '';
    UserIns.profile_image   = '';
    UserIns.social_type   	= constants ;
    UserIns.social_id   	= req.body.userid;
    UserIns.access_token   	= req.body.token;
    UserIns.is_active   	= true;
    UserIns.is_deleted   	= false;
    UserIns.created        	= Date.now();
    UserIns.updated        	= '';

    UserIns.save(function(error){
		if(error)
		{	
			return res.json({"status":'error',"msg":error});
		}
		else 
		{
			// SendMailToUser(req.body);
			return res.json({"status":'success',"msg":'Your details is successfully stored.',"newId":UserIns._id});
		}
    }); 
}

/**
* POST /api/customer/create/facebook
* Process to Create User By Facebook.
*/

exports.postSignupFacebook = function(req,res)
{
	if(req.body.device_token !== '')
  	{
		User.findOne({ access_token: req.body.token }, function(err, tokenExist){
			if(tokenExist)
			{
				return res.json({"status":'success',"msg":'Got your token',"newId":tokenExist._id});
			}
			else 
			{
				SignUpFromSocial(req,res,constants.FACEBOOKLOGIN);
			}
		});
	}
	else 
	{
		return res.json({"status":'error',"msg":'Device Token is not available.'});
	}	

	
}

/**
* POST /api/customer/create/googleplus
* Process to Create User By GooglePlus.
*/

exports.postSignupGooglePlus = function(req,res)
{
	if(req.body.device_token !== '')
  	{
		User.findOne({ access_token: req.body.token }, function(err, tokenExist){
			if(tokenExist)
			{
				return res.json({"status":'success',"msg":'Got your token',"newId":tokenExist._id});
			}
			else 
			{
				SignUpFromSocial(req,res,constants.FACEBOOKLOGIN);
			}
		});
	}
	else 
	{
		return res.json({"status":'error',"msg":'Device Token is not available.'});
	}	
}



/**
* POST /api/customer/coverimage/:userId
* Process to update cover image.
*/

exports.postCoverImage = function(req,res)
{
	UpdateData = {
	    'cover_image'	: req.params.cover_image,
	    'updated'		: Date.now()
	};

  		User.findByIdAndUpdate(req.body.userId,UpdateData, function(error, updateExistingCI)
  		{

  		});
}

/**
* POST /api/customer/Profileimage/:userId
* Process to update Profile image.
*/

exports.postProfileImage = function(req,res)
{
	UpdateProfileImage = {
	    'profile_image'	: req.params.profile_image,
	    'updated'		: Date.now()
	};

  		User.findByIdAndUpdate(req.body.userId,UpdateProfileImage, function(error, updateExistingDP)
  		{

  		});
}

/**
* POST /api/customer/bio/:userId
* Process to update bio.
*/

exports.postBioImage = function(req,res)
{
	UpdateBioData = {
	    'bio'	 : req.body.dob,
	    'updated': Date.now()
	};

	User.findByIdAndUpdate(req.params.userId,UpdateBioData, function(error, updateExistingBio)
		{
			if(error)
		{	
			return res.json({"status":'error',"msg":error});
		}
		else 
		{
			return res.json({"status":'success',"msg":'Your Bio updated successfully.'});
		}
	});
}

/**
* POST /api/saveusercofiguration
* Process to Save user configuration from Application.
*/

exports.saveUserCofiguration = function(req,res)
{
	UserDetails.findOne({user_id:req.body.userId},function(error,fetchUserConfigDetails)
	{
		if(fetchUserConfigDetails)
		{
			UserConfigDetails = {
			    'user_id'	 	: req.body.userId,
			    'configDetail'	: req.body.configDetail  //Array
			};
			UserDetails.findByIdAndUpdate(req.params.userId,UserConfigDetails, function(error, updateConfigDetails){
				if(error)
				{
					return res.json({"status":'error',"msg":error});
				}
				else 
				{
					return res.json({"status":'success',"msg":'Your configuration successfully updated.'});
				}
			})
		}
		else
		{
			var UserDetailsIns  			= new UserDetails();
			UserDetailsIns.user_id 			= req.body.userId;
			UserDetailsIns.configDetail 	= req.body.configDetail;
			
			UserDetailsIns.save(function(error){
				if(error)
				{
					return res.json({"status":'error',"msg":error});
				}
				else 
				{
					return res.json({"status":'success',"msg":'Your configuration successfully added.'});
				}
			});
		}
	});

	 
}


/* Comman Send mail function for all user purpose */
function SendMailToUser (user, done) 
{
	const transporter = nodemailer.createTransport({
		service: 'SendGrid',
		auth: 
		{
			user: process.env.SENDGRID_USER,
			pass: process.env.SENDGRID_PASSWORD
		}
	});
	const mailOptions = {
		to: user.email,
		from: 'hackathon@starter.com',
		subject: 'Your Hackathon Starter password has been changed',
		text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
	};
		transporter.sendMail(mailOptions, function(err) {
		//req.flash('success', { msg: 'Success! Your password has been changed.' });
		done(err);
	});
}




