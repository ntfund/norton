<template>
	<view class="container">
		<chat-data-list :data="dataList"></chat-data-list>
	</view>
</template>

<script setup>
	import ChatDataList from './chat_data_list.vue'
	import {
		onMounted,
		onUnmounted,
		reactive,
		ref,
		watch
	} from 'vue';
	import {
		onShow,
		onHide,
		onReachBottom
	} from '@dcloudio/uni-app'
	import tools from '@/utils/tools'
	import {
		getMessageList
	} from '@/config/api';
	import {
		useUserStore
	} from '@/stores/modules/user'
	import {
		useChatStore
	} from '@/stores/modules/chatStore';


	const userStore = useUserStore()


	const dataList = ref([]);

	const pagination = reactive({
		page: 1,
		pageSize: 20,
		status: ''
	})
	const getMessage = async () => {
		let res = await getMessageList(pagination.page, pagination.pageSize);

		console.log('getMessageList', res)
		if (pagination.page == 1) {
			dataList.value = res.data
		} else {
			dataList.value.push(...res.data)
		}

		console.log('getMessageList', res.data)
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
				console.log('index msgList', msg, userStore.user.id);
				if (msg.msg.userinfo.id != userStore.user.id && msg.type != "system") {
					//接收人
					// #ifdef APP-PLUS
					// console.log('振动 index socketTask');
					// uni.vibrateLong();
					// #endif
					const chatStore = useChatStore();

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
			default:
				break;
		}
	}

	onMounted(() => {
		console.log('chat list onMounted')
		// getFisrtData();

		
	})

	onUnmounted(() => {
		console.log('chat list onUnmounted')
		// uni.$off('chat')
	})

	onShow(() => {
		console.log('chat list onShow')
		uni.$on('chat', webConnect)
	})
	
	onHide(() => {
		console.log('chat list onHide')
		// uni.$off('chat')
	})
	
	// console.log('chat list uni $on')
	
	getFisrtData();


	watch(() => userStore.user.account, (newVal, oldVal) => {
		getFisrtData();
	})
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.heng {
		width: 750rpx;
		height: 20rpx;
		background: #F9F9F9;
	}

	.container {
		padding-bottom: 150rpx;
	}
</style>