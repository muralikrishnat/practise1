var restify = require('restify');

var dbUtil = require('./lib/util');

dbUtil.loadDB().then(function () {
   console.log("DB loaded Successfully");
});

//var server = restify.createServer({
//    name: 'mydb',
//    version: '1.0.0'
//});
//
//server.use(restify.acceptParser(server.acceptable));
//server.use(restify.queryParser());
//server.use(restify.bodyParser());
//
//
//var getApiInfo = function () {
//    var apiInfo = {};
//    apiInfo.Version = "0.1";
//    apiInfo.DevelopedBy = "Nimbu";
//    apiInfo.Tables = [];
//    var Category = function (t) {
//        this.Title = t;
//    };
//
//    apiInfo.Tables.push(new Category("User"));
//    apiInfo.Tables.push(new Category("Book"));
//
//    //apiInfo.Links.push(new Link('User', '/api/user', 'GET', 'Get all the Users'));
//    //apiInfo.Links.push(new Link('User', '/api/user/:id', 'GET', 'Get User details by Id'));
//    //apiInfo.Links.push(new Link('User', '/api/user/:id', 'DELETE', 'delete User by Id'));
//    //apiInfo.Links.push(new Link('User', '/api/user/:id', 'POST', "create User if posted data don't have Id"));
//    //apiInfo.Links.push(new Link('User', '/api/user/:id', 'UPDATE', 'create User if posted data has Id'));
//    return apiInfo;
//};
//
//server.get('/api/:tablename', function (req, res, next) {
//    //res.end("test" + __dirname);
//    dbUtil.openDB('', {req: req, res: res, next: next });
//});
//
//server.post('/api/:tablename', function (req, res, next) {
//    //res.end("test" + __dirname);
//    dbUtil.writeDB('', {req: req, res: res, next: next });
//});
//
//server.get('/', function (req, res, next) {
//    var apiInfo = getApiInfo();
//    var apiHtmlString = [];
//
//    var styleString = [];
//    styleString.push('<style>');
//    styleString.push('</style>');
//
//    apiHtmlString.push('<table style="width:80%;padding-top:30px;">');
//    apiHtmlString.push('<tr>');
//    apiHtmlString.push('<td> API Implemented By : <b>' + apiInfo.DevelopedBy + '</b></td>');
//    apiHtmlString.push('</tr>');
//
//    apiHtmlString.push('<tr> <td>API Version :  <b>' + apiInfo.Version + '</b></td></tr>');
//
//    apiHtmlString.push('<tr><td > <div style="margin-top:30px;">List of Tables : </div> ');
//
//    apiHtmlString.push('<ul>');
//    apiInfo.Tables.forEach(function (loopItem) {
//        apiHtmlString.push('<li>' + loopItem.Title + '</li>');
//    });
//
//    apiHtmlString.push('</ul>');
//
//
//    apiHtmlString.push('</td></tr>');
//
//    res.setHeader('Content-Type', 'text/html');
//    res.writeHead(200);
//
//    res.end('<html><head>' + styleString.join(' ') + '</head><body>' + apiHtmlString.join(' ') +'</body></head></html>');
//    next();
//});
//
//
//
//
//server.listen(4567, function () {
//    console.log('%s listening at %s', server.name, server.url);
//});