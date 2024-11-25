<template>
	<view class="">
		<com-nav-bar title="群组信息" border="true" backgroundColor="#fff"></com-nav-bar>
		<view class="info bg-white">
			<view class="info_container">
				<view class="bg-gray-300" style="border-radius: 20rpx;">
					<com-avatar :data="room.avatar_list" width="200" height="200"></com-avatar>
				</view>
				<view class="info_nickname pt-4">
					{{room.name}}
				</view>
			</view>

			<view class="info_add_friend flex flex-col mb-[30rpx]" @click="submit">
				<view class="flex items-center">
					<image src="@/static/images/chat/addplus_zi@2x.png" mode="aspectFit"
						style="width: 26rpx; height: 26rpx;"></image>
					<view class="" style="margin-left: 19rpx;">申请加入群聊</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script setup>
	import {
		nextTick,
		reactive,
		ref,
		watchEffect
	} from "vue";

	import tools from '@/utils/tools'
	import project from "@/utils/project";
	import {
		useUserStore
	} from "@/stores/modules/user";
	import {
		acceptFriend,
		getChatRoom
	} from "@/config/api";
	const props = defineProps(['id', 'from_user_id'])

	const userStore = useUserStore()
	const loading = ref(false)
	const title = ref('')
	const remark = ref('')

	const room = ref({
		id: 0,
		name: "群组",
		notice: null,
		admin_id: 0,
		userList: [],
		avatar_list: [],
		users: [],
		admins: [],
		mutes: [],
		admin: {},
		remarks: [],
		internal: 1,
		mute: 0,
		modify: 1
	})

	const getRoomData = () => {
		getChatRoom(props.id).then(data => {
			console.log('getChatRoom', data)
			room.value = data

			if (isInRoom()) {
				tools.navigateToWithEncodeMultiply('/pages/chat/talk/talk', {
					room_id: 'room-' + room.value.id
				})
			}
		})
	}


	const isInRoom = () => {
		return room.value.users.findIndex(item => item == userStore.user.id) > -1
	}

	getRoomData();


	const submit = () => {
		console.log(remark.value)
		uni.$u.http.post('/chat/chatRoomVerify', {
			room_id: props.id,
			from_user_id: props.from_user_id,
			remark: remark.value,
			source: 2 //扫码加入
		}).then(res => {
			console.log()
			tools.toast('已申请，待验证');
		})
	}
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
	
	.info_add_friend:active {
		background: #EEEEEE;
	}
</style>