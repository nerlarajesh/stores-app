"use strict";
var http = require('http');
var _ = require("lodash");
var context = {},resData = {};
const indexHandler = (request, reply) => {
    reply.view("storeHome");
};

const storeSelect = (request, reply) => {
    var Obj = [{tablename:'trends_table',section:'trendProductList'},{tablename:'weather_table',section:'weatherProductList'},{tablename:'stores_table',section:'storeProductList'}];
    _.forEach(Obj, (value, key) => {
        generalizeAPICall(request,reply,value.tablename,value.section,key);
    });
};

function generalizeAPICall(request,reply,tablename,productListSection,key){
    const cassandra = require('cassandra-driver');
    const client = new cassandra.Client({ contactPoints: ['cassandra'], keyspace: 'hackday' });
    const query = 'SELECT * FROM '+tablename;
    var productList = "";
    client.execute(query,{prepare: true},function(err,result) {
        _.forEach(result.rows, (value, key) => {
            if(request.params.storeId == value.storeid){
                productList += "&productId="+value.productid;
            }
        });
        if(request.params.storeId){
            var options = {
                host: 'lwssvcs.lowes.com',
                path: '/CatalogServices/product/productid/v2_0?storeNumber='+request.params.storeId+productList+'&priceFlag=balance',
                method: 'GET',
                headers: {"Authorization": "Basic QWRvYmU6ZW9pdWV3ZjA5ZmV3bw=="}
              };
              var finalData = '';
              http.request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    finalData+= chunk;                
                });
                res.on('end', function(){
                    finalData = JSON.parse(finalData);
                    resData[productListSection] = finalData.productList;
                    setTimeout(function(){
                        if(key == 2){
                            reply.view('mainContent',resData);
                        }
                    },500);
                });
              }).end();
    
        } else {
            reply.view("store");
        }

    });
}

module.exports = {storeSelect: storeSelect, indexHandler: indexHandler};