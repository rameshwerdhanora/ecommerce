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

  Order.find({status:Constants.ORDERSTATUSPENDING},function(error,fetchAllOrderData){

    if(fetchAllOrderData)
    {
      var finalDashboradObj = {};
      var orderArr = new Array();
      async.eachSeries(fetchAllOrderData, function(OrderIds, callback)
      {
        var orderObj          = {};
        orderObj._id          = OrderIds._id;
        orderObj.order_number = OrderIds.order_number;
        orderObj.totalprice   = OrderIds.totalprice;
        orderObj.orderdate    = dateFormat(parseInt(OrderIds.order_date),'dd/mm/yyyy');
        orderArr.push(orderObj);
        callback();



        async.parallel
        (
          [
            function(callback)
            {
              var currentDate = Date.now();
              var d = new Date();
              d.setDate(d.getDate() - 1);
              
              var yesterdayTimeStamp = +new Date(d); // Unix timestamp in milliseconds
              Order.find({status:Constants.ORDERSTATUSPAID,order_date:{$gt:yesterdayTimeStamp}},function(error,fetchAllTodaySale){
                if(fetchAllTodaySale)
                {
                  var todaySale = 0;
                  var todayShippingTotal = 0;
                  var todayPaymentFees = 0;
                  async.eachSeries(fetchAllTodaySale, function(fetchOrderId, callback)
                  {
                    todaySale = parseInt(todaySale) + parseInt(fetchOrderId.totalprice);
                    todayShippingTotal = parseInt(todayShippingTotal) + parseInt(fetchOrderId.shipping_charges);
                    todayPaymentFees = parseInt(todayPaymentFees) + parseInt(fetchOrderId.subtotal);
                    
                    callback(error);
                  },function(error){

                      finalDashboradObj.todaySale = todaySale.toFixed(2);
                      finalDashboradObj.todayShippingTotal = todayShippingTotal.toFixed(2);
                      finalDashboradObj.todayPaymentFees = todayPaymentFees.toFixed(2);
                      //callback();
                  });
                 

                }
              });

              //-- Weekly
              d.setDate(d.getDate() - 7);
              weeklyTimeStamp = +new Date(d);
              Order.find({status:Constants.ORDERSTATUSPAID,order_date:{$gt:weeklyTimeStamp}},function(error,fetchAllWeeklySale){
                if(fetchAllWeeklySale)
                {
                  var weeklyTotalSale = 0;
                  var weeklyNoOfSale = 0;
                  var weeklyAvgSale = 0;
                  async.eachSeries(fetchAllWeeklySale, function(fetchOrderId, callback)
                  {
                    weeklyTotalSale = parseInt(weeklyTotalSale) + parseInt(fetchOrderId.totalprice);
                    weeklyNoOfSale ++;
                    callback(error);
                  },function(error){

                      finalDashboradObj.weeklyTotalSale = weeklyTotalSale.toFixed(2);
                      finalDashboradObj.weeklyNoOfSale = weeklyNoOfSale;
                      finalDashboradObj.weeklyAvgSale = (parseInt(weeklyTotalSale)/parseInt( weeklyNoOfSale)).toFixed(2);
                  });
                }
              });

              //-- YTD Yearly
              //console.log(d.getFullYear());
              d = new Date(new Date().getFullYear(), 0, 1);
              yearlyTimeStamp = +new Date(d);
              Order.find({status:Constants.ORDERSTATUSPAID,order_date:{$gt:yearlyTimeStamp}},function(error,fetchAllYearlySale){
                if(fetchAllYearlySale)
                {
                  var yearlyYtdSale = 0;
                  async.eachSeries(fetchAllYearlySale, function(fetchYearlySale, callback)
                  {
                    yearlyYtdSale = parseInt(yearlyYtdSale) + parseInt(fetchYearlySale.totalprice);
                    callback(error);
                  },function(error){

                      finalDashboradObj.yearlyYtdSale = yearlyYtdSale.toFixed(2);
                      //callback();
                  });
                }
              });

              //-- Total Users
              //d = new Date(new Date().getFullYear(), 0, 1);
              //yearlyTimeStamp = +new Date(d);
              User.find({},function(error,fetchAllTotalUser){
                if(fetchAllTotalUser)
                {
                  var totalUser = 0;
                  var newUsers = 0;
                  async.eachSeries(fetchAllTotalUser, function(fetchTotalUser, callback)
                  {
                    totalUser ++;
                    //-- check last one month users
                    //-- get last one date
                    d.setDate(d.getDate() - 30);
                    lastOneMonthTimeStamp = +new Date(d);
                    if(fetchTotalUser.created > lastOneMonthTimeStamp)
                    {
                      newUsers++;
                    }
                    callback(error);
                  },function(error){
                      finalDashboradObj.totalUser = totalUser;
                      finalDashboradObj.newUsers = newUsers;
                      //callback();
                  });
                }
              });

              //-- Like ME Count
              Like.find({},function(error,fetchAllLike){
                if(fetchAllLike)
                {
                  var share = 0;
                  var like = 0;
                  async.eachSeries(fetchAllLike, function(fetchLike, callback)
                  {
                    share ++;
                    like ++;
                    callback(error);
                  },function(error){
                      finalDashboradObj.share = share;
                      finalDashboradObj.like = like;
                      callback();
                  });
                }
              });

              // Order.find({status:Constants.ORDERSTATUSPAID},function(error,fetchAllCustomerData){
              //   [
              //    { "$group": { "user_id": "$user_id"} }
              //   ]}).toArray(function(err, result) {
              //     assert.equal(err, null);
              //     console.log(result);
              //     callback(result);
              //   });

              

              // Order.find({status:Constants.ORDERSTATUSPAID}
              // ,function(error,fetchAllCustomerData){
              //   if(fetchAllCustomerData)
              //   {
              //     console.log(fetchAllCustomerData);
              //   }
              // });
            }
          ],
          function(err){
            finalDashboradObj.newOrder = orderArr;
            //finalDashboradObj.orderCalulation = orderCalulation;
            //console.log('#####################');
            console.log(finalDashboradObj);
            res.render('home/dashboard', {
                title: 'Home',
                left_activeClass:1,
                dashboardData:finalDashboradObj
              });

          }
        ) // parallel close function 

      },function(err)
      {
        
      }); // eachseries close function
    } // If condition

  });









/*
  //-- get new orders and count
  Order.find({status:Constants.ORDERSTATUSPAID},function(error,getAllOrders)
  {
      if(getAllOrders)
      {
        var orderArr = new Array();
        async.eachSeries(getAllOrders, function(OrderIds, callback)
        {
          var orderObj = {};
         
          orderObj._id = OrderIds._id;
          orderObj.order_number = OrderIds.order_number;
          orderObj.totalprice   = OrderIds.totalprice;
          orderObj.orderdate    = dateFormat(parseInt(OrderIds.order_date),'dd/mm/yyyy');
          orderArr.push(orderObj);
          callback(error);


        },
        function(err){
          res.render('home/dashboard', {
            title: 'Home',
            left_activeClass:1,
            newOrders:orderArr
          });
        });
      }
  }).limit(5);*/
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