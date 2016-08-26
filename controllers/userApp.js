const User = require('../models/userApp');

/**
 * GET /signup/vendor
 * Signup user page.
 */
exports.signupUser = (req, res) => {
  res.render('user/create', {
    title: 'Signup'
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
			var userIns        		= new User();
			userIns.role_id    		= req.body.role_id;
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

