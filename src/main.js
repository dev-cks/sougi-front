// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
Vue.config.productionTip = false
import components from './components';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../static/styles/global.css'
import VueSimpleAlert from "vue-simple-alert";
import socketio from 'socket.io';
import VueSocketIO from 'vue-socket.io';
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueSignaturePad from 'vue-signature-pad';
Object.keys(components).forEach((key) => {
  var name = key.replace(/(\w)/, (v) => v.toUpperCase())
  Vue.component('v' + name, components[key])
})

Vue.config.productionTip = false;
import Vuelidate from 'vuelidate';
Vue.use(Loading);
Vue.use(Vuelidate);
Vue.use(VueSimpleAlert);
Vue.use(BootstrapVue)
Vue.use(VueSignaturePad);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
