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
const tagController          =   require('./controllers/tag');


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
app.set('port', process.env.PORT || 8081);
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

app.get('/dashboard', homeController.index);
app.get('/', homeController.land);

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
app.post('/api/customer/changeuserpasswordfromprofile', userAppController.changeUserPasswordFromProfile); // Completed

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

app.get('/api/brand/details/:brandId/:userId',productAppController.BrandDetailView);
app.get('/api/brand/itfits/:brandId/:userId',productAppController.BrandItFitsProducts);

/* Filter Controller */
app.get('/api/filter/fetchfilter',  filterAppController.fetchFilterOptions);
app.get('/api/filter/category/:catId',  filterAppController.fetchSelectedSubCategory);
app.post('/api/product/fetchcheck',  productAppController.fetchcheck);
app.post('/api/product/discount',  productAppController.discountApply); // 27-09-2016



app.post('/api/showCart',  cartAppController.getCartProduct);
app.post('/api/addTocart',  cartAppController.addTocart);
app.post('/api/deleteFromCart',  cartAppController.deleteFromCart);
app.post('/api/emptyCart',  cartAppController.emptyCart);
app.post('/api/updateIntoCart',  cartAppController.updateIntoCart);
app.get('/api/cart/mycart/:userId',  cartAppController.myCartWithBrands)
app.post('/api/cart/showcartaccbrand',  cartAppController.showCartAccBrand);
app.post('/api/cart/finalcheckoutdisplay',  cartAppController.finalCheckoutDisplay);
app.post('/api/order/saveorder',orderAppController.saveUserFinalOrder)
app.get('/api/order/listoforder/:userId',  orderAppController.listOfOrderWithStatus);
app.get('/api/order/orderdetails/:orderId',  orderAppController.detailsOfSelectedOrder); // 22-09-2016
app.post('/api/order/refund',  orderAppController.refundRequest); // 27-09-2016



app.get('/api/listofbrand',  brandAppController.listOfAllBrand);
app.get('/api/listofsize',  sizeAppController.listOfAllSize);
app.get('/api/size/:sizeId',  sizeAppController.listOfSizeAttribute);
app.get('/api/listofcolor',  colorAppController.listOfAllColor);

app.get('/api/size/fetchcofiguration/:userId',  sizeAppController.fetchCofiguration);
app.get('/api/size/fetchselectedsize/:sizeId/:userId',  sizeAppController.fetchSelectedSize);
app.post('/api/size/updateusersizes', sizeAppController.updateUserSizes);


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
app.get('/color/list/:colorId?', passportConfig.isAuthenticated,  colorController.listOfColor);
//app.get('/color/add',  colorController.addColor);
app.get('/color/edit/:colorId', passportConfig.isAuthenticated,  colorController.editColor);
app.post('/color/save', passportConfig.isAuthenticated,  colorController.saveColor);
app.get('/color/delete/:colorId', passportConfig.isAuthenticated,  colorController.removeColor);
app.post('/color/update', passportConfig.isAuthenticated,  colorController.updateColor);


/* Size CRUD Section */ // Need isAuthenticated code for check user is loggedin.
app.get('/size/list', passportConfig.isAuthenticated,  sizeController.listOfSize);
app.get('/size/add', passportConfig.isAuthenticated,  sizeController.addSize);
app.get('/size/edit/:sizeId', passportConfig.isAuthenticated,  sizeController.editSize);
app.post('/size/save', passportConfig.isAuthenticated,  sizeController.saveSize);
app.get('/size/delete/:sizeId', passportConfig.isAuthenticated,  sizeController.removeSize);
app.post('/size/update', passportConfig.isAuthenticated,  sizeController.updateSize);


/* Products CRUD Section */ // Need isAuthenticated code for check user is loggedin.
app.get('/product/list/:productId?', passportConfig.isAuthenticated,  productController.listOfProducts);
app.post('/product/getAttrib', passportConfig.isAuthenticated,  productController.getAttrib);
app.get('/product/add', passportConfig.isAuthenticated,  productController.addProduct);
app.post('/product/save', passportConfig.isAuthenticated,  productController.saveProduct);
app.get('/product/edit/:productId', passportConfig.isAuthenticated,  productController.editProduct);
app.post('/product/update', passportConfig.isAuthenticated,  productController.updateProduct);
app.get('/product/delete/:productId', passportConfig.isAuthenticated,  productController.removeProduct);
app.get('/product/fetchselectedcategory/:catId', passportConfig.isAuthenticated,  productController.selectedCategory);
app.get('/product/loadattrvalues/:attrId', passportConfig.isAuthenticated,  productController.loadAttrValues);
app.post('/product/updatediscount', passportConfig.isAuthenticated,  productController.updateDiscount);
app.post('/product/delete-shop-product', passportConfig.isAuthenticated,  productController.removeShopProduct);


/* Category CRUD Section */ // Need isAuthenticated code for check user is loggedin.
//app.get('/category/list',  categoryController.listOfCategories);
//app.get('/category/list/:categoryId?',  categoryController.listOfCategories);
app.get('/category/list/:categoryId?/:subCatFlag?', passportConfig.isAuthenticated,  categoryController.listOfCategories);
app.get('/category/add', passportConfig.isAuthenticated,  categoryController.addCategory);
app.post('/category/save', passportConfig.isAuthenticated,  categoryController.saveCategory);
app.get('/category/edit/:catId', passportConfig.isAuthenticated,  categoryController.editCategory);
app.post('/category/update', passportConfig.isAuthenticated,  categoryController.updateCategory);
app.get('/category/delete/:catId', passportConfig.isAuthenticated,  categoryController.removeCategory);


/* Sub Category CRUD Section */ // Need isAuthenticated code for check user is loggedin.
//app.get('/subcategory/list',  categorySubController.listOfSubCategories);
//app.get('/subcategory/add',  categorySubController.addSubCategory);
app.post('/subcategory/save', passportConfig.isAuthenticated,  categorySubController.saveSubCategory);
//app.get('/subcategory/edit/:subcatId',  categorySubController.editSubCategory);
app.post('/subcategory/update', passportConfig.isAuthenticated,  categorySubController.updateSubCategory);
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
app.get('/order/list', passportConfig.isAuthenticated,  orderController.list);
app.get('/order/detail/:orderId', passportConfig.isAuthenticated,  orderController.detail);

app.get('/emailtemplate/list', passportConfig.isAuthenticated,  emailController.list);
app.post('/emailtemplate/save', passportConfig.isAuthenticated,  emailController.saveTemplate);
app.get('/emailtemplate/add', passportConfig.isAuthenticated,  emailController.addTemplate);
app.get('/emailtemplate/edit/:templateId', passportConfig.isAuthenticated,  emailController.edit);
app.post('/emailtemplate/update', passportConfig.isAuthenticated,  emailController.update);

app.get('/tag/test',passportConfig.isAuthenticated,  tagController.test);
app.get('/tag/list',passportConfig.isAuthenticated,  tagController.list);
app.get('/tag/add', passportConfig.isAuthenticated, tagController.add);

app.post('/tag/save', passportConfig.isAuthenticated, tagController.save);
app.post('/tag/update', passportConfig.isAuthenticated, tagController.update);
app.get('/tag/edit/:tagId', passportConfig.isAuthenticated, tagController.edit);


/* Signup users */
// app.get('/signup/user',  userAppControlleraAdmin.signupUser);
// app.post('/signup/saveuser',  userAppControlleraAdmin.saveUser);

/* Customer */
app.get('/customer/list', passportConfig.isAuthenticated,  userAppControlleraAdmin.customerList);
app.get('/customer/view/:id', passportConfig.isAuthenticated,  userAppControlleraAdmin.customerView);
app.get('/customer/edit/:id', passportConfig.isAuthenticated,  userAppControlleraAdmin.customerEdit);
app.post('/customer/update', passportConfig.isAuthenticated,  userAppControlleraAdmin.customerUpdate);
app.get('/customer/delete/:customerId', passportConfig.isAuthenticated,  userAppControlleraAdmin.customerDelete);
app.get('/customer/changePassword/:customerId', passportConfig.isAuthenticated,  userAppControlleraAdmin.customerChangePassword);
app.post('/customer/changePasswordSave/:customerId', passportConfig.isAuthenticated,  userAppControlleraAdmin.customerChangePasswordSave);
app.get('/customer/notification/:customerId', passportConfig.isAuthenticated,  userAppControlleraAdmin.notification);
app.post('/customer/saveNotification', passportConfig.isAuthenticated,  userAppControlleraAdmin.saveNotification);
app.get('/customer/linkedAccounts/:customerId', passportConfig.isAuthenticated,  userAppControlleraAdmin.linkedAccounts);
app.post('/customer/saveLinkedAccounts', passportConfig.isAuthenticated,  userAppControlleraAdmin.saveLinkedAccounts);

app.get('/customer/accounts/:customerId', passportConfig.isAuthenticated,  userAppControlleraAdmin.accounts);
app.get('/customer/productPreview/:customerId', passportConfig.isAuthenticated,  userAppControlleraAdmin.productPreview);
app.get('/customer/order/:customerId', passportConfig.isAuthenticated,  userAppControlleraAdmin.order);
app.get('/customer/payments/:customerId', passportConfig.isAuthenticated,  userAppControlleraAdmin.payments);
app.get('/customer/address/:customerId', passportConfig.isAuthenticated,  userAppControlleraAdmin.customerAddressList);
app.post('/customer/address/save/:customerId', passportConfig.isAuthenticated,  userAppControlleraAdmin.customerAddressSave);




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
app.get('/myprofile/:id', passportConfig.isAuthenticated,  userAppControlleraAdmin.myProfile);

/* Users pages */

app.get('/user/shopprofile', passportConfig.isAuthenticated, userAppControlleraAdmin.shopProfile);
app.post('/user/shopprofileupdate', passportConfig.isAuthenticated, userAppControlleraAdmin.shopPfofileUpdate);

app.get('/user/shop_shippping_detail', passportConfig.isAuthenticated, userAppControlleraAdmin.shopShippingdetail);
app.post('/user/update_shop_shipping_detail', passportConfig.isAuthenticated, userAppControlleraAdmin.shopShippingUpdate);

app.get('/user/shop_product_review', passportConfig.isAuthenticated, userAppControlleraAdmin.shop_product_review);
app.get('/user/shop_linked_account', passportConfig.isAuthenticated, userAppControlleraAdmin.shop_linked_account);

app.get('/user/shop_account', passportConfig.isAuthenticated, userAppControlleraAdmin.shop_account);
app.post('/user/shop_account_update', passportConfig.isAuthenticated, userAppControlleraAdmin.shop_account_update);

app.get('/user/shop_notification', passportConfig.isAuthenticated, userAppControlleraAdmin.shop_notification);
app.post('/user/shop_notification_update', passportConfig.isAuthenticated, userAppControlleraAdmin.shop_notification_update);
app.get('/user/shop_payment_method', passportConfig.isAuthenticated, userAppControlleraAdmin.shop_payment_method);
app.get('/user/shop_user_list', passportConfig.isAuthenticated, userAppControlleraAdmin.shop_user_list);
app.get('/user/shop_user_view/:userId', passportConfig.isAuthenticated, userAppControlleraAdmin.shop_user_view);
app.get('/user/shop_payment_method', passportConfig.isAuthenticated, userAppControlleraAdmin.shop_payment_method);
app.post('/user/shop_payment_method_save', passportConfig.isAuthenticated, userAppControlleraAdmin.shop_payment_method_save);

app.get('/user/shopuser_profile/:userId', passportConfig.isAuthenticated, userAppControlleraAdmin.shopuser_profile);
app.post('/user/shopuser_profile_update', passportConfig.isAuthenticated, userAppControlleraAdmin.shopuser_profile_update);
app.get('/user/shopuser_notification/:userId', passportConfig.isAuthenticated, userAppControlleraAdmin.shopuser_notification);
app.post('/user/shopuser_notification_update', passportConfig.isAuthenticated, userAppControlleraAdmin.shopuser_notification_update);
app.get('/user/shopuser_account/:userId', passportConfig.isAuthenticated, userAppControlleraAdmin.shopuser_account);
app.post('/user/shopuser_account_update', passportConfig.isAuthenticated, userAppControlleraAdmin.shopuser_account_update);


app.get('/user/list', passportConfig.isAuthenticated, userAppControlleraAdmin.userList);
app.get('/user/add',  passportConfig.isAuthenticated,userAppControlleraAdmin.userAdd);
app.post('/user/save',  passportConfig.isAuthenticated,userAppControlleraAdmin.userSave);
app.get('/user/view/:id',  passportConfig.isAuthenticated,userAppControlleraAdmin.userView);
app.get('/user/edit/:id',  passportConfig.isAuthenticated,userAppControlleraAdmin.userEdit);
app.post('/user/update',passportConfig.isAuthenticated,  userAppControlleraAdmin.userUpdate);
app.get('/user/delete/:userId', passportConfig.isAuthenticated, userAppControlleraAdmin.userDelete);
app.get('/user/shipping/:userId', passportConfig.isAuthenticated, userAppControlleraAdmin.userShipping);
app.post('/user/shipping/save/:userId', passportConfig.isAuthenticated, userAppControlleraAdmin.userShippingSave);
app.get('/user/paymentMethod/:userId', passportConfig.isAuthenticated, userAppControlleraAdmin.userPaymentMethod);
app.post('/user/paymentMethod/save/:userId', passportConfig.isAuthenticated, userAppControlleraAdmin.userPaymentMethodSave);

//app.get('/user/order/:userId',  userAppControlleraAdmin.userOrder);
app.get('/user/reviews/:userId', passportConfig.isAuthenticated,  userAppControlleraAdmin.userProductReview);
app.get('/user/account/:userId', passportConfig.isAuthenticated,  userAppControlleraAdmin.userAccount);
app.get('/user/linkedAccount/:userId', passportConfig.isAuthenticated,  userAppControlleraAdmin.userLinkedAccount);
app.get('/user/notifications/:userId', passportConfig.isAuthenticated,  userAppControlleraAdmin.userNotifications);
app.get('/user/changePassword/:userId', passportConfig.isAuthenticated,  userAppControlleraAdmin.userChangePassword);
app.post('/user/changePasswordSave/:userId', passportConfig.isAuthenticated,  userAppControlleraAdmin.userChangePasswordSave);

app.post('/user/updateShopLogo', passportConfig.isAuthenticated,  userAppControlleraAdmin.updateShopLogo);
app.post('/user/delete-users-shop', passportConfig.isAuthenticated,  userAppControlleraAdmin.removeUsersAndShop);


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
