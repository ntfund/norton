<template>
	<view>
		<com-nav-bar title="定期申购" :right="tools.hideAccount(userStore.user.account, 2, 4)" leftWidth="220rpx" rightWidth="220rpx" ></com-nav-bar>
		<view class="group_4 flex flex flex-col">
			<view class="section_2 flex flex-row items-center justify-between">
				<view class="flex items-center">
					<image class="icon_2" referrerpolicy="no-referrer"
						src="@/static/images/financial/arraw-right@2x.png" mode="aspectFit" />
					<image class="label_1" referrerpolicy="no-referrer" src="@/static/img/usdt.png" mode="aspectFit" />
					<span class="text_2">USDT</span>
				</view>
				<view class="text-group_1 flex flex-col justify-between">
					<span class="text_3"><!-- 0.38% -->{{ tools.floorAmount(data.rate * 365) }}</span>
					<span class="text_4">预计年利率</span>
				</view>
			</view>
			<view class="section_3 flex flex-row justify-between">
				<view class="text_5">申购数量</view>
				<view class="balance flex" v-if="data.payType == 1">
					<span class="balance_name">钱包余额</span>
					<view class="balance_value flex">:&nbsp;
						<com-balance :address="walletStore.wallet.address"
							:chain="walletStore.chain" :token="selectedToken.address"
							v-model:balance="walletStore.wallet.usdt"></com-balance>
						<!-- <view style="color: #7F17FE;" @click="showWallet = true">请切换至BNB钱包</view> -->
					</view>
				</view>
				<view class="balance flex" v-else>
					<span class="balance_name">可用余额</span>
					<span class="balance_value flex">:&nbsp;{{balanceStore.usdt}}</span>
				</view>
			</view>
			<view class="input_1">
				<input type="digit" v-model="data.buyAmount" step="0.01" class="text-wrapper_2"
					:class="{'font-medium' : data.buyAmount > 0}" autofocus @input="amountInput" :auto-blur="true"
					:placeholder="t('deposit.min')+data.min" cursor-spacing="50" />
				<view class="text_10">USDT</view>
			</view>
			<view class="section_4 flex flex-row" v-if="data.payType == 1">
				<image class="icon_3" referrerpolicy="no-referrer" src="/static/images/financial/wallet@2x.png"
					mode="aspectFit" />
				<view class="text-wrapper_3 flex flex-col justify-between">
					<span class="text_11" @click="changePaytype(2)">钱包支付</span>
					<span class="text_12">{{tools.hideAccount(walletStore.wallet.address, 12, 10)}}</span>
					<!-- <span class="text_12 text-red" v-else>无BNB钱包</span> -->
				</view>
				<span class="text_13" @click="showWallet = true">选择钱包&gt;</span>
				<view class="group_5 group_5_m flex flex-col"></view>
				<span class="text_14 text_14_m" @click="changePaytype(2)">余额支付</span>
			</view>
			<view class="section_4 flex flex-row items-center justify-between" v-else>
				<view class="flex items-center">
					<image class="ml-[29rpx]" referrerpolicy="no-referrer" src="/static/images/financial/yue@2x.png"
						mode="aspectFit" style="width: 38rpx; height: 38rpx;" />
					<view class="ml-[22rpx] flex flex-col justify-center">
						<span class="text_111" @click="changePaytype(1)">余额支付</span>
					</view>
				</view>
				<view class="flex items-center">
					<view class="group_5 flex flex-col"></view>
					<span class="text_144 ml-[35rpx] mr-[32rpx]" @click="changePaytype(1)">切换至钱包支付</span>
				</view>
			</view>
			<span class="text_15">概述</span>
			<view class="section_5 flex flex-col justify-start">
				<view class="info-item flex flex-row items-center justify-between">
					<span class="text_16"><!--申购时间-->{{t('deposit.fixed.p5')}}</span>
					<span class="text_17">{{ tools.getNowTime("YYYY/mm/dd HH:MM") }}</span>
				</view>
				<view class="info-item flex flex-row items-center justify-between">
					<span class="text_16"><!-- 期限 -->{{t('deposit.p4')}}</span>
					<view class="text_17">
						<span class="font-[Gilroy-Regular]">{{ data.cycle }}</span>
						<span class="font-[SourceHanSansCN-Regular]">天</span>
					</view>
				</view>
				<view class="info-item flex flex-row items-center justify-between">
					<span class="text_16"><!-- 计息周期 -->{{t('deposit.fixed.p6')}}</span>
					<view class="text_17">
						<span class="font-[SourceHanSansCN-Regular]"><!-- 每天 -->{{t('deposit.fixed.p7')}}</span>
					</view>
				</view>
				<view class="info-item flex flex-row items-center justify-between">
					<span class="text_16"><!-- 收益发放 -->{{t('deposit.fixed.p8')}}</span>
					<view class="text_17 fle items-center justify-end">
						<span class="font-[Gilroy-Regular]"><!-- 次日 -->{{t('deposit.fixed.p91')}}</span>
						<span class="font-[SourceHanSansCN-Regular]"><!-- 8:00 -->{{t('deposit.fixed.p92')}}</span>
					</view>
				</view>
				<view class="info-item flex flex-row items-center justify-between">
					<span class="text_16"><!-- 结束时间 -->{{t('deposit.fixed.p10')}}</span>
					<span class="text_17">{{ tools.getNowTimeDelta(data.cycle * 86400, "YYYY-mm-dd HH:MM") }}</span>
				</view>
				<view class="info-item flex flex-row items-center justify-between">
					<span class="text_16"><!-- 参考月化 -->{{t('deposit.fixed.p11')}}</span>
					<span class="text_17">{{ tools.floorAmount(data.rate * 30) }}%</span>
				</view>
				<view class="info-item flex flex-row items-center justify-between">
					<span class="text_16"><!-- 到期收益 -->{{t('deposit.fixed.p13')}}</span>
					<span class="text_17">{{profit}}</span>
				</view>

			</view>
			<view class="mt-[131rpx] m-button">
				<view class="text-center text-[24rpx] text-gray-500 tip" v-if="tip">{{tip}}</view>
				<button type="button" class="n-btn" :class="{'disabled': loading || disabled}"
					:disabled="loading || disabled" @click="submit">
					确认并申购
				</button>
			</view>
		</view>
		<com-wallet-manager v-model:show="showWallet"></com-wallet-manager>
		<com-bind-yqm></com-bind-yqm>
		<!-- 订单确认 -->
		<com-order-confirm v-if="showConfirm" v-model:show="showConfirm" v-model:data="data"></com-order-confirm>
	</view>
</template>

<script setup>
	import {
		computed,
		nextTick,
		reactive,
		ref,
		watchEffect
	} from 'vue';
	import tools from '@/utils/tools';
	import i18n from '@/lang/'
	import {
		addOrder
	} from "@/config/api";
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
	import {
		useBalanceStore
	} from "@/stores/modules/userBalance";
	import {
		useUserStore
	} from "@/stores/modules/user";
	import TokenList from '@/data/tokenList.js'
	import project from '@/utils/project';
	import secret from '@/utils/secret';
	import tokenData from '@/data/tokenData';

	const {
		locale,
		t
	} = i18n.global
	const props = defineProps(['params'])
	const data = reactive(JSON.parse(decodeURIComponent(props.params)))

	const showWallet = ref(false)
	const walletStore = useWalletStore();
	const selectedToken = ref(TokenList.find(x => x.symbol == 'USDT' && x.chain_id == walletStore.chain.id))
	const balanceStore = useBalanceStore()
	const userStore = useUserStore()
	const helper = ref(null);
	const tip = ref('')
	const showConfirm = ref(false)

	watchEffect(() => {
		selectedToken.value = TokenList.find(x => x.symbol == 'USDT' && x.chain_id == walletStore.chain.id)
	})
	
	const profit = computed(() => {
		if (!data.buyAmount) return '0.0000';
		return tools.floorAmount(data.buyAmount * data.cycle * data.rate / 100, 4)
	})

	const amountInput = async e => {
		// console.log(e, data.buyAmount)
		await nextTick()
		data.buyAmount = data.buyAmount.toString().replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/, '$1')
		await nextTick()
	}

	const loading = ref(false)
	const disabled = computed(() => {
		let b1 = true;
		if (data.payType == 1) {
			b1 = parseFloat(walletStore.wallet.usdt) > parseFloat(data.buyAmount)
		} else
		if (data.payType == 2) {
			b1 = balanceStore.usdtBalance() > parseFloat(data.buyAmount)
		}
		return !!(data.total - data.number <= 0 || !data.buyAmount || parseFloat(data.buyAmount) < parseFloat(data
			.min) || !b1);
	})

	const changePaytype = (payType) => {
		data.payType = payType;

		console.log(data.payType)

		// tools.toastSuccess(t('message.exchangeSuccess'))
	}


	const submit = async () => {

		loading.value = true;
		setTimeout(() => {
			loading.value = false;
		}, 500)

		let userStore = useUserStore()

		if (userStore.user.vip < data.min_buy_level && userStore.user.svip < data.min_buy_level) {
			tools.toastError(t('message.noLevel'));
			return false;
		}

		const isOpenReslt = await uni.$u.http.get('/setting/getIsOpenTime');
		if (!isOpenReslt || !isOpenReslt.is_open) {
			tools.toastError(t('buy.noOpen'));
			return false;
		}

		if (!data.buyAmount || parseFloat(data.buyAmount) < parseFloat(data.min)) {
			tools.toastError(t('buy.min') + data.min)
			return false;
		}

		//验证剩余申购额度
		if (data.buyAmount > data.total - data.number) {
			tools.toastError(t('buy.noAmount'))
			return false;
		}

		if (data.payType === 2) {

			if (parseFloat(data.buyAmount) > balanceStore.usdt) {
				tools.toastError(t('message.noBalance') + data.min)
				return false;
			}
			
		} else {
			//钱包支付
			if (parseFloat(data.buyAmount) > parseFloat(walletStore.wallet.usdt)) {
				tools.toastError(t('message.noBalance') + data.buyAmount)
				return false;
			}			
		}
		
		showConfirm.value = true;		
		return;
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F8F8F8;
	}

	.n-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto 60rpx;
		height: 100rpx;
		background: #7F17FE;

		font-family: SourceHanSansCN-Medium;
		font-weight: 500;
		font-size: 34rpx;
		color: #FFFFFF;

	}

	.n-btn:active {
		background: #CDCDCD;
	}

	.section_2 {
		width: 660rpx;
		height: 62rpx;
		margin: 58rpx 0 0 30rpx;
	}

	.icon_2 {
		width: 12rpx;
		height: 20rpx;
	}

	.label_1 {
		width: 40rpx;
		height: 40rpx;
		margin-left: 18rpx;
	}

	.text_2 {
		overflow-wrap: break-word;
		color: rgba(1, 1, 1, 1);
		font-size: 30rpx;
		font-family: Gilroy-Medium;
		font-weight: 500;
		text-align: left;
		white-space: nowrap;
		margin-left: 20rpx;
	}

	.text-group_1 {
		width: 102rpx;
		height: 62rpx;
		// margin-right: 60rpx;
		align-items: end;
	}

	.text_3 {
		width: 98rpx;
		height: 28rpx;
		overflow-wrap: break-word;
		color: rgba(127, 23, 254, 1);
		font-size: 36rpx;
		font-family: Gilroy-Medium;
		font-weight: 500;
		text-align: right;
		white-space: nowrap;
		margin-left: 2rpx;
	}

	.text_4 {
		height: 20rpx;
		overflow-wrap: break-word;
		color: rgba(0, 0, 0, 1);
		font-size: 20rpx;
		font-family: SourceHanSansCN-Regular;
		font-weight: normal;
		text-align: right;
		white-space: nowrap;
		margin-top: 14rpx;
	}

	.section_3 {
		// width: 658rpx;
		height: 24rpx;
		margin: 62rpx 0 0 31rpx;
	}

	.text_5 {
		width: 101rpx;
		height: 24rpx;
		overflow-wrap: break-word;
		color: rgba(0, 0, 0, 1);
		font-size: 26rpx;
		font-family: SourceHanSansCN-Regular;
		font-weight: normal;
		text-align: left;
		white-space: nowrap;
	}

	.text-wrapper_1 {
		width: 229rpx;
		height: 24rpx;
		overflow-wrap: break-word;
		// font-size: 0;
		font-family: SourceHanSansCN-Regular;
		font-weight: normal;
		text-align: right;
		white-space: nowrap;
	}

	.text_6 {
		width: 229rpx;
		height: 24rpx;
		overflow-wrap: break-word;
		color: rgba(0, 0, 0, 1);
		font-size: 24rpx;
		font-family: SourceHanSansCN-Regular;
		font-weight: normal;
		text-align: left;
		white-space: nowrap;
	}

	.text_7 {
		width: 229rpx;
		height: 24rpx;
		overflow-wrap: break-word;
		color: rgba(0, 0, 0, 1);
		font-size: 24rpx;
		font-family: Gilroy-Regular;
		font-weight: normal;
		text-align: left;
		white-space: nowrap;
	}

	.balance {
		margin-right: 60rpx;
		display: flex;
		align-items: center;

		color: rgba(0, 0, 0, 1);
		font-size: 24rpx;
		font-weight: normal;

		&_name {
			font-family: SourceHanSansCN-Regular;
		}

		&_value {
			font-family: Gilroy-Regular;
		}
	}

	.input_1 {
		box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(202, 202, 202, 0.3);
		background-color: rgba(255, 255, 255, 1);
		border-radius: 8rpx;
		width: 694rpx;
		height: 100rpx;
		border: 2rpx solid rgba(238, 238, 238, 1);
		margin: 30rpx 0 0 28rpx;

		display: flex;
		justify-content: space-between;
		align-items: center;


		.text-wrapper_2 {
			// width: 384rpx;
			// height: 30rpx;

			// overflow-wrap: break-word;
			font-size: 32rpx;
			font-family: SourceHanSansCN-Regular;
			// font-weight: normal;
			// text-align: left;
			// white-space: nowrap;
			// padding: 36rpx 0 0 36rpx;
			// padding-left: 36rpx;
			// padding: 34rpx 36rpx;
			padding-left: 36rpx;
			// height: 100%;

			flex: 1;
			flex-grow: 1;
			flex-shrink: 1;


			// background: green;
		}


		.text_10 {
			width: 76rpx;
			// height: 24rpx;
			overflow-wrap: break-word;
			color: rgba(0, 0, 0, 1);
			font-size: 32rpx;
			font-family: Gilroy-Regular;
			// font-weight: normal;
			text-align: right;
			white-space: nowrap;
			margin-right: 31rpx;
		}

	}

	.input_1:focus-within {
		border: #7F17FE 1px solid;
	}



	.text_8 {
		width: 284rpx;
		height: 30rpx;
		overflow-wrap: break-word;
		color: rgba(0, 0, 0, 1);
		font-size: 32rpx;
		font-family: SourceHanSansCN-Regular;
		font-weight: normal;
		text-align: left;
		white-space: nowrap;
	}

	.text_9 {
		width: 284rpx;
		height: 30rpx;
		overflow-wrap: break-word;
		color: rgba(0, 0, 0, 1);
		font-size: 32rpx;
		font-family: Gilroy-Regular;
		font-weight: normal;
		text-align: left;
		white-space: nowrap;
	}


	.section_4 {
		background-color: rgba(127, 23, 254, 0.1);
		border-radius: 8rpx;
		width: 694rpx;
		height: 90rpx;
		margin: 15rpx 0 0 28rpx;
	}

	.icon_3 {
		width: 36rpx;
		height: 32rpx;
		margin: 29rpx 0 0 23rpx;
	}

	.text-wrapper_3 {
		width: 291rpx;
		height: 59rpx;
		margin: 17rpx 0 0 22rpx;
	}

	.text_11 {
		width: 96rpx;
		height: 23rpx;
		overflow-wrap: break-word;
		color: rgba(127, 23, 254, 1);
		font-size: 24rpx;
		font-family: SourceHanSansCN-Regular;
		font-weight: normal;
		text-align: right;
		white-space: nowrap;
	}

	.text_111 {
		overflow-wrap: break-word;
		color: rgba(127, 23, 254, 1);
		font-size: 24rpx;
		font-family: SourceHanSansCN-Regular;
		font-weight: normal;
		text-align: right;
		white-space: nowrap;
	}

	.text_12 {
		height: 20rpx;
		overflow-wrap: break-word;
		color: rgba(1, 1, 1, 1);
		font-size: 20rpx;
		font-family: Gilroy-Regular;
		font-weight: normal;
		text-align: left;
		white-space: nowrap;
		margin: 16rpx 0 0 2rpx;
	}

	.text_13 {
		width: 111rpx;
		height: 23rpx;
		overflow-wrap: break-word;
		color: rgba(127, 23, 254, 1);
		font-size: 24rpx;
		font-family: SourceHanSansCN-Regular;
		font-weight: normal;
		text-align: left;
		white-space: nowrap;

		margin: 50rpx 0 0 39rpx;
	}

	.group_5_m {
		margin: 58rpx 0 0 20rpx;
	}

	.group_5 {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 1rpx;
		width: 2rpx;
		height: 20rpx;
	}

	.text_14_m {
		margin: 50rpx 32rpx 0 21rpx;
	}

	.text_14 {
		// width: 97rpx;
		height: 24rpx;
		overflow-wrap: break-word;
		color: rgba(127, 23, 254, 1);
		font-size: 24rpx;
		font-family: SourceHanSansCN-Regular;
		font-weight: normal;
		text-align: left;
		white-space: nowrap;
	}

	.text_144 {
		// width: 97rpx;
		// height: 24rpx;
		overflow-wrap: break-word;
		color: rgba(127, 23, 254, 1);
		font-size: 24rpx;
		font-family: SourceHanSansCN-Regular;
		font-weight: normal;
		text-align: left;
		white-space: nowrap;
	}



	.text_15 {
		width: 51rpx;
		height: 25rpx;
		overflow-wrap: break-word;
		color: rgba(0, 0, 0, 1);
		font-size: 26rpx;
		font-family: SourceHanSansCN-Regular;
		font-weight: normal;
		text-align: left;
		white-space: nowrap;

		margin: 61rpx 0 0 29rpx;
	}

	.section_5 {
		width: 750rpx;
		margin-top: 30rpx;
	}



	.info-item {
		height: 80rpx;
		border-bottom: 2rpx solid #EEEEEE;
		background: #ffffff;

		padding: 0 28rpx 0 29rpx;
		align-items: center;

		.text_16 {
			overflow-wrap: break-word;
			color: rgba(0, 0, 0, 1);
			font-size: 22rpx;
			font-family: SourceHanSansCN-Regular;
			font-weight: normal;
			text-align: left;
			white-space: nowrap;

		}

		.text_17 {
			overflow-wrap: break-word;
			color: rgba(0, 0, 0, 1);
			font-size: 30rpx;
			font-family: Gilroy-Regular;
			font-weight: normal;
			text-align: right;
			white-space: nowrap;
		}
	}

	.m-button {
		position: relative;
		z-index: 2;

		.tip {
			position: absolute;
			top: -50rpx;
			left: 0;
			right: 0;
		}
	}
</style>