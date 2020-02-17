import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import { DatetimePicker } from 'vant';



Vue.config.productionTip = false
Vue.use(Vant);

Vue.use(DatetimePicker);

new Vue({
  render: h => h(App),
}).$mount('#app')
