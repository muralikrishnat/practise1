var makeRequest = function (aUrl, aContent, options) {
    $.ajax({
        url: aUrl,
        method: 'POST',
        xhrFields:{
            withCredentials: true
        },
        data: aContent,
        complete: function (aResponse) {
            console.log("Got the response ", aResponse.responseJSON);
            if(options.callback){
                options.callback(aResponse);
            }
        }
    });
};


var saveDB = function () {
    var aObj = {};
    aObj.aName = "DB";
    aObj.aMethod = "POST";
    makeRequest('http://localhost:5654/api', aObj, { });
};

var getDB = function(tableName){
    var aObj = {};
    aObj.aName = tableName;
    aObj.aMethod = "GET";
    makeRequest('http://localhost:5654/api', aObj, { });
};

var updateTable = function (tableName, tableObj) {
    var aObj = {};
    aObj.aName = tableName;
    aObj.aMethod = "POST";
    aObj.aBody = JSON.stringify(tableObj);
    makeRequest('http://localhost:5654/api', aObj, {});
};