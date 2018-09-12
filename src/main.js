// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router';
import store from './store'
import { Button, Row,Col,Modal,Form,FormItem,LoadingBar ,Message ,Icon,Spin,Input  } from 'iview';
Vue.component('Button', Button);
Vue.component('Row', Row);
Vue.component('Col', Col);
Vue.component('Modal', Modal);
Vue.component('Form', Form);
Vue.component('FormItem', FormItem);
Vue.component('Message', Message);
Vue.component('Icon', Icon);
Vue.component('Spin', Spin);
Vue.component('Input', Input);


Vue.config.productionTip = false;
Vue.prototype.$Loading = LoadingBar;
Vue.prototype.$Message = Message;
Vue.prototype.$Modal = Modal;
Vue.prototype.$Spin = Spin;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
