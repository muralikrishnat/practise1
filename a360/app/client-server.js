var static = require('node-static');
var file = new static.Server('./public');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(3434, function () {
    console.log((new Date()) + ' Server is listening on port 3434');
});