/* Add required Models */
const async           = require('async');
const Order           = require('../models/orders');
const OrderDetails    = require('../models/orderDetails');
const User            = require('../models/userApp');

/**
 * GET /order/list
 * For showing list of Orders
 */

exports.list = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }	

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
                    orderObj.user_id    = OrderIds.user_id;
                    orderObj.user_name  = fetUserDetails.user_name;
                    orderObj.email_id   = fetUserDetails.email_id;
                    orderObj.first_name = fetUserDetails.first_name;
                    orderObj.last_name  = fetUserDetails.last_name;
                    orderObj.gender     = fetUserDetails.gender;
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
                  orderDetailObj.user_id    = OrderIds.user_id;
                  orderDetailObj.user_name  = fetUserDetails.user_name;
                  orderDetailObj.email_id   = fetUserDetails.email_id;
                  orderDetailObj.first_name = fetUserDetails.first_name;
                  orderDetailObj.last_name  = fetUserDetails.last_name;
                  orderDetailObj.gender     = fetUserDetails.gender;
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
                        callback(err);
                    });
                })
              }
          ],
          function(err)
          {
            finalOrderDetailData.push(orderDetailObj);
            callback(err);
          }
        );
      },
      function(err)
      {
        console.log(finalOrderDetailData)
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

 