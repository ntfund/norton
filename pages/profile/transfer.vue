<template>
	<view>
		<com-nav-bar title="内部转账" backgroundColor="#fff" :border="true" leftWidth="240rpx" rightWidth="240rpx" @clickRight="showWallet = true">
			<template #right>
				<view class="flex justify-end pr-1">
					<view class="nav-account">
						{{tools.hideAccount(walletStore.wallet.address, 4, 4)}}
					</view>
				</view>
			</template>
		</com-nav-bar>
		<view class="content">
			<view class="relative">
				<view class="flex flex-row justify-between items-center input-symbol"
					@click="showSelect = !showSelect">
					<view class="input-symbol_name">
						币种
					</view>
					<view class="flex items-center">
						<image :src="selected.icon" mode="aspectFit" class="input-symbol_img" style="width: 40rpx; height: 40rpx;">
						</image>
						<text class="font-bold input-symbol_symbol">{{selected.name}}</text>
						<view class="iconfont icon-arrow-down-filling input-symbol_down"></view>
					</view>
					
				</view>
				<view class="absolute w-[100%] bg-white z-10 shadow-md" v-if="showSelect">
					<view class="flex flex-row justify-between input-symbol-select input-symbol-select_border items-center"
						:class="{'bg-cyan-50' : selected.id == item.id}" v-for="(item, index) in options" :key="index"
						@click="selected = item; showSelect = false;">
						<view class="flex items-center">
							<image :src="item.icon" mode="aspectFit" style="width: 40rpx; height: 40rpx;">
							</image>
							<text class="font-bold ml-[20rpx]">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<view style="margin-top: 90rpx;">
				<view class="flex justify-between items-center">
					<view class="form-label"><!--收款账户-->{{ $t('transfer.account') }}</view>
				</view>
				<view class="amount-input">
					<input class="amount-input_input" type="text" inputmode="text" cursor-spacing="20" v-model="recipient" :placeholder="$t('transfer.uid')">
				</view>
			</view>
			
			<view style="margin-top: 71rpx;">
				<view class="flex justify-between items-center">
					<view class="form-label">数量</view>
					<view class="flex form-label-info">
						<view>{{ $t('transfer.balance') }}：</view>
						<view class="amount">{{ tools.floorAmountMinDigits(balance, 2) }} {{ selected.name }}</view>
					</view>
				</view>
				<view class="amount-input">
					<input class="amount-input_input" type="digit" inputmode="decimal" cursor-spacing="50" v-model="amount" @input="replaceInput" :placeholder="placeholder">
					
					<view class="amount-input_max" @click="amount = tools.floorAmount(balance, 2)">MAX</view>
				</view>
			</view>
								
			<view class="btn-bottom">
				<button type="button" class="n-btn" :class="{'disabled': !isCanSubmit || disabled}" :disabled="!isCanSubmit || disabled" @click="confirm">转账</button>
			</view>
		</view>
		<com-wallet-manager v-model:show="showWallet" :chains="[3]"></com-wallet-manager>
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
	import { useUserStore } from "@/stores/modules/user";
	import { useBalanceStore } from "@/stores/modules/userBalance";
	import { tokens } from '@/data/tokens.js'
	import { getWithdrawTokens } from '@/config/api.js'
	import { useWalletStore } from "@/stores/modules/wallet";

	const props = defineProps(["show"])
	const { t } = useI18n();
	const emit = defineEmits(['update:show']);
	const userStore = useUserStore()
	const userBalance = useBalanceStore()
	const balance = ref<any>(0);
		
	const walletStore = useWalletStore()
	const showPassword = ref(false)

	const placeholder = computed(() => {
		return t('form.minMoney') + selected.value.min_transfer + selected.value.name;
	})
	const disabled = ref(false);
	const recipient = ref<string>('');
	const amount = ref<string>('');
	let options = ref(tokens);

	//服务器 返回
	let tokenList = ref([]);
	
	const showSelect = ref(false)
	let selected = ref(tokens[1]);
	const showWallet = ref(false);

	//获取提币代币列表，和默认选择项
	(async () => {
		tokenList.value = await getWithdrawTokens()
		selected.value = options.value[1];
	})()


	watchEffect(() => {
		let token = tokenList.value.find(x=>x.id == selected.value.id)
		if (token) {
			selected.value.min_transfer = token.min_transfer
		}
		
		if (selected.value.symbol == 'USDT') {
			balance.value = userBalance.usdtBalance()
		} else {
			balance.value = userBalance.tokenBalance();
		}
	})

	const replaceInput = async (event) => {
		await nextTick()
		amount.value = event.detail.value.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/, '$1')
	}

	const isCanSubmit = computed(() => {
		return recipient.value && amount.value;
	})
	
	const confirm = () => {
		if (recipient.value === userStore.user.uid) {
			tools.toastError(t('transfer.me'))
			return false;
		}
		if (!amount.value) {
			tools.toastError(t('form.noInput'))
			return false;
		}
		if (parseFloat(amount.value) > userBalance.getBalance(selected.value.id)) {
			tools.toastError(t('form.noBalance'));
			return false;
		}
		if (parseFloat(amount.value) < selected.value.min_transfer) {
			tools.toastError(t('form.minAmount') + selected.value.min_transfer);
			return false;
		}
				
		showPassword.value = true;
	}
	
	const success = () => {
		console.log('transfer confirmed')
		disabled.value = true;		
		
		uni.$u.http.post('/transfer', {
			token_id: selected.value.id,
			tid: recipient.value,
			amount: amount.value
		}).then(res => {			
			project.getUser()
			close()
			tools.toastSuccess(t('form.success'))
		})
		
		tools.clickedTimeOut(disabled);
	}

	const close = () => {
		emit('update:show', !props.show);
	}

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
			
			&_img {
				
			}
			
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
				
			margin-top: 20rpx;
			
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
		}
		
		.amount-input:focus-within {
			border: 2rpx solid #7F17FE;
		}
		
		.form-label {
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 30rpx;
			color: #212226;
			
			
		}
		
		.form-label-info {
			font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 23rpx;
			color: #212226;
			
			display: flex;
			flex-direction: row;
			align-items: center;
			
			.amount {
				font-family: Gilroy;
				font-weight: Gilroy-Bold;
				font-size: 26rpx;
				color: #212226;
				
				position: relative;
				top: -3rpx;
			}
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
	
	.nav-account {
		border: 2rpx solid #7F17FE;
		padding: 5rpx 10rpx;
		border-radius: 20rpx;
		
		font-family: Gilroy-Bold;
		font-weight: bold;
		font-size: 26rpx;
	}
</style>