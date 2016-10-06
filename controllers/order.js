/* Add required Models */
const async           = require('async');
const Order           = require('../models/orders');
const OrderDetails    = require('../models/orderDetails');
const User            = require('../models/userApp');
const ShopShipping   = require('../models/shopShipping');
const Constants       = require('../constants/constants');

/**
 * GET /order/list
 * For showing list of Orders
 */

exports.list = (req, res) => {

    if((req.user.role_id == 3 || req.user.role_id == 4 || req.user.role_id == 6) && req.user.userPermissions.indexOf('57c04c7043592d87b0e6f5f9') == -1){
      req.flash('errors',[Constants.SHOP_PERMISSION_ERROR_MSG]);
      res.redirect('/user/shopprofile');
    }else{

        Order.find({},function(error,getAllOrders)
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
                res.render('order/list', { title: 'Order List',left_activeClass:2,orderdata:finalOrderData});
              });
            }
            else 
            {
              req.flash('success',['Order is not created.']);
              res.render('order/list',{title: 'Order List',left_activeClass:2,orderdata:''});
            }
        });
    }
};


/**
 * GET /order/detail/:orderId
 * For showing Orders details
 */


exports.detail = (req, res) => {

  if (!req.user) {
    return res.redirect('/login');
  }	
  
  Order.find({_id:req.params.orderId},function(error,getAllOrders)
  {
    if(getAllOrders)
    {
      var finalOrderDetailData  = new Array();
      var brandIdsArr           = new Array();
      var shipFromAddress       = new Array();

      async.eachSeries(getAllOrders, function(OrderIds, callback)
      {
        var orderDetailObj = {};
        var dateTime = new Date(parseInt(OrderIds.order_date));
        
        //var split = dateTime.split(' ');
 
        var year  = dateTime.getFullYear();
        var month = dateTime.getMonth()+1;
        var date  = dateTime.getDate();

        var hour  = dateTime.getHours() == 0 ? 12 : (dateTime.getHours() > 12 ? dateTime.getHours() - 12 : dateTime.getHours());
        var min   = dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes();
        var ampm  = dateTime.getHours() < 12 ? 'AM' : 'PM';
        var time  = hour + ':' + min + ' ' + ampm;

        finalDate = month+'/'+date+'/'+year ;

        orderDetailObj._id                  = OrderIds._id;
        orderDetailObj.order_number         = OrderIds.order_number;
        orderDetailObj.status               = OrderIds.status;
        orderDetailObj.shipping_address     = OrderIds.shipping_address;
        orderDetailObj.billing_address      = OrderIds.billing_address;
        orderDetailObj.totalprice           = OrderIds.totalprice;
        orderDetailObj.shipping_charges     = OrderIds.shipping_charges;
        orderDetailObj.tax                  = OrderIds.tax;
        orderDetailObj.subtotal             = OrderIds.subtotal;
        orderDetailObj.itemquantity         = OrderIds.itemquantity;
        orderDetailObj.orderdate            = finalDate;
        orderDetailObj.ordertime            = time;

        
        async.parallel
        (
          [
              function(callback)
              {
                User.findOne({_id:OrderIds.user_id},function(error,fetUserDetails)
                {
                  if(fetUserDetails)
                  {
                    orderDetailObj.user_id    = OrderIds.user_id;
                    orderDetailObj.user_name  = fetUserDetails.user_name;
                    orderDetailObj.email_id   = fetUserDetails.email_id;
                    orderDetailObj.first_name = fetUserDetails.first_name;
                    orderDetailObj.last_name  = fetUserDetails.last_name;
                    orderDetailObj.gender     = fetUserDetails.gender;
                  }
                  callback(error);
                });
              },
              function(callback)
              {
                OrderDetails.find({order_id:OrderIds._id},function(error,fetchingAllOrderDetails)
                {
                    if(fetchingAllOrderDetails)
                    {
                      orderDetailObj.details   = fetchingAllOrderDetails;
                      callback(error);
                    }
                })
              },
              function(callback)
              {
                OrderDetails.find({order_id:OrderIds._id},function(error,fetchingAllOrderDetails)
                {   
                    
                    async.eachSeries(fetchingAllOrderDetails, function(fetchBrandId, callback)
                    {
                      brandIdsArr.push(fetchBrandId.brand_id);
                      callback(error);
                    },
                    function(err)
                    {
                        uniqueArrayForBrandId = brandIdsArr.filter(function(elem, pos) {
                          return brandIdsArr.indexOf(elem) == pos;
                        });
                        
                        orderDetailObj.brand_id = uniqueArrayForBrandId;
                        //-- Get Ship from address

                        ShopShipping.find({user_id:{$in:uniqueArrayForBrandId}},function(error,fetchingShoperDetails){

                            if(fetchingShoperDetails)
                            {
                              orderDetailObj.shopperDetails = fetchingShoperDetails;
                              callback(err);
                            }
                        });
                        
                        // uniqueArrayForBrandId.forEach(function(item, index) {
                        //     orderDetailObj.shopperDetails = orderDetailObj.brand_id[index];
                        // });  

                    });
                })
              }
          ],
          function(err)
          {
            //console.log(finalOrderDetailData);
            finalOrderDetailData.push(orderDetailObj);
            callback(err);
          }
        );
      },
      function(err)
      {
        console.log(finalOrderDetailData[0].shopperDetails);
        res.render('order/detail', { title: 'Order',left_activeClass:2,orderdata:finalOrderDetailData[0]});
      });
    } 
    else 
    {
      req.flash('success',['Order is not created.']);
      res.render('order/list',{title: 'Order List',left_activeClass:2,orderdata:''});
    } 
  });
};

 