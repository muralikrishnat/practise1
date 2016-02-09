window.App = (function () {
    var dbWsConfig = {
        url: 'ws://localhost:5654',
        protocol: 'echo-protocol'
    };
    var app = function () {
        var that = this;
        var DbWS = null;
        this.dbServer = {
            SocketObject: null
        };

        var guid = function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + '-' + (new Date).getTime();
        };

        var bindSocketEvents = function (sckt) {
            that.dbServer.SocketObject = sckt;
            sckt.onopen = function () {
                console.log("web socket connect established dude!!!!!");
            };

            sckt.onmessage = function (tr) {
                console.log('got the data from server ', tr);
                if(that.dbServer.onmessage){
                    that.dbServer.onmessage(tr);
                }
            };

            sckt.onclose = function () {
                console.log('ws disconnected!!! ');
            };

            that.dbServer.sendData = function (data) {
                //var busRequestData = { Headers: { Guid: that.Guid, atoken: true }, Body: data };
                //sckt.send(JSON.stringify(busRequestData));
            };

        };


        this.Guid = null;
        //this.Guid = guid();

        this.init = function (dbWsConf) {
            dbWsConfig = dbWsConf || dbWsConfig;

            DbWS = new WebSocket(dbWsConfig.url, dbWsConfig.protocol);
            bindSocketEvents(DbWS);
        };

        this.performAction = function (actionName, actionData) {
            return new Promise(function(resolve, reject){
                resolve();
            });
        };

        this.authenticate = function (loginData) {

        };

    };

    return new app();

})();