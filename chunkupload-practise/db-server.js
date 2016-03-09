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

var UploadFiles = [];

var uploadFile = function (n, t, c, tb, ub) {
    this.Name = n;
    this.Token = t;
    this.ClientTimeStamp = c;
    this.Totalbytes = tb;
    this.UploadedBytes = ub ? ub: 0;
};

var parseFormFields = function (req) {
    return new Promise(function (resolve, reject) {
        var form = new formidable.IncomingForm();
        try {
            form.parse(req, function (err, fields, files) {
                resolve(fields);
            });
        }catch (r){
            resolve({});
        }
    });

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

var uploadHandler = function (req, res, headers) {
    var resObject = {}, reqPromise, qParams = {};
    qParams = parseQueryParams(req);
    resObject.QueryParams = qParams;

    switch (req.method){
        case 'GET':
            if(qParams.fileName){
                reqPromise = new Promise(function (resolve, reject) {
                    var fileToken = guid();
                    UploadFiles.push(new uploadFile(qParams.fileName, fileToken, new Date().getTime()));
                    resolve({ token: fileToken, fileName: qParams.fileName});
                });
            }
            break;
        case 'POST':
            reqPromise = parseFormFields(req).then(function (fields) {
                if(fields.fileName){
                    var fName = fields.fileName;
                    var fileToken = guid();
                    var cTime = fields.fileTimeStamp || new Date().getTime();
                    var totalBytes = fields.Totalbytes ? fields.Totalbytes: 0;
                    UploadFiles.push(new uploadFile(fName, fileToken,cTime, totalBytes));
                    return { token: fileToken, fileName: fName};
                }else{
                    return fields;
                }
            });
            break;

    }

    if(reqPromise){
        reqPromise.then(function (fields) {
            resObject.Fields = fields;
            sendResObject(res, headers, resObject);
        });
    }else{
        resObject.Params = params;
        resObject.Body = "Found the Route buddy!!!";
        sendResObject(res, headers, resObject);
    }

};

var fs = require('fs');
var writeToFile_old = function (fName, stringData) {
  return new Promise(function (resolve, reject) {
      fs.writeFile(__dirname + '/files/' + fName, stringData, 'base64', function (err, data) {
          if (err) {

          }
          resolve({});
      });

      //resolve({});
  });
};

var writeToFile = function (fName, stringData) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(__dirname + '/files/' + fName, stringData, function (err, data) {
            if (err) {

            }
            resolve({});
        });

        //resolve({});
    });
};



var resumableHandler_old = function (req, res, headers) {
    var resObject = {};
    resObject.body = [];
    var fileContent = [];
    var qParams = parseQueryParams(req);
    req.on('data', function(chunk) {
        fileContent.push(chunk);
    }).on('end', function() {
        fileContent = Buffer.concat(fileContent).toString();
        var fName = qParams.fileName;
        if(qParams.token){
            fName = fName.substr(0,fName.lastIndexOf('.')) + '-' + qParams.token + '.' + fName.substr(fName.lastIndexOf('.') + 1);
        }
        var base64Splitter = ';base64,';
        fileContent = fileContent.substr(fileContent.indexOf(base64Splitter)).replace(base64Splitter, '');
        writeToFile(fName, fileContent).then(function () {
            sendResObject(res, headers, resObject);
        });

    });

};

var resumableHandler = function (req, res, headers) {
    var resObject = {};
    resObject.body = [];
    var fileContent = [];
    var qParams = parseQueryParams(req);
    req.on('data', function(chunk) {
        fileContent.push(chunk);
    }).on('end', function() {

        fileContent = Buffer.concat(fileContent);
        //fileContent = Buffer.concat(fileContent).toString();
        var fName = qParams.fileName;
        if(qParams.token){
            fName = fName.substr(0,fName.lastIndexOf('.')) + '-' + qParams.token + '.' + fName.substr(fName.lastIndexOf('.') + 1);
        }

        if(qParams.chunkIndex){
            fName = fName.substr(0,fName.lastIndexOf('.')) + '-' + qParams.chunkIndex + '.' + fName.substr(fName.lastIndexOf('.') + 1);
        }

        //writeToFile(fName, fileContent).then(function () {
        //    sendResObject(res, headers, resObject);
        //});
        //var bfr = new Buffer(fileContent);
        fs.open(fName, 'w', function(err, fd) {
            console.log("got the write",  fd);
            fs.write(fd, fileContent, function () {
                fs.close(fd, function() {
                    console.log('file written');
                });
                sendResObject(res, headers, resObject);
            });
        });

    });

};

var RouteClass = function (u, f) {
    this.Url = u;
    this.Fn = f;
};



routings.push(new RouteClass('/upload/getToken', uploadHandler));
routings.push(new RouteClass('/upload/resumable', resumableHandler));

server.listen(config.port, function() {
    console.log((new Date()) + ' Server is listening on port ' + config.port);
});