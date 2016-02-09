var guid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + (new Date).getTime().toString(16);
};

var Util = {};

Util.guid = function(len) {
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


var BuStand = function (h, b) {
    var Header = function (g, t) {
        this.Guid = g;
        this.atoken = t;
    };
    this.Headers = new Header(h.Guid, h.atoken);
    this.Body = b;
};
BuStand.parse = function (strObject) {
    var msgObject = null;
    try{
        msgObject = JSON.parse(strObject);
        return new BuStand(msgObject.Headers, msgObject.Body);
    }catch (t){
        //eat it
        return null;
    }
};

var connectionArray = [];

var ConnectionObject = function (g, c, u) {
    this.Guid = g;
    this.connection = c;
    this.UserID = u;
};




var WebSocketServer = require('websocket').server;
var http = require('http');
var multiparty = require('multiparty');
var formidable = require('formidable');
var util = require('util');

var cookie = require('cookie');

var authenticateUser = function (isPost, req, res) {

    var headers = {};
    var resObject = {};

    headers['Access-Control-Allow-Origin'] = 'http://localhost:3434';
    headers['Access-Control-Allow-Credentials'] = true;
    headers['content-type'] = 'text/json';

    var sendAuthenticationNeed = function () {
        resObject.Error = "Need Authentication";
        res.writeHead(200, headers);
        res.end(JSON.stringify(resObject));
    };

    if (req.headers && req.headers.cookie) {
        var reqCookies = cookie.parse(req.headers.cookie);

        if (reqCookies.atkn) {
            res.writeHead(200, headers);
            resObject.tokenObject = {};
            resObject.tokenObject.token = reqCookies.atkn;
            res.end(JSON.stringify(resObject));
        }else{
            sendAuthenticationNeed(resObject);
        }
    } else {
        if (isPost) {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                if (err) {
                    sendAuthenticationNeed(resObject);
                }

                var uname = fields.name, pwd = fields.pwd;
                resObject.tokenObject = {};
                resObject.tokenObject.token = guid(true);
                headers['Set-Cookie'] = 'atkn=' + resObject.tokenObject.token;
                res.writeHead(200, headers);
                res.end(JSON.stringify(resObject));
            });
        } else{
            sendAuthenticationNeed(resObject);
        }
    }
};



var server = http.createServer(function(req, res) {
    var headers = {};

    headers['Access-Control-Allow-Origin'] = 'http://localhost:3434';
    headers['Access-Control-Allow-Credentials'] = true;

    if(req.url.indexOf('/authenticate') >= 0){
        authenticateUser(req.method.toLowerCase() == 'post', req, res);
    }else if(req.url.indexOf('/requestVerificationToken') >= 0){
        var verificationObject = {};
        verificationObject.token = guid(true);
        res.writeHead(200, headers);
        res.end(JSON.parse(verificationObject));
    }else {
        headers['content-type'] = 'text/plain';
        res.writeHead(200, headers);
        res.end(JSON.stringify(req.headers));
    }
});
server.listen(5654, function() {
    console.log((new Date()) + ' Server is listening on port 5654');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}


wsServer.on('request', function(request) {
    //if (!originIsAllowed(request.origin)) {
    //    // Make sure we only accept requests from an allowed origin
    //    request.reject();
    //    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    //    return;
    //}

    var connection = request.accept('echo-protocol', request.origin);

    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {

        if (message.type === 'utf8') {
            var datafromClient = BuStand.parse(message.utf8Data);
            console.log('Received Message: ', message.utf8Data);
            connection.sendUTF(JSON.stringify(datafromClient));
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            //connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

    if(connection.connected){
        //connectionArray.push(new ConnectionObject(guid(), connection,))
        connection.sendUTF(guid());
    }
    //function sendNumber() {
    //    if (connection.connected) {
    //        var number = Math.round(Math.random() * 0xFFFFFF);
    //        connection.sendUTF(number.toString());
    //        setTimeout(sendNumber, 1500);
    //    }
    //}
    //sendNumber();
});




//var restify = require('restify');
//
//var LRU = require('lrucache');
//var lrucache = LRU();
//var fs = require('fs');
//
//
//var server = restify.createServer({
//    name: 'mydb',
//    version: '1.0.0'
//});
//
//
//server.use(restify.acceptParser(server.acceptable));
//server.use(restify.queryParser());
//server.use(restify.bodyParser());
//
//
//server.get('/', function (req, res, next) {
//    //fs.writeFile('data/hubs.json', JSON.stringify({ "Id": "234324234-23423423-234-23-4234", "Name": "gmail2345"}), function(err) {
//    //    if (err) throw err;
//    //    console.log('It\'s saved!');
//    //});
//
//    fs.readFile('data/hubs.json', 'utf8',  function (err, data) {
//        console.log(data);
//        var resData = JSON.parse(data);
//        res.send(resData);
//    });
//
//    return next();
//});
//
//
//
//server.listen(7867, function () {
//    console.log('%s listening at %s', server.name, server.url);
//});