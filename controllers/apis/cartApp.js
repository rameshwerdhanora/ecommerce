/*
	@author : Cis Team
	@date : 10-Aug-2016
	@File : Create User from Application

*/

/* Load required library */
const async             = require('async');
const Constants 	    = require('../../constants/constants');
const Cart              = require('../../models/cart');
const Product           = require('../../models/product');
const Color             = require('../../models/color');
const AttributOption    = require('../../models/attributeOption');
const Attribut          = require('../../models/attribute');
const ProductImage      = require('../../models/productsImages');
const Brand             = require('../../models/brand');
var upsAPI              = require('shipping-ups');


/*
 * Web service to send all the product exist in the cart
 */
function getProduct(pid, callback){
   Product.findOne({_id:pid},function(error,productRes){
       if(error){
           callback(error,new Array());
       }else{
           callback(error,productRes);
        }
   });
}

function getProductColor(cid, callback){
    Color.findOne({_id:cid},function(error,colorRes){
        if(error){
           callback(error,new Array());
        }else{
           callback(error,colorRes);
        }
   });
}
function getOptAttribute(opId, callback){
   AttributOption.find({_id: {$in : opId}},function(error,opRes){
        if(error){
           callback(error,new Array());
        }else{
           callback(error,opRes);
        }
   });
}
function getAttrib(attributIds,callback){
    Attribut.find({_id: {$in : attributIds}},function(error,attribRes){
       if(error){
           callback(error,new Array());
       }else{
           callback(error,attribRes);
        }
   });
}

function fetchingImage(pid, callback){
    ProductImage.findOne({product_id:pid},function(error,fetchallFeatProdsImgs){
        if(error){
            callback(error,'');
        }else{
            callback(error,fetchallFeatProdsImgs.large_image_1);
        }
    });
}

exports.getCartProduct = (req,res) => {
    if(req.body.device_token !== ''){ 
        Cart.find({ user_id: req.body.user_id}, function(error, cartRes) {

            if(cartRes.length){
                var tempCartProduct = [];
                var totalPrice = 0; 
                async.eachSeries(cartRes, function(CproductRes, callback){

                    var pArr = {};
                    pArr._id  = CproductRes._id;
                    pArr.quantity = CproductRes.quantity;
 
                    /* Use asyn Parallel method for waiting those functions value */
                    async.parallel(
                        [
                            function(callback){// To get product name
                                getProduct(CproductRes.product_id, function(err, pres){
                                    if(err){
                                        pArr.name = '';
                                        pArr.sku = '';
                                        pArr.price = 0;
                                    }else{
                                        pArr.name = pres.name;
                                        pArr.sku = pres.sku;
                                        pArr.price = pres.price;
                                        totalPrice+=parseInt(pres.price);
                                    }
                                    
                                    callback(err);
                                });
                            },
                            function(callback){
                                fetchingImage(CproductRes.product_id, function(err, res){
                                    pArr.image  = res;
                                    callback(err);  
                                });
                            },
                            function(callback){// To get product color and color code
                                getProductColor(CproductRes.color_id, function(err, cres){
                                     
                                    if(err){
                                        //pArr.colorcode = '';
                                        pArr.color = '';
                                    }
                                    else if(err == null)
                                    {
                                        pArr.color = '';
                                    }
                                    else
                                    {
                                        //pArr.colorcode = cres.color_code;
                                        pArr.color = cres.color_name;
                                    }
                                    callback(err);
                                });
                            },
                            function(callback){// To get attribut name and option name
                                var optionIds = CproductRes.size;
                                getOptAttribute(optionIds,function(err,opRes){
                                    var tmpAttributeKey = new Array();
                                    var tmpOptionValue = new Array();
                                    for(var kk=0;kk<opRes.length;kk++){
                                        tmpAttributeKey[kk] = opRes[kk].attribute_id;
                                        tmpOptionValue[kk] = opRes[kk].value;
                                    }
                                    var tmpOoptionFinalAr = new Array();
                                    getAttrib(tmpAttributeKey,function(err,attribRes){
                                        for(var i=0;i<tmpAttributeKey.length;i++){
                                            for(j=0;j<attribRes.length;j++){
                                                if(attribRes[j]._id == tmpAttributeKey[i]){
                                                    tmpOoptionFinalAr[i] = new Array();
                                                    tmpOoptionFinalAr[i][0] = attribRes[j].name; 
                                                    tmpOoptionFinalAr[i][1] = tmpOptionValue[i];
                                                }
                                            }
                                        }
                                        pArr.options = tmpOoptionFinalAr;
                                        callback(err);
                                    });
                                    
                                });
                            }
                        ], 
                        function(err){
                            tempCartProduct.push(pArr);
                            callback(err); 
                        }
                    )
                }, 
                function(err){
                  // console.log(temp); //This should give you desired result
                  return res.json({"status":'success',"msg":'Fetch all products.',data:tempCartProduct,'subTotal':totalPrice-(totalPrice-90),'tax':totalPrice-90,'total':totalPrice});
                });
            }else{
                return res.json({"status":'error',"msg":'No product found in your cart.'});
            }
        });
    }else{
        return res.json({"status":'error',"msg":'Device Token is not available.'});
    }
}

/*
 *Web serive to save user address into database 
 */
exports.addTocart = (req,res) => {
    if(req.body.device_token !== ''){
        var cartModel  = new Cart();
        cartModel.user_id = req.body.user_id;
        cartModel.product_id =  req.body.product_id;
        cartModel.brand_id = req.body.brand_id; // We will pass brand_id too
        cartModel.quantity= req.body.quantity;
//         var quamaSepSize = '';
//         var size = req.body.size;
//         for(var i = 0; i<size.length;i++){
//             quamaSepSize+=size[i];
//         }
//         quamaSepSize = quamaSepSize.substring(0, quamaSepSize.length - 1);
        cartModel.size= req.body.size;//Comma separated
        cartModel.color_id= req.body.color_id;
        cartModel.created= new Date();
        cartModel.updated= new Date();
        cartModel.save(function(err,addressObject){
            if (err){
                return res.send({status:'error',error:err});
            }else {
                return res.json({"status":'success',"msg":'Product has been added successfully'});
            }
        });
    }else{
        return res.json({"status":'error',"msg":'Device Token is not available.'});
    }
}


/* Delete address */
exports.deleteFromCart = (req,res) => {
    if(req.body.device_token !== ''){
        Cart.remove({_id:req.body.id, user_id: req.body.user_id},function(error,deleteProduct){
            if(error){
                return res.send({status:'error',msg:error});
            }else{
                return res.send({status:'success',msg:'Product removed from cart.'});
            }
        });
    }else{
        return res.json({"status":'error',"msg":'Device Token is not available.'});
    }
};

/* Delete address */
exports.emptyCart = (req,res) => {
    if(req.body.device_token !== ''){
        Cart.remove({user_id: req.body.user_id},function(error,emptyCartRes){
            if(error){
                return res.send({status:'error',msg:error});
            }else{
                return res.send({status:'success',msg:'Cart has been empty successfully'});
            }
        });
    }else{
        return res.json({"status":'error',"msg":'Device Token is not available.'});
    }
};

/*
 *Web serive to save user address into database 
 */
exports.updateIntoCart = (req,res) => {

    if(req.body.device_token !== ''){

        updateData = {
            quantity : req.body.quantity
        };

        if(req.body.quantity){

            Cart.findByIdAndUpdate(req.body.id,updateData,function(err,updateRes)
            {
                if (err){
                    return res.send({status:'error',error:err});
                }else{
                    return res.json({"status":'success',"msg":'Cart updated successfully',quantity:req.body.quantity});
                }
            });
        }else{// if 0 quantity set then delete the product from the cart.
            Cart.remove({_id:req.body.id, user_id: req.body.user_id},function(error,deleteProduct){
                if(error){
                    return res.send({status:'error',msg:error});
                }else{
                    return res.send({status:'success',msg:'Product removed from cart.'});
                }
            });
        }
    }else{
        return res.json({"status":'error',"msg":'Device Token is not available.'});
    }
}


/**
 * GET /api/cart/mycart/:userId
 * Process for Fetch Brand it fits Product
 */

 exports.myCartWithBrands = (req,res) => {

    Cart.find({user_id:req.params.userId},function(error,fetchAllProductsBrands)
    {
        if(fetchAllProductsBrands.length > 0)
        {
            var finalBrandArr   = new Array();
            var brandArr        = new Array();
            var produArr        = new Array();
            var productPriceArr = new Array();

            for (var b = 0; b < fetchAllProductsBrands.length; b++) 
            {
                brandArr.push(fetchAllProductsBrands[b].brand_id);
                produArr.push(fetchAllProductsBrands[b].product_id);
            }

            uniqueArrayForBrandId = brandArr.filter(function(elem, pos) {
                return brandArr.indexOf(elem) == pos;
            });

            Brand.find({_id:{$in:uniqueArrayForBrandId}},function(error,fetchAllBrandDetails)
            {
                if(fetchAllBrandDetails)
                {
                    async.eachSeries(fetchAllBrandDetails, function(BrandId, callback)
                    {
                        var brandObj = {};
                        brandObj.brand_id   = BrandId._id;
                        brandObj.brand_name = BrandId.brand_name;
                        brandObj.brand_logo = BrandId.brand_logo;

                        async.parallel
                        (
                            [
                                function(callback)
                                {
                                    Cart.find({user_id:req.params.userId,brand_id:BrandId._id},function(err,listOfOtherData)
                                    {
                                        var sumQuantity = 0;
                                        for (var tq = 0; tq < listOfOtherData.length; tq++) 
                                        {   
                                            sumQuantity += parseInt(listOfOtherData[tq].quantity);
                                        }

                                        brandObj.totalQuantity = sumQuantity;
                                        var discount = 0;
                                        var finaldiscount = 0;

                                        var sumPrice = 0;
                                        async.eachSeries(listOfOtherData, function(ProductId, callback)
                                        {   
                                            Product.findOne({_id:ProductId.product_id},function(error,fetchProductPrice)
                                            {
                                                if(ProductId.appliedcoupon == 'yes')
                                                {
                                                    if((fetchProductPrice.price != '') && (fetchProductPrice.dis_name != ''))
                                                    {
                                                       if(fetchProductPrice.dis_type == 'percentage')
                                                        {
                                                            discount = (fetchProductPrice.price  * ProductId.quantity) / 100 * fetchProductPrice.dis_amount;
                                                        }
                                                        else 
                                                        {   
                                                            discount = fetchProductPrice.dis_amount * ProductId.quantity;
                                                        }
                                                    }
                                                    else
                                                    {
                                                        discount = parseInt(0);
                                                    }
                                                }
                                                else 
                                                {
                                                    discount = parseInt(0);
                                                }

                                                finaldiscount += parseFloat(discount);
                                                sumPrice += parseInt(fetchProductPrice.price) * parseInt(ProductId.quantity);
                                                callback(err);
                                            });
                                        },
                                        function(err)
                                        { 
                                           brandObj.finalPrice          = sumPrice;
                                           brandObj.finaldiscount       = finaldiscount;
                                           brandObj.priceafterdiscount  = sumPrice - finaldiscount;
                                           //console.log(brandObj);
                                           callback(err);
                                        });
                                        
                                    });
                                },
                                function(callback)
                                {
                                    
                                    var ups = new upsAPI({
                                        environment: 'sandbox', // or live 
                                        username: 'siteops@etiqett',
                                        password: 'XMm{a+7ad^BMcj7e',
                                        access_key: '1D151DB255A031A8',
                                        imperial: true, // for inches/lbs, false for metric cm/kgs
                                        currency: 'USD',
                                        pretty: false,
                                        //user_agent: 'uh-sem-blee, Co | typefoo',
                                        debug: true
                                    });

                                    var codeAr = {};
                                    codeAr['11'] = 'Standard';
                                    codeAr['03'] = 'Ground';
                                    codeAr['12'] = '3 Day Select';
                                    codeAr['02'] = '2nd Day Air';
                                    codeAr['59'] = '2nd Day Air AM';
                                    codeAr['13'] =  'Next Day Air Saver';
                                    codeAr['01'] = 'Next Day Air';
                                    codeAr['14'] = 'Next Day Air Early A.M.';
                                    codeAr['07'] = 'UPS Worldwide Express';
                                    codeAr['54'] = 'Worldwide Express Plus';
                                    codeAr['08'] = 'UPS Worldwide Expedited';
                                    codeAr['65'] = 'UPS World Wide Saver';
                                    
                                    data = {
                                            pickup_type: 'daily_pickup', // optional, can be: 'daily_pickup', 'customer_counter', 'one_time_pickup', 'on_call_air', 'suggested_retail_rates', 'letter_center', 'air_service_center'
                                            //pickup_type_code: '02', // optional, overwrites pickup_type
                                            customer_classification: '00', // optional, need more details about what this does
                                            shipper: {
                                                name: 'LAST RESORT COLLABORATIONS, LLC',
                                                shipper_number: '', // optional, but recommended for accurate rating
                                                phone_number: '', // optional
                                                fax_number: '', // optional
                                                email_address: '', // optional
                                                tax_identification_number: '', // optional
                                                address: {
                                                  address_line_1: '1439 S RIMHURST AVE',
                                                  city: 'GLENDORA',
                                                  state_code: 'CA',
                                                  country_code: 'US',
                                                  postal_code: '91740'
                                                }
                                            },
                                            ship_to: {
                                                company_name: 'Rameshwer', // or person's name
                                                attention_name: '', // optional
                                                phone_number: '', // optional
                                                fax_number: '', // optional
                                                email_address: '', // optional
                                                tax_identification_number: '', // optional
                                                location_id: '', //optional, for specific locations
                                                address: {
                                                    address_line_1: '3456 Fake Address', // optional
                                                    city: 'Barstow', // optional
                                                    state_code: 'CA', // optional, required for negotiated rates
                                                    country_code: 'US',
                                                    postal_code: '92311',
                                                    residential: true // optional, can be useful for accurate rating
                                                }
                                            },
                                            ship_from: { // optional, use if different from shipper address
                                                company_name: 'LAST RESORT COLLABORATIONS, LLC', // or person's name
                                                attention_name: 'LAST RESORT COLLABORATIONS, LLC',
                                                phone_number: '', // optional
                                                tax_identification_number: '', // optional
                                                address: {
                                                    address_line_1: '1439 S RIMHURST AVE',
                                                    city: 'GLENDORA',
                                                    state_code: 'CA',
                                                    country_code: 'US',
                                                    postal_code: '91740'
                                                }
                                            },
                                            sold_to: { // optional, The person or company who imports and pays any duties due on the current shipment, required if Invoice of NAFTA CO is requested
                                                option: '01', // optional, applies to NAFTA CO form
                                                company_name: 'Company Name', // or person's name
                                                attention_name: 'Attention Name',
                                                phone_number: '', // optional
                                                tax_identification_number: '', // optional
                                                address: {
                                                    address_line_1: '123 Fake Address',
                                                    city: 'Barstow',
                                                    state_code: 'CA',
                                                    country_code: 'US',
                                                    postal_code: '92311'
                                                }
                                            },
                                             packages: 
                                             [
                                                {
                                                    packaging_type: '02', // optional, packaging type code
                                                    weight: 1,
                                                    description: 'My Package', // optional
                                                    delivery_confirmation_type: 2, // optional, 1 or 2
                                                    insured_value: 100.00, // optional, 2 decimals
                                                    dimensions: { // optional, integers: 0-108 for imperial, 0-270 for metric
                                                        length: 12,
                                                        width: 12,
                                                        height: 24
                                                    }
                                                }
                                            ]
                                        } // Data Variable
                                        options = {
                                            //negotiated_rates: false // Optional, but if truthy then the NegotiatedRatesIndicator will always be placed (even without state/province code). Useful for countries without provinces.
                                        }
                                        ups.rates(data,options, function(err, result) {
                                            var mainRes = new Array();
                                            if(result.Response != null)
                                            {
                                                if(result.Response.ResponseStatusCode == 1){
                                                    for(var i = 0;i < result.RatedShipment.length;i++){
                                                        var tempRes = {};
                                                        tempRes.Code = result.RatedShipment[i].Service.Code;
                                                        tempRes.serviceName = codeAr[result.RatedShipment[i].Service.Code];
                                                        //tempRes.BillingWeight  = result.RatedShipment[i].BillingWeight.Weight;
                                                        //tempRes.UnitOfMeasurement  = result.RatedShipment[i].BillingWeight.UnitOfMeasurement.Code;
                                                        //tempRes.TransportationCharges  = result.RatedShipment[i].TransportationCharges.MonetaryValue;
                                                        //tempRes.ServiceOptionsCharges  = result.RatedShipment[i].ServiceOptionsCharges.MonetaryValue;
                                                        tempRes.TotalCharges  = result.RatedShipment[i].TotalCharges.MonetaryValue;
                                                        mainRes.push(tempRes); 
                                                    }
                                                }
                                                brandObj.shipping = mainRes;
                                            }
                                            else 
                                            {
                                                brandObj.shipping = new Array();
                                            }
                                            
                                            
                                            //console.log(mainRes);
                                            callback(err);
                                            //brandObj.shipping = mainRes;
                                            //return res.send({status:'success',msg:'Shiiping Rates are shown in the list',data:mainRes});
                                        });
                                                                     
                                }
                            ],
                            function(err)
                            {
                                
                                finalBrandArr.push(brandObj);
                                callback(err);
                            }
                        );
                        
                    },
                    function(err){
                        return res.json({"status":'success',"msg":'Found your cart data.',finalOrder:finalBrandArr});
                    });
                }
                else 
                {
                     return res.json({"status":'error',"msg":'Unable to found any brands.'});
                }
            })
        }
        else 
        {
            return res.json({"status":'success',"msg":'Your Cart is empty yet.'});
        }

    });

 }

/**
 * POST /api/cart/showcartaccbrand
 * Process for Fetch all products of brand in cart.
 */ 

exports.showCartAccBrand = (req,res) => {

    if(req.body.device_token != '')
    {
        Cart.find({user_id:req.body.user_id,brand_id:req.body.brand_id},function(error,fetchAllProductsOfBrand)
        {
            if(fetchAllProductsOfBrand)
            {
                var tempCartProduct = new Array();
                var totalPrice = 0; 
                var subTotal = 0;
                var priceTotalObj = {}; 
                var discount = 0;
                var finaldiscount = 0;
                var finalPriceWithDis = 0;
                async.eachSeries(fetchAllProductsOfBrand, function(CproductRes, callback)
                {
                    pArr = {}; 
                    pArr._id =  CproductRes._id;
                    pArr.quantity =  CproductRes.quantity;
                    async.parallel
                    (
                        [
                            function(callback)
                            {
                                getProduct(CproductRes.product_id, function(err, pres)
                                {
                                    if(err){
                                        pArr.name = '';
                                        pArr.sku = '';
                                        pArr.price = 0;
                                    }
                                    else
                                    {
                                        pArr.name = pres.name;
                                        pArr.sku = pres.sku;
                                        pArr.realprice = pres.price;
                                        pArr.price = pres.price * CproductRes.quantity;
                                        totalPrice += parseInt(pres.price) * CproductRes.quantity;

                                        if(CproductRes.appliedcoupon == 'yes')
                                        {
                                            if((pres.price != '') && (pres.dis_name != ''))
                                            {
                                                if(pres.dis_type == 'percentage')
                                                {
                                                    discount = (pres.price  * CproductRes.quantity) / 100 * pres.dis_amount;
                                                    pArr.dis_type = '%';
                                                    pArr.dis_rate = pres.dis_amount;
                                                }
                                                else 
                                                {   
                                                    discount = pres.dis_amount * CproductRes.quantity;
                                                    pArr.dis_type = 'flat';
                                                    pArr.dis_rate = pres.dis_amount;
                                                }
                                            }
                                            else 
                                            {
                                                discount = '';
                                                pArr.dis_type = '';
                                                pArr.dis_rate = 0;
                                            }
                                        }
                                        else 
                                        {
                                            discount = '';
                                            pArr.dis_type = '';
                                            pArr.dis_rate = 0;
                                        }
                                        pArr.discountprice = discount;
                                        finaldiscount += discount;
                                    }
                                        
                                        callback(err);
                                });
                            },
                            function(callback)
                            {
                                fetchingImage(CproductRes.product_id, function(err, res)
                                {
                                    pArr.image  = res;
                                    callback(err);  
                                });
                            },
                            function(callback)
                            {
                                getProductColor(CproductRes.color_id, function(err, cres)
                                {  
                                    if(cres)
                                    {
                                        pArr.color = cres.color_name;
                                    }
                                    else
                                    {
                                        pArr.color = '';
                                    }
                                    callback(err);
                                });
                            },
                            function(callback)
                            {// To get attribut name and option name
                                var optionIds = CproductRes.size;
                                getOptAttribute(optionIds,function(err,opRes){
                                    var tmpAttributeKey = new Array();
                                    var tmpOptionValue = new Array();
                                    for(var kk=0;kk<opRes.length;kk++){
                                        tmpAttributeKey[kk] = opRes[kk].attribute_id;
                                        tmpOptionValue[kk] = opRes[kk].value;
                                    }
                                    var tmpOoptionFinalAr = new Array();
                                    getAttrib(tmpAttributeKey,function(err,attribRes){
                                        for(var i=0;i<tmpAttributeKey.length;i++){
                                            for(j=0;j<attribRes.length;j++){
                                                if(attribRes[j]._id == tmpAttributeKey[i]){
                                                    tmpOoptionFinalAr[i] = new Array();
                                                    tmpOoptionFinalAr[i][0] = attribRes[j].name; 
                                                    tmpOoptionFinalAr[i][1] = tmpOptionValue[i];
                                                }
                                            }
                                        }
                                        pArr.options = tmpOoptionFinalAr;
                                        callback(err);
                                    });
                                });
                            }
                        ],
                        function(err)
                        {
                            subTotal            += parseInt(totalPrice);
                            finalPriceWithDis   = finaldiscount;
                            //pArr.subTotal   = parseInt(totalPrice);
                            tempCartProduct.push(pArr);
                            callback(err); 
                        }
                    ) 
                },
                function(err)
                {   
                    // console.log(req.body);

                    priceTotalObj.tax           = (subTotal > 0) ? parseInt(10) : parseInt(0);
                    priceTotalObj.ship_code     = req.body.shipping_array[req.body.index].Code;
                    priceTotalObj.servicename   = req.body.shipping_array[req.body.index].serviceName;
                    priceTotalObj.totalcharges  = parseInt(req.body.shipping_array[req.body.index].TotalCharges);
                    priceTotalObj.totaldiscount = finalPriceWithDis;
		    priceTotalObj.subtotal      = subTotal;
                    priceTotalObj.totalprice    = subTotal + parseInt(priceTotalObj.tax) + parseInt(priceTotalObj.totalcharges);

                    
                    //priceTotalObj.totalcharges  = '6.95'
                    priceTotalObj.finalTotal    = subTotal + parseInt(priceTotalObj.tax) + parseInt(priceTotalObj.totalcharges) - finalPriceWithDis;

                     

                    return res.json({"status":'success',"msg":'List of all products of selected brand.',tempCartProduct:tempCartProduct,shipping_array:req.body.shipping_array,priceTotalObj:priceTotalObj});
                });
            } 
            else 
            {
                return res.json({"status":'error',"msg":'Unable to found any product for this brand.'});
            }
        });
    }
    else 
    {
        return res.json({"status":'error',"msg":'Device token is not avaible.'})
    }
};

/**
 * POST /api/cart/finalcheckoutdisplay
 * Process for Fetch all products of brand in cart.
 */  

exports.finalCheckoutDisplay = (req,res) => {
    
    if(req.body.device_token != '')
    { 
        Cart.find({user_id:req.body.user_id},function(error,fetchAllProductsWithBrands)
        {
            if(fetchAllProductsWithBrands)
            {
                var finalBrandArr   = new Array();
                var brandArr        = new Array();
                var produArr        = new Array();
                var productPriceArr = new Array();

                for (var b = 0; b < fetchAllProductsWithBrands.length; b++) 
                {
                    brandArr.push(fetchAllProductsWithBrands[b].brand_id);
                    produArr.push(fetchAllProductsWithBrands[b].product_id);
                }

                uniqueArrayForBrandId = brandArr.filter(function(elem, pos) {
                    return brandArr.indexOf(elem) == pos;
                });

                 
                Brand.find({_id:{$in:uniqueArrayForBrandId}},function(error,fetchAllBrandDetails)
                {
                    if(fetchAllBrandDetails)
                    {
                        var finalPrice = 0;
                        var finalquantity = 0; 
                        var index = 0;
                        var TotalShippingCharges = 0;
                        var finalDiscount = 0;

                        async.eachSeries(fetchAllBrandDetails, function(BrandId, callback)
                        {
                            //var req.body.shipping_array[index] = []; 
                            var brandObj = {};
                            brandObj.brand_id       = BrandId._id;
                            brandObj.brand_name     = BrandId.brand_name;
                            brandObj.brand_logo     = BrandId.brand_logo;
                            brandObj.ship_code      = req.body.shipping_array[index].Code;
                            brandObj.servicename    = req.body.shipping_array[index].serviceName;
                            brandObj.totalcharges   = parseInt(req.body.shipping_array[index].TotalCharges);

                            async.parallel
                            (
                                [
                                    function(callback)
                                    {
                                        Cart.find({user_id:req.body.user_id,brand_id:BrandId._id},function(err,listOfOtherData)
                                        {
                                            console.log(listOfOtherData);
                                            var sumQuantity = 0;
                                            for (var tq = 0; tq < listOfOtherData.length; tq++) 
                                            {   
                                                sumQuantity += parseInt(listOfOtherData[tq].quantity);
                                                
                                            }

                                            brandObj.totalQuantity = sumQuantity;

                                            var sumPrice = 0;
                                            var discount = 0;
                                            var finaldiscount = 0;

                                            async.eachSeries(listOfOtherData, function(ProductId, callback)
                                            {   
                                                Product.findOne({_id:ProductId.product_id},function(error,fetchProductPrice)
                                                {
                                                    if(ProductId.appliedcoupon == 'yes')
                                                    {
                                                        if((fetchProductPrice.price != '') && (fetchProductPrice.dis_name != ''))
                                                        {
                                                            if(fetchProductPrice.dis_type == 'percentage')
                                                            {
                                                                discount = (fetchProductPrice.price  * ProductId.quantity) / 100 * fetchProductPrice.dis_amount;
                                                            }
                                                            else 
                                                            {   
                                                                discount = fetchProductPrice.dis_amount * ProductId.quantity;
                                                            }
                                                        }
                                                        else 
                                                        {
                                                            discount = '';
                                                        }
                                                    }
                                                    else 
                                                    {
                                                        discount = '';
                                                    }
                                                    
                                                    finaldiscount += discount;
                                                    sumPrice += parseInt(fetchProductPrice.price) * parseInt(ProductId.quantity);
                                                    callback(err);
                                                });
                                            },
                                            function(err)
                                            {
                                                //console.log(finaldiscount); 
                                                brandObj.finalPrice          = sumPrice;
                                                brandObj.finaldiscount       = finaldiscount;
                                                brandObj.priceafterdiscount  = sumPrice - finaldiscount;
                                                callback(err);
                                            });
                                            
                                        });
                                    }
                                ],
                                function(err)
                                {
                                    finalDiscount += parseFloat(brandObj.finaldiscount) ;
                                    finalPrice += brandObj.finalPrice;
                                    finalquantity += brandObj.totalQuantity;
                                    TotalShippingCharges +=  brandObj.totalcharges;
                                    finalBrandArr.push(brandObj);
                                    callback(err);
                                }
                            );
                        index++; 
                        },
                        function(err){
                            var tax = (parseInt(finalPrice) > 0) ? parseInt(10) : parseInt(0);
                            var totalCartPrice = parseInt(finalPrice) + parseInt(tax) + parseInt(TotalShippingCharges) - finalDiscount;
                            return res.json({"status":'success',"msg":'Found your cart data.',
                                finalOrder:finalBrandArr,
                                subTotal:finalPrice,
                                tax:tax,
                                shipping_charge:TotalShippingCharges,
                                totalCartPrice:totalCartPrice,
                                finalquantity:finalquantity,
                                shipping_array:req.body.shipping_array,
                                finalDiscount:finalDiscount
                            });
                        });
                    }
                    else 
                    {
                         return res.json({"status":'error',"msg":'Unable to found any brands.'});
                    }
                })
            }

        });
    }
    else 
    {
        return res.json({"status":'error',"msg":'Device token is not avaible.'})
    }
};





 
