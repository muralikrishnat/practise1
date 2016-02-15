var WebSocketServer = require('websocket').server;

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}


wsServer.on('request', function(request) {
    //if (!originIsAllowed(request.origin)) {
    //    // Make sure we only accept requests from an allowed origin
    //    request.reject();
    //    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    //    return;
    //}

    var connection = request.accept('echo-protocol', request.origin);

    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {

        if (message.type === 'utf8') {
            var datafromClient = BuStand.parse(message.utf8Data);
            console.log('Received Message: ', message.utf8Data);
            connection.sendUTF(JSON.stringify(datafromClient));
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            //connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

    if(connection.connected){
        //connectionArray.push(new ConnectionObject(guid(), connection,))
        connection.sendUTF(guid());
    }
});