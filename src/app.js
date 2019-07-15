import Vue from 'vue'
import App from './user/App.vue'

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#root');

//index.html -> app.js -> App.vue