exports.listofAllFeaturedProdOLDNew = (req, res) => {
 
Brand.find({},function(error,fetchAllBrands){ 

  var allBrand = new Array();

  AsyncLoop(fetchAllBrands, function (item, next)
  {
      var brand     = new Array();
      var products  = new Array();
      var image  = new Array();

      brand['name'] = item.brand_name;
      brand['logo'] = item.brand_logo;
      brand['desc'] = item.brand_desc;      

      // console.log('########################');
      // console.log(brand);
      //  console.log('########################');

        Product.find({is_featured:'1',brand_id:item._id},function(error,fetchallFeatProds)
        {
          AsyncLoop(fetchallFeatProds, function (pritesh, next)
          { 
            if(pritesh)
            {
              // console.log('############ 8888888888888 ############');
              // console.log(pritesh);
              // console.log('############ 8888888888888 ############');
              
                var pArr=[];
                pArr['_id']    = pritesh._id;
                pArr['name']   = pritesh.name;
                pArr['sku']    = pritesh.sku;
                pArr['description'] = pritesh.description;
                pArr['price']  = pritesh.price;
                // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                // console.log(pArr);
                // console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
                products[pritesh._id] = pArr;

                ProductImage.find({product_id:pritesh._id},function(error,fetchallFeatProdsImgs)
                {
                  AsyncLoop(fetchallFeatProdsImgs, function (priteshImg, next)
                  {
                    var pArrImg=[];
                    pArrImg['large_image']   = priteshImg.large_image;
                    image[priteshImg._id] = pArrImg;
                    
                     next();
                    } , function ()
                    {
                       brand['img'] = image;
                       allBrand.push(brand);
                       console.log(brand);
                       
                    });
                  });
                 
                }

            
            next();
          } , function ()
          {
            brand['prod'] = products;
             allBrand.push(brand);
           
             
          });
        });
         
      // Get associated value with: item.value 
      next();
  }, function ()
  {
    //allBrand['final'] = brand;
    console.log('#########');
    console.log(allBrand);
     console.log('#############');
  });

});
};


/****************************************************************************************/




  var allBrdProd = new Array();
  Brand.find({},function(error,fetchAllBrands)
  { 
      if(fetchAllBrands)
      {
        async.eachSeries(fetchAllBrands, function(Brand, callback)
        {

          var bArr                  = {};
          bArr['_id']               = Brand._id;
          bArr['brand_name']        = Brand.brand_name;
          bArr['brand_description'] = Brand.brand_desc;
          bArr['brand_logo']        = Brand.brand_logo;
           
           /* Use asyn Parallel method for waiting those functions value */
          async.parallel
          (
            [
               function(callback)
               {
                  fetchingProduct(Brand._id, function(err, res){
                  bArr['product'] = res;
                    callback(err); //Forgot to add
                  });
                }
            ], 
            function(err)
            {
              allBrdProd.push(bArr);
              callback(err); 
            }
          )
        }, 
        function(err)
        {
           console.log(allBrdProd); //This should give you desired result
          //return res.json({"status":'success',"msg":'Fetch all products.',productslist:temp});
        });
      }
      else 
      {
        return res.json({"status":'error',"msg":'Brand is not avaible in admin.'})
      }
  });