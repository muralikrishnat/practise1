var U = {};

var cookie = require('cookie');

U.guid = function(len) {
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

U.getCookies = function (req) {
    var reqCookies = {};
    if (req.headers && req.headers.cookie) {
        reqCookies = cookie.parse(req.headers.cookie);
    }
    return reqCookies;
};

U.makerequestold = function (headers) {
    headers['Set-Cookie'] = 'cuid=' + U.guid();
    return headers;
};

U.isNewRequest = function (req) {
    if(req.headers && req.headers.cookie){
        var reqCookies = cookie.parse(req.headers.cookie);
        if(reqCookies.cuid){
            return false;
        }
    }
    return true;
};

U.RouteClass = function (u, f) {
    this.Url = u;
    this.Fn = f;
};

U.sendResObject = function (res, headers, resObject) {
    res.writeHead(200, headers);
    res.end(JSON.stringify(resObject));
};



module.exports = U;