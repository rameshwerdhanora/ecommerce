/**
 * Module dependencies.
 */
const express = require('express');
//const paginate = require('express-paginate');
//require('mongoose-paginate');

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
//var flash = require('connect-flash');



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

const userAppControlleraAdmin = require('./controllers/userApp');

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
const shippingAppController     = require('./controllers/apis/shippingApp');
const cartAppController         = require('./controllers/apis/cartApp');
const privacyAppController      = require('./controllers/apis/privacyApp');
const orderAppController        = require('./controllers/apis/orderApp');

const brandController          = require('./controllers/brand');
const colorController          = require('./controllers/color');
const sizeController           = require('./controllers/size');
const productController        = require('./controllers/product');
const categoryController       = require('./controllers/category');
const categorySubController    = require('./controllers/subCategory');


const attributeController      = require('./controllers/attribute');
const orderController          = require('./controllers/order');
const emailController          = require('./controllers/emailTemplate');


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
mongoose.Promise = global.Promise;

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


//app.use(paginate.middleware(10, 50));

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
app.get('/api/product/details/:productId/:userId',productAppController.productDetailView);
app.post('/api/product/fetchfilter',productAppController.fetchFilterValues);
app.post('/api/product/fetchsort',productAppController.fetchSortValues);
app.get('/api/product/addcartoptions/:productId',productAppController.addCartOptions);

app.post('/api/product/filterupdate',productAppController.saveFilter);
app.post('/api/product/sortupdate',productAppController.saveSort);
app.get('/api/product/fetchfilter/:brandId/:userId',productAppController.fetchFilterValues);

app.get('/api/follow/:userId/:brandId',followAppController.followUnFollowBrand);
app.get('/api/listoffollow/:userId',followAppController.listOfFollowUser);

app.get('/api/brand/details/:brandId',productAppController.BrandDetailView);
app.get('/api/brand/itfits/:brandId/:userId',productAppController.BrandItFitsProducts);

/* Filter Controller */
app.get('/api/filter/fetchfilter',  filterAppController.fetchFilterOptions);
app.get('/api/filter/category/:catId',  filterAppController.fetchSelectedSubCategory);
app.post('/api/product/fetchcheck',  productAppController.fetchcheck);


app.post('/api/showCart',  cartAppController.getCartProduct);
app.post('/api/addTocart',  cartAppController.addTocart);
app.post('/api/deleteFromCart',  cartAppController.deleteFromCart);
app.post('/api/emptyCart',  cartAppController.emptyCart);
app.post('/api/updateIntoCart',  cartAppController.updateIntoCart);
app.get('/api/cart/mycart/:userId',  cartAppController.myCartWithBrands)
app.get('/api/cart/showcartaccbrand/:userId/:brandId',  cartAppController.showCartAccBrand);
app.post('/api/order/saveorder',orderAppController.saveUserFinalOrder)

app.get('/api/listofbrand',  brandAppController.listOfAllBrand);
app.get('/api/listofsize',  sizeAppController.listOfAllSize);
app.get('/api/size/:sizeId',  sizeAppController.listOfSizeAttribute);
app.get('/api/listofcolor',  colorAppController.listOfAllColor);

app.get('/api/size/fetchcofiguration/:userId',  sizeAppController.fetchCofiguration);
app.get('/api/size/fetchselectedsize/:sizeId/:userId',  sizeAppController.fetchSelectedSize);


app.post('/api/saveusercofiguration',  userAppController.saveUserCofiguration);



/* Card CRUD Section */ // Need isAuthenticated code for check user is loggedin.

app.get('/api/card/list/:userId',  cardAppController.listOfCards);
app.post('/api/card/savecard',  cardAppController.saveCard);
app.post('/api/card/removecard',  cardAppController.removeCard);
app.post('/api/card/editcard',  cardAppController.editCard);
app.post('/api/card/updatecard',  cardAppController.updateCard);



app.get('/brand/list/:brandId?',  brandController.listOfBrand);
//app.get('/brand/add',  brandController.addBrand);
app.post('/brand/save',  brandController.saveBrand);


//app.get('/brand/edit/:brandId',  brandController.editBrand);
app.post('/brand/update',  brandController.updateBrand);
app.get('/brand/delete/:brandId',  brandController.removeBrand);

/* Address CRUD Section */
app.post('/api/getUserAddress',addressAppController.getUserAddress);
app.post('/api/addUserAddress',addressAppController.addAddress);
app.post('/api/deleteUserAddress',addressAppController.deleteAddress);
app.post('/api/updateUserAddress',addressAppController.updateAddress);


/* Color CRUD Section */ // Need isAuthenticated code for check user is loggedin.
app.get('/color/list/:colorId?',  colorController.listOfColor);
//app.get('/color/add',  colorController.addColor);
app.get('/color/edit/:colorId',  colorController.editColor);
app.post('/color/save',  colorController.saveColor);
app.get('/color/delete/:colorId',  colorController.removeColor);
app.post('/color/update',  colorController.updateColor);


/* Size CRUD Section */ // Need isAuthenticated code for check user is loggedin.
app.get('/size/list',  sizeController.listOfSize);
app.get('/size/add',  sizeController.addSize);
app.get('/size/edit/:sizeId',  sizeController.editSize);
app.post('/size/save',  sizeController.saveSize);
app.get('/size/delete/:sizeId',  sizeController.removeSize);
app.post('/size/update',  sizeController.updateSize);


/* Products CRUD Section */ // Need isAuthenticated code for check user is loggedin.
app.get('/product/list/:productId?',  productController.listOfProducts);
app.post('/product/getAttrib',  productController.getAttrib);
app.get('/product/add',  productController.addProduct);
app.post('/product/save',  productController.saveProduct);
app.get('/product/edit/:productId',  productController.editProduct);
app.post('/product/update',  productController.updateProduct);
app.get('/product/delete/:productId',  productController.removeProduct);
app.get('/product/fetchselectedcategory/:catId',  productController.selectedCategory);
app.get('/product/loadattrvalues/:attrId',  productController.loadAttrValues);


/* Category CRUD Section */ // Need isAuthenticated code for check user is loggedin.
//app.get('/category/list',  categoryController.listOfCategories);
//app.get('/category/list/:categoryId?',  categoryController.listOfCategories);
app.get('/category/list/:categoryId?/:subCatFlag?',  categoryController.listOfCategories);
app.get('/category/add',  categoryController.addCategory);
app.post('/category/save',  categoryController.saveCategory);
app.get('/category/edit/:catId',  categoryController.editCategory);
app.post('/category/update',  categoryController.updateCategory);
app.get('/category/delete/:catId',  categoryController.removeCategory);


/* Sub Category CRUD Section */ // Need isAuthenticated code for check user is loggedin.
//app.get('/subcategory/list',  categorySubController.listOfSubCategories);
//app.get('/subcategory/add',  categorySubController.addSubCategory);
app.post('/subcategory/save',  categorySubController.saveSubCategory);
//app.get('/subcategory/edit/:subcatId',  categorySubController.editSubCategory);
app.post('/subcategory/update',  categorySubController.updateSubCategory);
//app.get('/subcategory/delete/:subcatId',  categorySubController.removeSubCategory);

/* Attribute CRUD Section */ // Need isAuthenticated code for check user is loggedin.
app.get('/attribute', passportConfig.isAuthenticated,  attributeController.list);
app.get('/attribute/list', passportConfig.isAuthenticated,  attributeController.list);
app.get('/attribute/add', passportConfig.isAuthenticated,  attributeController.create);
app.get('/attribute/edit/:attributeId', passportConfig.isAuthenticated,  attributeController.edit);
app.post('/attribute/save', passportConfig.isAuthenticated,  attributeController.saveAttribute);
app.get('/attribute/delete/:attributeId', passportConfig.isAuthenticated,  attributeController.deleteAttribute);
app.post('/attribute/update', passportConfig.isAuthenticated,  attributeController.updateAttribute);
/* 31 Aug */
app.post('/attribute/getOptions', passportConfig.isAuthenticated,  attributeController.getAttributeOptions);
app.post('/attribute/deleteAttibOption', passportConfig.isAuthenticated,  attributeController.deleteAttributeOption);
app.post('/attribute/updateAttribOption', passportConfig.isAuthenticated,  attributeController.updateAttributeOption);
app.post('/attribute/addAttribOption', passportConfig.isAuthenticated,  attributeController.addAttributeOption);


/* Order */
app.get('/order/list',  orderController.list);
app.get('/order/detail',  orderController.detail);

app.get('/emailtemplate/list',  emailController.list);
app.post('/emailtemplate/save',  emailController.saveTemplate);
app.get('/emailtemplate/add',  emailController.addTemplate);
app.get('/emailtemplate/edit/:templateId',  emailController.edit);
app.post('/emailtemplate/update',  emailController.update);

 
/* Signup users */
// app.get('/signup/user',  userAppControlleraAdmin.signupUser);
// app.post('/signup/saveuser',  userAppControlleraAdmin.saveUser);

/* Customer */
app.get('/customer/list',  userAppControlleraAdmin.customerList);
app.get('/customer/view/:id',  userAppControlleraAdmin.customerView);
app.get('/customer/edit/:id',  userAppControlleraAdmin.customerEdit);
app.post('/customer/update',  userAppControlleraAdmin.customerUpdate);
app.get('/customer/delete/:customerId',  userAppControlleraAdmin.customerDelete);
app.get('/customer/changePassword/:customerId',  userAppControlleraAdmin.customerChangePassword);
app.post('/customer/changePasswordSave',  userAppControlleraAdmin.customerChangePasswordSave);
app.get('/customer/notification/:customerId',  userAppControlleraAdmin.notification);
app.post('/customer/saveNotification',  userAppControlleraAdmin.saveNotification);
app.get('/customer/linkedAccounts/:customerId',  userAppControlleraAdmin.linkedAccounts);
app.post('/customer/saveLinkedAccounts',  userAppControlleraAdmin.saveLinkedAccounts);

app.get('/customer/accounts/:customerId',  userAppControlleraAdmin.accounts);
app.get('/customer/productPreview/:customerId',  userAppControlleraAdmin.productPreview);
app.get('/customer/order/:customerId',  userAppControlleraAdmin.order);
app.get('/customer/payments/:customerId',  userAppControlleraAdmin.payments);
app.get('/customer/address/:customerId',  userAppControlleraAdmin.customerAddressList);
app.post('/customer/address/save/:customerId',  userAppControlleraAdmin.customerAddressSave);



/* Address CRUD Section */
/*app.post('/api/getUserAddress',addressAppController.getUserAddress);
app.post('/api/addUserAddress',addressAppController.addAddress);
app.post('/api/deleteUserAddress',addressAppController.deleteAddress);
app.post('/api/updateUserAddress',addressAppController.updateAddress);*/

/* cart CRUD Section */
/*app.post('/api/showCart',cartAppController.getCartProduct);
app.post('/api/addToCart',cartAppController.addTocart);
app.post('/api/deleteFromCart',cartAppController.deleteFromCart);
app.post('/api/emptyCart',cartAppController.emptyCart);
app.post('/api/updateIntoCart',cartAppController.updateIntoCart);*/

/* privacy CRUD Section */
app.post('/api/privacy/privacysetting',privacyAppController.privacySettingofUser);
app.get('/api/privacy/fetchprivacysetting/:userId',privacyAppController.fetchPrivacySetting);
app.post('/api/privacy/notificationsetting',privacyAppController.notificationSettingofUser);
app.get('/api/privacy/fetchnotificationsetting/:userId',privacyAppController.fetchNotificationSetting);

/* MY Profile */
app.get('/myprofile/:id',  userAppControlleraAdmin.myProfile);

/* Users pages */
app.get('/user/list',  userAppControlleraAdmin.userList);
app.get('/user/add',  userAppControlleraAdmin.userAdd);
app.post('/user/save',  userAppControlleraAdmin.userSave);
app.get('/user/view/:id',  userAppControlleraAdmin.userView);
app.get('/user/edit/:id',  userAppControlleraAdmin.userEdit);
app.post('/user/update',  userAppControlleraAdmin.userUpdate);
app.get('/user/delete/:userId',  userAppControlleraAdmin.userDelete);
app.get('/user/shipping/:userId',  userAppControlleraAdmin.userShipping);
app.post('/user/shipping/save/:userId',  userAppControlleraAdmin.userShippingSave);
app.get('/user/paymentMethod/:userId',  userAppControlleraAdmin.userPaymentMethod);
app.post('/user/paymentMethod/save/:userId',  userAppControlleraAdmin.userPaymentMethodSave);
app.get('/user/order/:userId',  userAppControlleraAdmin.userOrder);
app.get('/user/reviews/:userId',  userAppControlleraAdmin.userProductReview);
app.get('/user/account/:userId',  userAppControlleraAdmin.userAccount);
app.get('/user/linkedAccount/:userId',  userAppControlleraAdmin.userLinkedAccount);
app.get('/user/notifications/:userId',  userAppControlleraAdmin.userNotifications);

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
app.get('/api/getShippingRate', shippingAppController.getShppingRate);




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

app.use(function(req, res) {
      res.status(404);
     res.render('404.jade', {title: '404: Page Not found'});
  });
  
  // Handle 500
  app.use(function(error, req, res, next) {
      res.status(500);
     res.render('500.jade', {title:'500: Internal Server Error', error: error});
  });
//app.use(errorHandler());


/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
module.exports = app;
