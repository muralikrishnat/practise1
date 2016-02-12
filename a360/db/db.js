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

var ConnectionObject = function () {
};




var WebSocketServer = require('websocket').server;
var http = require('http');
var multiparty = require('multiparty');
var formidable = require('formidable');
var util = require('util');

var M = require('./lib/util.js');
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
                resObject.tokenObject.token = guid();
                headers['Set-Cookie'] = 'atkn=' + resObject.tokenObject.token;
                res.writeHead(200, headers);
                res.end(JSON.stringify(resObject));
            });
        } else{
            sendAuthenticationNeed(resObject);
        }
    }
};

var makerequestold = function (headers) {
    headers['Set-Cookie'] = 'cuid=' + Util.guid();
    return headers;
};

var isNewRequest = function (req) {
    if(req.headers && req.headers.cookie){
        var reqCookies = cookie.parse(req.headers.cookie);
        if(reqCookies.cuid){
            return false;
        }
    }
    return true;
};


var server = http.createServer(function(req, res) {
    var headers = {};

    headers['Access-Control-Allow-Origin'] = 'http://localhost:3434';
    headers['Access-Control-Allow-Credentials'] = true;

    if(isNewRequest(req)){
        makerequestold(headers);
    }
    res.writeHead(200, headers);
    res.end(JSON.stringify({"Msg": "You are new one!!!!!!!!"}));

    //if (req.headers && req.headers.cookie) {
    //    var reqCookies = cookie.parse(req.headers.cookie);
    //    if(reqCookies.cuid){
    //        //already request came in
    //        headers['content-type'] = 'text/plain';
    //        res.writeHead(200, headers);
    //        res.end(JSON.stringify({"Msg": "You are old one!!!!!!!!"}));
    //    }else{
    //        handleNewRequest(res, headers);
    //    }
    //}else {
    //    if (req.url.indexOf('/authenticate') >= 0) {
    //        authenticateUser(req.method.toLowerCase() == 'post', req, res);
    //    } else if (req.url.indexOf('/requestVerificationToken') >= 0) {
    //        var verificationObject = {};
    //        verificationObject.token = guid(true);
    //        res.writeHead(200, headers);
    //        res.end(JSON.parse(verificationObject));
    //    } else {
    //        handleNewRequest(res, headers);
    //    }
    //}
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
});