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
    <el-container>
      <el-main>
        聊天内容112345678
        <ul>
          <template v-for="(msg,idx) in msgs">
            <li :key="idx"> {{msg.content}}</li>
          </template>
        </ul>

      </el-main>
      <el-footer>
        <el-input
          type="text"
          :autosize="{ minRows: 1, maxRows: 2}"
          placeholder="请输入内容"
          v-model="textareaChat"
        >
          <el-button
            slot="append"
            @click="test"
          >发送</el-button>
        </el-input>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      input_search: "",
      msgs: [],
      textareaChat: "1433223",
    };
  },
  created() {
    this.initWebSocket();

  },
  methods: {
    // 测试发送信息
    test() {
      if (this.textareaChat !== "") {
        // Create WebSocket connection.
        const socket = new this.$websocket("ws://localhost:8089");
        
        // Connection opened
        socket.addEventListener("open", event => {
          let msg = this.textareaChat;
          socket.send("Hello Server! " + msg);
        });

        // Listen for messages
        socket.addEventListener("message", event => {
          console.log("Message from server ", event);
          console.log("Message from server ", event.data);
          this.msgs.push({ content: event.data });
        });
        // socket.onmessage = function incoming(data) {
        //   console.log(`Roundtrip time: ${Date.now() - data} ms`);

        //   setTimeout(function timeout() {
        //     socket.send(Date.now());
        //   }, 500);
        // };
      } else {
        this.$message.error("请先输入您要发送的信息");
      }
    },
    initWebSocket() {
      //初始化weosocket
      // console.log(this.$websocket);
      // const ws = new this.$websocket("ws://localhost:8089/");
      // this.socket = ws;
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

