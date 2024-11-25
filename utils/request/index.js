// 引入配置
import * as config  from '@/config/http.js'
// 引入拦截器配置
import {
	requestInterceptors,
	responseInterceptors
} from './interceptors.js'
// 引入luch-request
import {
	http
} from 'uview-plus'
//  初始化请求配置
const initRequest = (vm) => {
	http.setConfig((defaultConfig) => {
		/* defaultConfig 为默认全局配置 */
		// console.log('config.baseUrl', config.baseUrl)
		defaultConfig.baseURL = config.baseURL /* 根域名 */
		return defaultConfig
	})
	requestInterceptors()
	responseInterceptors()
}
export {
	initRequest
}