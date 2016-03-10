var http = require('http');
var url = require('url');
var _ = require('lodash');

var fs = require('fs');

var routings = [];

var config = {
    port: 5654
};


var RouteClass = function (u, f) {
    this.Url = u;
    this.Fn = f;
};

var sendResObject = function (res, headers, resObject) {
    res.writeHead(200, headers);
    res.end(JSON.stringify(resObject));
};

var parseQueryParams = function (req) {
    var qParams = {};
    if(req.url.indexOf('?') >= 0){
        var qPart = req.url.split('?')[1];
        var qArray = qPart.split('&');
        qArray.forEach(function (lItem) {
            if(lItem.split('=')[1]) {
                qParams[lItem.split('=')[0]] = decodeURIComponent(lItem.split('=')[1]);
            }
        });
    }
    return qParams;
};

var bufferData = [];
var bufferChunkCount = 0;
var resumableHandler = function (req, res, headers) {

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

        bufferData[parseInt(qParams.chunkIndex)] = data;

        console.log("Got the Chunk ", qParams.chunkIndex);

        bufferChunkCount = bufferChunkCount + 1;

        if(parseInt(qParams.chunkCount) == bufferChunkCount){
            var fallBackCount = 0;
            for(var i = 0; i < bufferData.length ; i++){
                fs.appendFile(qParams.fileName, bufferData[i], 'binary', function (err) {
                    fallBackCount = fallBackCount + 1;
                    if(fallBackCount == bufferData.length){
                        sendResObject(res, headers, resObject);
                    }
                });
            }
        }else{
            sendResObject(res, headers, resObject);
        }


    });
    req.on('error', function(err) {
        console.log("Error during HTTP request");
        console.log(err.message);
    });


};

routings.push(new RouteClass('/upload/resumable', resumableHandler));

var fallBackRoute = function (req, res, headers) {
    res.writeHead(200, headers);
    var resObject = {};
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



server.listen(config.port, function() {
    console.log((new Date()) + ' Server is listening on port ' + config.port);
});