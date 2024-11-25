import {
	useExchangeStore
} from "@/stores/modules/exchange";
import i18n from '../lang/'
import BigNumber from 'bignumber.js'
import {
	useAppStore
} from "../stores/modules/app";
// import {
// 	resolveBaseUrl
// } from "vite";

export default {
	fromWeiByEther(num) {
		// if (num) {
		// 	return Math.floor(web3.utils.fromWei(num, 'ether') * 1000000) / 1000000
		// }
		return 0;
	},
	toWeiByEther(num) {
		// if (num) {
		// 	num *= 1000000;
		// 	return web3.utils.toWei(num.toFixed(0).toString(), 'micro')
		// }
		return 0;
	},
	fromWei(amount, decimals, digits = 6) {
		let BN = BigNumber.clone() //生成一个独立的BigNumber构造函数
		BN.config({
			DECIMAL_PLACES: digits,
			ROUNDING_MODE: digits
		}) //设置小数点、舍入模式
		return BN(amount).div(Math.pow(10, decimals)).toNumber() //0.3333，注意跟上面计算结果的区别
	},
	getFullToday() {
		let time = new Date();
		let year = time.getFullYear();
		let month = time.getMonth() + 1;
		let day = time.getDay();
		return year * 10000 + month * 100 + day;
	},
	hideAccount(account, startLen = 4, endLen = 4) {
		if (!account) {
			return '';
		}
		return account.substring(0, startLen) + '...' + account.substring(account.length - endLen)
	},
	hideNumber(number, startLen = 2, endLen = 3) {
		if (!number) {
			return '';
		}
		return number.toString().substring(0, startLen) + '***' + number.toString().substring(number.toString().length -
			endLen)
	},
	endNumber(number, endLen = 4) {
		if (!number) {
			return '';
		}
		return number.toString().substring(number.toString().length - endLen)
	},
	subString(str, startIndex = 0, len = 0) {
		if (!str) {
			return '';
		}
		if (startIndex == 0 && len < 0) {
			// console.log('subString', str, str.length, str.length + len)
			len = str.length + len
			let substr = str.substring(0, len)
			// console.log('substr', substr);
			return substr;
		}
		if (startIndex < 0 && len == 0) {
			return str.substring(str.length + startIndex)
		}
	},
	// 格式数字
	toThousands(num, pad = true) {
		if (num < 1000) {
			if (num > 1) {
				return this.floorAmount(num);
			}
			return num;
		}
		num = num.toString().replace(/\$|\,/g, '');
		if (isNaN(num))
			num = "0";
		let sign = (num == (num = Math.abs(num)));
		num = Math.floor(num * 100 + 0.50000000001);
		let cents = num % 100;
		num = Math.floor(num / 100).toString();
		if (cents < 10)
			cents = "0" + cents;
		for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
			num = num.substring(0, num.length - (4 * i + 3)) + ',' +
			num.substring(num.length - (4 * i + 3));
		// console.log('toThousands', num, cents)
		if (!pad) {
			cents = cents / 10
		}
		return (((sign) ? '' : '-') + num + '.' + cents);
	},
	//格式化金钱
	toMoney(value) {
		if (!Number.isNaN(value)) {
			value = parseFloat(value);
		}
		const options = {
			style: 'currency',
			currency: 'CNY',
		};
		return value.toLocaleString('zh-CN', options);
	},
	unitConverter(num, digits = 2) {
		if (isNaN(Number(num, 10))) {
			return num;
		}
		if (num) {
			const divisor = num >= 0 ? 1 : -1;
			// console.log('num1', num)
			// num = Math.abs(num);
			// console.log('num2', num)

			num = num.toString().replace('-', '').split("."); // 分隔小数点
			var arr = num[0].split("").reverse(); // 转换成字符数组并且倒序排列
			var res = [];
			for (var i = 0, len = arr.length; i < len; i++) {
				if (i % 3 === 0 && i !== 0) {
					res.push(","); // 添加分隔符
				}
				res.push(arr[i]);
			}
			res.reverse(); // 再次倒序成为正确的顺序

			if (num[1]) {
				// console.log('num[1]', num[1])
				if (num[1].length < 2) {
					// 如果有小数的话添加小数部分
					res = res.join("").concat("." + num[1] + '0');
				} else if (num[1].length >= digits) {
					let data = num[1].substring(0, digits)
					// 如果有小数的话添加小数部分
					res = res.join("").concat("." + data);
				} else {
					res = res.join("").concat("." + num[1]);
				}

			} else {
				res = res.join("").concat("." + '00');
			}
			if (divisor == -1) {
				res = '-' + res
			}
		} else {
			res = '0.00'
		}
		return res;
	},
	roundNumber(value, digits = 2) {
		return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits)
	},
	//格式化时间
	timestampToTime(timestamp, type) {
		if (!timestamp) return '';
		if (typeof timestamp === 'bigint') {
			timestamp = Number(timestamp)
		}
		if (type === undefined) type = 'Y-m-d H:i:s';
		let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		// const Y = date.getFullYear();
		// const m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
		// const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
		// const H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
		// const i = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		// const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		// return eval(type.replace(/\s/, " + ' ' + ").replace(/([:\-\/])/g, " + '$1' + "));

		type = type.replace('Y', 'YYYY')
		type = type.replace('m', 'mm')
		type = type.replace('d', 'dd')
		type = type.replace('H', 'HH')
		type = type.replace('i', 'MM')
		type = type.replace('s', 'SS')

		return this.dateFormat(type, date)
	},
	dateFormat(fmt, date) {
		//dateFormat("YYYY-mm-dd HH:MM", date)
		let ret;
		const opt = {
			"Y+": date.getFullYear().toString(), // 年
			"m+": (date.getMonth() + 1).toString(), // 月
			"d+": date.getDate().toString(), // 日
			"H+": date.getHours().toString(), // 时
			"M+": date.getMinutes().toString(), // 分
			"S+": date.getSeconds().toString() // 秒
			// 有其他格式化字符需求可以继续添加，必须转化成字符串
		};
		for (let k in opt) {
			ret = new RegExp("(" + k + ")").exec(fmt);
			if (ret) {
				fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
			}
		}
		return fmt;
	},
	timeAlgo(timestamp) {
		if (typeof timestamp === 'bigint') {
			timestamp = Number(timestamp)
		}
		const now = (new Date().getTime() / 1000);
		let diff = now - timestamp
		if (diff > 3600) {
			return (diff / 3600).toFixed(0) + 'h'
		}
		if (diff > 60) {
			return (diff / 60).toFixed(0) + 'm'
		}
		return diff.toFixed(0) + 's'
	},
	time2Chat(date) {
		const time = new Date(date);
		const now = new Date();
		if (time.getFullYear() == now.getFullYear() && time.getMonth() == now.getMonth()) {
			return this.dateFormat('mm-dd HH:MM', time);
		}
		return this.dateFormat('YY-mm-dd', time);
	},
	getNowTime(type) {
		return this.dateFormat(type, new Date())
	},
	getNowTimeDelta(deltaSecond, type) {
		const timestamp = new Date().getTime();
		return this.dateFormat(type, new Date(timestamp + deltaSecond * 1000))
	},
	getRemain(datetime) {
		console.log('getRemain', datetime)
		let date = new Date(datetime);
		let remain = (date.getTime() - (new Date()).getTime()) / 1000
		if (remain < 0) {
			remain = 0;
		}
		return remain;
	},
	USDT2CNY(amount, digits = 4) {
		const store = useExchangeStore()
		// if (amount < 1) {
		// 	return amount * store.rate;
		// }
		if (amount) {
			// let money = Math.floor(amount * store.rate * Math.pow(10, digits)) / Math.pow(10, digits)
			let money = amount * store.rate
			// if (digits < 4) {
			// 	//保留4位
			// 	return (Math.floor(money * 100) / 100).toFixed(2);
			// }
			// if (digits < 6) {
			// 	//保留4位
			// 	return Math.floor(money * 1000000) / 1000000;
			// }
			// return money;
			// return Math.floor(money * Math.pow(10, digits)) / Math.pow(10, digits);

			// return money.toFixed(digits);
			return this.unitConverter(money, digits)
		}
		return 0;
	},
	getMoneyFmt(amount, digits = 4) {
		const appStore = useAppStore()
		let unit = appStore.unit == 'CNY' ? '￥' : '$'
		// console.log('getMoneyFmt', amount)
		if (amount) {
			// let money = Math.floor(amount * store.rate * Math.pow(10, digits)) / Math.pow(10, digits)
			const store = useExchangeStore()
			// console.log('getMoneyFmt rate', store.rate)
			let money = amount;
			if (appStore.unit == "CNY") {
				money = amount * store.rate
			}
			// return money.toFixed(digits);
			return unit + ' ' + this.unitConverter(money, digits)
		}
		return unit + ' ' + 0;
	},
	getNumberStart(amount) {
		if (amount) {
			return Math.floor(amount)
		}
		return 0;
	},
	getNumberEnd(value, bit = 4, pad = true) {
		if (!value) {
			return pad ? ''.padEnd(bit, '0') : '0';
		}
		let str = value.toString();
		let index = str.indexOf('.')
		if (index === -1) {
			return pad ? ''.padEnd(bit, '0') : '0';
		}
		str = str.substring(index + 1, index + 1 + bit)
		return pad ? str.padEnd(bit, '0') : str
	},
	formatNumberEnd(value, minDigits = 2, maxDigits = 6) {
		if (!value) {
			return ''.padEnd(minDigits, '0');
		}
		let str = value.toString();
		let index = str.indexOf('.')
		if (index === -1) {
			return ''.padEnd(minDigits, '0');
		}
		str = str.substring(index + 1, index + 1 + maxDigits);
		if (str.length < minDigits) {
			return str.padEnd(minDigits, '0')
		}
		return str;
	},
	formatNumberLtTen(value) {
		if (value < 10) {
			return '0' + value;
		}
		return value;
	},
	formatNumber2(number, max_digits = 2, min_digits = 0) {
		// if (!number) {
		// 	return number;
		// }
		if (isNaN(Number(number, 10))) {
			return number;
		}
		const divisor = number >= 0 ? 1 : -1;
		number = Math.abs(number);
		let num = (number || 0).toString();

		let result = '';
		let dot = '';
		let right = '';
		if (num.indexOf(".") > -1) {
			let arr = num.split(".")
			num = arr[0]
			right = arr[1]
			dot = ".";
		}
		while (num.length > 3) {
			result = ',' + num.slice(-3) + result;
			num = num.slice(0, num.length - 3);
		}

		if (max_digits > 0) {
			// console.log('max_digits', right.slice(0, max_digits));
			right = right.slice(0, max_digits) + '';


			if (right.length > 0 && right > 0) {
				dot = '.'
			}

			//去除0.00的数据。1.00显示为1
			if (!right || right <= 0) {
				right = ''
				dot = ''
			}

		}
		if (min_digits > 0 && right.length < min_digits) {
			right = right.padEnd(min_digits, '0')
			dot = '.'
		}
		result = num + result + dot + right;
		if (divisor == -1) {
			result = '-' + result;
		}
		return result;
	},
	formatNumber(number, max_digits = 2, min_digits = 0) {
		return this.formatNumber2(number, max_digits, min_digits);
		// return new Intl.NumberFormat('en-US', {
		// 	minimumFractionDigits: min_digits,
		// 	maximumFractionDigits: max_digits
		// }).format(
		// 	number
		// )
	},
	floorAmount(value, digits = 2) {
		return Math.floor(value * Math.pow(10, digits)) / Math.pow(10, digits)
	},
	floorAmountMinDigits(value, digits) {
		return this.getNumberStart(value) + '.' + this.getNumberEnd(value, digits);
	},
	getNumberUpOrDown(value, digits) {
		if (digits) {
			value = this.unitConverter(value, 2)
		}
		if (value > 0) {
			return '+' + value;
		}
		return value;
	},
	isJSON(str) {
		if (typeof str == 'string') {
			try {
				JSON.parse(str);
				return true;
			} catch (e) {
				// console.log(e);
				return false;
			}
		}
		return false;
		// console.log('It is not a string!')
	},
	checkTxHashOk(txHash, successCall, errCall = null) {
		if (txHash == null || txHash === '') {
			errCall()
			return
		}
		let total = 0;
		let timer = setInterval(async () => {
			let result = await web3.eth.getTransactionReceipt(txHash);
			console.log(result)
			if (result != null) {
				clearInterval(timer);
				if (result.status) {
					successCall()
				} else {
					errCall()
				}
			}
			total += 300;
			if (total >= 10000) {
				clearInterval(timer);
			}
		}, 500);
	},
	clickedTimeOut(obj, timeout = 1000) {
		setTimeout(() => {
			obj.value = false;
		}, timeout)
	},
	async copyClick(Text, showTip = true) {
		let t = i18n.global.t;
		uni.setClipboardData({
			data: Text,
			showToast: false,
			success: function() {
				// uni.showToast({
				// 	title: t('message.copySuccess'),
				// 	duration: 2000,
				// 	icon: 'success'
				// });
				if (showTip) {
					uni.$u.toast(t('message.copySuccess'))
				}
			},
			fail: function() {
				uni.showToast({
					title: t('message.copyFail'),
					duration: 2000,
					icon: 'error'
				});
			},
		});
	},
	navigateTo(url, params = null) {
		// if (params) {
		// 	url += '?params=' + encodeURIComponent(JSON.stringify(params))
		// }
		// console.log(url)
		// uni.navigateTo({
		// 	url: url
		// });
		uni.$u.route({
			url: url,
			params: params
		})
	},
	navigateToWithEncode(url, params = null) {
		if (params) {
			url += '?params=' + encodeURIComponent(JSON.stringify(params))
		}
		uni.navigateTo({
			url: url
		});
	},
	//不能格式化 代码
	navigateToWithEncodeMultiply(url, params = null, callback = null) {
		if (params) {
			let dataKeys = Object.keys(params)
			dataKeys.forEach((item, index) => {
				// if(Object.prototype.toString.call(params[item]) === '[object Object]') {
				// 	console.log('params[item] [object Object]');
				// }
				url += (
					`${0 === index ? "?" : ""}${item}=${Object.prototype.toString.call(params[item]) === '[object Object]'?encodeURIComponent(JSON.stringify(params[item])):params[item]}${dataKeys.length - 1 !== index ? "&" : ""}`
					)
			})
		}
		// console.log(url);
		// return;
		uni.navigateTo({
			url: url,
			success: function(res) {
				console.log('navigateTo success', res)
				if (callback) {
					console.log('navigateTo success callback')
					callback(res);
				}
			}
		});
	},
	redirectTo(url, params = null) {
		uni.$u.route({
			type: 'redirectTo',
			url: url,
			params: params
		})
	},
	redirectToEncode(url, params = null) {
		if (params) {
			url += '?params=' + encodeURIComponent(JSON.stringify(params))
		}
		uni.redirectTo({
			url: url
		});
	},
	navigateBack(delta = 1) {
		uni.navigateBack({
			delta: delta,
			animationType: 'pop-out',
			animationDuration: 200
		});
	},
	getDiffDay(date_1, date_2) {
		let totalDays, diffDate
		let myDate_1 = Date.parse(date_1)
		let myDate_2 = Date.parse(date_2)
		diffDate = Math.abs(myDate_1 - myDate_2)
		totalDays = Math.floor(diffDate / (1000 * 3600 * 24))
		return totalDays
	},
	getTimeAgoForNews(time) {
		let totalDays = this.getDiffDay(new Date(time), new Date)
		if (totalDays < 7) {
			return this.dateFormat('mm-dd', new Date(time))
		}
		if (totalDays < 30) {
			return '1周前'
		}
		return '1月前'
	},
	getAvatar(avatar) {
		if (avatar) {
			return uni.$u.http.config.baseURL + avatar;
		}
		return null
	},
	simplifyNum(number) {
		if (!number && number != 0) return number;
		let str_num
		// if (number >= 1E3 && number < 1E4) {
		// 	str_num = number / 1E3
		// 	return this.floorAmountMinDigits(str_num, 2) + '千'
		// } else 
		if (number >= 1E4 && number < 1E7) {
			str_num = number / 1E4
			return this.toThousands(str_num) + '万'
		} else if (number >= 1E7 && number < 1E8) {
			str_num = number / 1E7
			return this.toThousands(str_num) + '千万'
		} else if (number >= 1E8) {
			str_num = number / 1E8
			return this.toThousands(str_num) + '亿'
		}
		// else if (number >= 1E10 && number < 1E11) {
		// 	str_num = number / 1E10
		// 	return this.floorAmount(str_num, 2) + '百亿'
		// } else if (number >= 1E11 && number < 1E12) {
		// 	str_num = number / 1E11
		// 	return this.floorAmount(str_num, 2) + '千亿'
		// } else if (number >= 1E12) {
		// 	str_num = number / 1E12
		// 	return this.floorAmount(str_num, 2) + '万亿'
		// }

		return this.toThousands(number);
	},
	logout() {
		uni.removeStorageSync('token')
		this.redirectTo('/pages/login/login')
	},
	sleep(timeout) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, timeout);
		});
	},
	httpBuild(params) {
		// #ifdef H5
		return new URLSearchParams(params).toString()
		// #endif
		let str = ""
		for (let key in params) {
			str += key + "=" + params[key] + "&"
		}
		return str.substr(0, str.length - 1)
	},
	toast(msg) {
		uni.$u.toast(msg)
	},
	toastSuccess(msg) {
		uni.showToast({
			title: msg,
			icon: 'success',
			duration: 2000
		})
	},
	toastError(msg) {
		uni.showToast({
			title: msg,
			icon: 'error',
			duration: 2000
		})
	},
	toastFail(msg) {
		uni.showToast({
			title: msg,
			icon: 'fail',
			duration: 2000
		})
	},
	toastLoading(msg) {
		uni.showToast({
			title: msg,
			icon: 'loading',
			duration: 2000
		})
	},
	/**
	 * Format bytes as human-readable text.
	 * 
	 * @param bytes Number of bytes.
	 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
	 *           binary (IEC), aka powers of 1024.
	 * @param dp Number of decimal places to display.
	 * 
	 * @return Formatted string.
	 */
	humanFileSize(bytes, si = false, dp = 1) {
		const thresh = si ? 1000 : 1024;

		if (Math.abs(bytes) < thresh) {
			return bytes + ' B';
		}

		const units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB',
			'ZiB', 'YiB'
		];
		let u = -1;
		const r = 10 ** dp;

		do {
			bytes /= thresh;
			++u;
		} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


		return bytes.toFixed(dp) + ' ' + units[u];
	},
	randomString(length) {
		var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var result = '';
		for (var i = length; i > 0; --i)
			result += str[Math.floor(Math.random() * str.length)];
		return result;
	},
	scanCode() {
		return new Promise((resolve, reject) => {
			uni.scanCode({
				success: res => {
					console.log('条码类型：' + res.scanType);
					console.log('条码内容：' + res.result);
					if (res.scanType == "QR_CODE") {
						if (res.result.startsWith("ethereum:")) {
							let result = res.result.substr(8, res.result.length)
							resolve(result);
						}
					}
					resolve(res.result)
				},
				fail: res => {
					reject(res)
				}
			});
		})
	}
}