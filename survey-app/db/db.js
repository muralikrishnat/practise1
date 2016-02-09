var restify = require('restify');

var LRU = require('lrucache');
var lrucache = LRU();

var Models = require('./schema/models.js');

var server = restify.createServer({
    name: 'mydb',
    version: '1.0.0'
});


var fs = require('fs');

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/rest/v1/:tablename', function (req, res, next) {
    res.send(lrucache.get('tablename'));
    return next();
});

server.post('/rest/v1/:tablename', function (req, res, next) {
    lrucache.set('tablename', req.params.tablename);
    res.send(lrucache.get('tablename'));
    return next();
});

server.get('/rest/v1/', function (req, res, next) {
    res.send(req.params);
    return next();
});


server.get('/', function (req, res, next) {
    console.log('trying to write file');
    fs.writeFile('data/questions.json', JSON.stringify({ "Id": "234324234-23423423-234-23-4234", "Name": "gmail2345"}), function(err) {
        if (err) throw err;
        console.log(err);
        console.log('It\'s saved!');
    });
    res.send(req.params);
    return next();
});

server.listen(7867, function () {
    console.log('%s listening at %s', server.name, server.url);
});


