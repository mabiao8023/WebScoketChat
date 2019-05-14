import Vue from 'vue'
import App from './App.vue'
import WebSocket from 'websocket'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import '@/assets/css/index.scss'

Vue.use(ElementUI);

Vue.prototype.$websocket = WebSocket

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
