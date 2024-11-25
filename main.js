import App from './App'
import './pages/tailwind.css';
import uviewPlus, {setConfig} from 'uview-plus'
import {initRequest} from './utils/request/index'

import vueI18n from './lang/Index'
import * as Pinia from 'pinia';

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
// 引入请求封装，将app参数传递到配置中

import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(Pinia.createPinia());
	initRequest(app);
	app.use(uviewPlus)
	// 调用setConfig方法，方法内部会进行对象属性深度合并，可以放心嵌套配置
	// 需要在app.use(uview-plus)之后执行
	// setConfig({
	// 	// 修改$u.config对象的属性
	// 	config: {
	// 		// 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
	// 		unit: 'rpx'
	// 	},
	// 	// 修改$u.props对象的属性
	// 	// props: {
	// 	// 	// 修改radio组件的size参数的默认值，相当于执行 uni.$u.props.radio.size = 30
	// 	// 	radio: {
	// 	// 		size: 15
	// 	// 	}
	// 	// 	// 其他组件属性配置
	// 	// 	// ......
	// 	// }
	// })
	app.use(vueI18n)
	return {
		app,
		Pinia, // 此处必须将 Pinia 返回
	}
}
// #endif