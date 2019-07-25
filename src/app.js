import Vue from 'vue'
import App from './user/App.vue'
import "ant-design-vue/dist/antd.css";
import Vuescroll from 'vuescroll';
import Antd from 'ant-design-vue'
import 'vuescroll/dist/vuescroll.css'

Vue.use(Antd);

Vue.component(Vuescroll.name, Vuescroll);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#root');

//index.html -> app.js -> App.vue