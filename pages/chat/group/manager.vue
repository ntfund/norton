<template>
	<view>
		<com-nav-bar title="群管理" backgroundColor="#fff"></com-nav-bar>
		<view class="bg-white info-rows">
			<view class="info-item pt-[10px] flex items-start justify-between">
				<view class="left">
					<view>
						仅群主/群管理可以邀请成员
					</view>
					<view class="sub-title">启用后，群成员需群主或管理员确认才能邀请朋友进群。扫描二维码进群将需要验证</view>
				</view>
				<view class="right">
					<u-switch activeColor="#7F17FE" inactiveColor="#dadada" size="20" v-model="room.invite" :activeValue="1"
						:inactiveValue="0" :loading="loading" @change="inviteSwitch"></u-switch>
				</view>
			</view>
			<view class="info-item  flex items-center justify-between" v-if="room.invite == 1 && project.isRoomOwnerByRoomAndMe(room)"
				@click="tools.navigateTo('/pages/chat/group/new', {id: room.id})">
				<view class="left">加群验证</view>
				<view class="right flex items-center">
					<image class="right_img" src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
						style="width: 12rpx; height: 20rpx;"></image>
				</view>
			</view>
			<view class="item-space"></view>
			<view class="info-item  flex items-center justify-between">
				<view class="left">仅群主/群管理可以修改群聊名称</view>
				<view class="right">
					<u-switch activeColor="#7F17FE" inactiveColor="#dadada" size="20" v-model="room.modify" :activeValue="1"
						:inactiveValue="0" :loading="loading" @change="modifySwitch"></u-switch>
				</view>
			</view>
			<view class="info-item  flex items-center justify-between"
				@click="tools.navigateToWithEncodeMultiply('/pages/chat/group/members', {room: room, type: 'admin'})">
				<view class="left">群主管理权转让</view>
				<view class="right flex items-center">
					<image class="right_img" src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
						style="width: 12rpx; height: 20rpx;"></image>
				</view>
			</view>
			<view class="info-item  flex items-center justify-between" v-if="project.isRoomOwnerByRoomAndMe(room)"
				@click="tools.navigateToWithEncodeMultiply('/pages/chat/group/groupManager', {room: room})">
				<view class="left">群管理员</view>
				<view class="right flex items-center">
					<image class="right_img" src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
						style="width: 12rpx; height: 20rpx;"></image>
				</view>
			</view>
			<view class="info-item flex items-center justify-between"
				@click="tools.navigateToWithEncodeMultiply('/pages/chat/group/forbidden', {room: room})">
				<view class="left">群禁言</view>
				<view class="right">
					<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
						style="width: 12rpx; height: 20rpx;"></image>
				</view>
			</view>
			<view class="info-item  flex items-center justify-between">
				<view class="left">群好友互加</view>
				<view class="right">
					<u-switch activeColor="#7F17FE" inactiveColor="#dadada" size="20" v-model="room.internal"
						:activeValue="1" :inactiveValue="0" :loading="loading" @change="internalSwitch"></u-switch>
				</view>
			</view>
		</view>

		<view class="bg-white" style="margin-top: 60rpx;">
			<view class="btn-option  flex justify-center items-center" v-if="userStore.user.id == room.admin_id"
				@click="show2 = !show2">
				<view class="btn-option_txt">解散群聊</view>
			</view>
		</view>

		<com-modal-confirm :msg="'确认解散 币圈交流群 吗？'" :red="['币圈交流群']" v-model:show="show2"
			@confirm="part"></com-modal-confirm>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		useUserStore
	} from '@/stores/modules/user';
	import project from '/utils/project';
	import tools from '@/utils/tools';
	import {
		updateChatRom
	} from '@/config/api';

	const props = defineProps(["room"])
	const room = ref(JSON.parse(decodeURIComponent(props.room)))


	const userStore = useUserStore()

	const show2 = ref(false)

	const loading = ref(false)

	//群好友互加开关切换
	const internalSwitch = (value) => {
		console.log(value)
		updateChatRom(room.value.id, {
			internal: value
		})
	}
	
	//群名称修改开关切换
	const modifySwitch = (value) => {
		console.log(value)
		updateChatRom(room.value.id, {
			modify: value
		})
	}	
	
	//邀请验证开关切换
	const inviteSwitch = (value) => {
		console.log(value)
		updateChatRom(room.value.id, {
			invite: value
		})
	}	

	//解散群聊
	const part = () => {
		uni.$u.http.post('/chat/chatRoom/part/' + room.value.id).then(data => {
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
</script>

<style lang="scss">
	page {
		background: $uni-bg-color-grey;
	}

	.info-rows {
		background: #FFFFFF;
		margin-top: 20rpx;

		.info-item {
			// height: 100rpx;
			min-height: 100rpx;

			margin: 0 30rpx;

			.left {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 32rpx;
				color: #000000;


				.sub-title {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 24rpx;
					color: #000000;
					// line-height: 36rpx;
					opacity: 0.6;

					padding-top: 10rpx;
					padding-bottom: 20rpx;
				}
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

	.item-space {
		width: 750rpx;
		height: 20rpx;
		background: #F8F8F8;
	}
</style>