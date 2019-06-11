#!/usr/bin/env node
// 服务端
var WebSocketServer = require('websocket').server;
var http = require('http');
 
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);

    response.writeHead(404);
    response.end();
});

server.listen(8091, function() {
    // 创建连接
    console.log((new Date()) + ' Server is listening on port 8091');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});
 

 
wsServer.on('request', function(request) {
    console.log("连接成功");
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    // 服务端监听收到客户端信息
    connection.on('message', function(message) {
        
        if (message.type === 'utf8') {
            console.log('Received Message--: ' + message.utf8Data);
            console.log(listener);
            connection.sendUTF(message.utf8Data);
        }
       
    });
    // 客户端断开连接
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});