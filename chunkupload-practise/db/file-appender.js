var path = require('path');
var fs = require('fs');

var chunkPaths = path.resolve(__dirname, '../files');
var fileName = "angularjs-cookbook-sample";
var fileExt = "pdf";
var chunkCount = 2;

var bufferData = [];
for(var i = 0 ;i < chunkCount; i++){
    var chunkName =  fileName + '-' + i + '.' + fileExt;
    //fs.readFile(chunkPaths + '/' + chunkName, function (ferr, fdata) {
    //    fs.writeFile(chunkPaths + '/test.pdf' ,fdata);
    //});



    fs.open(chunkPaths + '/' + chunkName, 'r', function(status, fd) {
        if (status) {
            console.log(status.message);
            return;
        }

        console.log('', fd);
        //var buffer = new Buffer(100);
        //fs.read(fd, buffer, 0, 100, 0, function(err, num) {
        //    bufferData.push(buffer);
        //});
    });
}






