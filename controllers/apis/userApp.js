/*
	@author : Cis Team
	@date : 10-Aug-2016
	@File : Create User from Application

*/

/* Load required library */
const NodeMailer 		= require('nodemailer');
const Passport 			= require('passport');
const Multer 			= require('multer');
const User 				= require('../../models/userApp');
const ForgetPassword	= require('../../models/forgetPassword');
const Constants 		= require('../../constants/constants');
const UserDetails 		= require('../../models/usersDetails');


/* Define Folder name where our user porfile stored */
var storage =   Multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/uploads/profile_images');
  },
  filename: function (req, file, callback) {
  	var realname = file.originalname.replace(/ /g,"_");
    callback(null, Date.now() + '_' + realname);
  }
});
/* Create Instance for upload folder */
var Profileimage = Multer({ storage : storage}).single('image');


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
					var userIns        		= new User();
					userIns.role_id    		= Constants.CUSTOMERROLE;
					userIns.user_name   	= req.body.user_name;
					userIns.password    	= req.body.password;
				    userIns.email_id       	= req.body.email_id;
					userIns.first_name  	= req.body.first_name;
				    userIns.last_name   	= req.body.last_name;
				    userIns.contact_no  	= '';
				    userIns.dob   			= '';
				    userIns.gender   		= req.body.gender;
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
							// SendMailToUser(req.body);
							return res.json({"status":'success',"msg":'Your details is successfully stored.',"newId":userIns._id});
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
				forgetPasswordIns	 			= new ForgetPassword();
				forgetPasswordIns.email 		= req.body.email;
				forgetPasswordIns.send_token 	= new Buffer.from(req.body).toString('base64');
				forgetPasswordIns.send_time		= Date.now();
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
						var userIns         = new User();
						userIns.password 	= req.body.password;
						userIns.updated     = Date.now();
						userIns.save(function(error){
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
* GET /api/customer/fetchuserdetails/:userId
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
  		updateData = {
			'password' 	: req.body.password,
			'first_name': req.body.first_name,
		    'last_name'	: req.body.last_name,
		    'gender'	: req.body.gender,
		    'dob'		: req.body.dob,
		    'updated'	: Date.now()
		};

  		User.findByIdAndUpdate(req.body.userId,updateData, function(error, updateExistingVals)
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
						updateUserDetailsData = 
						{
							'shr_fb' 	: req.body.shr_fb,
							'shr_tw'	: req.body.shr_tw,
						    'shr_intg'	: req.body.shr_intg,
						    'enable_filter'	: req.body.enable_filter,
						    'updated'	: Date.now()
						};
						UserDetails.findByIdAndUpdate(req.body.userId,updateUserDetailsData, function(error, updateExistingVals)
  						{
  							return res.json({"status":'success',"msg":'Your details is successfully Updated.'});
  						});
					}
					else 
					{
						var userDetailsIns  	= new UserDetails();
						userDetailsIns.shr_fb 	= req.body.shr_fb;
						userDetailsIns.shr_tw 	= req.body.shr_fb;
						userDetailsIns.shr_intg = req.body.shr_fb;
						userDetailsIns.enable_filter = req.body.shr_fb;
						userDetailsIns.save(function(error){
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


function signUpFromSocial(req,res,constants)
{

	var email_id = (req.body.email_id) ?  req.body.email_id : '';
	var userIns        		= new User();
	userIns.role_id    		= Constants.CUSTOMERROLE;
	userIns.user_name   	= '';
	userIns.password    	= '';
    userIns.email       	= email_id;
	userIns.first_name  	= '';
    userIns.last_name   	= '';
    userIns.contact_no  	= '';
    userIns.dob   			= '';
    userIns.gender   		= '';
    userIns.bio   			= '';
    userIns.cover_image		= '';
    userIns.profile_image   = '';
    userIns.social_type   	= constants ;
    userIns.social_id   	= req.body.userid;
    userIns.access_token   	= req.body.token;
    userIns.is_active   	= true;
    userIns.is_deleted   	= false;
    userIns.created        	= Date.now();
    userIns.updated        	= '';

    userIns.save(function(error){
		if(error)
		{	
			return res.json({"status":'error',"msg":error});
		}
		else 
		{
			// SendMailToUser(req.body);
			return res.json({"status":'success',"msg":'Your details is successfully stored.',"newId":userIns._id});
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
				signUpFromSocial(req,res,Constants.FACEBOOKLOGIN);
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
				signUpFromSocial(req,res,Constants.FACEBOOKLOGIN);
			}
		});
	}
	else 
	{
		return res.json({"status":'error',"msg":'Device Token is not available.'});
	}	
}



/**
* POST /api/customer/coverimage
* Process to update cover image.
*/

exports.postCoverImage = function(req,res)
{
	if(req.body.device_token !== '')
  	{
  		Profileimage(req,res,function(err) 
		{
			if(err) {
	            return res.end(err);
	        }
	        var newCIPath = req.file.path.replace('public/','');

			updateData = {
			    'cover_image'	: newCIPath,
			    'updated'		: Date.now()
			};

	  		User.findByIdAndUpdate(req.body.user_id,updateData, function(error, updateExistingCI)
	  		{
	  			if(updateExistingCI)
	  			{
	  				return res.json({"status":'success',"msg":'Successfully update your cover Image'});
	  			}
	  			else 
	  			{
	  				return res.json({"status":'error',"msg":error});
	  			}
	  		});
	  	});
  	}
	else 
	{
		return res.json({"status":'error',"msg":'Device Token is not available.'});
	}	
}

/**
* POST /api/customer/Profileimage
* Process to update Profile image.
*/

exports.postProfileImage = function(req,res)
{
	if(req.body.device_token !== '')
  	{
		Profileimage(req,res,function(err) 
		{
	        if(err) {
	            return res.end(err);
	        }

	  		var newDpPath = req.file.path.replace('public/','');

			updateProfileImage = {
			    'profile_image'	: newDpPath,
			    'updated'		: Date.now()
			};

	  		User.findByIdAndUpdate(req.body.user_id,updateProfileImage, function(error, updateExistingDP)
	  		{
	  			if(updateExistingDP)
	  			{
	  				return res.json({"status":'success',"msg":'Successfully update your profile image'});
	  			}
	  			else 
	  			{
	  				return res.json({"status":'error',"msg":error});
	  			}
	  		});
  		});
  	}
	else 
	{
		return res.json({"status":'error',"msg":'Device Token is not available.'});
	}		
}

/**
* POST /api/customer/bio
* Process to update bio.
*/

exports.postBioImage = function(req,res)
{
	if(req.body.device_token !== '')
  	{
		updateBioData = {
		    'bio'	 : req.body.dob,
		    'updated': Date.now()
		};

		User.findByIdAndUpdate(req.params.user_id,updateBioData, function(error, updateExistingBio)
		{
			if(updateExistingBio)
			{	
				return res.json({"status":'success',"msg":'Your Bio updated successfully.'});
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

/**
* POST /api/saveusercofiguration
* Process to Save user configuration from Application.
*/

exports.saveUserCofiguration = function(req,res)
{
	UserDetails.findOne({user_id:req.body.user_id},function(error,fetchUserConfigDetails)
	{
		if(fetchUserConfigDetails)
		{ 
			userConfigDetails = {
			    'user_id'	 	: req.body.user_id,
			    'configDetail'	: req.body.configDetail  //Array
			};
			UserDetails.findByIdAndUpdate(fetchUserConfigDetails._id,userConfigDetails, function(error, updateConfigDetails){
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
			var userDetailsIns  			= new UserDetails();
			userDetailsIns.user_id 			= req.body.user_id;
			userDetailsIns.configDetail 	= req.body.configDetail;
			
			userDetailsIns.save(function(error){
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
function sendMailToUser (user, done) 
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




