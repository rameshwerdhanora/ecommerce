const async         = require('async');
const Order         = require('../models/orders');
const User          = require('../models/userApp');
const Like          = require('../models/like');
const Constants     = require('../constants/constants');
const dateFormat    = require('dateformat');
/**
 * GET /
 * Home page.
 */

function fetchOrder(callback)
{
 
  var dashBoardArr = new Array();
  Order.find({status:Constants.ORDERSTATUSPENDING},function(error,fetchAllOrderData)
  {
    //callback(error,fetchAllOrderData);
    
    var listOfOrdersArr = new Array();
    var orderObj = {};
    async.eachSeries(fetchAllOrderData, function(OrderIds, callback)
    {
      var listOfOrders          = {};
      listOfOrders._id          = OrderIds._id;
      listOfOrders.order_number = OrderIds.order_number;
      listOfOrders.user_id      = OrderIds.user_id;
      listOfOrders.totalprice   = OrderIds.totalprice;
      listOfOrders.order_date   = dateFormat(parseInt(OrderIds.order_date),'dd mmmm yyyy h:MM TT');
      listOfOrdersArr.push(listOfOrders);
      callback(error)
    },
    function(error)
    {
      dashBoardArr.push(listOfOrdersArr);
    });  // Each function
    callback(error,dashBoardArr);
  }); //   Order 
}


function fetchWeeklyTotal(callback)
{
  var d = new Date();
  //-- Weekly
  d.setDate(d.getDate() - 7);
  weeklyTimeStamp = +new Date(d);
  var weeklyTotalObj = {};
  var weeklyTotalArr = new Array();
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
      },
      function(error)
      {
          weeklyTotalObj.weeklyTotalSale = weeklyTotalSale.toFixed(2);
          weeklyTotalObj.weeklyNoOfSale = weeklyNoOfSale;
          weeklyTotalObj.weeklyAvgSale = (parseInt(weeklyTotalSale)/parseInt( weeklyNoOfSale)).toFixed(2);
          weeklyTotalArr.push(weeklyTotalObj);
          
      });
    }
     callback(error,weeklyTotalArr);
  });
}

function fetchYTDdata(callback)
{
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

          callback(error,yearlyYtdSale.toFixed(2));
          //callback();
      });
    }
  });
}

function fetchTopMembersdata(callback)
{
    Order.aggregate([
    {
        "$group": {
            "_id": "$user_id",
            "finalTotal": { "$sum": "$subtotal" }
        }
    },
    { "$sort": { "finalTotal": -1 } },
    { "$limit": 5 }
    ]).exec(function(error, fetchAllTopUsers){
        callback(error,fetchAllTopUsers);
    });
}

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


  var currentDate = Date.now();
  var d = new Date();
  d.setDate(d.getDate() - 1);
  var yesterdayTimeStamp = +new Date(d); // Unix timestamp in milliseconds

  
    var dashBoardObj    = {};
    var dashBoardNewArr = new Array();
    var todaysale = 0;
    var shipping_charges = 0;

    async.parallel
      (
        [
          function(callback)
          {
            Order.find({order_date:{$lt:currentDate,$gt:yesterdayTimeStamp}},function(error,countOfTodayOrder)
            {
              for (var i = 0; i < countOfTodayOrder.length; i++) 
              {
                todaysale += parseFloat(countOfTodayOrder[i].totalprice);
                shipping_charges += parseFloat(countOfTodayOrder[i].shipping_charges);
              }
              dashBoardObj.todaycount         = countOfTodayOrder.length  ;
              dashBoardObj.todaysale          = todaysale ;
              dashBoardObj.shipping_charges   = shipping_charges ;
              dashBoardObj.payment_charges    = 0 ;
              console.log("1"+dashBoardObj);
              callback();
            });  
          },
          function(callback)
          {
            fetchOrder(function(err, fetchlistOfOrders)
            {
              dashBoardObj.listOfOrders = fetchlistOfOrders;
              console.log("2"+fetchlistOfOrders);
              callback(err); 
            })
            //callback();
          },
          function(callback)
          {
            fetchWeeklyTotal(function(err, fetchWeeklydata)
            {
              dashBoardObj.listOfWeeklydata = fetchWeeklydata;
              console.log("3"+fetchWeeklydata);
              callback(err); 
            })
          },
          function(callback)
          {
            fetchYTDdata(function(err, fetchYTDdata)
            {
              dashBoardObj.listOfYTDdata = fetchYTDdata;
              console.log("4"+fetchYTDdata);
              callback(err); 
            })
          }
        ],
        function(err){
          //return res.json({status:'success',msg:'You are not stored any Card details.',pp:dashBoardObj});
          res.render('home/dashboard', {
            title: 'Home',
            left_activeClass:1,
            dashboardData:dashBoardObj
          });
        }
        // function(error)
        // {
        //   console.log("Final"+dashBoardObj);
        //   return res.json({status:'success',msg:'You are not stored any Card details.',pp:dashBoardObj});
        // }
      )


    /*var listOfOrders = {};
    async.eachSeries(listofTodaySales, function(OrderIds, callback)
    {
      listOfOrders._id          = OrderIds._id;
      listOfOrders.order_number = OrderIds.order_number;
      listOfOrders.user_id      = OrderIds.user_id;
      listOfOrders.totalprice   = OrderIds.totalprice;
      listOfOrders.order_date   = dateFormat(parseInt(OrderIds.order_date),'dd mm yyyy h:MM TT');

      async.parallel
      (
        [
          function(error)
          {

          }
        ],
        function(error)
        {

        }
      )*/
    
    // listOfOrders._id = 



     



 
  /*Order.find({status:Constants.ORDERSTATUSPENDING},function(error,fetchAllOrderData){

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
>>>>>>> Stashed changes
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