export default {
	get(url : string, data ?: {}) {
		return new Promise((resolve, reject) => {
			// 基本用法，注意：get请求的参数以及配置项都在第二个参数中
			uni.$u.http.get(url, { params: data }).then(res => {
				resolve(res)
			}).catch(err => {
				reject(err);
			})
		});
	},
	post(url : string, data ?: {}) {
		return new Promise((resolve, reject) => {
			// 基本用法，注意：get请求的参数以及配置项都在第二个参数中
			uni.$u.http.post(url, data).then(res => {
				resolve(res)
			}).catch(err => {
				reject(err);
			})
		});
	},
	config: http.config
}