const async           = require('async');
const Order           = require('../models/orders');
const User           = require('../models/userApp');
const Like           = require('../models/like');
const Constants       = require('../constants/constants');
const dateFormat = require('dateformat');
/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  if((req.user.role_id == 3 || req.user.role_id == 4 || req.user.role_id == 6) && req.user.userPermissions.indexOf('57c04c7043592d87b0e6f5f9') == -1){
      req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
      res.redirect('/user/shopprofile');
  }else{
    res.render('home/dashboard', {
      title: 'Home',
      left_activeClass:1,
    });
  }
};


exports.land = (req, res) => {
  res.render('home/land', {
    title: 'Home',
    left_activeClass:1
  });
};

/*exports.emailsubscribe = (req, res) => {
  console.log(req.body);
};*/