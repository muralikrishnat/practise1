var http = require('http');
var url = require('url');


var routings = [];

var RouteClass = function (u, f) {
    this.Url = u;
    this.Fn = f;
};

var fallBackRoute = function (req, res, headers) {
    res.writeHead(200, headers);
    var resObject = {};
    res.end(JSON.stringify(resObject));
};

var routingMachanism = function (req) {
    var isRouteFound = false, fnToCall = null;
     routings.forEach(function (lItem) {
        var reqUrl = url.parse(req.url);
        if(lItem.Url === reqUrl.pathname){
            isRouteFound = true;
            fnToCall = lItem.Fn;
        }
    });

    return { isRouteFound: isRouteFound, fnToCall: fnToCall };
};


routings.push(new RouteClass('/', function (req, res, headers) {
    res.writeHead(200, headers);
    var resObject = {};
    res.end(JSON.stringify(resObject));
}));



var server = http.createServer(function(req, res) {
    var headers = {};

    headers['Access-Control-Allow-Origin'] = 'http://localhost:3434';
    headers['Access-Control-Allow-Credentials'] = true;
    headers['Access-Control-Allow-Headers'] = 'content-type';
    headers['Access-Control-Allow-Methods'] = 'DELETE,GET,POST';

    var rountingItem = routingMachanism(req);

    if(rountingItem.isRouteFound && rountingItem.fnToCall){
        rountingItem.fnToCall.call(null, req, res, headers);
    }else {
        fallBackRoute(req, res, headers);
    }
});


var fileUploader = require('./file-upload');

fileUploader.startStandloneServer(5654);

require('./fe-server')(3434);

