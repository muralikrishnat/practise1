var restify = require('restify');

var server = restify.createServer({
    name: 'mydb',
    version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


server.get('/rest/v1/db', function (req, res, next) {
    var tables = [];
    tables.push("a360");
    res.send(tables);
    return next();
});

var tables  = [];
tables.push("Hub");
tables.push("User");
server.get('/rest/v1/db/a360/tables', function (req, res, next) {
    res.send(tables);
    return next();
});

server.get('/rest/v1/db/a360/tables/hub', function (req, res, next) {
    var hubs = [];
    res.send(hubs);
    return next();
});


server.get('/rest/v1/', function (req, res, next) {
    res.send(req.params);
    return next();
});

server.listen(7867, function () {
    console.log('%s listening at %s', server.name, server.url);
});



