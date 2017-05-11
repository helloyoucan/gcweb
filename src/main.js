import Vue from 'vue'
import App from './App'
import router from './router'
import vueResource from 'vue-resource'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/css/reset1.2.css'
import './assets/css/pagePublic.css'
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(vueResource);
new Vue({
	router,
	render: h => h(App)
}).$mount('#app');