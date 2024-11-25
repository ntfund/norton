<template>
	<view>
		<com-nav-bar title="验证申请" backgroundColor="#fff"></com-nav-bar>
		<view class="content">
			<view class="avatar flex ">
				<image class="avatar_img" :src="baseURL + to_user.avatar" mode="aspectFit"
					style="width: 120rpx; height: 120rpx;"></image>
				<view class="flex flex-col justify-center " style="margin-left: 31rpx;">
					<view class="flex items-center">
						<view class="avatar_name">{{to_user.nickname}}</view>
						<image class="avatar_vip" :src="'/static/images/profile/vip/'+to_user.real_vip+'@2x.png'"
							mode="aspectFit" style="width: 120rpx; height: 30rpx;"></image>
					</view>
					<view class="avatar_uid">UID：{{to_user.uid}}</view>
				</view>
			</view>

			<view class="n-input" style="margin-top: 54rpx;">
				<view class="n-input_label">输入您的验证申请</view>
				<view class="n-input_view">
					<input type="text" class="n-input_input" v-model="formData.tip" placeholder="请输入">
				</view>
			</view>

			<view class="n-input" style="margin-top: 66rpx;">
				<view class="n-input_label">为朋友添加备注昵称</view>
				<view class="n-input_view">
					<input type="text" class="n-input_input" v-model="formData.remark" placeholder="请输入">
				</view>
			</view>

			<view class="btn-bottom">
				<button type="button" class="n-btn" @click="confirmed">
					<text>发送申请</text>
				</button>
			</view>

		</view>
	</view>
</template>

<script setup>
	import {
		reactive
	} from 'vue';
	import {
		getUserBaseInfo
	} from '@/config/api';
	import {
		baseURL
	} from '@/config/http';
	import {
		useUserStore
	} from '@/stores/modules/user';

	const props = defineProps(['to_user_id'])
	let to_user = reactive({
		nickname: '',
		avatar: '',
		uid: '',
		real_vip: ''
	})
	const userStore = useUserStore();
	const formData = reactive({
		tip: '我是 ' + userStore.user.nickname,
		remark: ''
	})

	getUserBaseInfo(props.to_user_id).then(data => {
		console.log('getUserBaseInfo', data)
		for (const key in data) {
			to_user[key] = data[key]
		}

		console.log(to_user)
	})

	const confirmed = () => {
		uni.$u.http.post('/chat/newFriend', {
			to_user_id: props.to_user_id,
			...formData
		}).then(data => {
			uni.showToast({
				title: "已向对方发送好友申请",
				icon: 'none'
			});
		})
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F8F8F8;
	}

	.content {

		padding: 55rpx 0;

		.avatar {

			padding: 0 28rpx;

			padding-bottom: 41rpx;

			border-bottom: 2rpx solid #EEEEEE;

			&_img {
				border-radius: 50%;

				border: 4rpx solid #7F17FE;
			}

			&_name {
				font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 48rpx;
				color: #000000;
			}

			&_vip {
				margin-left: 19rpx;
			}

			&_uid {
				font-family: Gilroy-Regular;
				font-weight: 400;
				font-size: 22rpx;
				color: #999;

				padding-left: 4rpx;
				padding-top: 9rpx;
			}
		}

		.n-input {

			padding: 0 28rpx;

			&_label {
				margin-bottom: 20rpx;

				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 26rpx;
				color: #000000;
			}

			&_view {
				background: #FFFFFF;
				border-radius: 8rpx;
				border: 2rpx solid #EEEEEE;

				display: flex;
				align-items: center;

			}

			&_input {
				height: 100rpx;

				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 32rpx;

				padding-left: 34rpx;
			}
		}
	}
</style>