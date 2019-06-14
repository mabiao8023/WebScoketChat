// 服务端

// 引入 ws 模块
const WebSocket = require('ws');

// 端口号
const Port = 8089

// 创建 ws 服务器
const wss = new WebSocket.Server({ port: Port },function(){
    console.log((new Date()) + ' Server is listening on port '+ Port);
});
 
wss.on('connection', function connection(ws) {
    console.log('连接成功');
  ws.on('message', function incoming(message) {
    console.log('received: ', message);
    ws.send(message);
  });
});

// Broadcast to all.
// wss.broadcast = function broadcast(data) {
//   wss.clients.forEach(function each(client) {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(data);
//     }
//   });
//   console.log(wss.clients);
  
// };

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    console.log(data);
    
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});