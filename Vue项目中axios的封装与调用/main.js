/**
 * Created with WebStorm.
 * User: SFZ
 * Date: 2018/7/10
 * Time: 15:13
 * Description:
 * To change this template use File | Settings | File Templates.
 */
/* eslint-disable */
import Vue from 'vue'
import App from './g5012App'
import commonUtil from './assets/js/commonUtil'
import TDMall from 'TDMall'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import router from './router'
import store from './store'
import api from './api' // 导入api接口

// global.TDMall = TDMall
// Vue.config.productionTip = false
Vue.use(vueResource)
Vue.use(MintUI)

Vue.prototype.$api = api; // 将api挂载到vue的原型上

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
