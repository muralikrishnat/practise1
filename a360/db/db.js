var http = require('http');
var formidable = require('formidable');
var _ = require('lodash');

var Utl = require('./lib/util.js');

var routings = [];

var authenticateUserRoute = function (req, res, headers) {
    var resObject = {}, reqCookies = Utl.getCookies(req);
    if(reqCookies.atkn){
        resObject.tokenObject = {};
        resObject.tokenObject.token = reqCookies.atkn;
        headers['Set-Cookie'] = 'atkn=' + resObject.tokenObject.token;
        Utl.sendResObject(res, headers, resObject);
    }else{
        if(req.method.toUpperCase() === 'POST'.toUpperCase()){
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                var uname = fields.name, pwd = fields.pwd;
                resObject.tokenObject = {};
                resObject.tokenObject.token = guid();
                headers['Set-Cookie'] = 'atkn=' + resObject.tokenObject.token;
                Utl.sendResObject(res, headers, resObject);
            });
        }else{
            Utl.sendResObject(res, headers, resObject);
        }
    }

};
var fallBackRoute = function (req, res, headers) {
    res.writeHead(200, headers);
    res.end("This is default Route");
};


routings.push(new Utl.RouteClass('/authenticate', authenticateUserRoute));

var server = http.createServer(function(req, res) {
    var headers = {};

    headers['Access-Control-Allow-Origin'] = 'http://localhost:3434';
    headers['Access-Control-Allow-Credentials'] = true;

    if(Utl.isNewRequest(req)){
        Utl.makerequestold(headers);
    }
    var isRouteFound = false, fnToCall = null;
    _.forEach(routings, function (lItem) {
        if(lItem.Url === req.url){
            isRouteFound = true;
            fnToCall = lItem.Fn;
        }
    });

    if(isRouteFound && fnToCall){
        fnToCall.call(null, req, res, headers);
    }else {
        fallBackRoute(req, res, headers);
    }
});
server.listen(5654, function() {
    console.log((new Date()) + ' Server is listening on port 5654');
});
