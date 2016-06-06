var fs = require('fs');
var LRU = require('lrucache');
var lrucache = LRU();


var sendResObject = function (res, headers, resObject) {
    res.writeHead(200, headers);
    res.end(JSON.stringify(resObject));
};

var parseQueryParams = function (req) {
    var qParams = {};
    var url = req ? (req.url ? req.url: req): null;
    if(url && url.indexOf('?') >= 0){
        var qPart = url.split('?')[1];
        var qArray = qPart.split('&');
        qArray.forEach(function (lItem) {
            if(lItem.split('=')[1]) {
                qParams[lItem.split('=')[0]] = decodeURIComponent(lItem.split('=')[1]);
            }
        });
    }
    return qParams;
};


var chunkholder = {};
var resumableHandler = function (req, res, headers) {

    headers = typeof headers === "object" ? headers : {};
    //var resObject = { "Status": "Scucess"};
    //sendResObject(res, headers, resObject);
    req.setEncoding('binary'); // this

    var data = "";
    var qParams = parseQueryParams(req);

    req.on('data', function(chunk) {
        return data += chunk;
    });


    req.on('end', function() {
        var resObject = {};
        resObject.Body = "Reading binary completed";
        var fName = qParams.fileName;
        if(qParams.chunkIndex){
            fName = fName.substr(0, fName.lastIndexOf('.')) + '-' + qParams.chunkIndex + fName.substr(fName.lastIndexOf('.'))
        }


        if(!chunkholder["C" +  fName]){
            chunkholder["C" +  fName] = { bufferData: [], bufferChunkCount: 0};
        }
        chunkholder["C" +  fName].bufferData[parseInt(qParams.chunkIndex)] = data;
        chunkholder["C" +  fName].bufferChunkCount = chunkholder["C" +  fName].bufferChunkCount + 1;


        if(parseInt(qParams.chunkCount) == chunkholder["C" +  fName].bufferChunkCount){
            var fallBackCount = 0;
            console.log("all chunk data received");
            for(var i = 0; i < chunkholder["C" +  fName].bufferData.length ; i++){
                fs.appendFile('files/' + qParams.fileName, chunkholder["C" +  fName].bufferData[i], 'binary', function (err) {
                    fallBackCount = fallBackCount + 1;
                    if(fallBackCount == chunkholder["C" +  fName].bufferData.length){
                        chunkholder["C" +  fName] = null;
                        sendResObject(res, headers, resObject);
                    }
                });
            }
            sendResObject(res, headers, resObject);
        }else{
            sendResObject(res, headers, resObject);
        }


    });
    req.on('error', function(err) {
        console.log("Error during HTTP request");
        console.log(err.message);
    });


};


var startStandloneServer = function (port) {
    var http = require('http');
    var url = require('url');
    port = port || '5654';

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

    routings.push(new RouteClass('/upload/resumable', resumableHandler));

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

    routings.push(new RouteClass('/token', function (req, res, headers) {
        res.writeHead(200, headers);
        var resObject = { "token": guid()};
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

    server.listen(port, function () {
        console.log((new Date()) + ' Server is listening on port ' + port);
    });


};
module.exports = {
    startStandloneServer:startStandloneServer,
    resumableHandler: resumableHandler
};