"use strict";
var http = require('http');

const indexHandler = (request, reply) => {
    reply.view("storeHome");
};

const storeSelect = (request, reply) => {
    //const apiUrl = "https://lwssvcs.lowes.com/CatalogServices/product/productid/v2_0?storeNumber=0595&productId=1000307379&productId=3881659&priceFlag=balance"
    if(request.params.storeId){
        var options = {
            host: 'lwssvcs.lowes.com',
            path: '/CatalogServices/product/productid/v2_0?storeNumber=0595&productId=1000307379&productId=3881659&priceFlag=balance',
            method: 'GET',
            headers: {"Authorization": "Basic QWRvYmU6ZW9pdWV3ZjA5ZmV3bw=="}
          };
          var finalData = '';
          var context = {};
          http.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                finalData+= chunk;                
            });
            res.on('end', function(){
                finalData = JSON.parse(finalData);
                context.productList = finalData.productList;
                //context.storeName = request.params.storeName;
                //context.storeId = request.params.storeId
                console.log(context);
                reply.view("mainContent", context);
            });
          }).end();

    } else {
        reply.view("store");
    }
};

module.exports = {storeSelect: storeSelect, indexHandler: indexHandler};