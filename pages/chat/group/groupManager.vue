<template>
	<view>
		<com-nav-bar title="设置群管理员" backgroundColor="#fff"></com-nav-bar>
		<view class="info">
			<view class="info_title">群管理员</view>
			<view class="info_item">
				1、管理员可协助群主管理群聊，拥有发布群公告、移除群成员等能力
			</view>
			<view class="info_item" style="margin-top: 20rpx;">
				2、只有群主具备设置管理员、解散群聊的能力。
			</view>
			<view class="info_item">
				3、最多可设置个3管理员
			</view>
		</view>
		<view class="add-btn" v-if="room.admin_list.length == 0"
			@click="tools.navigateToWithEncodeMultiply('/pages/chat/group/members', {room: room, type: 'addManager'})">
			<image class="add-btn_img" src="@/static/images/chat/add@2x.png" mode="aspectFit"
				style="width: 32rpx; height: 32rpx;"></image>
			<view class="add-btn_txt">添加管理员</view>
		</view>
		<view class="data-list" v-else>
			<view class="data-list_item" v-for="(item, index) in room.admin_list" :key="index">
				<view class="data-list_item_left">
					<image :src="project.getFullURL(item.avatar)" mode="aspectFit" style="width: 80rpx; height: 80rpx;">
					</image>
				</view>
				<view class="data-list_item_right" @click="rowClick(item)">
					<view class="data-list_item_right_nickname">{{item.nickname}}</view>
					<view class="data-list_item_right_options">移除</view>
				</view>
			</view>

			<view v-if="room.admin_list.length < 3" class="add-btn add-btn-2"
				@click="tools.navigateToWithEncodeMultiply('/pages/chat/group/members', {room: room, type: 'addManager'})">
				<image class="add-btn_img" src="@/static/images/chat/add@2x.png" mode="aspectFit"
					style="width: 32rpx; height: 32rpx;"></image>
				<view class="add-btn_txt">添加管理员</view>
			</view>
		</view>

		<com-modal-confirm :msg="msg" v-model:show="show" @confirm="remove()"></com-modal-confirm>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		useUserStore
	} from '@/stores/modules/user';
	import project from '/utils/project';
	import tools from '@/utils/tools';
	import {
		getChatRoom,
		updateChatRomAdmins
	} from '@/config/api';
	const props = defineProps(["room"])
	const room = ref(JSON.parse(decodeURIComponent(props.room)))

	const dataList = ref([])

	const getRoom = () => {
		getChatRoom(room.value.id).then(data => {
			room.value = data
		})
	}

	const msg = ref('')
	const selectedRow = ref(null)
	const show = ref(false);

	const rowClick = (item) => {
		msg.value = '确认移除 ' + item.nickname + ' 的管理权限吗？'
		selectedRow.value = item;
		show.value = true;
	}

	const remove = () => {
		let index = room.value.admins.indexOf(selectedRow.value.id.toString());
		room.value.admins.splice(index, 1);
		updateChatRomAdmins(room.value.id, room.value.admins).then(res => {
			let index2 = room.value.admin_list.indexOf(selectedRow.value);
			room.value.admin_list.splice(index2, 1)
		})
	}


	onShow(() => {
		getRoom();
	})
</script>

<style lang="scss" scoped>
	.info {
		margin: 68rpx 28rpx;

		&_title {
			font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 36rpx;
			color: #000000;
		}

		&_item {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 28rpx;
			color: #999999;

			margin-top: 40rpx;
		}
	}

	.add-btn {
		height: 77rpx;
		border-top: 1rpx solid #EEEEEE;
		border-bottom: 1rpx solid #EEEEEE;

		margin-bottom: 54rpx;

		display: flex;
		justify-content: center;
		align-items: center;

		cursor: pointer;

		&_txt {
			margin-left: 34rpx;

			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 30rpx;
			color: #000000;
		}
	}

	.add-btn-2 {
		height: 116rpx;
		border-top: none;

		justify-content: start;
		margin-left: 23rpx;
	}

	.add-btn:active {
		background: #eeeeee;
	}

	.data-list {
		border-top: 1rpx solid #EEEEEE;
		margin: 0 26rpx;

		&_item {
			display: flex;
			justify-content: space-between;
			align-items: center;

			height: 118rpx;

			&_left {}

			&_right {
				display: flex;
				justify-content: space-between;
				align-items: center;

				flex: 1;
				// height: 118rpx;
				height: 100%;

				margin-left: 30rpx;

				border-bottom: 1rpx solid #EEEEEE;

				&_nickname {
					font-family: SourceHanSansCN-Heavy;
					font-weight: 800;
					font-size: 30rpx;
					color: #000000;
				}

				&_options {
					font-family: SourceHanSansCN-Bold;
					font-weight: bold;
					font-size: 24rpx;
					color: #7F17FE;

					padding-right: 62rpx;
				}
			}
		}
	}
</style>