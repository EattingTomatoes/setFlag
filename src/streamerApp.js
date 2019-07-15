import Vue from 'vue'
import StreamerApp from './anchor/App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(StreamerApp),
}).$mount('#aroot')
