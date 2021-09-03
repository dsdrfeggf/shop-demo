import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'

// 导入字体图标
import './assets/fonts/iconfont.css'
//导入全局样式表
import './assets/CSS/global.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//将axios挂载到Vue的原型对象上,让组件可以通过$http来直接调用
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
