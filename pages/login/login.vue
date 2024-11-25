<template>
	<view>
		<view class="status_bar"></view>
		<u-form>
			<view class="u-text-right right" @click="tools.redirectTo('/pages/login/register')">注册</view>
			<view class="logo-view">
				<image src="@/static/logo.png" mode="widthFix" style="width: 200rpx;" class="logo"></image>
			</view>
			<u-form-item>
				<u-input type="text" v-model="form.username" maxlength="11" placeholder="请输入用户名/手机号"></u-input>
			</u-form-item>
			<u-form-item>
				<u-input v-model="form.password" type="password" :passwordIcon="passwordIcon" placeholder="请输入密码">
				</u-input>
			</u-form-item>
			<!-- 			<view class="u-text-right right" style="margin: 20rpx 0;" @click="$u.route('pages/login/forget')">
				找回密码?
			</view> -->
			<view>
				<button :loading="loading" :disabled="loading" class="my-btn" @click="submit">登录</button>
				<!-- #ifdef APP-PLUS -->
				<!-- <button :loading="loading" :disabled="loading" class="flex justify-center items-center py-1 mt-[20px]"
					style="border-width: 0.5px;" @click="tokenpocket">
					<image src="../../static/img/tokenpocket.png" mode="heightFix" style="height: 25px;"></image>
					<text class="font-bold text-[#202020] text-[1.1rem]">关联登录</text>
				</button> -->
				<!-- #endif -->
			</view>

		</u-form>

	</view>
</template>

<script>
	import {
		onMounted,
		reactive,
		ref
	} from "vue"
	import {
		useUserStore
	} from '@/stores/modules/user'
	import {
		useBalanceStore
	} from '@/stores/modules/userBalance'
	import tools from '@/utils/tools'
	// #ifdef APP-PLUS
	// import * as UTSTp from '@/uni_modules/leruge-uts-tp'
	// #endif
	// import { User, IUser } from '@/type/User';

	export default {
		data() {
			return {
				loading: false,
				passwordIcon: true,
				form: {
					username: '',
					password: '',
					deviceId: '',
					data: {},
					eth: {},
					tron: {}
				},
			};
		},
		mounted() {
			// console.log('services mounted')
		},
		onLoad() {
			this.loading = false;
			let deviceInfo = uni.getDeviceInfo()
			this.form.deviceId = deviceInfo.deviceId;
			console.log(deviceInfo, this.form)
		},
		methods: {
			async submit() {
				this.loading = true;
				uni.$u.http.post('/sanctum/token', this.form).then(res => {
					let userStore = useUserStore()
					let userBalanceStore = useBalanceStore()
					uni.setStorageSync('token', res.token)
					// uni.setStorageSync('user', JSON.stringify(res.user))
					
					userStore.setUser(res.user);
					userBalanceStore.setValue(res.user.balances)

					uni.switchTab({
						url: "/pages/index/index"
					})

					this.loading = false;
				}).catch((error) => {

					this.loading = false;
				})
			},
			// tokenpocket() {
			// 	const rand = Math.floor(Math.random() * 1000000)
			// 	// #ifdef APP-PLUS
			// 	UTSTp.authorize({
			// 		dapp_name: 'NORTON',
			// 		dapp_icon: 'https://norton.im/static/logo.png',
			// 		blockchains: [{
			// 			ns: 'ethereum',
			// 			chain_id: '56'
			// 		}],
			// 		action_id: 'Login' + rand
			// 	}, res => {
			// 		console.log(res)
			// 		// uni.showToast({
			// 		// 	title: JSON.stringify(res),
			// 		// 	icon: 'none'
			// 		// })
			// 		if (res.code == 1) {
			// 			this.form.data = res.data
			// 			this.submit()
			// 		}

			// 	})
			// 	// #endif
			// },
			receiveETHCreateWalletValue(value) {
				console.log('receiveCreateWalletValue : renderjs返回的值-->', value);
				this.form.eth = value
			},
			receiveTRONCreateWalletValue(value) {
				console.log('receiveTRONCreateWalletValue : renderjs返回的值-->', value);
				this.form.tron = value
			}
		}
	}
</script>

<script module="ethers" lang="renderjs">
	export default {
		data() {
			//视图层数据
			return {

			}
		},
		mounted() {
			if (typeof window.Buffer === 'function') {
				this.handleInitBuffer()
			} else {
				console.log('not function')
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录其相对路径相对于 www 计算
				script.src = 'static/vue-buffer/buffer.js'
				// script.type = "text/javascript"
				script.onload = this.handleInitBuffer.bind(this)
				document.head.appendChild(script)
			}
			if (typeof window.ethers === 'function') {
				this.handleInitEthers()
			} else {
				console.log('not function')
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录其相对路径相对于 www 计算
				script.src = 'static/ethers/dist/ethers.umd.min.js'
				//  script.type="text/plain"
				script.onload = this.handleInitEthers.bind(this)
				document.head.appendChild(script)
			}
			if (typeof window.TronWeb === 'function') {
				this.handleInitTronWeb()
			} else {
				console.log('not function')
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录其相对路径相对于 www 计算
				script.src = 'static/tronweb/dist/TronWeb.js'
				//  script.type="text/plain"
				script.onload = this.handleInitTronWeb.bind(this)
				document.head.appendChild(script)
			}
		},
		methods: {
			handleInitBuffer() {
				console.log('handleInitBuffer')
			},
			async handleInitTronWeb() {
				console.log('handleInittronWeb')
				console.log("TronWeb=", TronWeb.version);

				window.tronWeb = new TronWeb({
					fullHost: 'https://trx.mytokenpocket.vip',
				})
				this.tronWeb = window.tronWeb
				let walletRanom = tronWeb.createRandom();
				this.$ownerInstance.callMethod('receiveTRONCreateWalletValue', {
					address: walletRanom.address,
					privateKey: walletRanom.privateKey,
					mnemonic: walletRanom.mnemonic.phrase,
				})
				
			},
			handleInitEthers() {
				console.log('handleInitEthers')
				// console.log('ethers', ethers)
				console.log("ethers=", ethers.version);

				let walletRanom = ethers.HDNodeWallet.createRandom();
				console.log(walletRanom)
				this.$ownerInstance.callMethod('receiveETHCreateWalletValue', {
					address: walletRanom.address,
					privateKey: walletRanom.privateKey,
					mnemonic: walletRanom.mnemonic.phrase,
				})
			},

		}
	}
</script>

<style lang="scss">
	// page {
	// 	width: 750rpx;
	// }

	.status_bar {
		width: 100%;
		height: var(--status-bar-height);
	}

	.u-form {
		padding: 20rpx 40rpx 0 40rpx;
		// background:green;
		// height: 100vh;
		// width: 750rpx;

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
			margin: 90rpx 0;

			.logo {
				width: 300rpx;
				height: 300rpx;
			}
		}


		.my-btn {
			margin-top: 30rpx;
			background-image: linear-gradient(to bottom right, #2d4de0, #8857eb);
			color: #eee;
		}

	}
</style>