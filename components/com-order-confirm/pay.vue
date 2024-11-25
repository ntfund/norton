<template>
	<view>
		<u-popup :show="show" @open="open" @close="close" mode="bottom" :round="20">
			<view class="content">
				<view class="title">
					<view class="left">详情</view>
					<view class="right" @click="close()">
						<image src="@/static/images/wallet/close@2x.png" mode="aspectFill"
							style="width: 28rpx; height: 28rpx;"></image>
					</view>
				</view>
				<view class="amount">
					-{{data.buyAmount}} USDT
				</view>
				<view class="item-row">
					<view class="left">付款地址</view>
					<view class="right">{{userStore.user.account}}</view>
				</view>
				<view class="item-row">
					<view class="left">收款地址</view>
					<view class="right">{{walletStore.chain.token}}</view>
				</view>
				<view class="item-row">
					<view class="left">网络费</view>
					<view class="right">
						<view class="right-title">{{feeText}} {{walletStore.chain.symbol}}</view>
						<!-- <view class="sub-title">预估 $ 0.108</view> -->
						<span class="text-red" v-if="!isLoading && !isOk">网络费不足！</span>
					</view>
				</view>
				<view class="text-center mt-4 text-[24rpx] text-gray-500 tip" v-if="tip">{{tip}}</view>
				<view class="n-btn-full mt-4" :class="{'disabled': !isOk || disabled}" :disabled="!isOk || disabled"
					@click="showPassword = true">
					{{btnText}}
				</view>
			</view>
		</u-popup>
		<com-verify-password v-if="showPassword" v-model:show="showPassword" @success="successVerify"></com-verify-password>
		<com-ethers ref="ethers" :rpc="walletStore.chain.rpc" v-if="walletStore.chain.type == 'eth'"></com-ethers>
		<com-tronweb ref="tronWeb" :rpc="walletStore.chain.rpc" v-if="walletStore.chain.type == 'tron'"></com-tronweb>
	</view>
</template>

<script setup>
	import {
		ref,
		watchEffect
	} from 'vue';
	import {
		useUserStore
	} from '@/stores/modules/user';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
	import secret from '@/utils/secret';
	import dbWallet from '../../utils/dbWallet';
	import dbToken from '../../utils/dbToken';
	// import tokenData from '@/data/tokenData';
	const props = defineProps(["data", "show"])
	const emit = defineEmits("update:show", "success")
	//项目合约
	const userStore = useUserStore()
	const walletStore = useWalletStore()
	const fee = ref('~')
	const feeText = ref('~')
	const ethers = ref(null)
	const tronWeb = ref(null)
	const balance = ref(0)
	const showPassword = ref(false);
	const disabled = ref(false);
	const tip = ref('')
	const btnText = ref('确认')

	const isOk = ref(false)
	const isLoading = ref(false)
	watchEffect(() => {
		if (walletStore.chain.type == 'eth') {
			isOk.value = parseFloat(balance.value) >= parseFloat(fee.value)
		} else {
			isOk.value = true
		}	
		if (isLoading.value) {
			btnText.value = "网络费查询中"
		} else if (fee.value == -1) {
			btnText.value = "授权并申购"
		} else {
			btnText.value = "确认"
		}
		
		if(fee.value == '~' || fee.value == -1) {
			feeText.value = '~'
		} else {
			feeText.value = fee.value
		}
	})

	const open = async () => {
		tip.value = ''
		isLoading.value = true;
		if (walletStore.chain.type == 'eth') {
			let ethToken = await dbToken.getTokenBy({
				chain_id: walletStore.chain.id,
				address: ''
			})
			// console.log('ethToken', ethToken, walletStore.chain, walletStore.wallet)
			fee.value = await ethers.value.estimateDepositGas({
				from: walletStore.wallet.address,
				tokenAddress: walletStore.chain.token,
				private_key: secret.decrypt(walletStore.wallet.private_key),
				decimals: ethToken.decimals
			})

			balance.value = await ethers.value.balanceOf(walletStore.wallet.address)
			
			console.log('ether balance.value', balance.value)
		} else {

			balance.value = await tronWeb.value.balanceOf(walletStore.wallet.address);
			
			console.log('tron balance.value', balance.value)
		}
		
		isLoading.value = false;
	}

	const close = () => {
		emit('update:show', false)
	}

	uni.$on('approve', () => {
		tip.value = '正在进行授权操作，请稍等...'
	})
	uni.$on('approved', () => {
		tip.value = '正在进行申购...'
	})

	const successVerify = async () => {
		disabled.value = true;
		//发起支付
		let usdtToken = await dbToken.getTokenBy({
			chain_id: walletStore.chain.id,
			symbol: 'USDT'
		})
		
		let hash = '';
		if (walletStore.chain.type == 'eth') {
			let recepit = await ethers.value.deposit({
				from: walletStore.wallet.address,
				amount: props.data.buyAmount,
				private_key: secret.decrypt(walletStore.wallet.private_key),
				tokenAddress: walletStore.chain.token, //合约地址. deposit 申购
				usdtAddress: usdtToken.address, //要申购的代币合约地址
				decimals: usdtToken.decimals, //要申购的代币合约地址
				good_id: props.data.id ,//分析师ID
			})
			console.log('recepit', recepit)
			hash = recepit.hash;
		} else {
			let private_key = secret.decrypt(walletStore.wallet.private_key)
			if (private_key.startsWith("0x")) {
				private_key = private_key.substr(2)
				console.log('private_key', private_key)
			}
			const recepit = await tronWeb.value.deposit({
				from: walletStore.wallet.address,
				amount: props.data.buyAmount,
				private_key: private_key,
				tokenAddress: walletStore.chain.token, //合约地址. deposit 申购
				usdtAddress: usdtToken.address, //要申购的代币合约地址
				decimals: usdtToken.decimals, //要申购的代币合约地址
				good_id: props.data.id ,//分析师ID
			})
			console.log('recepit', recepit)
			
			hash = recepit;
		}
		
		
		close();
		emit('success', hash)
		disabled.value = false;
		tip.value = ''
	}
</script>

<style lang="scss" scoped>
	.title {
		.left {
			font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 38rpx;
			color: #0A0A0A;
			line-height: 46rpx;
		}
	}

	.content {
		padding: 33.33rpx;

		.title {
			display: flex;
			justify-content: space-between;
			font-weight: 500;
			font-size: 33.33rpx;
		}

		.amount {
			background: #f0f3f8;
			padding: 15px;
			display: flex;
			justify-content: center;
			border-radius: 10px;
			margin: 15px 0;

			font-family: Gilroy-Bold;
			font-weight: bold;
			font-size: 36rpx;
			color: #7F17FE;
		}

		.item-row {
			// margin: 15px 0;
			// display: flex;
			justify-content: space-between;
			align-items: flex-start;
			width: calc(750rpx - 66.66rpx);
			display: flex;
			font-size: 27.2rpx;

			.left {
				width: 22%;
				// background: green;
				color: #9c9c9c;
			}

			.right {
				// background: #2880fe;
				word-break: break-all;
				width: calc(750rpx - 66.66rpx - 22%);
				display: flex;
				flex-wrap: wrap;

				color: #2a2a2a;

				flex-direction: column;

				.sub-title {
					color: #b4b4b4;
				}
			}

			padding: 15px 0;
			border-bottom: 1px solid #efefef;
		}

		.btn-primary {
			background: #2880fe;
			padding: 10px;
			color: white;
			justify-content: center;
			display: flex;
			border-radius: 10px;

			margin: 30px 0 10px 0;
			font-size: 33rpx;
		}
	}
</style>