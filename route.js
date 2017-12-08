var Hapi = require('hapi');
const storeSelectImpl = require("./server/handlers/storeSelect");

var routes = [
    {
        method: 'GET',
        path: '/',
        handler: storeSelectImpl.indexHandler
    },
    {
        method: 'GET',
        path: '/store/{storeId}/{storeName}',
        handler: storeSelectImpl.storeSelect
    },
    {
        method: 'GET',
        path: '/cassandra',
        handler: (request, reply) => {
            const cassandra = require('cassandra-driver');
            const client = new cassandra.Client({ contactPoints: ['cassandra'], keyspace: 'hackday' });
        
            const query = 'SELECT zipcode,products FROM product_trends WHERE zipcode = ?';
            client.execute(query, [28117],{prepare: true},function(err,result) {
                console.log(err);
                console.log("result is", result.rows);
                reply.view('mainContent', { result:result.rows});
        
            });
        }
    }
];

module.exports = routes;

