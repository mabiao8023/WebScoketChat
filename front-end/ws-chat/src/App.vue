<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  created() {
    this.initWebSocket();
  },
  methods: {
    initWebSocket() {
      //初始化weosocket
      console.log(this.$websocket);
      const WebSocketClient = this.$websocket.w3cwebsocket;
      const client = new WebSocketClient(
        "ws://localhost:8080/",
        "echo-protocol"
      );
      console.log(client);
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

      client.onmessage = function(e) {
        if (typeof e.data === "string") {
          console.log("Received: '" + e.data + "'");
        }
      };
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
