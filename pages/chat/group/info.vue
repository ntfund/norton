<template>
	<view>
		<com-nav-bar :title="title" backgroundColor="#fff"></com-nav-bar>
		<view class="flex justify-between items-center info-title">
			<view class="info-title_left">群聊成员</view>
			<view class="right flex  items-center" @click="catMoreUsers">
				<view class="info-title_right">查看{{room.users.length}}名群成员</view>
				<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
					style="width: 12rpx; height: 20rpx; margin-left: 11rpx;"></image>
			</view>
		</view>
		<view class="data-list grid grid-cols-6 bg-white">
			<view class="flex flex-col justify-center items-center " v-for="(user, index) in room.userList"
				:key="index" @click="tools.navigateTo('/pages/chat/user/info?room_id='+ room.id +'&id=' + user.id)">
				<image :src="tools.getAvatar(user.avatar)" mode="aspectFit" style="width: 80rpx; height: 80rpx;" />
				<text class="list-item-sub-title ">{{user.nickname}}</text>
			</view>
			<view @click="invite" v-if="userStore.user.id == room.admin_id || room.invite != 1">
				<view class=" flex items-center justify-center  rounded-lg"
					style="width: 80rpx; height: 80rpx; border: 1px dashed #ccc;">
					<u-icon name="plus" size="24"></u-icon>
				</view>
				<view class="list-item-sub-title">邀请成员</view>
			</view>
			<view v-if="userStore.user.id == room.admin_id"
				@click="tools.navigateTo('/pages/chat/group/remove?id=' + props.id)">
				<view class=" flex items-center justify-center  rounded-lg"
					style="width: 80rpx; height: 80rpx; border: 1px dashed #ccc;">
					<u-icon name="minus" size="24"></u-icon>
				</view>
				<view class="list-item-sub-title">删减成员</view>
			</view>
		</view>
	</view>

	<!-- 	<view class="p-2 pb-4 text-center bg-white" v-if="room.userList.length < room.users.length" @click="catMoreUsers">
		<text class="text-gray-600">查看更多群成员 ></text>
	</view> -->

	<view class="bg-white info-rows">
		<view class="info-item  flex items-center justify-between" @click="changeGroupName">
			<view class="left">群聊名称</view>
			<view class="right flex items-center">
				<view class="right_tip">{{room.name}}</view>
				<image class="right_img" src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
					style="width: 12rpx; height: 20rpx;"></image>
			</view>
		</view>
		<view class="info-item  flex items-center justify-between"
			@click="tools.navigateToWithEncodeMultiply('/pages/chat/group/qrcode', {room: room})">
			<view class="left">群二维码</view>
			<view class="right flex items-center">
				<image class="right_img" src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
					style="width: 12rpx; height: 20rpx;"></image>
			</view>
		</view>
		<view class="info-item flex items-center justify-between"
			@click="tools.navigateToWithEncodeMultiply('/pages/chat/group/notice', {room: room})">
			<view class="left">群公告</view>
			<view class="right">
				<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
					style="width: 12rpx; height: 20rpx;"></image>
			</view>
		</view>
		<view class="info-item flex items-center justify-between" v-if="project.isRoomAdminByRoomAndMe(room)"
			@click="tools.navigateToWithEncodeMultiply('/pages/chat/group/manager', {room: room})">
			<view class="left">群管理</view>
			<view class="right">
				<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
					style="width: 12rpx; height: 20rpx;"></image>
			</view>
		</view>
		<view class="item-space"></view>
		<view class="info-item flex items-center justify-between" @click="tools.navigateTo('pages/chat/history/search?room_id=' + room.id)" >
			<view class="left">查找聊天记录</view>
			<view class="right">
				<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
					style="width: 12rpx; height: 20rpx;"></image>
			</view>
		</view>
		<view class="item-space"></view>
		<view class="info-item  flex items-center justify-between">
			<view class="left">消息免打扰</view>
			<view class="right">
				<u-switch activeColor="#7F17FE" inactiveColor="#dadada" size="20" v-model="infos.mute" :activeValue="1"
					:inactiveValue="0" :loading="loading" @change="muteSwitch"></u-switch>
			</view>
		</view>
		<view class="info-item  flex items-center justify-between">
			<view class="left">置顶群聊</view>
			<view class="right">
				<u-switch activeColor="#7F17FE" inactiveColor="#dadada" size="20" v-model="infos.pin" :activeValue="1"
					:inactiveValue="0" :loading="loading" @change="pinSwitch"></u-switch>
			</view>
		</view>
		<view class="item-space"></view>
		<view class="info-item  flex items-center justify-between" @click="changeGroupNickName">
			<view class="left">我在群里的昵称</view>
			<view class="right flex items-center">
				<view class="right_tip">{{infos.nickname}}</view>
				<image class="right_img" src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
					style="width: 12rpx; height: 20rpx;"></image>
			</view>
		</view>
		<view class="info-item  flex items-center justify-between">
			<view class="left">显示群成员昵称</view>
			<view class="right">
				<u-switch activeColor="#7F17FE" inactiveColor="#dadada" size="20" v-model="infos.show_nickname" :activeValue="1"
					:inactiveValue="0" :loading="loading" @change="nicknameSwitch"></u-switch>
			</view>
		</view>
		<view class="item-space"></view>
		<view class="info-item flex items-center justify-between" @click="clean">
			<view class="left">清空聊天记录</view>
			<view class="right">
				<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
					style="width: 12rpx; height: 20rpx;"></image>
			</view>
		</view>
	</view>
	<view class="bg-white" style="margin-top: 60rpx;">
		<view class="btn-option  flex justify-center items-center" @click="show = !show"
			v-if="userStore.user.id !== room.admin_id">
			<view class="btn-option_txt">退出群聊</view>
		</view>
		<view class="btn-option  flex justify-center items-center" @click="show2 = !show2" v-else>
			<view class="btn-option_txt">解散群聊</view>
		</view>
	</view>
	<u-modal :show="show" title="退出群聊" content="即将退出群聊..." confirmText="退出" showCancelButton confirmColor="#ff0000"
		@confirm="confirm" @cancel="show = false" closeOnClickOverlay @close="show = false"></u-modal>
	<u-modal :show="show2" title="解散群聊" content="即将解散群聊..." confirmText="解散" showCancelButton confirmColor="#ff0000"
		@confirm="part" @cancel="show2 = false" closeOnClickOverlay @close="show2 = false"></u-modal>
</template>

<script setup lang="ts">
	import {
		computed,
		reactive,
		ref
	} from "vue";
	import { onShow } from '@dcloudio/uni-app'
	import tools from '@/utils/tools'
	import {
		useUserStore
	} from "@/stores/modules/user";
	import { getChatRoom, updateGroupInfo } from "@/config/api";
	import project from "@/utils/project";
	import roomHelper from "@/utils/chat/roomHelper";
import { useAppStore } from "../../../stores/modules/app";
	const props = defineProps(['id'])
	const userStore = useUserStore();

	const title = ref('');
	const show = ref(false)
	const show2 = ref(false)
	let infos = reactive({
		nickname: '',
		pin: 0,
		mute: 0,
		show_nickname: 1
	})

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
		show_remark: 1,
		mute: 0,
		invite: 0,
		modify: 1
	})

	const loading = ref(false)

	const getData = () => {
		getChatRoom(props.id).then(data => {
			console.log('getChatRoom', data)
			room.value = data
			title.value = '聊天信息(' + data.users.length + ')'

			roomHelper.updateUserGroupInfos(data, infos)
			if (infos.nickname == '') {
				infos.nickname = userStore.user.nickname;
			}
		})
	}

	//退出群聊
	const confirm = () => {
		uni.$u.http.post('/chat/chatRoom/leave/' + props.id).then(data => {
			// tools.ta
			uni.showToast({
				title: "退出成功",
				icon: 'none'
			});
			uni.switchTab({
				url: "/pages/chat/index/index"
			})
		})
	}

	//解散群聊
	const part = () => {
		uni.$u.http.post('/chat/chatRoom/part/' + props.id).then(data => {
			// tools.ta
			uni.showToast({
				title: "解散成功",
				icon: 'none'
			});
			uni.switchTab({
				url: "/pages/chat/index/index"
			})
		})
	}
	
	//清空聊天记录
	const clean = () => {
		uni.$u.http.post('/chat/message/clean', {
			room_id: 'room-' + props.id
		}).then(data => {
			const appStore = useAppStore();
			appStore.setClean(true)
			tools.navigateBack()
		})
	}

	//邀请成员
	const invite = () => {
		tools.navigateTo('/pages/chat/group/invite?id=' + props.id);
	}

	//查看更多成员
	const catMoreUsers = () => {
		tools.navigateTo('/pages/chat/group/more?id=' + props.id);
	}

	//修改群名称
	const changeGroupName = () => {
		if (userStore.user.id == room.value.admin_id || room.value.modify == 0) {
			tools.navigateTo('/pages/chat/group/changeName?id=' + props.id + '&name=' + room.value.name)
		}
	}

	//修改群昵称
	const changeGroupNickName = () => {
		tools.navigateTo('/pages/chat/group/changeGroupNickName?id=' + props.id + '&name=' + room.value.name)
	}
	
	//群昵称显示开关切换
	const nicknameSwitch = (value) => {
		console.log(value)
		updateGroupInfo(room.value.id, "show_nickname", value)
	}
	
	//消息免打扰开关切换
	const muteSwitch = (value) => {
		console.log(value)
		updateGroupInfo(room.value.id, "mute", value)
	}
	
	//置顶开关切换
	const pinSwitch = (value) => {
		console.log(value)
		updateGroupInfo(room.value.id, "pin", value)
	}
	

	onShow(() => {
		getData();
	})
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}

	.item {
		border-bottom: 1px solid #efefef;

		.right {
			@apply text-gray-500;
		}
	}

	.info-title {
		background: #fff;
		padding: 25rpx 29rpx;
		margin-top: 18rpx;

		&_left {
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 32rpx;
			color: #000000;
		}

		&_right {
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 24rpx;
			color: #999;
		}
	}

	.data-list {
		padding: 35rpx 28rpx;
		padding-top: 20rpx;

		grid-row-gap: 30rpx;
		grid-column-gap: 43rpx;


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

				&_tip {
					font-family: SourceHanSansCN-Medium;
					font-weight: 500;
					font-size: 28rpx;
					color: #999;
				}

				&_img {
					padding-left: 24rpx;
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

	.btn-option {
		height: 100rpx;

		&_txt {
			font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 30rpx;
			color: #FC465C;
		}
	}

	.list-item-sub-title {
		width: 90rpx;

		font-family: SourceHanSansCN-Medium;
		font-weight: 500;
		font-size: 20rpx;
		color: #000000;

		margin-top: 10rpx;

		white-space: nowrap;

		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;

	}

	.item-space {
		width: 750rpx;
		height: 20rpx;
		background: #F8F8F8;
	}
</style>