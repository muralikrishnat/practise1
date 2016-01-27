
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var globalConfig = require('./../globalconfig');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(globalConfig.rootPath, 'css')));
app.use(express.static(path.join(globalConfig.rootPath, 'client')));

var routes = require('./routes/index')(app);

app.use(function(req, res, next) {
    res.render(globalConfig.rootPath + '/client/index.jade',{ title:'Gulp Practise'});
});


module.exports = app;


/*
 var express = require('express');
 var viewRouter = express.Router();

 var apiRouter = express.Router();

 var globalConfig = require('./../../globalconfig');

 viewRouter.get('/', function(req, res, next) {
 res.render(globalConfig.rootPath + '/client/views/home.jade',{ title : 'HomePage'});
 res.end();
 });

 apiRouter.get('/', function(req, res, next) {
 res.send('this is api call');
 res.end();
 });

 var routerIndex = function(app){
 app.use('/views', viewRouter);
 app.use('/api', apiRouter);
 };

 module.exports = routerIndex;
 */