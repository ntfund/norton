<!-- 这个是聊天的首页入口 -->
<template>
	<uni-nav-bar :fixed="true" :border="false" :statusBar="true" @clickLeft="leftShow = true"
		@clickRight="rightShow=true">
		<template #default>
			<view class="w-[100%] h-[100%] p-0 m-0 flex items-center justify-center" style="align-items: center;">
				<!-- <image src="@/static/images/chat/NORTON@2x.png" mode="aspectFit" style="width: 180rpx; height: 27rpx;">
				</image> -->
				<view class="nav-title">NORTON</view>
			</view>
		</template>
		<template #left>
			<view class="w-[100%] h-[100%] p-0 m-0 nav-left">
				<image src="@/static/images/home/Group 787@2x.png" mode="aspectFit"
					style="width: 42rpx; height: 30rpx;"></image>
			</view>
		</template>
		<template #right>
			<view class="w-[100%] p-0 m-0 nav-right text-right">
				<image src="@/static/images/chat/plus@2x.png" mode="aspectFit" style="width: 38rpx; height: 38rpx;">
				</image>
			</view>
		</template>
	</uni-nav-bar>
	<chat-tab v-model:current="current" @change="tabChange"></chat-tab>
	<!-- <view style="height: 44px;"></view> -->
	<view v-show="current == 0">
		<!-- <chat-list></chat-list> -->
		<chat-data-list :data="dataList"></chat-data-list>
	</view>
	<view v-show="current == 1">
		<contact></contact>
	</view>

	<!-- 	<view class="chat-list">
		<uni-list :border="false" :show-scrollbar="false">
			<uni-list-chat v-for="(item, index) in messageList" :key="index" :title="item.title"
				:avatar-list="getAvatarList(item.avatar_list)" :note="getNote(item)"
				:time="tools.time2Chat(item.created_at)" badge-positon="left" :badge-text="item.unread"
				:clickable="true" @click="chatClick(item)"></uni-list-chat>
		</uni-list>
	</view> -->

	<com-message-popup v-model:show="rightShow" @change="change"></com-message-popup>
	<com-index-left v-model:show="leftShow"></com-index-left>
	<com-tab-bar></com-tab-bar>

</template>

<script setup>
	import {
		onMounted,
		ref,
		reactive,
		watch
	} from 'vue';
	import {
		onShow,
		onHide,
		onReachBottom
	} from '@dcloudio/uni-app'
	import tools from '@/utils/tools';
	import ChatTab from './components/tab.vue'
	import ChatList from './components/chat_list.vue'
	import Contact from '@/pages/chat/contact/contact.vue'
	import secret from '@/utils/secret';
	import {
		getNewFriendList
	} from '@/config/api';
	import {
		getMessageList
	} from '@/config/api';
	import {
		useUserStore
	} from '@/stores/modules/user'
	import {
		useChatStore
	} from '@/stores/modules/chatStore';
	import {
		useAppStore
	} from '@/stores/modules/app';
	import project from '@/utils/project';
	import ChatDataList from './components/chat_data_list.vue'


	const userStore = useUserStore()
	const appStore = useAppStore();
	const chatStore = useChatStore();
	const current = ref(0)
	const len = ref(0);

	const leftShow = ref(false)
	const rightShow = ref(false)

	const dataList = ref([]);

	const pagination = reactive({
		page: 1,
		pageSize: 20,
		status: ''
	})
	const getMessage = async () => {
		let res = await getMessageList(pagination.page, pagination.pageSize);

		// console.log('getMessageList', res)
		if (pagination.page == 1) {
			dataList.value = res.data
		} else {
			dataList.value.push(...res.data)
		}

		// console.log('getMessageList', res.data)
		if (pagination.page < res.last_page) {
			pagination.page++
			pagination.status = 'loadmore'
		} else {
			pagination.status = 'nomore';
		}
	}

	onReachBottom(() => {
		if (pagination.status == 'loadmore') {
			pagination.status = 'loading'
			console.log('onReachBottom')
			getMessage()
		}
	})

	const getFisrtData = async () => {
		pagination.page = 1;
		pagination.status = 'loading'
		dataList.value = []
		getMessage();
	}

	const webConnect = (act, data) => {
		console.log('chat list on message', act, data)
		switch (act) {
			case 'msgList': {
				let itemData = data;
				// console.log('onMessage msgList', itemData)

				let index = dataList.value.findIndex(item => item.id == itemData.id)
				if (index > -1) {
					dataList.value.splice(index, 1);
				}
				dataList.value.unshift(itemData)

				dataList.value.sort((x, y) => {
					return new Date(x.create_at).getTime() - new Date(y.create_at).getTime()
				})

				dataList.value.sort((x, y) => {
					return y.weight - x.weight
				})

				let msg = itemData.message.data;
				// console.log('index msgList', msg, userStore.user.id);
				if (msg.msg.userinfo.id != userStore.user.id && msg.type != "system") {
					//接收人
					// #ifdef APP-PLUS
					// console.log('振动 index socketTask');
					// uni.vibrateLong();
					// #endif


					if (!data.mute && chatStore.roomId != itemData.room_id) {
						console.log('声音播放 - 消息提示');
						let AUDIO = uni.createInnerAudioContext()
						AUDIO.src = "/static/voice/mail.mp3";
						AUDIO.play()
					}

				} else {
					//发送人
					if (!data.mute) {
						// console.log('声音播放 - 气泡');
						// let AUDIO = uni.createInnerAudioContext()
						// AUDIO.src = "/static/voice/qipao.mp3";
						// AUDIO.play()
					}
				}
			}

			break;
			case 'revoke':
			case 'delete': {
				let itemData = data;
				let index = dataList.value.findIndex(item => item.message_id == itemData.id)
				// console.log('chat delete index', index)
				if (index > -1) {
					dataList.value[index].message = null
				}
			}
			break;
			case 'remove_msg_list': {
				let index = dataList.value.findIndex(item => item.target_id == data.target_id &&
					item.type == data.type)
				console.log('remove_msg_list', index)
				if (index > -1) {
					dataList.value.splice(index, 1);
				}
			}
			break;
			case 'new_friend':
				appStore.increaseNewFriendRecords();
				break;
			default:
				break;
		}
	}


	const change = (item) => {
		console.log(item)
		if (item == '发起群聊') {
			tools.navigateTo('/pages/chat/contact/group')
		} else if (item == '添加朋友') {
			tools.navigateTo('/pages/chat/contact/add')
		} else if (item == '扫一扫') {
			uni.scanCode({
				autoDecodeCharset: true,
				scanType: ['qrCode'],
				success: function(res) {
					console.log('条码类型：' + res.scanType);
					console.log('条码内容：' + res.result);
					if (res.scanType == 'QR_CODE') {
						let data = JSON.parse(secret.decode(res.result))
						if (data.act == "add_friend") {
							tools.navigateTo('/pages/chat/contact/add', {
								keyword: data.id
							})
						} else if (data.act == "join_romm") {
							if (new Date().getTime() > data.expirated_at) {
								tools.toast("改二维码已过期")
							} else {
								tools.navigateTo('/pages/chat/group/show', {
									id: data.id,
									from_user_id: data.from_user_id
								})
							}
						}
					}
				}
			});
		}
	}




	const tabChange = (index) => {
		// console.log('获取新朋友')
		//不用获取了，浪费资源，软件打开了，会自动推送
		// if (1 == index) {
		// 	appStore.getNewFirendRecords()
		// }
	}
	
	uni.$on('chat', webConnect)

	onShow(() => {
		// #ifdef APP-PLUS
		plus.runtime.setBadgeNumber(0)
		// #endif	
		console.log('Index Page Show')
	})

	watch(() => userStore.user.account, (newVal, oldVal) => {
		getFisrtData()
		appStore.getNewFirendRecords()
	}, {
		immediate: true
	})
</script>

<style lang="scss">
	page {
		background: #fff;
		padding-bottom: 112rpx;
	}


	.chat-list {
		// padding-top: var(--status-bar-height);
		/* #ifndef  APP-PLUS */
		padding-top: 0;
		/* #endif */
		/* #ifdef  APP-PLUS */
		// padding-top: 168rpx;
		/* #endif */
	}

	.uni-list-chat {
		/* #ifdef  APP-PLUS */
		border-bottom: 1px solid #f0f0f0;
		/* #endif */
	}

	.nav-right {
		margin-right: calc(38rpx - 10px);
	}
</style>