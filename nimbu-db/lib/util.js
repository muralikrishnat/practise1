var jsonfile = require('jsonfile');
var util = {};

var LRU = require('lrucache');
var lrucache = LRU();

util.loadDB = function () {
    return new Promise(function (resolve, reject) {
        var tableList = ['user', 'question'];
        var tablePromises = [];
        tableList.forEach(function (loopItem) {
            tablePromises.push(new Promise(function(resolveInner, rejectInner){
                jsonfile.readFile('data/' + loopItem + '.json', function (err, data) {
                    if(!err){
                        lrucache.set(loopItem + 's', data[loopItem + 's']);
                    }
                    resolveInner(data);
                });
            }));
        });
        Promise.all(tablePromises).then(function (rt) {
           resolve(rt);
        })
    });
};

util.openDB = function (dbPath, options) {
    jsonfile.readFile('data/user.json', function (err, data) {
        if(err){
            options.res.end(JSON.stringify(err));
            return options.next();
        }
        options.res.end(JSON.stringify(data));
        options.next();
    });
};

util.writeDB = function (dbPath, options) {
    jsonfile.writeFile('data/user.json', { "user": [] }, function (err) {
        if(err){
            options.res.end(JSON.stringify(err));
            return options.next();
        }
        options.res.end("Created Successfully ");
        options.next();
    });
};

module.exports = util;