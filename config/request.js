//本文件已弃用，使用新版
//新版文件 @uitls/request/index.js
import i18n from '../lang/'
console.log('request locale:', i18n.global.locale.value)

import {
	baseURL
} from "./http";
// 初始化请求配置
uni.$u.http.setConfig((config) => {
	/* config 为默认全局配置*/
	config.baseURL = baseURL; /* 根域名 */
	// config.withCredentials = true;
	return config
})

//test
// uni.setStorageSync('token', '1|m1ro6Xlrjm6877OYRf1ar4qldbKtUBWRruS32iZC')

// 请求拦截
uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
	// console.log('config.custom', config.custom)
	if (config.custom && config.custom.noPrefix) {
		config.baseURL = config.custom.baseURL;		
	} else {
		config.url = '/api' + config.url
	}

	// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
	config.data = config.data || {}
	// 根据custom参数中配置的是否需要token，添加对应的请求头
	// if(config?.custom?.auth) {
	// 	// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
	// 	config.header.token = vm.$store.state.userInfo.token
	// }	
	// config.withCredentials = true;
	config.custom.catch = true
	config.header.Accept = 'application/json'
	config.header.Authorization = `Bearer ${uni.getStorageSync('token')}`
	config.header.locale = uni.getStorageSync('locale') || i18n.global.locale.value || 'en'
	return config
}, config => { // 可使用async await 做异步操作
	return Promise.reject(config)
})

// 响应拦截
uni.$u.http.interceptors.response.use((response) => {
	// console.log('response1', response)
	/* 对响应成功做点什么 可使用async await 做异步操作*/
	const data = response.data

	// 自定义参数
	const custom = response.config.custom
	if (data.code !== 200 && data.code !== 204 && data.code != 0) {
		// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
		if (!!custom && custom.toast !== false) {
			// uni.$u.toast(data.message)
			uni.$u.toast(data.msg)
		}

		// 如果需要catch返回，则进行reject
		if (!!custom && custom.catch) {
			return Promise.reject(data)
		} else {
			// 否则返回一个pending中的promise，请求不会进入catch中
			return new Promise(() => {})
		}
	}
	return data.data === undefined ? {} : data.data
}, (response) => {
	// 对响应错误做点什么 （statusCode !== 200）
	console.log('response2', response)

	const data = response.data
	if (response.statusCode == 401) {
		//身份验证 登录跳转
		// uni.$u.toast('身份信息已过期')
		uni.redirectTo({
			url: '/pages/login/loading'
		});
		
	} else if (response.statusCode == 404) {
		uni.$u.toast('网络请求地址不存在')
	} else if (response.statusCode == 422) {
		//表单验证错误
		// for (let key in data.errors) {
		// 	uni.$u.toast(data.errors[key])
		// }
		// uni.$u.toast(data.message)
		uni.showToast({
			title: data.message,
			icon: 'error'
		})
	} else if (response.statusCode == 429) {
		//网络错误
		uni.$u.toast('请求频繁，已被限制')
	} else if (response.statusCode == 405) {
		//网络错误
		uni.$u.toast('请求方法不存在')
	} else if (response.statusCode == 500) {
		//网络错误
		uni.$u.toast('网络请求错误')
	} else {
		uni.$u.toast(data.message)
	}

	return Promise.reject(response)
})