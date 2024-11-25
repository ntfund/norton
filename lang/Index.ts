import {
	createI18n
} from 'vue-i18n'
import en from './en'
import zh from './zh'

// let locale = uni.getStorageSync('locale');
// if (!locale) {
// 	//navigator.language.slice(0, 2),
// 	locale = 'zh'
// }

const i18n = createI18n({
	legacy: false, // 使用Composition API，这里必须设置为false
	globalInjection: true,
	global: true,
	// 如果本地有语言标识就采用本地，没有就根据浏览器语言默认标识显示语言
	locale: uni.getStorageSync('locale') || 'zh' || navigator.language.slice(0, 2),
	// fallbackLocale: 'en-us', // 默认语言
	messages: {
		zh,
		en
	}
});
export default i18n;