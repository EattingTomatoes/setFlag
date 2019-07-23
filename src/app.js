import Vue from 'vue'
import App from './user/App.vue'
import Button  from 'ant-design-vue/lib/button'
import "ant-design-vue/dist/antd.css";

Vue.component(Button.name, Button);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#root');

//index.html -> app.js -> App.vue