import {
	watch
} from "vue";
import useSocket from "../hooks/socket/useSocket";
import {
	useUserStore
} from "../stores/modules/user";
import {
	useTabbarStore
} from "../stores/modules/tabbarStore";
import tools from "./tools";

let socketTask = null;
let sendSocketMessage = null;
let isOpen = false;
let bInit = false;
let isconnecting = false;
let uid = 0;
export default {
	bInit,
	isOpen,
	isconnecting,
	uid,
	webConnect() {
		console.log('App vue webConnect')
		if (this.isconnecting) {
			return;
		}
		this.isconnecting = true;
		if (socketTask) {
			socketTask.close();
		}
		const userStore = useUserStore();
		let result = useSocket({
			onOpen: send => {
				console.log('App vue webConnect onOpen')
				send(JSON.stringify({
					type: 'login',
					data: {
						uid: userStore.user.id,
						token: uni.getStorageSync('token'),
						cid: uni.getStorageSync('clientid')
					}
				}))
				this.bInit = true;
				this.isOpen = true;
			},
			onMessage: data => {
				// if (data.type == 'msgList') {
				// 	// list.value[1].count++;
				// 	console.log('increaseChatValue')
				// 	tabbarStore.increaseChatValue()
				// }
				console.log('App vue on message', data)
				socketTask.uid = userStore.user.id
				const tabStore = useTabbarStore();
				if (data.type == "chat") {
					if (tabStore.selected != 1) {
						tabStore.increaseTabValue(1)
					}
					uni.$emit("chat", data.act, data.data)
					uni.$emit("talk", data.act, data.data)
				} else if (data.type == "order") {
					if (tabStore.selected != 2) {
						tabStore.increaseTabValue(2)
					}
					uni.$emit("order", data.act, data.data)
				} else if (data.type == "c2c") {
					uni.$emit("c2c", data.act, data.data)
				} else if (data.type == "system") {
					uni.$emit("system", data.act, data.data)
				} else {
					uni.$emit('other', data.act, data.data)
				}
			},
			complete: () => {
				this.isconnecting = false;
			}

		})

		sendSocketMessage = result.sendSocketMessage
		socketTask = result.socketTask
		socketTask.onClose((result) => {
			console.log('App vue socket onclose', result)
			// #ifdef APP-PLUS
			// plus.runtime.restart();
			// #endif
			this.isOpen = false;
			if (socketTask.uid == userStore.user.id) {
				setTimeout(() => {
					this.webConnect();
				}, 1500)
			}
		})
		socketTask.onError(async error => {
			//网络切换，网络异常等
			console.log('App vue socket error', error)
			this.isOpen = false;
			if (socketTask.uid == userStore.user.id) {
				setTimeout(() => {
					this.webConnect();
				}, 2000)
			}
		})
	},
	init() {
		const userStore = useUserStore();
		watch(() => userStore.user.id, (newVal, oldVal) => {
			if (newVal != 0 && uni.getStorageSync('token')) {
				console.log('App websocket starting..')
				this.webConnect();
			} else {
				console.log('App websocket 不满足条件..', newVal, uni.getStorageSync('token'))
			}
		}, {
			immediate: true
		})
	},
	join(room_id) {
		console.log('join socketTask', socketTask, room_id)
		const userStore = useUserStore();
		if (sendSocketMessage) {
			let message = JSON.stringify({
				type: 'join',
				data: {
					room_id: room_id,
					uid: userStore.user.id,
					token: uni.getStorageSync('token'),
					cid: uni.getStorageSync('clientid')
				}
			});
			console.log('message', message)
			sendSocketMessage(message)
		} else {
			console.log('socketTask is null')
		}
	},
	leave(room_id) {
		console.log('leave socketTask', socketTask)
		if (sendSocketMessage) {
			sendSocketMessage(JSON.stringify({
				type: 'leave',
				data: {
					room_id: room_id
				}
			}))
		} else {
			console.log('socketTask is null')
		}
	},
	send(msg) {
		console.log('socketTask send', msg)
		if (sendSocketMessage) {
			sendSocketMessage(JSON.stringify(msg))
		} else {
			console.log('socketTask is null')
		}
	}
}