import {
	useChatStore
} from "../stores/modules/chatStore";
import {
	useTabbarStore
} from "../stores/modules/tabbarStore";
import {
	useUserStore
} from "../stores/modules/user";

export default {
	async init() {
		await this.getClientId();
		uni.onPushMessage((res) => {
			/**
			 * 
			 * {
					"type": "receive",
					"data": {
						"__UUID__": "androidPushMsg108224368",
						"title": "norton-app",
						"appid": "__UNI__EEAF8FE",
						"content": "{name:'test'}",
						"payload": {
							"name": "test"
						}
					}
				}
				{
					"type": "click",
					"data": {
						"__UUID__": "androidPushMsg171864467",
						"title": "消息测试",
						"appid": "__UNI__EEAF8FE",
						"content": "消息测试22",
						"payload": {
							"title": "消息测试",
							"content": "消息测试22"
						}
					}
				}
			 */
			console.log("收到推送消息：", res) //监听推送消息
			//苹果和ios 通知消息格式不一致，兼容处理
			let payload = res.data.payload;

			if (typeof(res.data.payload.payload) != "undefined") {
				if (typeof(res.data.payload.payload) == "string") {
					payload = JSON.parse(res.data.payload.payload);
				} else [
					payload = res.data.payload.payload
				]
			}
			if (typeof(payload) == "string") {
				payload = JSON.parse(payload)
			}

			if (res.type == "receive") {
				/**
				 * 
				let options = {
				    cover: true, // 覆盖上次
				    when: new Date(),
				    title: '通知消息',
				  }
				plus.push.createMessage("欢迎使用Html5 Plus创建本地消息", "LocalMSG", options);  
				*/

				this.receiveHandle(payload)

			}
			if (res.type == "click") {
				//点击通知栏。
				// console.log("点击通知栏：", res)
				this.clickHandle(payload)
			}
		})
	},
	getClientId() {
		// #ifdef APP-PLUS
		let clientInfo = plus.push.getClientInfo(); //获取 clientID
		console.log('clientInfo', clientInfo);
		// #endif
		let timer;
		let count = 0;
		return new Promise((resolve, reject) => {			
			timer = setInterval(() => {
				uni.getPushClientId({
					success: (res) => {
						clearInterval(timer);
						console.log('clientid', res.cid);
						uni.setStorageSync('clientid', res.cid) //缓存到本地
						resolve(res.cid)
					},
					fail: (err) => {
						clearInterval(timer);
						console.log('getClientId err', err)
						resolve("")
					}
				})
				count++;
				if (count >= 5) { //1.5秒
					clearInterval(timer);
					console.log('getClientId timeout');
					resolve("")
				}
			}, 300)
		})
	},
	increaseBadge() {
		let badge = uni.getStorageSync('badge');
		if (!badge) {
			badge = 1;
		}
		uni.setStorageSync('badge', badge)
		plus.runtime.setBadgeNumber(badge);
	},
	//透传消息
	receiveHandle(data) {
		// console.log("handle receive message", data)
		//data = res.data.payload
		//透传消息。判断什么类别的消息。

		if (data.type && data.type == "chat") {
			//聊天消息。
			//1.判断是否在聊天窗口，如果在聊天窗口不通知，其他情况通知。
			const chatStore = useChatStore();
			const userStore = useUserStore();
			console.log(chatStore.roomId, data.room_id)
			if (chatStore.roomId != data.room_id) {
				console.log('聊天消息 创建通知栏')

				uni.createPushMessage({
					title: data.title1,
					content: data.content1,
					payload: JSON.stringify(data),
					cover: true, //折叠
					sound: 'system',
					when: new Date()
				})

				this.increaseBadge();
			} else {
				console.log('在聊天中，不创建')
			}

		} else {
			//其他消息
			console.log('其他消息 创建通知栏')
			uni.createPushMessage({
				title: data.title1,
				content: data.content1,
				payload: JSON.stringify(data),
				cover: false, //不折叠
				sound: 'system',
				when: new Date()
			})

			this.increaseBadge();
		}

	},
	//通知栏点击
	clickHandle(data) {
		// console.log("处理 点击 消息", data)
		if (data.type && data.type == "chat") {
			//聊天消息。
			//1.判断是否在聊天窗口，如果在聊天窗口不通知，其他情况通知。
			const chatStore = useChatStore();

			if (chatStore.roomId == data.room_id) {
				//不支持后续代码
				return;
			}
		}

		if (data.tab_index) {
			const tabStore = useTabbarStore();
			tabStore.updateValue(1) //底部聊天消息选中
		}

		if (data.url) {
			if (data.url_type == "tab") {
				uni.switchTab({
					url: data.url
				})
			} else {
				uni.navigateTo({
					url: data.url
				})
			}
		}

	},
	//进去聊天界面清除对应的通知
	clearNotification(room_id) {
		//这个不支持清除指定通知。
		//而且IOS不支持
	}
}