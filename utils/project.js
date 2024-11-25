import {
	useUserStore
} from "@/stores/modules/user";
import {
	useBalanceStore
} from '@/stores/modules/userBalance'
import {
	getChatRoom,
	getUserInfo
} from "@/config/api";
import i18n from '../lang/'
import {
	S3Client,
	PutObjectCommand,
	CreateBucketCommand,
	DeleteObjectCommand,
	DeleteBucketCommand,
	paginateListObjectsV2,
	GetObjectCommand,
	S3
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import {
	isProxy,
	isRef,
	toRaw
} from "vue";
import {
	useTalkStore
} from "@/stores/modules/talk";
import { useAppStore } from "@/stores/modules/app";
import push from "./push";

export default {
	getRoomId(userId1, userId2) {
		if (userId1 < userId2) {
			return "user-" + userId1 + "-" + userId2;
		}
		return "user-" + userId2 + "-" + userId1;
	},
	getRoomType(room_id) {
		if (room_id.startsWith("user")) {
			return "user";
		} else if (room_id.startsWith("c2c")) {
			return "c2c"
		} else if (room_id.startsWith("room")) {
			return "group"
		}
		return "none";
	},
	async getIsRoomAdmin(room_id, user_id) {
		if (this.getRoomType(room_id) == "user") {
			return false
		}
		let id = this.getToRoomIdByRoomId(room_id)
		let result = false;
		let data = await getChatRoom(id);
		// console.log('getIsRoomAdmin', data)
		if (data.admin_id == user_id || data.admins.indexOf(user_id) > -1) {
			result = true;
		}
		// console.log('result', result)
		return result;
	},
	isRoomAdminByRoomAndMe(room) {
		const userStore = useUserStore();
		let result = false;
		let roomData = null;
		if (isProxy(room) || isRef(room)) {
			roomData = toRaw(room)
		} else {
			roomData = room
		}
		console.log('roomData', roomData)
		if (roomData.admin_id == userStore.user.id || roomData.admins.indexOf(userStore.user.id) > -1) {
			result = true;
		}
		return result;
	},
	isRoomOwnerByRoomAndMe(room) {
		const userStore = useUserStore();
		let result = false;
		if (room.admin_id == userStore.user.id) {
			result = true;
		}
		return result;
	},
	getToUserIdByRoomId(roomId) {
		let arr = roomId.split("-");
		let userStore = useUserStore();
		if (arr[1] == userStore.user.id) {
			return arr[2];
		}
		return arr[1]
	},
	getToRoomIdByRoomId(roomId) {
		let arr = roomId.split("-");
		return arr[1]
	},
	incrementBalanceChat(token_id, amount) {
		const userBalanceStore = useBalanceStore();
		userBalanceStore.increment(token_id, amount);
	},
	getPaymentSymbol(paymentName) {
		if (paymentName == "银行卡") {
			return 'bank';
		} else if (paymentName == "微信" || paymentName == "微信支付") {
			return 'wechat_pay';
		} else if (paymentName == "支付宝") {
			return 'alipay';
		}
		return 'None';
	},
	getPaymentName(paymentSymbol) {
		if (paymentSymbol == "bank") {
			return '银行卡';
		} else if (paymentSymbol == "wechat_pay") {
			return '微信支付';
		} else if (paymentSymbol == "alipay") {
			return '支付宝';
		}
		return '未知';
	},
	getFullURL(url) {
		if (!url) {
			console.log('getFullURL url is null')
			return url;
		}
		if (typeof url == "undefined") {
			console.log('url is undefined')
			return null;
		}
		try {
			if (url.startsWith('http') || url.startsWith('file://')) {
				return url;
			}
		} catch (e) {
			//TODO handle the exception
		}
		return uni.$u.http.config.baseURL + url;
	},
	getFirstChar(value) {
		return value.charAt(0)
	},
	getHideNickname(value) {
		if (value.length > 2) {
			return this.getFirstChar(value) + '**'
		}
		return this.getFirstChar(value) + '*'
	},
	getUser() {
		getUserInfo().then(user => {

			let userStore = useUserStore()
			let userBalanceStore = useBalanceStore()

			userStore.setUser(user);
			userBalanceStore.setValue(user.balances)
		})
	},
	getNote(msg) {
		if (msg.type == "system") {
			if (msg.msg.type == "friend" || msg.msg.type == "new-group") {
				return msg.msg.content.text;
			}
		} else if (msg.type == "user") //用户消息
		{
			//文本
			if (msg.msg.type == "text") {
				return msg.msg.content.text
			} else if (msg.msg.type == "img") {
				//图片
				return '图片'
			} else if (msg.msg.type == "transfer") {
				//图片
				return '您收到一笔转账'
			}
		}

		return '您收到一条新的消息';
	},
	sendMsg(room_id, content, type) {
		const talkStore = useTalkStore();
		if (talkStore.msg) {
			content.reply_id = talkStore.msg.msg.id
			talkStore.setMsg(null)
		}
		uni.$u.http.post('/chat/message', {
			room_id,
			content,
			type: this.getRoomType(room_id),
			contentType: type
		})
	},
	upload(params) {
		const uploadTask = uni.uploadFile({
			url: params.url || uni.$u.http.config.baseURL + '/api/upload/uploadFile', //仅为示例，非真实的接口地址
			filePath: params.filePath,
			name: params.name || 'file',
			formData: params.formData || {},
			header: {
				'Accept': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Authorization': `Bearer ${uni.getStorageSync('token')}`,
				'locale': uni.getStorageSync('locale') || i18n.global.locale.value || 'en'
			},
			success: (uploadFileRes) => {
				if (params.success) {
					params.success(uploadFileRes)
				}
			}
		});

		uploadTask.onProgressUpdate((res) => {
			// console.log('上传进度' + res.progress);
			// console.log('已经上传的数据长度' + res.totalBytesSent);
			// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

			if (params.progress) {
				params.progress(res, uploadTask)
			}

			// 测试条件，取消上传任务。
			// if (res.progress > 50) {
			// 	uploadTask.abort();
			// }
		});
	},
	async loadFile(path) {
		console.log('loadFile', path)
		return new Promise(resolve => { //文件读写是一个异步请求 用promise包起来方便使用时的async+await
			plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, fs => { //请求文件系统
					console.log(`_documents`);
					fs.root.getFile(
						path, { //请求地址文件  '/storage/emulated/0/config.txt'为根目录  '/config.txt'为/storage/Android/data/io.dcloud.HBuilder（包名）/documents/config.js
							create: false //当文件不存在时创建
						}, fileEntry => {
							fileEntry.file(function(file) {
								let fileReader = new plus.io
									.FileReader() //new一个可以用来读取文件的对象fileReader
								// fileReader.readAsText(file, 'utf-8') //读文件的格式
								fileReader.readAsDataURL(file) //读文件的格式
								fileReader.onerror = e => { //读文件失败
									console.log('获取文件失败', fileReader.error)
									plus.nativeUI.toast("获取文件失败,请重启应用", {
										background: '#ffa38c',
									})
									return
								}
								fileReader.onload = e => { //读文件成功
									resolve(e.target
										.result
									) ////回调函数内的值想返回到函数外部  就用promise+resolve来返回出去
								}
							})
						}, error => {
							console.log('2新建获取文件失败', error)
							plus.nativeUI.toast("获取文件失败,请重启应用", {
								background: '#ffa38c',
							})
							return
						})
				},
				e => {
					console.log('1请求文件系统失败', e.message)
					plus.nativeUI.toast("请求系统失败,请重启应用", {
						background: '#ffa38c',
					})
					return
				}
			)
		})

	},
	async login(address, message, signature, type = 'eth') {
		console.log('start login...')
		console.log('start push getClientId ...')
		let cid = await push.getClientId();
		console.log('login cid', cid)
		let result = true;
		let res = await uni.$u.http.post('/sanctum/app', {
			account: address,
			message: message,
			signature: signature,
			deviceId: uni.getDeviceInfo().deviceId,
			cid: cid,
			platform: uni.getSystemInfoSync().platform,
			type: type
		}).catch((error) => {
			console.log(error)
			result = false;
		})
		
		if (!result) {
			return false;
		}
		
		const balanceStore = useBalanceStore();
		const userStore = useUserStore();
		uni.setStorageSync('token', res.token)
		balanceStore.setValue(res.user.balances)
		userStore.setUser(res.user);
		
		const appStore = useAppStore();
		appStore.getC2CShopOrderCount();
		appStore.getNewFirendRecords();
		
		console.log('login success', res.user.account)
		
		return result;
	}
	

}