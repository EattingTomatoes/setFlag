import Vue from 'vue'
import StreamerApp from './anchor/App.vue'

import "ant-design-vue/dist/antd.css";
import Vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css'
import Antd from 'ant-design-vue'

Vue.use(Antd);
Vue.component(Vuescroll.name, Vuescroll);

Vue.config.productionTip = false;

new Vue({
  render: h => h(StreamerApp),
}).$mount('#aroot')
