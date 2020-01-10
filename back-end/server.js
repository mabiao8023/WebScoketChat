// 服务端

// 引入 ws 模块
const WebSocket = require('ws');

// 用户池
let clientList = {}

// 在线用户
let clientLive = []


// 端口号
const port = 18089

// 创建 ws 服务器,并开启 ws 端口监听
const wss = new WebSocket.Server({
  port
}, () => {
  // 成功回调
  console.log((new Date()) + ' -----> ws服务器创建成功，端口为： ' + port);
}
);


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



// 握手完成时发出
wss.on('connection', (ws, req) => {
  console.log('服务器连接成功');
  onMessage(ws)
});
// 监听连接和监听信息
function onMessage(ws) {
  ws.on('message', async data => {
    const Data = JSON.parse(data)
    if (Data.event === "connection") {
      console.log(Data.userName + "上线啦");
       addClientList(ws, Data)
       massTexting(ws, Data, false)
       computeLive()
      
    } else if (Data.event === "msg") {
      console.log(Data);
      
      if (Data.sendWho === "server") {
        // 群发
        console.log("all");
        
        massTexting(ws, Data, true)
      } else {
        // 发给个人
        console.log("no all");
        sendToUser(Data)
      }
    } else {
      console.log("发送类型出错");
      massTexting(ws, Data, true)
    }
  })
}

// 添加用户池
function addClientList(ws, data) {
  const { userName } = data
  const uId = {
    ws,
    userName
  }
  clientList[data.from] = uId
  // console.log(clientList);

}

// 消息群发
function massTexting(ws, msg, sendToSelf = false) {

  wss.clients.forEach(client => {

    if (client === ws && client.readyState === WebSocket.OPEN) {
      sendToSelf && client.send(JSON.stringify(msg))
    } else {
      client.send(JSON.stringify(msg))
    }
  })
}

// 发送到个人
function sendToUser(data) {
  console.log(data);
  
  const who = clientList[data.sendWho]
  // console.log(who);
  
  who.ws.send(JSON.stringify(data))
}


/**
 * 计算还在线上的用户
 */
function computeLive() {
  let _temp = [];
  wss.clients.forEach(client => {
    for (let x in clientList) {
      if (clientList[x]['ws'] == client) {
        if (client.readyState === WebSocket.OPEN) {
          _temp.push({
            uId: x,
            userName: clientList[x]['userName']
          });
        } else {
          delete (clientList[x]);
        }
      }
    }
  });
  clientLive = _temp;
  sendAllLive()
}

/**
 * 在线用户列表信息分发
 */
function sendAllLive() {
  const msg = {
    event: 'server',
    from: 'all',
    to: 'all',
    userName: 'server',
    type: 'others',
    data: clientLive  //将所有在线用户列表分发给所有在线用户，简便处理
  };
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg));
    }
  });
}



// setInterval(computeLive, 1000*5);
// setInterval(sendAllLive, 1000*5);
