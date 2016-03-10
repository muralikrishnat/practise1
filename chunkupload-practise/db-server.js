var http = require('http');
var url = require('url');
var _ = require('lodash');
var formidable = require('formidable');

var routings = [];

var config = {
    port: 5654
};

var fallBackRoute = function (req, res, headers) {
    res.writeHead(200, headers);
    var resObject = {};
    res.end(JSON.stringify(resObject));
};

var sendResObject = function (res, headers, resObject) {
    res.writeHead(200, headers);
    res.end(JSON.stringify(resObject));
};

var routingMachanism = function (req) {
    var isRouteFound = false, fnToCall = null;
    _.forEach(routings, function (lItem) {
        var reqUrl = url.parse(req.url);
        if(lItem.Url === reqUrl.pathname){
            isRouteFound = true;
            fnToCall = lItem.Fn;
        }
    });

    return { isRouteFound: isRouteFound, fnToCall: fnToCall };
};

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

var guid = function(len) {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    if(len == 8){
        return s4() + s4();
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + (new Date).getTime().toString(16);
};


var RouteClass = function (u, f) {
    this.Url = u;
    this.Fn = f;
};



server.listen(config.port, function() {
    console.log((new Date()) + ' Server is listening on port ' + config.port);
});