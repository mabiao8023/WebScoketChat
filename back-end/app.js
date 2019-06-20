// 服务端

// 引入 ws 模块
const WebSocket = require('ws');
// 端口号
const Port = 8089
// 创建 ws 服务器
const wss = new WebSocket.Server({ port: Port }, function () {
  console.log((new Date()) + ' --> ws服务器创建成功，端口为： ' + Port);
});


// 绑定基础服务器时发出
wss.on('listening', function connection() {
  console.log("绑定服务器成功");
});

// 服务器关闭时发出
wss.on('close', function connection() {
  console.log("服务器关闭");
});

// 在底层服务器上发生错误时发出。
wss.on('error', function connection(err) {
  console.log("服务器错误：" + err);
});

// 在响应标头作为握手的一部分写入套接字之前发出
wss.on('headers', function connection(head,req) {
  // console.log(head,req);
});

// 握手完成时发出
wss.on('connection', function connection(ws) {
  console.log('连接成功');
  ws.on('message', function incoming(message) {
    console.log('收到消息: ', message);
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
// wss.on('connection', function connection(ws) {
//   ws.on('message', function incoming(data) {
//     console.log(data);

//     // Broadcast to everyone else.
//     wss.clients.forEach(function each(client) {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(data);
//       }
//     });
//   });
// });