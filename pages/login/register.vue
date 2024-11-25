<template>
	<view>
		<view class="status_bar"></view>
		<u-form>
			<view class="flex justify-between items-center">
				<view class="u-text-right right" @click="$u.route('pages/login/login')">已有账号？<span
						class="text-blue-500">登录</span></view>
				<!-- #ifdef H5 -->
				<view class="text-right right" @click="downloadApp">点击下载APP</view>
				<!-- #endif -->
			</view>
			<view class="logo-view">
				<image src="@/static/logo.png" mode="widthFix" style="width: 200rpx;" class="logo"></image>
			</view>
			<u-form-item>
				<u-input type="text" v-model="form.username" placeholder="用户名"></u-input>
			</u-form-item>

			<!-- <u-form-item>
				<u-input type="number" v-model="form.nickname" placeholder="昵称"></u-input>
			</u-form-item> -->

			<!-- <u-form-item>
				<u-input v-model="form.mobile_code" type="number" placeholder="验证码" />
				<view class="wrap">
					<u-toast ref="uToast"></u-toast>
					<u-button @tap="getCode">{{tips}}</u-button>
				</view>
			</u-form-item> -->
			<u-form-item>
				<u-input v-model="form.password" type="password" :passwordIcon="passwordIcon" placeholder="登录密码">
				</u-input>
			</u-form-item>
			<u-form-item>
				<u-input v-model="form.yqm" placeholder="邀请码"></u-input>
			</u-form-item>
			<view>
				<button :loading="loading" :disabled="loading" class="my-btn" @click="submit">注册并登录</button>
			</view>
			<view class="yuedu">
				<label>
					<checkbox :checked="checked" @click="checked = !checked"></checkbox>
					已阅读并同意<span>用户注册协议</span>和<span>隐私政策</span>
				</label>
			</view>
		</u-form>

	</view>
</template>

<script setup lang="ts">
	import { onMounted, reactive, ref } from "vue";
	import { useUserStore } from '@/stores/modules/user'
	import { useBalanceStore } from '@/stores/modules/userBalance'
	const userStore = useUserStore()
	const userBalanceStore = useBalanceStore()

	const loading = ref(false)
	const checked = ref(true)
	const passwordIcon = true
	const form = reactive({
		username: '', //用户名
		nickname: '', //昵称
		password: '', //密码
		xieyi: 2, //同意协议 1同意，其他数字不同意
		yqm: '', //邀请码
		deviceId: ''
	})
	let downloadUrl = ''

	const http = uni.$u.http;
	// H5 获取下载地址
	const getDownloadUrl = () => {
		http.get('/index/download').then(res => {
			console.log(res);
			downloadUrl = res.url;
		})
	}
	// H5 下载APP
	const downloadApp = () => {
		location.href = downloadUrl;
	}
	const submit = () => {
		if (!checked.value) {
			uni.$u.toast("请同意并阅读协议和隐私政策");
			return;
		}
		if (!form.username) {
			uni.$u.toast("请填写用户名!");
			return;
		}
		if (!form.password) {
			uni.$u.toast("请填写登录密码");
			return;
		}
		// if (!form.yqm) {
		// 	uni.$u.toast("请填写邀请码!");
		// 	return;
		// }
		loading.value = true;
		if (checked.value) {
			form.xieyi = 1;
		}
		http.post('/user/register', form).then(res => {
			// uni.$u.toast(res.msg);
			console.log(res)
			uni.setStorageSync('token', res.token)
			uni.setStorageSync('user', JSON.stringify(res.user))
			uni.setStorageSync('balances', JSON.stringify(res.user.balances))
			userStore.setUser(res.user);
			userBalanceStore.setValue(res.user.balances)

			uni.switchTab({
				url: "/pages/index/index"
			})
		}).catch(err => {
			loading.value = false;
		});
	}


	onMounted(() => {
		// #ifdef H5
		getDownloadUrl();
		// #endif

		let deviceInfo = uni.getDeviceInfo()
		form.deviceId = deviceInfo.deviceId;
		console.log(deviceInfo)
	})
</script>

<style lang="scss">
	.status_bar {
		width: 100%;
		height: var(--status-bar-height);
	}

	.u-form {
		padding: 20rpx 40rpx 0 40rpx;

		.u-form-item {
			// border-bottom: 1px solid #dae1e7 !important;

			.u-input {
				color: #000000;
				padding-left: 20rpx;
				padding-right: 20rpx;
			}

			.input-placeholder {
				color: #909399 !important;
			}
		}


		.right {
			color: #000000;
		}

		.logo-view {
			width: 100%;
			text-align: center;
			margin: 70rpx 0;

			.logo {
				width: 300rpx;
				height: 300rpx;
			}
		}

		.my-btn {
			margin-top: 100rpx;
			background-image: linear-gradient(to bottom right, #2d4de0, #8857eb);
			color: #eee;
		}

		.yuedu {
			margin-top: 20rpx;
			width: 100%;
			text-align: center;
			color: #878787;

			span {
				color: #000000;
			}

			;

			checkbox {
				position: relative;
				top: -4rpx;
			}
		}
	}
</style>