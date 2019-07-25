import Vue from 'vue'
import StreamerApp from './anchor/App.vue'
import Button  from 'ant-design-vue/lib/button'
import Input from 'ant-design-vue/lib/input'
import Icon from 'ant-design-vue/lib/icon'
import CheckBox from 'ant-design-vue/lib/checkbox'
import CheckBoxGroup from 'ant-design-vue/lib/checkbox/Group'
import "ant-design-vue/dist/antd.css";

Vue.component(CheckBoxGroup.name,CheckBoxGroup);
Vue.component(CheckBox.name, CheckBox);
Vue.component(Icon.name, Icon);
Vue.component(Input.name, Input);
Vue.component(Button.name, Button);
Vue.config.productionTip = false;

new Vue({
  render: h => h(StreamerApp),
}).$mount('#aroot')
