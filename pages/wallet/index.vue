<template>
	<view>
		<uni-nav-bar :fixed="true" :border="false" :statusBar="true" leftWidth="550rpx"
			@clickLeft="showWalletManager = true" @clickRight="clickRight">

			<template #left>
				<view class="p-0 m-0 nav-left-0 pl-[10px]">
					<image :src="walletStore.chain.icon" mode="aspectFit" style="width: 72rpx; height: 72rpx;">
					</image>
					<view class="ml-[20rpx] flex flex-col justify-between">
						<view class="flex items-center">
							<view class="nav-symbol">{{walletStore.chain.symbol}}（{{walletStore.chain.name}}）</view>
							<view class="flex items-center justify-center">
								<image src="@/static/images/wallet/arrow_down@2x.png" mode="aspectFit"
									style="width: 20rpx; height: 14rpx;"></image>
							</view>
						</view>
						<view class="nav-address flex items-end justify-end">
							<view>
								{{tools.hideAccount(walletStore.wallet.address, 14, 6)}}
							</view>
							<image src="@/static/images/wallet/copy-gray@2x.png" mode="aspectFit"
								style="width: 22rpx; height: 22rpx; margin-left: 15rpx;"
								@click.stop="tools.copyClick(walletStore.wallet.address)"></image>
						</view>
					</view>
				</view>
			</template>
			<!-- <template #right>
				<view class="w-[100%] flex justify-end p-0 m-0 nav-right mr-[10rpx]">
					<image src="@/static/images/wallet/scan-black@2x.png" style="width: 34rpx; height: 34rpx;"></image>
				</view>
			</template> -->
		</uni-nav-bar>

		<index-detail :balance="totalBalance" style="margin-top: 34rpx;"></index-detail>

		<view class="bg-white  w-[750rpx]  mt-[48rpx]">
			<view class="flex justify-between px-[28rpx]">
				<view class="row-title">资产</view>
				<!-- <uni-icons type="plus" size="22"></uni-icons> -->
				<view class="flex items-center">
					<view class="text-[#7F17FE] text-[24rpx] font-[SourceHanSansCN-Regular] mr-[9rpx]">添加资产</view>
					<image src="@/static/images/wallet/add-token@2x.png" mode="aspectFit"
						style="width: 22rpx; height: 22rpx;"></image>
				</view>
			</view>
		</view>
		<view class="data-list">
			<view class="data-list_item " v-for="(item, index) in tokens" :key="index" @click="toTokenDetail(item)">
				<image :src="item.icon" mode="aspectFit" style="width: 72rpx; height: 72rpx; margin: auto;"
					class="rounded-full">
				</image>
				<view class="symbol flex-1 flex flex-col justify-center  ">
					<view class="name">{{item.name}}</view>
					<view class="address" v-if="item.address">{{ tools.hideAccount(item.address, 10, 7) }}</view>
				</view>
				<view class="right flex-1 flex flex-col justify-center items-end ">
					<view class="balance">
						<com-balance v-if="walletStore.chain.id != 0 && walletStore.wallet.address" :address="walletStore.wallet.address" :token="item.address"
							:chain="walletStore.chain" v-model:balance="item.balance" :step="item.step"></com-balance>
							
						<!-- {{tools.floorAmount(item.balance, 6)}} -->
					</view>
					<view class="value">≈ {{ tools.getMoneyFmt(item.balance * item.price) }}</view>
				</view>
			</view>
		</view>
		<!-- <view v-if="binit" :wallet="wallet" :change:wallet="ethers.receiveWallet"></view> -->
		<!-- <view v-if="binit" :index="index" :change:index="ethers.receiveIndex"></view> -->

		<com-wallet-manager v-model:show="showWalletManager"></com-wallet-manager>
		<com-tab-bar></com-tab-bar>
		<com-ethers ref="ethers" :rpc="walletStore.chain.rpc" v-if="walletStore.chain.type == 'eth'"></com-ethers>
		<com-tronweb ref="tronWeb" :rpc="walletStore.chain.rpc" v-if="walletStore.chain.type == 'tron'"></com-tronweb>
	</view>
</template>

<script setup>
	import tools from '@/utils/tools'
	import project from '@/utils/project'
	import {
		onShow,
		onHide
	} from '@dcloudio/uni-app'
	import {
		computed,
		nextTick,
		onMounted,
		reactive,
		ref,
		toRaw,
		watch,
		watchEffect
	} from "vue";
	import IndexDetail from './index/index_detail.vue'
	import secret from '@/utils/secret';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
	import dbToken from '@/utils/dbToken';
	
	console.log('wallet index')

	const showWalletManager = ref(false)
	const tokens = ref([]);
	const walletStore = useWalletStore();
	const ethers = ref(null);
	const tronWeb = ref(null);
	const usdtToken = ref({
		address: '',
		name: ''
	});

	let timer = null;
	//未启用
	const getTokensBalance = async () => {
		console.log('getTokensBalance')
		for (var i = 0; i < tokens.value.length; i++) {
			tokens.value[i].balance = 0;
		}
		for (var i = 0; i < tokens.value.length; i++) {
			if (walletStore.chain.type == "eth") {
				console.log('getTokensBalance start', walletStore.wallet.address, tokens.value[i].address)
				let balance = await ethers.value.getBalanceValue(walletStore.wallet.address, tokens.value[i]
					.address);
				console.log('getTokensBalance', balance)
				tokens.value[i].balance = balance;
			}
		}
	}

	const getTokensBalance2 = async () => {
		for (var i = 0; i < tokens.value.length; i++) {
			if (typeof tokens.value[i].step == "undefined") {
				tokens.value[i].step = 0;
			}
			tokens.value[i].step++;
		}
	}

	const getTokensPrice = async () => {
		console.log('getTokensPrice')
		//获取代币单价, 相对于USDT单价
		for (var i = 0; i < tokens.value.length; i++) {
			let token = tokens.value[i];
			if (token.name == "USDT" || !walletStore.chain.router || !walletStore.chain.weth || !usdtToken.value
				.address) {
				tokens.value[i].price = 1;
				continue;
			}
			
			let price = 1;
			let data = {
				routerAddress: walletStore.chain.router,
				fromToken: token.address ? token.address : walletStore.chain.weth,
				toToken: usdtToken.value.address,
				private_key: secret.decrypt(walletStore.wallet.private_key),
				address: walletStore.wallet.address,
				decimals: usdtToken.value.decimals
			};
			if (walletStore.chain.type == "eth") {
				price = await ethers.value.getTokenPrice(data)
			} else if (walletStore.chain.type == "tron") {
				price = await tronWeb.value.getTokenPrice(data)
			}

			console.log('getTokens price', price)
			tokens.value[i].price = price;
		}

	}
	//获取当前链的代币列表，ETH、USDT、....
	const getTokens = async () => {
		console.log('getTokens')
		tokens.value = []; //不加这句废话的话，com-balance组件在销毁的时候，会触发余额查询。
		tokens.value = await dbToken.getTokens(walletStore.chain.id)
		console.log('tokens.value', tokens.value)
		usdtToken.value = tokens.value.find(x => x.name == "USDT")

		getTokensPrice();

		clearInterval(timer)
		timer = setInterval(() => {
			getTokensBalance2(); //3秒后， 第一次不执行
		}, 3000)
	}

	watch(() => walletStore.chain.id, (newValue, oldValue) => {
		if (newValue != 0) {
			getTokens();
		}
	}, {
		immediate: true
	})

	watchEffect(() => {
		// getTokensBalance()


	})

	const totalBalance = computed(() => {
		let tempValue = 0;
		for (var i = 0; i < tokens.value.length; i++) {
			if (!tokens.value[i].price) {
				break;
			}
			tempValue += tokens.value[i].balance * tokens.value[i].price;
		}

		return tempValue;
	})


	// watch(() => walletStore.wallet.address, (newVal, oldVal) => {
	// 	getTokensBalance()
	// }, {immediate: true})

	const toTokenDetail = (token) => {
		console.log(token)
		// tools.navigateTo('/pages/wallet/tokenDetail?token=' + encodeURIComponent(JSON.stringify(token)) +
		// 	'&wallet=' + encodeURIComponent(JSON.stringify(walletStore.wallet)))
		tools.navigateToWithEncodeMultiply('/pages/wallet/tokenDetail', {
			token,
			wallet: walletStore.wallet
		})
	}

	// const clickLeft = () => {
	// 	tools.navigateToWithEncode('/pages/wallet/walletManager', {
	// 		type: 1,
	// 		chain_id: walletStore.chain.id,
	// 		account: walletStore.wallet.address,
	// 		// ids: [3, 4, 5]
	// 	})
	// }

	const clickRight = () => {
		uni.scanCode({
			success: function(res) {
				console.log('条码类型：' + res.scanType);
				console.log('条码内容：' + res.result);
				if (res.scanType == "QR_CODE" && res.result.startsWith("ethereum:0x")) {
					uni.$emit('scan', res.result)
				}
			}
		});
	}

	onShow(() => {
		clearInterval(timer)
		timer = setInterval(() => {
			getTokensBalance2(); //3秒后， 第一次不执行
		}, 3000)
	})

	onHide(() => {
		clearInterval(timer);
	})
</script>


<style lang="less" scoped>
	page {
		padding-bottom: 112rpx;
	}

	.bbottom {
		border-bottom: 1px solid #eefefe;
	}

	.uni-navbar .uni-icons {
		font-size: 22px !important;
	}

	.nav-left-0 {
		display: flex;
		align-items: center;
		width: 500rpx !important;

		margin-left: 10rpx;


		.nav-symbol {
			font-family: Gilroy-Medium;
			font-weight: 500;
			font-size: 30rpx;
		}

		.nav-address {
			font-family: Gilroy-Medium;
			font-weight: 500;
			font-size: 24rpx;
			color: #999;

			margin-top: 10rpx;

			height: 22rpx;
			align-items: end;
		}
	}

	.data-list {

		&_item {
			// width: 690rpx; 
			height: 120rpx;
			margin: 20rpx 30rpx;
			padding: 24rpx 42rpx;
			display: flex;

			background: #FFFFFF;
			box-shadow: 0px 8rpx 20rpx 0px rgba(202, 202, 202, 0.3);
			border-radius: 8rpx;

			.symbol {
				padding-top: 5rpx;
				margin-left: 30rpx;

				.name {
					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 30rpx;
					color: #010101;
				}

				.address {
					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 24rpx;
					color: #666;

					margin-top: 26rpx;
				}
			}

			.right {
				.balance {
					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 36rpx;
					color: #000000;
				}

				.value {
					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 20rpx;
					color: #666;

					margin-top: 25rpx;
				}
			}

		}
	}
</style>