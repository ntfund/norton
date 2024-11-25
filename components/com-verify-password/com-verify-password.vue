<template>
	<view>
		<u-popup v-if="showAuth && show" :show="show" :round="10" mode="center" @close="close" @open="authOpen"
			bgColor="transparent">
			<view class="auth">
				<view class="auth-view">
					<view class="img">
						<image src="@/static/images/auth/face.png" v-if="isFacial" mode="aspectFill"
							style="width: 100rpx; height: 100rpx;"></image>
						<image src="@/static/images/auth/fingerprint.png" v-else mode="aspectFill"
							style="width: 100rpx; height: 100rpx;"></image>
					</view>
					<view class="info">
						<text v-if="isFacial">请用FaceID解锁</text>
						<text v-else>请使用指纹</text>
					</view>
					<view class="cancel" @click="close">
						取消
					</view>
				</view>
			</view>
		</u-popup>

		<u-popup v-if="showPasswordInput && show" :show="show" :round="10" mode="bottom" @close="close" @open="open">
			<view class="title">
				<view class="left">验证密码</view>
				<view class="flex items-center" v-if="isFacial || isFingerPrint">
					<com-input-checkbox :label="isFacial ? '启用面容ID' : '启用指纹验证'"
						v-model="isEnableAuth"></com-input-checkbox>
				</view>
			</view>
			<view class="content">
				<view class="container2">
					<view class="input-box">
						<input class="input" v-model="password" placeholder="请输入钱包密码" :password="showPassword"
							cursor-spacing="30" />
						<view @click="showPassword = !showPassword">
							<uni-icons type="eye-filled" size="22" v-if="showPassword"></uni-icons>
							<uni-icons type="eye-slash-filled" size="22" v-else></uni-icons>
						</view>
					</view>
					<!-- <u--input class="mt-4" placeholder="请输入密码" type="password" color="#6f6f6f" border="surround" fontSize="16"
						v-model="password"></u--input> -->
					<button type="button" class="n-btn-full" @click="confirmPassword">确认</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from "vue";
	import dbSetting from "@/utils/dbSetting";
	import tools from "@/utils/tools";
	import secret from "@/utils/secret";
	const props = defineProps(['show', 'data'])
	const emit = defineEmits(['update:show', "success"]);

	const password = ref('');
	const showPassword = ref(true);
	//生物认证窗口
	const showAuth = ref(false);
	//手动输入密码窗口
	const showPasswordInput = ref(false);
	//是否支持指纹
	const isFingerPrint = ref(false);
	//是否支持faceid
	const isFacial = ref(false);

	const isEnableAuth = ref(false);


	const open = () => {
		// console.log('open');

	}
	const close = () => {
		emit('update:show', false);
	}

	const successResult = async () => {
		if (isEnableAuth.value) {
			if (isFacial.value){
				await dbSetting.updateValue("facial", "1")
			}
			if (isFingerPrint.value) {
				await dbSetting.updateValue("fingerPrint", "1")
			}
		}		
		try{
			emit('success');
		}catch(e){
			//TODO handle the exception
			console.log(e.message)
		}
		close();
	}

	const confirmPassword = async () => {
		// #ifdef H5
		successResult();
		// #endif
		// #ifndef H5
		if (password.value == '') {
			tools.toast("请输入密码")
			return;
		}
		// console.log(password.value);
		let walletPasswd = await dbSetting.getPassword();
		if (secret.md5(password.value) != walletPasswd) {
			tools.toastError("密码错误")
			return;
		}
		
		if (isEnableAuth.value) {			
			showPasswordInput.value = false;
			showAuth.value = true;
			if (true == isFacial.value) {
				startSoterAuthenticationFaceID();
			} else if (true == isFingerPrint.value) {
				startSoterAuthenticationFingerPrint()
			}
		} else {
			successResult();
		}		
		// #endif		
	}


	// const platform = uni.getSystemInfoSync().platform
	// switch (platform) {
	// 	case "ios":
	// 		console.log('你已经进入苹果平台，你需要执行的代码是！！！！')
	// 		break;
	// 	case "devtools":
	// 		console.log('你已经进入微信小程序，你需要执行的代码是！！！！')
	// 		break;
	// 	case "android":
	// 		console.log('你已经进入安卓平台！！！，你需要执行的代码是！！！！')
	// 		break;
	// 	default:
	// 		break;
	// }

	//检查支持的认证方式
	const checkIsSupportSoterAuthentication = () => {
		uni.checkIsSupportSoterAuthentication({
			success(res) {
				console.log('supportMode', res);
				// checkIsSoterEnrolledInDeviceFingerPrint();
				if (res.supportMode.includes("fingerPrint")) {
					checkIsSoterEnrolledInDeviceFingerPrint();
				} else if(res.supportMode.includes("facial")) {
					checkIsSoterEnrolledInDeviceFaceID();
				}				
			},
			fail(err) {
				console.log(err);
			},
			complete(res) {
				console.log(res);
				isEnableAuth.value = isFacial.value || isFingerPrint.value;
			}
		})
	}

	//检查是否录入指纹
	const checkIsSoterEnrolledInDeviceFingerPrint = () => {
		uni.checkIsSoterEnrolledInDevice({
			checkAuthMode: 'fingerPrint',
			success(res) {
				console.log('检查是否录入指纹: ', res);
				isFingerPrint.value = res.isEnrolled;
			},
			fail(err) {
				console.log(err);
			},
			complete(res) {
				console.log(res);
			}
		})
	}

	//检查是否录入FaceID
	const checkIsSoterEnrolledInDeviceFaceID = () => {
		uni.checkIsSoterEnrolledInDevice({
			checkAuthMode: 'facial',
			success(res) {
				console.log("检查是否录入FaceID:", res);
				isFacial.value = res.isEnrolled
			},
			fail(err) {
				console.log(err);
			},
			complete(res) {
				console.log(res);
			}
		})
	}

	//开始指纹认证
	const startSoterAuthenticationFingerPrint = () => {
		uni.startSoterAuthentication({
			requestAuthModes: ['fingerPrint'],
			challenge: '123456',
			authContent: "请用指纹解锁",
			success(res) {
				console.log('success', res);
				successResult();
			},
			fail(err) {
				console.log('fail', err);
			},
			complete(res) {
				console.log('complete', res);
				showAuth.value = false;
			}
		})
	}

	//开始FaceID认证
	const startSoterAuthenticationFaceID = () => {
		uni.startSoterAuthentication({
			requestAuthModes: ['facial'],
			challenge: '123456',
			authContent: "请用FaceID解锁",
			success(res) {
				console.log(res);
				successResult();
			},
			fail(err) {
				console.log(err);
			},
			complete(res) {
				console.log(res);
				showAuth.value = false;
			}
		})
	}

	const authOpen = async () => {

	}

	onMounted(async () => {
		// #ifdef H5
		showPasswordInput.value = true;
		// #endif
		// #ifndef H5
		checkIsSupportSoterAuthentication();
		const authMode = await dbSetting.getAuth()
		console.log('authMode', authMode)
		if (authMode !== false) {
			showAuth.value = true;
			if (true == isFacial.value && authMode == "facial") {
				startSoterAuthenticationFaceID();
			} else if (true == isFingerPrint.value && authMode == "fingerPrint") {
				startSoterAuthenticationFingerPrint()
			} else {
				showAuth.value = false;
				showPasswordInput.value = true;
			}
		} else {
			showPasswordInput.value = true;
		}
		// #endif		
	})
</script>

<style lang="scss" scoped>
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.left {
			font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 38rpx;
			color: #0A0A0A;
		}

		padding: 40rpx 30rpx;
	}

	.content {
		// width: 750rpx;		

		.container2 {
			padding: 30rpx;
			padding-top: 0;



			.input-box {
				height: 90rpx;

				display: flex;
				justify-content: space-between;
				align-items: center;

				border: 1rpx solid #eee;

				padding: 0 30rpx;

				.input {
					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 30rpx;
				}
			}

			.n-btn-full {
				margin-top: 40rpx;
			}
		}
	}

	.auth {


		.auth-view {
			width: 500rpx;
			// height: 300rpx;
			position: relative;
			top: -150rpx;
			padding-top: 30rpx;

			background-color: white;
			border-radius: 20rpx;

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;


			.img {}

			.info {
				padding: 30rpx 0;
			}

			.cancel {
				width: 100%;
				padding: 20rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #7F17FE;

				border-top: 1rpx solid #ccc;

				font-family: Gilroy-Medium;
				font-weight: Medium;
				font-size: 30rpx;

				border-bottom-left-radius: 20rpx;
				border-bottom-right-radius: 20rpx;
			}

			.cancel:active {
				background: #eee;
			}
		}

	}
</style>