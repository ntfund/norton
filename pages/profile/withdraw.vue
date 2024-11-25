<template>
	<view>
		<com-nav-bar title="提现" backgroundColor="#fff" :border="true"></com-nav-bar>
		<view class="content">
			<view class="relative">
				<view class="flex flex-row justify-between items-center input-symbol" @click="showChainSelect = !showChainSelect; showTokenSelect = false;">
					<view class="input-symbol_name">
						网络
					</view>
					<view class="flex items-center">
						<image :src="chainSelected.icon" mode="aspectFit" class="input-symbol_img"
							style="width: 40rpx; height: 40rpx;">
						</image>
						<text class="font-bold input-symbol_symbol">{{chainSelected.name}}</text>
						<view class="iconfont icon-arrow-down-filling input-symbol_down"></view>
					</view>

				</view>
				<view class="absolute w-[100%] bg-white z-10 shadow-md" v-if="showChainSelect">
					<view
						class="flex flex-row justify-between input-symbol-select input-symbol-select_border items-center"
						:class="{'bg-cyan-50' : chainSelected.id == item.id}" v-for="(item, index) in chainList" :key="index"
						@click="chainSelected = item; showChainSelect = false; recipient = '';">
						<view class="flex items-center">
							<image :src="item.icon" mode="aspectFit" style="width: 50rpx; height: 50rpx; border-radius: 50%;">
							</image>
							<text class="font-bold ml-[20rpx]">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="relative" style="margin-top: 45rpx;">
				<view class="flex flex-row justify-between items-center input-symbol" @click="showTokenSelect = !showTokenSelect; showChainSelect = false;">
					<view class="input-symbol_name">
						币种
					</view>
					<view class="flex items-center">
						<image :src="tokenSelected.icon" mode="aspectFit" class="input-symbol_img"
							style="width: 40rpx; height: 40rpx;">
						</image>
						<text class="font-bold input-symbol_symbol">{{tokenSelected.name}}</text>
						<view class="iconfont icon-arrow-down-filling input-symbol_down"></view>
					</view>

				</view>
				<view class="absolute w-[100%] bg-white z-10 shadow-md" v-if="showTokenSelect">
					<view
						class="flex flex-row justify-between input-symbol-select input-symbol-select_border items-center"
						:class="{'bg-cyan-50' : tokenSelected.id == item.id}" v-for="(item, index) in tokens" :key="index"
						@click="tokenSelected = item; showTokenSelect = false;">
						<view class="flex items-center">
							<image :src="item.icon" mode="aspectFit" style="width: 50rpx; height: 50rpx; border-radius: 50%;">
							</image>
							<text class="font-bold ml-[20rpx]">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>

			<view style="margin-top: 45rpx;">
				<view class="flex justify-between items-center">
					<view class="form-label">地址</view>
					<view class="flex items-center form-label2" @click="showWallet = true">
						<view class="iconfont icon-a-sorting2"></view>
						<view style="margin-left: 10rpx;"><!-- 选择钱包 -->{{ t('withdraw.choice') }}</view>
					</view>
				</view>
				<view class="amount-input">
					<input class="amount-input_input" style="font-size: 26rpx;" type="text" inputmode="text"
						cursor-spacing="20" v-model="recipient" :placeholder="$t('withdraw.placeholder')">
				</view>
			</view>

			<view style="margin-top: 45rpx;">
				<view class="form-label">数量</view>
				<view class="amount-input">
					<input class="amount-input_input" type="digit" inputmode="decimal" cursor-spacing="50"
						v-model="amount" @input="replaceInput" :placeholder="placeholder">

					<view class="amount-input_max"
						@click="amount = tools.floorAmount(balance, 2)">MAX</view>
				</view>
			</view>

			<view style="padding: 0 61rpx">
				<view class="flex justify-between" style="margin-top: 42rpx;">
					<view class="info-left1">可提现余额：</view>
					<view class="info-right1">{{ tools.floorAmount(balance, 4) }}
						{{ tokenSelected.symbol }}</view>
				</view>
				<view class="flex justify-between" style="margin-top: 50rpx;">
					<view class="info-left2">手续费</view>
					<view class="info-right2">{{fee}} {{ tokenSelected.symbol }}</view>
				</view>
				<view class="flex justify-between" style="margin-top: 40rpx;">
					<view class="info-left2">实际到账</view>
					<view class="info-right2">{{volume}} {{ tokenSelected.symbol }}</view>
				</view>
				<view class="info" style="margin-top: 90rpx;">
					1、单笔最低金额为{{tokenSelected.min_withdraw}} {{ tokenSelected.symbol }}
				</view>
				<view class="info" style="margin-top: 20rpx;">
					2、请务必确认手机安全及浏览器安全，防止信息被篡改或泄露。
				</view>
			</view>

			<view>
				<button type="button" class="n-btn" :class="{'disabled': !isCanSubmit || disabled}"
					:disabled="!isCanSubmit || disabled" style="margin-top: 114rpx;" @click="confirm">提币</button>
			</view>
		</view>
		<com-wallet-manager v-model:show="showWallet" :chains="[chainSelected.id]"></com-wallet-manager>
		<com-wallet-helper ref="ethers" :chain="chainSelected"></com-wallet-helper>
		<com-verify-password v-model:show="showPassword" @success="success"></com-verify-password>
	</view>
</template>

<script setup lang="ts">
	import {
		computed,
		nextTick,
		ref,
		watchEffect
	} from "vue";
	import tools from "@/utils/tools";
	import project from "@/utils/project";
	import { useI18n } from "vue-i18n";
	import { useBalanceStore } from "@/stores/modules/userBalance";
	import { tokens } from '@/data/tokens.js'
	import { onShow } from '@dcloudio/uni-app'
	import { getWithdrawTokens } from '@/config/api.js'
	import { useWalletStore } from "@/stores/modules/wallet";
	import chainList from '@/data/chainData';

	const ethers = ref(null);
	// const props = defineProps(["show"])
	const { t } = useI18n();
	// const emit = defineEmits(['update:show']);
	const userBalance = useBalanceStore()
	const balance = ref<any>(0);
	const walletStore = useWalletStore()
	const showPassword = ref(false)

	const placeholder = computed(() => {
		return t('withdraw.min') + tokenSelected.value.min_withdraw;
	})
	const disabled = ref(false);
	const recipient = ref<string>(walletStore.wallet.address);
	const amount = ref<string>('');
	
	//服务器 返回
	let tokenList = ref([]);

	const showTokenSelect = ref(false)
	const tokenSelected = ref(tokens[1]);
	
	const showChainSelect = ref(false)
	const chainSelected = ref(chainList.find(x => x.id == walletStore.chain.id));
	const showWallet = ref(false);

	//从服务器获取提币代币列表，和默认选择项
	(async () => {
		tokenList.value = await getWithdrawTokens()
	})()

	watchEffect(() => {
		let token = tokenList.value.find(x=>x.chain_id == chainSelected.value.id && x.symbol == 'USDT')
		if (token) {
			tokenSelected.value.id = token.id
			tokenSelected.value.fee = token.fee
		}
		
		if (tokenSelected.value.symbol == 'USDT') {
			balance.value = userBalance.usdtBalance()
		} else {
			balance.value = userBalance.tokenBalance();
		}
	})

	const fee = computed(() => {
		if (!amount.value) {
			return 0;
		}
		return parseFloat(amount.value) * (tokenSelected.value.fee / 100)
	})

	const volume = computed(() => {
		if (!amount.value) {
			return 0;
		}
		return parseFloat(amount.value) - parseFloat(amount.value) * (tokenSelected.value.fee / 100);
	})

	const replaceInput = async (event) => {
		await nextTick()
		amount.value = event.detail.value.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/, '$1')
	}

	const isCanSubmit = computed(() => {
		return recipient.value && amount.value && parseFloat(amount.value) < parseFloat(balance.value);
	})

	const confirm = async () => {
		if (chainSelected.value.id == 1) {
			tools.toastError('NRT网络暂未开放')
			return false;
		}
		
		if (!recipient.value) {
			tools.toastError(t('withdraw.placeholder'))
			return false;
		}
		const isAddress = await ethers.value.isAddress(recipient.value)
		if (!isAddress) {
			tools.toastError('地址不合法')
			return false;
		}

		if (!amount.value) {
			tools.toastError(t('form.noInput'))
			return false;
		}

		if (parseFloat(amount.value) > parseFloat(balance.value)) {
			tools.toastError(t('form.noBalance'));
			return false;
		}
		if (parseFloat(amount.value) < tokenSelected.value.min_withdraw) {
			tools.toastError(t('withdraw.minWithdraw') + tokenSelected.value.min_withdraw);
			return false;
		}	
		
		showPassword.value = true;
	}
	
	//提币确认
	const success = () => {
		console.log('withdraw confirmed')
		disabled.value = true;
		tools.clickedTimeOut(disabled);
		
		uni.$u.http.post('/withdraw', {
			_to: recipient.value,
			amount: amount.value,
			chain_id: chainSelected.value.id,
			token_id: tokenSelected.value.id,
		}).then(res => {
			tools.toastSuccess(t('withdraw.success'))
			project.getUser()
			// close()
			// uni.navigateBack();
			uni.navigateTo({
				url: '/pages/profile/bill'
			})
		})
	}

	// const close = () => {
	// 	emit('update:show', !props.show);
	// }

	watchEffect(() => {
		recipient.value = walletStore.wallet.address
	})

	const getWallet = async () => {
		recipient.value = walletStore.wallet.address
	}
	onShow(() => {
		getWallet()
	})
</script>

<style lang="scss" scoped>
	page {
		background: #F8F8F8;
	}

	.content {
		padding: 46rpx 28rpx;

		.input-symbol-select {
			background: #fff;
			padding: 36rpx 32rpx 34rpx 35rpx;

			&_border {
				border-bottom: 2rpx solid #EEEEEE;
			}
		}

		.input-symbol {
			background: #fff;
			padding: 36rpx 32rpx 34rpx 35rpx;
			border-radius: 8rpx;
			border: 2rpx solid #EEEEEE;

			&_name {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 32rpx;
				color: #000000;
			}

			&_img {}

			&_symbol {
				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 30rpx;
				color: #010101;

				margin-left: 20rpx;
			}

			&_down {
				color: #848498;
				margin-left: 42rpx;
			}
		}

		.amount-input {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 694rpx;
			height: 100rpx;


			background: #FFFFFF;
			border-radius: 8rpx;
			border: 2rpx solid #EEEEEE;

			&_input {
				padding-left: 32rpx;

				flex: 1;

				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 32rpx;
				color: #000000;
			}

			&_max {
				margin-right: 32rpx;

				width: 90rpx;
				height: 50rpx;
				background: #7F17FE;
				border-radius: 8rpx;

				display: flex;
				justify-content: center;
				align-items: center;

				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 28rpx;
				color: #FFFFFF;
			}

			&_max:active {
				background: #EEEEEE;
			}
		}

		.amount-input:focus-within {
			border: 2rpx solid #7F17FE;
		}

		.form-label {
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 30rpx;
			color: #212226;

			margin-bottom: 20rpx;
		}

		.form-label2 {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 24rpx;
			color: #7F17FE;

			margin-bottom: 20rpx;
		}


		.info-left1 {
			font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 23rpx;
			color: #212226;
		}

		.info-left2 {
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 28rpx;
			color: #000000;
			opacity: 0.4;
		}

		.info-right1 {
			font-family: Gilroy-Bold;
			font-weight: bold;
			font-size: 26rpx;
			color: #212226;
		}

		.info-right2 {
			font-family: Gilroy-Bold;
			font-weight: bold;
			font-size: 28rpx;
			color: #212226;
		}

		.info {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 28rpx;
			color: #000000;
			opacity: 0.6;
		}

	}
</style>