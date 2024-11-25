<template>
	<view :class="{'body-white': !user.friend && !isRoomAdmin && isInternal}">
		<com-nav-bar :title="title" border="true" backgroundColor="#fff"></com-nav-bar>
		<view class="info" :class="{'none': hide}">
			<view class="info_container">
				<image :src="tools.getAvatar(user.avatar)" mode="aspectFill" class="rounded-full info_avatar" />
				<view class="info_nickname">
					{{(user.friend && user.friend.remark) ? user.friend.remark : user.nickname}}
				</view>
				<image v-if="user.id == 1 || user.official" src="@/static/images/official@2x.png" mode="aspectFit"
					style="width: 105rpx; height: 34.5rpx;">
				</image>
				<view class="info_uid" v-if="isInternal || user.friend">
					UID：{{user.uid}}
				</view>
			</view>

			<view v-if="(isInternal || !isGroupInfo) && user.id != 1">
				<view class="info_add_friend mb-[20rpx]" v-if="!user.friend">
					<view v-if="newFriend && newFriend.status == 1">
						<view class="flex" v-if="!isMe(newFriend)">
							<view class="flex items-center info_add_friend_v"
								@click="acceptFriend(newFriend)">
								<image src="@/static/images/chat/addplus_zi@2x.png" mode="aspectFit"
									style="width: 26rpx; height: 26rpx;"></image>
								<view class="" style="margin-left: 19rpx;">通过验证</view>
							</view>
						</view>
						<view class="flex items-center" v-else>
							<view class="" style="margin-left: 19rpx;">待对方验证</view>
						</view>
					</view>
					<view class="flex items-center" @click="addFriend" v-else>
						<image src="@/static/images/chat/addplus_zi@2x.png" mode="aspectFit"
							style="width: 26rpx; height: 26rpx;"></image>
						<view class="" style="margin-left: 19rpx;">申请添加为好友</view>
					</view>
				</view>
			</view>

			<view v-else>
				<view class=""></view>
			</view>
		</view>
		<view class="bg-white info-rows" v-if="user.friend">
			<view class="info-item info-item_border flex items-center justify-between">
				<view class="left">置顶</view>
				<view class="right" v-if="user.friend">
					<u-switch activeColor="#7F17FE" inactiveColor="#dadada" size="20" v-model="user.friend.pin"
						:activeValue="1" :inactiveValue="0" :loading="loading" @change="pinSwitch"></u-switch>
				</view>
			</view>
			<view class="info-item info-item_border flex items-center justify-between"
				@click="tools.navigateTo('/pages/chat/user/remark?id='+user.id)" v-if="user.friend">
				<view class="left">设置备注</view>
				<view class="right flex items-center">
					<view class="no-remark" v-if="!user.friend.remark">未设置</view>
					<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
						style="width: 12rpx; height: 20rpx;"></image>
				</view>
			</view>
			<view class="info-item flex items-center justify-between" @click="share">
				<view class="left">把他推荐给朋友</view>
				<view class="right">
					<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
						style="width: 12rpx; height: 20rpx;"></image>
				</view>
			</view>
			<view class="bg-white info-rows">
				<view class="info-item info-item_border flex items-center justify-between">
					<view class="left">拉黑名单</view>
					<view class="right">
						<u-switch activeColor="#7F17FE" inactiveColor="#dadada" size="20" v-model="block"
							:activeValue="1" :inactiveValue="0" :loading="loading" @change="blockSwitch"></u-switch>
					</view>
				</view>
			</view>
		</view>
		<view class="bg-white info-rows" v-if="userStore.user.id == 1 && !user.friend">
			<view class="info-item info-item_border flex items-center justify-between">
				<view class="left">拉黑名单</view>
				<view class="right">
					<u-switch activeColor="#7F17FE" inactiveColor="#dadada" size="20" v-model="block" :activeValue="1"
						:inactiveValue="0" :loading="loading" @change="blockSwitch"></u-switch>
				</view>
			</view>
		</view>
		

		<view class="bg-white info-rows" v-if="isInRoom && isRoomAdmin">
			<view class="info-item info-item_border flex items-center justify-between" v-if="isGroupInfo">
				<view class="left">设置禁言</view>
				<view class="right">
					<u-switch activeColor="#7F17FE" inactiveColor="#dadada" size="20" v-model="isMute" :activeValue="1"
						:inactiveValue="0" :loading="loading" @change="muteSwitch"></u-switch>
				</view>
			</view>
		</view>


		<view class="remove" v-if="isRoomAdmin">
			<view class="flex-1 justify-center items-center text-center" v-if="isInRoom" @click="showRemoveTip = true">
				移出本群</view>
			<view class="flex-1 justify-center items-center text-center text-gray-400" v-else>已被移除群聊</view>
		</view>

		<view class="btns" v-if="user.friend || user.id == 1">
			<view class="btns-view">
				<button type="button" class="btns-btn btns-delete" @click="show = !show" v-if="user.friend">
					<text class="btns-delete-txt">删除好友</text>
				</button>
				<button type="button" class="btns-btn btns-send" @click="sendMsg">
					<text class="btns-send-txt">发消息</text>
				</button>
			</view>
		</view>
		
		<view class="btns" v-if="(isInternal || !isGroupInfo) && user.id != 1 && newFriend && !user.friend && newFriend.status == 1">
			<view class="btns-view">
				<button type="button" class="btns-btn btns-delete" @click="refuseFriend(newFriend)">
					<text class="btns-delete-txt">拒绝</text>
				</button>
			</view>
		</view>
	</view>

	<com-modal-confirm :msg="msg" v-model:show="show"
		:red="(user.friend && user.friend.remark) ? user.friend.remark : user.nickname"
		@confirm="deleteFriend"></com-modal-confirm>
	<com-modal-confirm :msg="removeTip" v-model:show="showRemoveTip"
		:red="(user.friend && user.friend.remark) ? user.friend.remark : user.nickname"
		@confirm="removeUser"></com-modal-confirm>

	<!-- <u-modal :show="show" title="删除联系人" :content='content' confirmText="删除" showCancelButton confirmColor="#ff0000"
		@confirm="deleteFriend" @cancel="show = false" closeOnClickOverlay @close="show = false"></u-modal> -->
</template>

<script setup>
	import {
		nextTick,
		reactive,
		ref,
		watchEffect
	} from "vue";

	import {
		onShow
	} from '@dcloudio/uni-app'

	import tools from '@/utils/tools'
	import project from "@/utils/project";
	import {
		useUserStore
	} from "@/stores/modules/user";
	import {
		acceptFriend,
		getChatRoom
	} from "@/config/api";
import { useAppStore } from "../../../stores/modules/app";
	const props = defineProps(['id', 'new_friend', 'room_id'])
	let newFriend = ref(null);
	if (props.new_friend) {
		newFriend.value = JSON.parse(decodeURIComponent(props.new_friend))
		console.log('newFriend', newFriend.value)
	}

	const userStore = useUserStore()
	const show = ref(false)
	const msg = ref('')
	const removeTip = ref('')
	const showRemoveTip = ref(false)
	const content = ref("")
	let user = ref({
		id: 0,
		friend: null,
		id: 0,
		nickname: '',
		avatar: '',
		uid: '',
	})
	const loading = ref(false)
	const hide = ref(true)

	const title = ref('')

	let isMute = ref(0);
	const isShowRemove = ref(false);
	const isRoomAdmin = ref(false);
	const isInRoom = ref(true);
	const isGroupInfo = ref(!!props.room_id);
	const isInternal = ref(false)
	const block = ref(0)

	const room = ref({
		id: 0,
		name: "群组",
		notice: null,
		admin_id: 0,
		userList: [],
		users: [],
		admins: [],
		mutes: [],
		admin: {},
		remarks: [],
		internal: 1,
		mute: 0,
		modify: 1
	})

	watchEffect(async () => {
		// isRoomAdmin.value = project.getIsRoomAdmin('room-' + room.value.id)

		isRoomAdmin.value = project.isRoomAdminByRoomAndMe(room.value)
		isMute.value = room.value.mutes.indexOf(user.value.id.toString()) > -1 ? 1 : 0
		isInRoom.value = room.value.users.indexOf(user.value.id.toString()) > -1

		await nextTick();
		isInternal.value = room.value.internal == 1

		console.log('watchEffect isInternal.value', isInternal.value)
	})

	const getRoomData = () => {
		getChatRoom(props.room_id).then(data => {
			console.log('getChatRoom', data)
			room.value = data
		})
	}
	if (props.room_id && props.room_id > 0) {
		getRoomData()
	} else {
		isInternal.value = true;
	}
	const getNickname = (user) => {
		if (user.value.friend && user.value.friend.remark) {
			return user.value.friend.remark;
		}
		return user.value.nickname;
	}
	const getUserInfo = () => {
		if (props.id) {
			uni.$u.http.get('/chat/user/' + props.id).then(data => {
				console.log('get chat user', data);
				data.uid = data.uid.toString().padStart(8, '0')
				user.value = data;
				content.value = "将删除联系人\"" + getNickname(user) + "\"，确认删除吗？"
				msg.value = '确认将 ' + getNickname(user) + ' 删除好友吗？'
				if (user.value.friend || isGroupInfo.value) {
					title.value = "个人资料"
				} else {
					title.value = "添加朋友"
				}

				removeTip.value = '确认将 ' + getNickname(user) + ' 移除本群吗？'

				hide.value = false;
			})

			//获取是否拉黑
			uni.$u.http.get('/chat/block/showBy/' + props.id).then(data => {
				if (data && data.status == 1) {
					block.value = data.status;
				} else {
					block.value = 0
				}
			})
		}
	}

	const sendMsg = () => {
		const room_id = project.getRoomId(userStore.user.id, user.value.id)
		tools.navigateToWithEncodeMultiply('/pages/chat/talk/talk', {
			room_id
		})
	}

	const addFriend = () => {
		uni.navigateTo({
			url: '/pages/chat/user/add_friend?to_user_id=' + props.id
		})
	}

	const share = () => {
		tools.navigateToWithEncode('/pages/chat/user/share', {
			type: 1,
			data: user.value
		})
	}

	const deleteFriend = () => {
		uni.$u.http.post('/chat/friend/deleteFriend', {
			to_id: props.id
		}).then(() => {
			uni.showToast({
				title: "删除成功",
				icon: 'none'
			});
			uni.switchTab({
				url: "/pages/chat/index/index"
			})
		})
	}

	//移除本群
	const removeUser = () => {
		uni.$u.http.post('/chat/chatRoom/remove/' + room.value.id, {
			ids: [props.id]
		}).then(() => {
			getRoomData()
		})
	}

	//群单独禁言开关
	const muteSwitch = (value) => {
		console.log(value)
		// isMute.value = value;
		// updateGroupInfo(room.value.id, "pin", value)

		//前端先更新一下。 因为在watch 里面监听。更新不到switch
		let index = room.value.mutes.indexOf(user.value.id.toString())
		// console.log('index', index, value)
		if (index > -1 && value == 0) {
			room.value.mutes.splice(index, 1)
		} else {
			room.value.mutes.push(user.value.id.toString())
		}

		uni.$u.http.post('/chat/chatRoom/mute/' + props.room_id, {
			user_id: user.value.id,
			mute: value
		}).then(result => {
			// console.log(data)
			room.value = result
		})
	}

	//置顶开关
	const pinSwitch = (event) => {
		console.log(event)
		uni.$u.http.put('/chat/friend/' + user.value.friend.id, {
			pin: event
		}).then(data => {
			// console.log(data)

		})
	}

	//拉黑开关
	const blockSwitch = (event) => {
		console.log(event)
		uni.$u.http.post('/chat/block/', {
			block_user_id: user.value.id,
			status: event
		}).then(data => {
			// console.log(data)
		})
	}

	const isMe = (item) => {
		return userStore.user.id == item.from_user.id;
	}
		
	const refuseFriend = (item) => {
		item.status = 3;
		uni.$u.http.put('/chat/newFriend/' + item.id, {
			status: 3
		}).then(data => {
			const appStore = useAppStore();
			appStore.decreaseNewFriendRecords();
			uni.showToast({
				title: "已拒绝好友申请",
				icon: 'none'
			});
		})
	}

	onShow(() => {
		getUserInfo()

	})
</script>

<style lang="scss">
	page {
		background: #F8F8F8;
	}

	.info {
		display: flex;
		flex-direction: column;
		// justify-content: center;
		align-items: center;
		background: #FFFFFF;

		padding-top: 95rpx;


		&_container {
			padding-bottom: 68rpx;

			display: flex;
			flex-direction: column;
			align-items: center;
		}

		&_avatar {
			border: 12rpx solid #7F17FE;

			width: 288rpx;
			height: 288rpx;
		}

		&_nickname {
			font-family: Gilroy-Bold;
			font-weight: bold;
			font-size: 40rpx;
			color: #000000;

			margin-top: 22rpx;
		}

		&_uid {
			font-family: Gilroy-Medium;
			font-weight: 500;
			font-size: 30rpx;
			color: #999;

			margin-top: 10rpx;
		}

		&_add_friend {
			width: 400rpx;
			height: 92rpx;

			margin-top: 10rpx;

			display: flex;
			justify-content: center;
			align-items: center;

			background: #FFFFFF;
			border-radius: 8rpx;
			border: 2rpx solid #EEEEEE;

			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 30rpx;
			color: #7F17FE;
		}
	}

	.body-white {
		width: 100vw;
		height: 100vh;
		background: #FFFFFF;
		overflow: hidden;
	}

	.info-rows {
		background: #FFFFFF;
		margin-top: 20rpx;

		.info-item {
			height: 100rpx;

			margin: 0 30rpx;

			.left {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 32rpx;
				color: #000000;
			}

			.right {
				padding-right: 3rpx;

				.no-remark {
					font-family: SourceHanSansCN-Medium;
					font-weight: 500;
					font-size: 28rpx;
					color: #000000;
					// line-height: 70rpx;
					opacity: 0.6;
					margin-right: 24rpx;
				}
			}

			&_border {
				border-bottom: 1rpx solid #EEEEEE;
			}
		}

		.info-item:active {
			background: #EEEEEE;
		}
	}

	.btns {
		position: fixed;

		width: 750rpx;
		bottom: 76rpx;

		display: flex;
		justify-content: center;


		&-view {
			display: flex;
			align-items: center;
			justify-content: center;

			flex: 1;
		}

		&-btn {
			width: 340rpx;
			height: 88rpx;
			border-radius: 44px;

			margin: 0 6rpx;

			display: flex;
			align-items: center;
			justify-content: center;

		}

		&-delete {
			border: 2px solid #FC465C;

			&-txt {
				// font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 34rpx;
				color: #FC465C;
			}
		}

		&-send {
			background: #7F17FE;

			&-txt {
				// font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 34rpx;
				color: #FFFFFF;
			}
		}
	}

	.remove {
		width: 750rpx;
		height: 100rpx;
		background: #FFFFFF;

		display: flex;
		align-items: center;
		justify-content: center;

		margin-top: 60rpx;

		font-family: SourceHanSansCN-Bold;
		font-weight: bold;
		font-size: 30rpx;
		color: #FC465C;
		// line-height: 33px;
	}

	.none {
		display: none;
	}

	.info_add_friend_v:active {
		background: #EEEEEE;
	}
</style>