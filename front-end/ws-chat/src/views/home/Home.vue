<template>
  <el-container>
    <el-aside width="200px">
      <el-row>
        <el-col :span="24">
          <div class="grid-content contact_search">
            <el-input
              size="small"
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model="input_search"
            >
            </el-input>
          </div>
          <el-row>
            <el-button @click="test">发送消息</el-button>
            <el-button type="primary">主要按钮</el-button>
            <el-button type="success">成功按钮</el-button>
            <el-button type="info">信息按钮</el-button>
            <el-button type="warning">警告按钮</el-button>
            <el-button type="danger">危险按钮</el-button>
          </el-row>
        </el-col>
      </el-row>
      <div>
        <el-row>
          <el-col :span="24">
            <div class="grid-content contact_list">
              <el-badge
                is-dot
                class="item"
              >
                <el-button
                  class="share-button"
                  icon="el-icon-share"
                  type="primary"
                ></el-button>
              </el-badge>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-aside>
    <el-main>
      聊天内容112345678
      <ul>
        <template v-for="(msg,idx) in msgs">
          <li :key="idx"> {{msg.content}}</li>
        </template>
      </ul>

    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      input_search: "",
      msgs: [],
      clientData: ""
    };
  },
  created() {
    this.initWebSocket();
  },
  methods: {
    test() {
      console.log(1234567);
      let msg = "hello world !";
      this.clientData.send(msg);
    },
    initWebSocket() {
      //初始化weosocket
      console.log(this.$websocket);
      const WebSocketClient = this.$websocket.w3cwebsocket;
      const client = new WebSocketClient(
        "ws://localhost:8080/",
        "echo-protocol"
      );
      console.log(client);
      this.clientData = client;
      client.onerror = function() {
        console.log("Connection Error");
      };

      client.onopen = function() {
        console.log("WebSocket Client Connected");

        function sendNumber() {
          if (client.readyState === client.OPEN) {
            var number = Math.round(Math.random() * 0xffffff);
            client.send(number.toString());
            client.send("hello world !");
            setTimeout(sendNumber, 1000);
          }
        }
        // sendNumber();
      };

      client.onclose = function() {
        console.log("echo-protocol Client Closed");
      };

      client.onmessage = e => {
        if (typeof e.data === "string") {
          console.log("Received: '" + e.data + "'");
          console.log("test: " + e.data);
          this.msgs.push({ content: e.data });
        }
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
}
.el-aside {
  background: #e6e6e6;
}
.el-main {
  color: #303133;
}
.grid-content {
  border-radius: 4px;
  min-height: 56px;
  padding: 10px;
}
.contact_search {
  background: #eeebe9;
}
.contact_list {
  background: #e8e7e7;
}
</style>

