var http = require('http');
var formidable = require('formidable');
var _ = require('lodash');

var Utl = require('./lib/util.js');

var routings = [];
var DbManager = {};
DbManager.Tables = ['hubs', 'members', 'projects'];

Utl.DB.Tables = DbManager.Tables;

var isAuthenticated = function () {
    return true;
};

var HubClass = function (obj) {
    this.Id = obj["Id"] || Utl.guid();
    this.Name = obj["Name"];
};

var ProjectClass = function (obj) {
    this.Id = obj["Id"] || Utl.guid();
    this.Name = obj["Name"];
};

var MemberClass = function (obj) {
    this.Id = obj["Id"] || Utl.guid();
    this.FirstName = obj["FirstName"];
    this.LastName = obj["LastName"];
};

var parseTableRow = function (tName, reqData) {
    var obj = {};
    switch (tName.toUpperCase()){
        case 'MEMBERS':
            obj = new MemberClass(reqData);
            break;
        case 'PROJECTS':
            obj = new ProjectClass(reqData);
            break;
        case 'HUBS':
            obj = new HubClass(reqData);
            break;
        default:
    }
    return obj;
};

var apiHandler = function (req, res, headers) {
    var resObject = {};
    if(isAuthenticated()){
        if(req.method.toUpperCase() === 'POST'.toUpperCase()){
            var form = new formidable.IncomingForm();
            try{
                form.parse(req, function (err, fields, files) {
                    if(err){
                        resObject.Status = "Failed";
                        Utl.sendResObject(res, headers, resObject);
                    }else{
                        var actionName = fields.aName;
                        var actionMethod = fields.aMethod;
                        var actionBody = fields.aBody;
                        var actionType = fields.aType;
                        if(actionBody){
                            actionBody = JSON.parse(actionBody);
                        }
                        if(actionType){
                            actionType = JSON.parse(actionType);
                        }

                        resObject.Status = "Success";
                        resObject.RequestDetails = {};
                        var reqPromise = null;
                        if(actionName.toUpperCase() === "DB"){
                            reqPromise = Utl.DB.saveToJSON();
                        }else {
                            switch (actionMethod.toUpperCase()) {
                                case 'POST':
                                    if(actionBody.Id){
                                        Utl.DB.updateTableRow(actionName, parseTableRow(actionName, actionBody));
                                    }else {
                                        Utl.DB.addTableRow(actionName, parseTableRow(actionName, actionBody));
                                    }
                                    break;
                                case 'DELETE':
                                    if(actionBody.Id){
                                        Utl.DB.deleteTableRow(actionName, parseTableRow(actionName, actionBody))
                                    }
                                    break;
                                case 'GET':
                                    reqPromise = Utl.DB.getTable(actionName);
                                default:
                            }
                        }

                        headers["Content-Type"] = "text/json";
                        if(reqPromise){
                            reqPromise.then(function (tData) {
                                resObject.Body = tData;
                                Utl.sendResObject(res, headers, resObject);
                            });
                        }else {
                            Utl.sendResObject(res, headers, resObject);
                        }
                    }
                });
            }catch (rt){
                resObject.Status = "Failed";
                Utl.sendResObject(res, headers, resObject);
            }
        }else{
            Utl.sendResObject(res, headers, resObject);
        }
    }else{
        Utl.sendResObject(res, headers, resObject);
    }
};


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
routings.push(new Utl.RouteClass('/api', apiHandler));


var tableRequestHandler = function (req, res, headers) {
    var resObject = {};
    if(this.tName){
        var tName = this.tName;
        var reqPromise = null;
        switch (req.method.toUpperCase()){
            case 'GET':
                reqPromise = Utl.DB.getTable(tName);
                break;
            case 'POST':
                break;
            case 'DELETE':
                break;
        }

        if(reqPromise){
            reqPromise.then(function (tData) {
                resObject.Body = tData;
                Utl.sendResObject(res, headers, resObject);
            });
        }else{
            Utl.sendResObject(res, headers, resObject);
        }
    }else{
        Utl.sendResObject(res, headers, resObject);
    }

};

Utl.DB.Tables.forEach(function (lItem) {
    routings.push(new Utl.RouteClass('/table/' + lItem.toLowerCase(), tableRequestHandler.bind({ tName: lItem})));
});


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



Utl.DB.rootPath = __dirname;

Utl.DB.createDB().then(function () {
    Utl.DB.loadDB().then(function () {
        server.listen(5654, function() {
            console.log((new Date()) + ' Server is listening on port 5654');
        });
    });
});








