<template>
	<com-nav-bar title="好友推荐" :border="true" backgroundColor="#fff"></com-nav-bar>
	<view class="chat-list">
		<uni-list :border="false" :show-scrollbar="false">
			<uni-list-chat v-for="(item, index) in messageList" :key="index" :title="item.title"
				:avatar-list="getAvatarList(item.avatar_list)" :note="getNote(item)"
				:time="tools.time2Chat(item.created_at)" badge-positon="left" :badge-text="item.unread"
				:clickable="true" @click="chatClick(item)" v-show="!isHideChat(item)"></uni-list-chat>
		</uni-list>
	</view>
	<u-modal :show="show" showCancelButton confirmText="发送" class="text-base" @cancel="show=false" @confirm="confirm">
		<view class="slot-content flex-1 flex flex-col">
			<view class="">
				<h3>发送给：</h3>
				<view class="flex items-center my-4">
					<!-- <image src="/static/faces/01.png" mode="widthFix" width="50" height="50"
						style="width: 100rpx; height: 100rpx;" class="rounded" />
					<text class="ml-2 text-gray-800">文件传输助手</text> -->
					<uni-list :border="false" :show-scrollbar="false">
						<uni-list-chat class="my-uni-chat" :border="false"
							style="border: none; outline: none; padding: 0;" :title="selected.title"
							:avatar-list="getAvatarList(selected.avatar_list)"></uni-list-chat>
					</uni-list>
				</view>
				<view>
					<view v-if="param.type == 1">
						<text class="text-[#bbb]">[个人名片]{{(param.data.friend && param.data.friend.remark) ? param.data.friend.remark : param.data.nickname}}</text>
					</view>

					<view v-else-if="param.type == 2">
						<text class="text-[#bbb]">{{project.getNote(param.data)}}</text>
					</view>

					<view v-else-if="param.type == 3">
						<text class="text-[#bbb]">[逐条转发]</text>
					</view>

					<view v-else-if="param.type == 4">
						<text class="text-[#bbb]">[合并转发]</text>
					</view>

				</view>
			</view>
		</view>
	</u-modal>
</template>

<script setup lang="ts">
	import {
		onReachBottom
	} from '@dcloudio/uni-app';
	import {
		onMounted,
		reactive,
		ref
	} from 'vue';
	import { onShow } from '@dcloudio/uni-app'
	import tools from '@/utils/tools'
	import { getMessageList } from '@/config/api';
	import project from '@/utils/project';
	const props = defineProps(['params']);
	const param = JSON.parse(decodeURIComponent(props.params))
	const show = ref(false)
	// const user = ref({
	// 	friend: {
	// 		remark: ''
	// 	},
	// 	nickname: ''
	// })
	console.log('param.data', param.data)
	// if (param.type == 1) {
	// 	user.value = param.data
	// }


	const getAvatarList = (avatarArr) => {
		let arr = [];
		for (var i = 0; i < avatarArr.length; i++) {
			let url = uni.$u.http.config.baseURL + avatarArr[i]
			arr.push({
				url
			})
		}

		return arr;
	}

	const isHideChat = (item) => {
		if (param.type == 1) {
			if (param.data.friend && param.data.friend.remark && item.title == param.data.friend.remark) {
				return true;
			}

			if (item.title == param.data.nickname) {
				return true;
			}
		}

		return false;
	}

	const selected = ref({
		room_id: '',
		title: '测试助手',
		avatar_list: ['/static/img/faces/03.png', '/static/img/faces/02.png', '/static/img/faces/06.png']
	})
	const messageList = ref([]);

	const chatClick = (item) => {
		console.log('chat click')
		selected.value = item
		show.value = true;
	}

	const confirm = () => {
		if (param.type == 1 || param.type == 2) {
			let data = {};
			if (param.type == 1) {
				//名片消息
				let user = param.data;
				data = {
					room_id: selected.value.room_id,
					content: { user: { id: user.id, avatar: user.avatar, nickname: user.nickname, uid:user.uid } },
					type: 'user',
					contentType: "card"
				}
			} else if (param.type == 2) {
				//消息转发
				let msg = param.data;
				data = {
					room_id: selected.value.room_id,
					content: msg.msg.content,
					type: msg.type,
					contentType: msg.msg.type
				}
			}
			console.log('confirm data', data)
			const http = uni.$u.http;
			http.post('/chat/message', data).then(res => {
				show.value = false;
				uni.navigateBack()
				uni.$u.toast("已发送");
			})
		}

		//单条转发
		if (param.type == 3 || param.type == 4) {
			const http = uni.$u.http;
			http.post('/chat/message/forward', {
				type: param.type,
				data: param.data,
				room_id: selected.value.room_id,
				from_room_id: param.room_id,
			}).then(res => {
				show.value = false;
				uni.navigateBack()
				uni.$u.toast("已发送");
			})
		}
	}

	const getNote = (item) => {
		const msg = item.message.data
		console.log('getNote', msg)
		return project.getNote(msg);
	}

	const pagination = reactive({
		page: 1,
		pageSize: 20,
		status: ''
	})
	const getMessage = () => {
		getMessageList(pagination.page, pagination.pageSize).then((res : any) => {
			console.log('getMessageList', res)
			messageList.value.push(...res.data)
			console.log(res.data)
			if (pagination.page < res.last_page) {
				pagination.page++
				pagination.status = 'loadmore'
			} else {
				pagination.status = 'nomore';
			}
		})
	}

	onReachBottom(() => {
		if (pagination.status == 'loadmore') {
			pagination.status = 'loading'
			getMessage()
		}
	})

	onShow(() => {
		messageList.value.length = 0;
		pagination.page = 1;
		pagination.status = '';
		getMessage();
	})

	onMounted(() => {
		console.log('talk onMounted')
	})
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.chat-list {
		// padding-top: var(--status-bar-height);
		/* #ifndef  APP-PLUS */
		padding-top: 0;
		/* #endif */
		/* #ifdef  APP-PLUS */
		padding-top: 0;
		/* #endif */
	}

	.uni-list-chat {
		/* #ifdef  APP-PLUS */
		border-bottom: 1px solid #f0f0f0;
		/* #endif */
	}

	// .u-modal {
	// 	.slot-content {

	// 	}
	// }
</style>

<style lang="less">
	.my-uni-chat {
		.uni-view:first {
			height: 200px;
		}
	}
</style>