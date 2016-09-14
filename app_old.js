/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const sass = require('node-sass-middleware');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'uploads') });

const constants = require('./constants/constants');


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');


/* Application Work Start Cisdev */
const userAppController         = require('./controllers/apis/userApp');
const commonAppController       = require('./controllers/apis/commonApp');
const brandAppController        = require('./controllers/apis/brandApp');
const sizeAppController         = require('./controllers/apis/sizeApp');
const colorAppController        = require('./controllers/apis/colorApp');
const productAppController      = require('./controllers/apis/productApp');
const filterAppController       = require('./controllers/apis/filterApp');
const followAppController       = require('./controllers/apis/followApp');
const cardAppController         = require('./controllers/apis/cardApp');
const addressAppController      = require('./controllers/apis/addressApp');
const privacyAppController      = require('./controllers/apis/privacyApp');
//rameshwer
const cartAppController       = require('./controllers/apis/cartApp');




const brandController          = require('./controllers/brand');
const colorController          = require('./controllers/color');
const sizeController           = require('./controllers/size');
const productController        = require('./controllers/product');
const attributeController      = require('./controllers/attribute');
const categoryController       = require('./controllers/category');
const categorySubController    = require('./controllers/subCategory');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/*
  Commented by Cisdev

app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
}); */

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);



/* User Signup manually from application Cisdev*/

//app.get('/api/customer/create', userAppController.postSignupManually);
app.post('/api/customer/create/save', userAppController.postSignupManuallySave);
app.post('/api/customer/forgotpassword', userAppController.postForgetPassword); // Completed
app.post('/api/customer/changePassword', userAppController.postChangePassword); // Completed

app.get('/api/customer/fetchuserdetails/:userId', userAppController.getUserProfile);
app.post('/api/customer/updateprofile', userAppController.postUpdateProfile);

app.post('/api/customer/coverimage', userAppController.postCoverImage); // Completed
app.post('/api/customer/profileimage', userAppController.postProfileImage); // Completed
app.post('/api/customer/bio', userAppController.postBioImage); // Completed

app.post('/api/customer/login', userAppController.postLoginManually);
app.post('/api/customer/create/facebook', userAppController.postSignupFacebook); // Completed
app.post('/api/customer/create/googleplus', userAppController.postSignupGooglePlus); // Completed

app.post('/api/customer/leavefeedback', commonAppController.postLeaveFeedback); // Completed

app.get('/api/product/like/:userId/:productId',productAppController.likeProductByUser);
app.get('/api/product/wishlist/:userId/:productId',productAppController.wishListProductByUser);
app.get('/api/product/alllike/:userId',productAppController.listOfAllLike);
app.get('/api/product/allwishlist/:userId',productAppController.listOfAllWishlist);
app.get('/api/product/featured/:userId',productAppController.listofAllFeaturedProd);
app.get('/api/product/chkfomoalert/:userId',productAppController.checkFomoAlertAccToUser);
app.get('/api/product/fits/:userId/:config',productAppController.listofAllItFitsProd);
app.get('/api/product/details/:productId',productAppController.productDetailView);
app.post('/api/product/fetchfilter',productAppController.fetchFilterValues);
app.post('/api/product/fetchsort',productAppController.fetchSortValues);
app.get('/api/product/addcartoptions/:productId',productAppController.addCartOptions);



app.get('/api/follow/:userId/:brandId',followAppController.followUnFollowBrand);

app.get('/api/brand/details/:brandId',productAppController.BrandDetailView);
app.get('/api/brand/itfits/:brandId/:userId',productAppController.BrandItFitsProducts);

/* Filter Controller */
app.get('/api/filter/fetchfilter',  filterAppController.fetchFilterOptions);
app.get('/api/filter/category/:catId',  filterAppController.fetchSelectedSubCategory);




app.get('/api/listofbrand',  brandAppController.listOfAllBrand);
app.get('/api/listofsize',  sizeAppController.listOfAllSize);
app.get('/api/size/:sizeId',  sizeAppController.listOfSizeAttribute);
app.get('/api/listofcolor',  colorAppController.listOfAllColor);

app.post('/api/saveusercofiguration',  userAppController.saveUserCofiguration);


/* Card CRUD Section */ // Need isAuthenticated code for check user is loggedin.

app.get('/api/card/list/:userId',  cardAppController.listOfCards);
app.post('/api/card/savecard',  cardAppController.saveCard);
app.post('/api/card/removecard',  cardAppController.removeCard);
app.post('/api/card/editcard',  cardAppController.editCard);
app.post('/api/card/updatecard',  cardAppController.updateCard);



/* Brand CRUD Section */ // Need isAuthenticated code for check user is loggedin.

app.get('/listofbrand',  brandController.listOfBrand);
app.get('/addbrand',  brandController.addBrand);
app.get('/editbrand/:brandId',  brandController.editBrand);
app.post('/savebrand',  brandController.saveBrand);
app.get('/removebrand/:brandId',  brandController.removeBrand);
app.post('/updatebrand',  brandController.updateBrand);

/* Color CRUD Section */ // Need isAuthenticated code for check user is loggedin.

app.get('/listofcolor',  colorController.listOfColor);
app.get('/addcolor',  colorController.addColor);
app.get('/editcolor/:colorId',  colorController.editColor);
app.post('/savecolor',  colorController.saveColor);
app.get('/removecolor/:colorId',  colorController.removeColor);
app.post('/updatecolor',  colorController.updateColor);


/* Size CRUD Section */ // Need isAuthenticated code for check user is loggedin.

app.get('/listofsize',  sizeController.listOfSize);
app.get('/addsize',  sizeController.addSize);
app.get('/editsize/:sizeId',  sizeController.editSize);
app.post('/savesize',  sizeController.saveSize);
app.get('/removesize/:sizeId',  sizeController.removeSize);
app.post('/updatesize',  sizeController.updateSize);

/* Products CRUD Section */ // Need isAuthenticated code for check user is loggedin.

app.get('/listofproducts',  productController.listOfProducts);
app.get('/addproduct',  productController.addProduct);
app.post('/saveproduct',  productController.saveProduct);
app.get('/editproduct/:productId',  productController.editProduct);
app.post('/updateproduct',  productController.updateProduct);
app.get('/removeproduct/:productId',  productController.removeProduct);

app.get('/product/fetchselectedcategory/:catId',  productController.selectedCategory);
app.get('/product/loadattrvalues/:attrId',  productController.loadAttrValues);

/* Category CRUD Section */ // Need isAuthenticated code for check user is loggedin.
app.get('/listofcategories',  categoryController.listOfCategories);
app.get('/addcategory',  categoryController.addCategory);
app.post('/savecategory',  categoryController.saveCategory);
app.get('/editcategory/:catId',  categoryController.editCategory);
app.post('/updatecategory',  categoryController.updateCategory);
app.get('/removecategory/:catId',  categoryController.removeCategory);

/* Sub Category CRUD Section */ // Need isAuthenticated code for check user is loggedin.
app.get('/listofsubcategories',  categorySubController.listOfSubCategories);
app.get('/addsubcategory',  categorySubController.addSubCategory);
app.post('/savesubcategory',  categorySubController.saveSubCategory);
app.get('/editsubcategory/:subcatId',  categorySubController.editSubCategory);
app.post('/updatesubcategory',  categorySubController.updateSubCategory);
app.get('/removesubcategory/:subcatId',  categorySubController.removeSubCategory);



/* Attribute CRUD Section */ // Need isAuthenticated code for check user is loggedin.
app.get('/attribute/list',  attributeController.list);
app.get('/attribute/create',  attributeController.create);
app.get('/attribute/edit/:attributeId',  attributeController.edit);
app.post('/attribute/save',  attributeController.saveAttribute);
app.get('/attribute/delete/:attributeId',  attributeController.deleteAttribute);
app.post('/attribute/update',  attributeController.updateAttribute);


/* Address CRUD Section */
app.post('/api/getUserAddress',addressAppController.getUserAddress);
app.post('/api/addUserAddress',addressAppController.addAddress);
app.post('/api/deleteUserAddress',addressAppController.deleteAddress);
app.post('/api/updateUserAddress',addressAppController.updateAddress);

/* cart CRUD Section */
app.post('/api/showCart',cartAppController.getCartProduct);
app.post('/api/addToCart',cartAppController.addTocart);
app.post('/api/deleteFromCart',cartAppController.deleteFromCart);
app.post('/api/emptyCart',cartAppController.emptyCart);
app.post('/api/updateIntoCart',cartAppController.updateIntoCart);

/* privacy CRUD Section */
app.post('/api/privacy/privacysetting',privacyAppController.privacySettingofUser);
app.get('/api/privacy/fetchprivacysetting/:userId',privacyAppController.fetchPrivacySetting);
app.post('/api/privacy/notificationsetting',privacyAppController.notificationSettingofUser);
app.get('/api/privacy/fetchnotificationsetting/:userId',privacyAppController.fetchNotificationSetting);

/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/aviary', apiController.getAviary);
app.get('/api/steam', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getSteam);
app.get('/api/stripe', apiController.getStripe);
app.post('/api/stripe', apiController.postStripe);
app.get('/api/scraping', apiController.getScraping);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/clockwork', apiController.getClockwork);
app.post('/api/clockwork', apiController.postClockwork);
app.get('/api/foursquare', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFoursquare);
app.get('/api/tumblr', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTumblr);
app.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
app.post('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter);
app.get('/api/linkedin', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getLinkedin);
app.get('/api/instagram', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);
app.get('/api/lob', apiController.getLob);
app.get('/api/upload', apiController.getFileUpload);
app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);
app.get('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPinterest);
app.post('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postPinterest);
app.get('/api/google-maps', apiController.getGoogleMaps);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */
app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/tumblr');
});
app.get('/auth/steam', passport.authorize('openid', { state: 'SOME STATE' }));
app.get('/auth/steam/callback', passport.authorize('openid', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/pinterest', passport.authorize('pinterest', { scope: 'read_public write_public' }));
app.get('/auth/pinterest/callback', passport.authorize('pinterest', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/api/pinterest');
});

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

 
 

module.exports = app;