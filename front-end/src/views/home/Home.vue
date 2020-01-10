<template>
  <div class="container">
    <div class="bg"></div>
    <el-card class="box-card" shadow="always">
      <div class="card-con">
        <div class="menu">
          <div class="logo">
            <el-avatar class="avatar" shape="square" size="medium" :src="avatarURL"></el-avatar>
          </div>
          <div class="menu-list">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              background-color="#28282a"
              text-color="#fff"
              active-text-color="#09BB07"
              :collapse="true"
            >
              <el-menu-item index="1">
                <i class="el-icon-chat-line-round"></i>
                <span slot="title">聊天</span>
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-user-solid"></i>
                <span slot="title">通讯录</span>
              </el-menu-item>
              <el-menu-item index="3">
                <i class="el-icon-price-tag"></i>
                <span slot="title">收藏</span>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
        <div class="contact">
          <div class="search">
            <el-row>
              <el-col :span="16">
                <el-input
                  placeholder="请输入内容"
                  size="mini"
                  style="margin-left:10px;"
                  prefix-icon="el-icon-search"
                  v-model="searchVla"
                ></el-input>
              </el-col>
              <el-col :span="8">
                <el-button style="margin-left:20px;" size="mini">搜索</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="contact-list">
            <el-scrollbar style="height:100%;width:100%;">
              <div
                :class="item.active?'contact-active contact-item':'contact-item'"
                v-for="(item,idx) in concatList"
                :key="idx"
                @click="contact(item)"
              >
                <el-avatar class="avatar">
                  <span class="avatar-text">{{item.lastName}}</span>
                </el-avatar>
                <div class="contact-info">
                  <div class="name">{{item.userName}}</div>
                  <p class="recent-info">这是一条信息，不管你信不信</p>
                  <span class="date">20/01/08</span>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div class="chat">
          <div class="chat-head">
            <span>{{whoChat}}</span>
          </div>
          <div class="chat-list">
            <el-scrollbar style="height:100%;width:100%;">
              <template v-for="(item,idx) in chatInfo">
                <div :key="idx" v-if="item.type==='others'">
                  <div class="chat-date">{{item.time}}</div>
                  <div class="chat-item">
                    <el-avatar class="avatar">
                      <span class="avatar-text">{{item.lastName}}</span>
                    </el-avatar>
                    <div class="chat-info">
                      <div class="el-popover el-popper popper-chat" x-placement="right-start">
                        {{item.msg}}
                        <div x-arrow class="popper__arrow" style="top: 12.5px;"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div :key="idx" v-else>
                  <div class="chat-date">{{item.time}}</div>
                  <div class="chat-item chat-item-right">
                    <el-avatar class="avatar">
                      <span class="avatar-text">{{item.lastName}}</span>
                    </el-avatar>
                    <div class="chat-info">
                      <div
                        class="el-popover el-popper popper-chat popper-chat-right"
                        x-placement="left-start"
                      >
                        {{item.msg}}
                        <div x-arrow class="popper__arrow" style="top: 12.5px;"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-scrollbar>
          </div>
          <div class="send-info">
            <el-scrollbar style="height:100%;width:100%;">
              <el-input
                type="textarea"
                :rows="2"
                :autosize="{ minRows: 4, maxRows: 40}"
                class="textarea-input"
                placeholder="请输入内容"
                v-model="sendInfo"
              ></el-input>
              <el-button
                size="small"
                class="send-btn"
                style="float:right;margin-right:20px;margin-top:6px;"
                @click="sendInfoBtn"
              >发送(S)</el-button>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import WS from "@/connect";
import { formatData } from "@/utils/common";
export default {
  data() {
    return {
      avatarURL:
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      searchVla: "",
      isShow: false,
      sendInfo: "",
      userName: "",
      defaultName: "张三",
      whoChat: "",
      chatInfo: [],
      sendWho: "all",
      concatList: [
        {
          userName: "群聊",
          lastName: "群",
          uId: "server",
          active: false
        },
      ]
    };
  },
  async created() {
    await this.init();
    await this.defaultActive();
  },
  methods: {
    getID(length = 0) {
      return Number(
        Math.random()
          .toString()
          .substr(3, length) + Date.now()
      ).toString(36);
    },
    defaultActive(id = "server") {
      if (id === "server") {
        this.whoChat = "群聊";
        this.sendWho = "server";
      }
      this.concatList.forEach(item => {
        if (id === item.uId) {
          item.active = true;
        } else {
          item.active = false;
        }
      });
    },
    init() {
      if (sessionStorage.userName) {
        this.userName = sessionStorage.userName;
        this.initWebSocket();
      } else {
        this.$prompt("请输入您的昵称", "", {
          confirmButtonText: "确定",
          showCancelButton: false,
          inputPlaceholder: "如：张三",
          inputPattern: /\S/,
          inputErrorMessage: "昵称不能为空",
          closeOnPressEscape: false,
          closeOnClickModal: false,
          showClose: false
        })
          .then(({ value }) => {
            sessionStorage.userName = value;
            this.userName = value;
            let uId = this.getID();
            sessionStorage.uId = uId;
            this.$message({
              type: "success",
              message: "你的昵称是: " + value
            });
            this.initWebSocket();
          })
          .catch(() => {
            sessionStorage.userName = this.defaultName;
            this.userName = this.defaultName;
            let uId = this.getID();
            sessionStorage.uId = uId;
            this.$message({
              type: "info",
              message: "未输入昵称，默认叫 " + this.defaultName
            });
            this.initWebSocket();
          });
      }
    },
    initWebSocket() {
      let Data = {
        event: "connection",
        from: sessionStorage.uId,
        userName: this.userName,
        sendWho: "all",
        msg: this.userName + "上线啦",
        time: new Date()
      };
      WS.openWS(Data);
      WS.onMessage(data => {
        console.log(data);
        let Data = JSON.parse(data.data);
        console.log(Data);
        if (Data.event === "connection") {
          this.$notify({
            message: Data.userName + "上线啦",
            type: "warning"
          });
        }
        if (Data.event === "msg") {
          let time = formatData(Data.time);
          let type = "";
          if (Data.userName === sessionStorage.userName) {
            type = "self";
          } else {
            type = "others";
            console.log("others");
          }
          
          console.log(this.chatInfo);
          if( Data.sendWho === this.sendWho){
            this.chatInfo.push({
              type,
              msg: Data.msg,
              time,
              lastName: Data.userName.substring(0, 1)
            });
              sessionStorage[this.sendWho] = JSON.stringify(this.chatInfo);
          }else{
            let oldInfo = ""
            // sessionStorage[this.sendWho]&&(oldInfo=sessionStorage[this.sendWho])
            oldInfo.concat([{
              type,
              msg: Data.msg,
              time,
              lastName: Data.userName.substring(0, 1)
            }])
            console.log(oldInfo);
            // sessionStorage[this.sendWho] = JSON.stringify(oldInfo)
          }

          
        }
        if (Data.event === "server") {
          this.concatList = [
            {
              userName: "群聊",
              lastName: "群",
              uId: "server",
              active: true
            }
          ];
          Data.data.forEach(item => {
            this.concatList.push({
              userName: item.userName,
              lastName: item.userName.substring(0, 1),
              uId: item.uId
            });
          });
        }
      });
    },
    sendInfoBtn() {
      if (this.sendInfo !== "") {
        let time = new Date().getTime();
        let Data = {
          event: "msg",
          from: sessionStorage.uId,
          userName: this.userName,
          sendWho: this.sendWho,
          msg: this.sendInfo,
          time
        };
        console.log(Data);
        if(Data.sendWho!=="server" && Data.sendWho !== Data.from){
          this.chatInfo.push({
            type: "self",
            msg: this.sendInfo,
            time,
            lastName: this.userName.substring(0, 1)
          });
        }
        WS.sendMsg(Data);
        this.sendInfo = "";
      } else {
        this.$message({
          message: "消息不能为空",
          type: "warning"
        });
      }
    },
    contact(info) {
      console.log(info);

      // if (sessionStorage[info.uId]) {
        this.chatInfo = JSON.parse(sessionStorage[info.uId]);
      // } else {
      //   this.chatInfo = [];
      // }
      this.defaultActive(info.uId);
      // this.whoChat = info.userName;
      // this.sendWho = info.uId;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  position: relative;
}
.bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("~@/assets/bg.jpg") no-repeat 100% 100%;
  -webkit-filter: blur(30px); /* Chrome, Opera */
  -moz-filter: blur(30px);
  -ms-filter: blur(30px);
  filter: blur(30px);
}
.box-card {
  position: absolute;
  left: 50%;
  top: 50%;
  border: none;
  transform: translate(-50%, -50%);
  width: 950px;
  height: 750px;
  /deep/ .el-card__body {
    padding: 0;
    height: 100%;
  }
}
.card-con {
  display: flex;
  flex-direction: row;
  height: 100%;
}
.menu {
  height: 100%;
  width: 64px;
  background: #28282a;
  .logo {
    height: 62px;
    position: relative;
    .avatar {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .menu-list {
    /deep/ .el-menu {
      border-right: none;
    }
  }
}
.contact {
  height: 100%;
  width: 250px;
  background: #eeebe8;
  .search {
    height: 62px;
    line-height: 62px;
  }
  .contact-list {
    width: 100%;
    height: calc(750px - 62px);
    .contact-item {
      height: 64px;
      padding: 10px;
      display: flex;
      .avatar {
        width: 40px;
        .avatar-text {
          font-size: 24px;
          font-weight: bold;
        }
      }
      .contact-info {
        flex: 1;
        margin-left: 10px;
        position: relative;
        .recent-info {
          padding-top: 5px;
          font-size: 12px;
          width: 150px;
          color: #999;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .date {
          position: absolute;
          right: 10px;
          top: 2px;
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
}
.chat {
  flex: 1;
  background: #f5f5f5;
  .chat-head {
    height: 62px;
    padding-left: 20px;
    line-height: 62px;
    font-size: 20px;
    border-bottom: 1px solid #e7e7e7;
  }
  .chat-list {
    height: calc(750px - 62px - 100px);
    .chat-item {
      display: flex;
      padding: 0 15px;
      .avatar {
        width: 38px;
        height: 38px;
        .avatar-text {
          font-size: 22px;
          font-weight: bold;
        }
      }
      .chat-info {
        flex: 1;
        position: relative;
        .popper-chat {
          min-width: 20px;
          max-width: 500px;
          padding: 8px 15px;
        }
      }
    }
    .chat-item-right {
      flex-direction: row-reverse;
    }
    .popper-chat-right {
      right: 0px;
    }
    .chat-date {
      font-size: 12px;
      padding-top: 15px;
      padding-bottom: 10px;
      text-align: center;
      color: #ccc;
    }
  }
  .send-info {
    overflow-x: hidden !important;
    height: 100px;
    background: #fff;
    border-top: 1px solid #e7e7e7;
    position: relative;
    .textarea-input {
      width: 530px;
      /deep/ .el-textarea__inner {
        border: none;
      }
    }
    .send-btn {
      position: absolute;
      right: 0px;
      bottom: 10px;
    }
  }
}
.contact-active {
  background: #e2e2e2;
}
</style>

