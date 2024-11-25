<template>
	<view>
		<com-nav-bar title="创建钱包" :border="true"></com-nav-bar>
		<view class="h-[52rpx] w-[100%]"></view>
		<view class="item-row">
			<view class="item-row_title">设置钱包名称</view>
			<view class="item-row_input">
				<input type="text" v-model="formData.name" placeholder="钱包名称">
			</view>
		</view>
		<view v-if="!hasPassword">
			<view class="item-row">
				<view class="item-row_title">设置密码</view>
				<view class="item-row_input">
					<input type="password" v-model="formData.password" placeholder="请输入不少于8位数的密码"
						@focus="showPassTip = true" @blur="showPassTip = false" @input="checkPasswd">
				</view>
				<view class="mima-tip" v-if="showPassTip">
					该密码仅用于钱包的安全防护，平台不会保存您的密码，请您务必记得并保管好密码！
				</view>
				<view class="mima-tip" v-if="formData.password && formData.password.length < 8">
					密码少于8位数
				</view>
			</view>
			<view class="item-row">
				<view class="item-row_title">重复输入</view>
				<view class="item-row_input">
					<input type="password" v-model="formData.passwordRepeat" placeholder="请重复输入密码" @input="checkPasswd">
				</view>
				<view class="mima-tip" v-if="showPassNotTip">
					2次输入的密码不一致
				</view>
				<view class="mima-tip" v-if="formData.passwordRepeat && formData.passwordRepeat.length < 8">
					密码少于8位数
				</view>
			</view>
			<view class="item-row">
				<view class="item-row_title">提示信息</view>
				<view class="item-row_input">
					<input type="text" v-model="formData.tip" placeholder="密码提示信息（可不填）">
				</view>
			</view>
		</view>

		<view :class="status ? 'btn-bottom': 'mt-box'">
			<button type="button" class="n-btn " :class="{'disabled': disabled}" :disabled="disabled"
				@click="ok">创建钱包</button>
		</view>


	</view>
</template>

<script setup>
	import {
		computed,
		onMounted,
		reactive,
		ref
	} from 'vue';
	import dbSetting from '@/utils/dbSetting';
	import useCheckHasPasword from '@/hooks/db/useCheckHasPasword';
	import dbWallet from '@/utils/dbWallet';
	import tools from '@/utils/tools';
	import useAdjustResize from '@/hooks/project/useAdjustResize';
	const {
		status
	} = useAdjustResize();
	
	const props = defineProps(['chain_id']);

	const formData = reactive({
		name: '',
		password: '',
		passwordRepeat: '',
		tip: '',
	})

	const {
		hasPassword
	} = useCheckHasPasword()
	const showPassTip = ref(false);
	const showPassNotTip = ref(false);
	const disabled = computed(() => {
		if (hasPassword.value) {
			return !formData.name;
		}
		return !formData.name  || formData.password != formData.passwordRepeat || formData.password.length < 8;
	})

	const checkPasswd = () => {
		showPassNotTip.value = formData.password != formData.passwordRepeat && formData.passwordRepeat && formData
			.password;
	}

	const ok = () => {
		
		if (!formData.name) {
			uni.showToast({
				title: "请填写钱包名称",
				icon: 'error',
				duration: 2000
			})
			return;
		}
		
		uni.setStorageSync('newWallet', {name: formData.name, password: formData.password, tip: formData.tip, chain_id: props.chain_id})
		
		tools.navigateTo('/pages/wallet/backup/tip', {chain_id: props.chain_id})
	}


	onMounted(async () => {
		formData.name = await dbWallet.getWalletName(props.chain_id);
	})
</script>

<style lang="scss" scoped>
	.item-row {
		padding: 0 29rpx;
		margin-bottom: 75rpx;
		position: relative;

		&_title {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 26rpx;
		}

		&_input {
			input {
				// background: green;
				height: 96rpx;
				padding-left: 35rpx;

				border-radius: 8px;
				border: 2rpx solid #EEEEEE;

				margin-top: 28rpx;
			}

			input:focus-within {
				border: 2rpx solid #7F17FE;
			}
		}

		.mima-tip {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 24rpx;
			color: #FC465C;

			margin-top: 22rpx;

			// position: absolute;
			// width: 694rpx;
			// margin: 0;

			// left: 28rpx;
			// bottom: -50rpx;
		}
	}
</style>