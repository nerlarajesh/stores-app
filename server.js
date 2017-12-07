var Hapi = require('hapi');
var inert = require('inert');
var vision = require('vision');
var routes = require('./route');
//var handlebarsHelpers = require("handlebars-helpers");
//var _ = require("lodash");

var server = new Hapi.Server();
server.connection({ port: 8600 });
server.register([inert, vision], function(){
    console.log("Hi");
});

const serverViews = server.views({
    engines: {
        hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'server/views',
    partialsPath: 'server/views/partials'
    //helpersPath: 'server/views/helpers'
});

// _.forEach(handlebarsHelpers, (value, key) => {
//     serverViews.registerHelper(key, value)
// });

server.route(routes);
server.start(function () {
    console.log('Server running at:', server.info.uri);
});