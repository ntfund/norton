<template>
	<scroll-view class="content_scroll-view" scroll-y="true" upper-threshold="50">
		<view class="content">
			<view class="flex content_tip">
				<view>输入助记词来添加或恢复您的钱包。为了您的资产安全</view>
				<view class="content_logo">Norton</view>
				<view>不会存储您的助记词，请妥善保管！</view>
			</view>
			<view class="input-box">
				<textarea class="input-box_textarea" v-model="formData.mnemonic" placeholder="输入助记词单词，并使用空格分开"
					cursor-spacing="20" />
				<view class="input-box_zhantie">
					<text @click="clipboardData">粘贴</text>
				</view>
			</view>
			<view class="input-row">
				<view class="input-row_title">设置钱包名称（{{chain.name}}）</view>
				<view class="input-row_input">
					<input type="text" v-model="formData.name" placeholder="请填写钱包名称" cursor-spacing="20" />
				</view>
			</view>
			<view v-if="!hasPassword">
				<view class="input-row">
					<view class="input-row_title">设置密码</view>
					<view class="input-row_input">
						<input type="password" v-model="formData.password" placeholder="密码不少于8位数" cursor-spacing="50"
							@input="checkPasswd" />
					</view>
					<view class="text-[#FC465C] mt-[10rpx]" v-if="formData.password && formData.password.length < 8">
						密码少于8位数
					</view>
				</view>
				<view class="input-row">
					<view class="input-row_title">重复输入新的密码</view>
					<view class="input-row_input">
						<input type="password" v-model="formData.password2" placeholder="请重复输入" cursor-spacing="20"
							@input="checkPasswd" />
					</view>
					<view class="text-[#FC465C] mt-[10rpx]" v-if="showPassNotTip">
						2次输入的密码不一致
					</view>
					<view class="text-[#FC465C] mt-[10rpx]" v-if="formData.password2 && formData.password2.length < 8">
						密码少于8位数
					</view>
				</view>
			</view>
			<view :class="status ? 'btn-bottom': 'mt-box'">
				<button type="button" class="n-btn " :class="{'disabled': disabled || loading}"
					:disabled="disabled || loading" @click="confirmed">马上导入</button>
			</view>
			<com-wallet-verify v-model:wallet.sync="formData"></com-wallet-verify>
			<com-watch-user-login v-if="isFirst" ref="loginRef"></com-watch-user-login>
		</view>
	</scroll-view>
</template>

<script setup>
	import {
		computed,
		onMounted,
		reactive,
		ref
	} from 'vue';
	import useAdjustResize from '@/hooks/project/useAdjustResize';
	import useCheckHasPasword from '@/hooks/db/useCheckHasPasword';
	import dbWallet from '@/utils/dbWallet';
	import dbSetting from '@/utils/dbSetting';
	import {
		MD5
	} from 'crypto-js';

	const props = defineProps(['chain_id']);
	const loginRef = ref(null)
	const loading = ref(false);
	const isFirst = ref(false);
	const showTip = ref(true)

	const {
		hasPassword
	} = useCheckHasPasword()

	const {
		status
	} = useAdjustResize();


	const chain = reactive({
		name: 'NRT生态链',
		type: 'eth'
	})

	let formData = reactive({
		name: '',
		mnemonic: null,
		privateKey: null,
		keystore: null,
		keystore_password: null,
		address: '',
		password: '',
		password2: '',
		type: '',
	})

	const showPassNotTip = ref(false);
	const disabled = computed(() => {
		if (hasPassword.value) {
			return !formData.mnemonic || !formData.name;
		}
		return !formData.mnemonic || !formData.name || formData.password != formData.password2 || formData.password
			.length < 8;
	})

	const checkPasswd = () => {
		showPassNotTip.value = formData.password != formData.password2 && formData.password2 && formData
			.password;
	}

	const clipboardData = () => {
		uni.getClipboardData({
			success: (res) => {
				console.log(res.data);
				formData.mnemonic = res.data;
			}
		});
	}


	const confirmed = async () => {
		if (!formData.address) {
			uni.showToast({
				title: "助记词校验不正确",
				icon: 'error',
				duration: 2000
			})
			return;
		}
		if (!formData.name) {
			uni.showToast({
				title: "请填写钱包名称",
				icon: 'error',
				duration: 2000
			})
			return;
		}
		let exist = await dbWallet.getWallet(formData.address, props.chain_id);
		if (exist) {
			uni.showToast({
				title: "钱包已存在",
				icon: 'fail',
				duration: 2000
			})
			return;
		}
		//设置密码
		if (formData.password) {
			await dbSetting.updateValue('password', MD5(formData.password).toString())
		}
		//设置密码提示
		if (formData.tip) {
			await dbSetting.updateValue('password_tip', formData.tip)
		}
		loading.value = true;
		await dbWallet.createWallet(formData, props.chain_id)
				
		const wallets = await dbWallet.getWallets(props.chain_id);
		if (wallets.length == 1 && props.chain_id == 3) {
			//初次导入。
			if (isFirst.value) {
				await loginRef.value.login(formData.address, formData.privateKey);
			}
			loading.value = false;
			uni.switchTab({
				url: '/pages/wallet/index'
			})
		} else {
			loading.value = false;
			uni.navigateBack({
				delta: 2
			})
		}

	}


	onMounted(async () => {
		let _chain = dbWallet.getChain(props.chain_id);
		console.log(_chain, props.chain_id)
		chain.name = _chain.name
		formData.type = _chain.type
		formData.name = await dbWallet.getWalletName(props.chain_id);
		
		const wallets = await dbWallet.getWallets(props.chain_id);
		if (wallets.length == 0) {
			isFirst.value = true;
		}
	})

	defineExpose({
		formData
	})
</script>

<style lang="scss" scoped>
	page {
		background: #F8F8F8;
	}

	.content_scroll-view {
		height: calc(100vh - 220rpx);
	}

	.content {
		padding: 44rpx 28rpx;
		position: relative;

		// display: flex;
		// flex-direction: column;
		&_tip {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 24rpx;
			color: #000000;

			display: flex;
			flex-wrap: wrap;
			align-items: center;

			// background: green;
		}

		&_logo {
			font-family: Gilroy-Regular;
			padding: 0 5rpx;
		}

		.input-box {
			width: 694rpx;
			height: 180rpx;
			background: #FFFFFF;
			box-shadow: 0px 4rpx 10rpx 0rpx rgba(11, 16, 29, 0.2);
			border-radius: 8rpx;

			margin-top: 35rpx;
			margin-bottom: 68rpx;

			position: relative;

			&_textarea {
				padding: 33rpx;
				height: 110rpx;

				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 24rpx;
				color: #666;
			}

			&_zhantie {
				position: absolute;
				z-index: 1;
				right: 29rpx;
				bottom: 19rpx;

				color: #7F17FE;
			}
		}

		.input-row {
			margin-bottom: 56rpx;

			&_title {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 26rpx;
				color: #000000;

				height: 24rpx;
			}

			&_input {
				background: #FFFFFF;
				border-radius: 8rpx;
				border: 2rpx solid #EEEEEE;
				margin-top: 30rpx;

				input {
					// width: 694px;
					// height: 100rpx;
					padding: 34rpx;

					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 32rpx;
					color: #000000;
				}
			}
		}

		.mt-box {
			margin-top: 100rpx;
		}
	}
</style>