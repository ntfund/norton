<template>
	<view>
		<com-nav-bar title="转账"></com-nav-bar>
		<view class=" font-medium bg-slate-100 pt-2 text-gray-600">
			<view class="p-4 mb-2 bg-white">
				<view>收款地址:</view>
				<div class="flex justify-between py-2">
					<u--input type="text" placeholder="请输入或粘贴钱包地址" color="#6f6f6f" fontSize="14" border="none"
						v-model="formData.to"></u--input>
					<uni-icons type="scan" size="22" class="ml-4" @click="scanClick"></uni-icons>
				</div>
			</view>
			<view class="p-4 mb-2 bg-white">
				<view class="flex justify-between">
					<view>转账金额:</view>
					<view class="text-gray-400" @click="changeToken">{{selectedToken.name}} ></view>
				</view>
				<view class="flex justify-between items-center py-2 mt-2">
					<u--input placeholder="请输入金额" type="digit" color="#6f6f6f" border="none" fontSize="14"
						v-model="formData.amount"></u--input>
					<button type="button" class="text-xs px-2 py-0.5 ml-4" @click="all">全部</button>
				</view>
				<view class="flex justify-between mt-4">
					<view>钱包余额</view>
					<view class="text-gray-400 flex">
						<view>{{tools.floorAmount(selectedToken.balance, 6)}}</view>
						<view class="ml-[5rpx]">{{selectedToken.name}}</view>
					</view>
				</view>
			</view>
			<view class="p-4 mb-2 bg-white">
				<view class="flex justify-between">
					<view>网络费</view>
					<view class="text-gray-400">{{selectedToken.fee}}{{walletStore.chain.symbol}}</view>
				</view>
			</view>

			<view class="p-4 mt-8">
				<!-- <u-button text="确认" type="primary" :loading="show" @click="confirm"></u-button> -->
				<button type="button" class="n-btn-full" @click="confirm">确认</button>
			</view>
		</view>

		<com-verify-password v-if="show" v-model:show="show" @success="confirmed"></com-verify-password>

		<com-wallet-pay v-if="showPay" v-model:show="showPay" :data="formData"
			@confirmed="show = true"></com-wallet-pay>

		<!-- 获取手续费和余额 以及助手 -->
		<!-- <com-wallet-helper ref="helper" :address="walletStore.wallet.address" :chain="walletStore.chain"
			:token="selectedToken.address" :privateKey="secret.decrypt(walletStore.wallet.private_key)"
			v-model:balance="selectedToken.balance" v-model:fee="selectedToken.fee"></com-wallet-helper> -->

		<com-ethers ref="ethers" :rpc="walletStore.chain.rpc" v-if="walletStore.chain.type == 'eth'"></com-ethers>
		<com-tronweb ref="tronWeb" :rpc="walletStore.chain.rpc" v-if="walletStore.chain.type == 'tron'"></com-tronweb>

	</view>
</template>

<script setup>
	import {
		onMounted,
		reactive,
		ref
	} from 'vue';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
	import tools from '@/utils/tools';
	import dbWallet from '@/utils/dbWallet';
	import dbToken from '@/utils/dbToken';
	import secret from '@/utils/secret';

	const props = defineProps(['address']);
	const show = ref(false);

	const walletStore = useWalletStore()
	const helper = ref(null)
	const ethers = ref(null)
	const tronWeb = ref(null)
	const selectedToken = ref({
		name: '',
		symbol: '',
		address: '',
		balance: 0,
		fee: '~',
	})
	const getSelectToken = async () => {
		selectedToken.value = await dbToken.getToken(props.address, walletStore.chain
			.id)
		// console.log(selectedToken.value)
	}


	const showPay = ref(false);
	const formData = reactive({
		from: '',
		to: '',
		amount: '',
		tokenAddress: '',
		icon: '',
		fee: '~',
		symbol: '',
		tokenBalance: 0,
		decimals: 18
	})

	const scanClick = async () => {
		console.log("right left")
		let res = await tools.scanCode();
		formData.to = res;
	}

	const all = () => {
		if (selectedToken.value.address) {
			formData.amount = selectedToken.value.balance
		} else {
			formData.amount = tools.floorAmount(selectedToken.value.balance - selectedToken.value.fee, 6)
			if (formData.amount < 0) {
				formData.amount = 0;
			}
		}
	}

	const getBalance = async () => {
		if (walletStore.chain.type == 'eth') {
			ethers.value.estimateTransferGas({
				from: walletStore.wallet.address,
				tokenAddress: selectedToken.value.address,
				private_key: secret.decrypt(walletStore.wallet.private_key)
			}).then(fee => {
				selectedToken.value.fee = fee;
			})
			ethers.value.getBalanceValue(walletStore.wallet.address, selectedToken.value.address).then(data => {
				selectedToken.value.balance = data
			})

		} else {
			selectedToken.value.balance = await tronWeb.value.getBalanceValue(walletStore.wallet.address,
				selectedToken
				.value.address)

			selectedToken.value.fee = '~'
		}
	}

	const changeToken = () => {
		uni.navigateTo({
			url: "/pages/wallet/tokens",
			events: {
				selectToken: (token) => {
					console.log('selectToken events', token)
					selectedToken.value = token;

					getBalance()
				}
			}
		})
	}

	const confirm = async () => {
		if (!formData.to) {
			tools.toast("请填写收款地址");
			return;
		}
		let isAddress = false;
		if (walletStore.chain.type == 'eth') {
			isAddress = await ethers.value.isAddress(formData.to)
		} else {
			isAddress = await tronWeb.value.isAddress(formData.to)
		}
		if (!isAddress) {
			tools.toast("收款地址无效");
			return;
		}
		if (!formData.amount) {
			tools.toast("请填写金额");
			return;
		}
		formData.from = walletStore.wallet.address;
		formData.tokenAddress = selectedToken.value.address;
		formData.fee = selectedToken.value.fee;
		formData.symbol = selectedToken.value.symbol;
		formData.icon = selectedToken.value.icon;
		formData.tokenBalance = selectedToken.value.balance;
		formData.decimals = selectedToken.value.decimals;

		showPay.value = true;
	}



	//最终确认，发起交易 [密码或生物认证确认完成]
	const confirmed = async () => {
		console.log('验证已确认，开始发起交易')
		try {
			if (walletStore.chain.type == 'eth') {
				 ethers.value.transfer({
					from: formData.from,
					to: formData.to,
					amount: formData.amount,
					tokenAddress: formData.tokenAddress,
					private_key: secret.decrypt(walletStore.wallet.private_key),
					decimals: formData.decimals
				}).then(receipt => {
					tools.toast("交易已发送")
					//eth是一个对象， tron是哈希值  trx是对象
					console.log('transcation:', transcation)
					uni.navigateBack()
				})
			} else {
				tronWeb.value.transfer({
					from: formData.from,
					to: formData.to,
					amount: formData.amount,
					tokenAddress: formData.tokenAddress,
					private_key: secret.decrypt(walletStore.wallet.private_key),
					decimals: formData.decimals
				}).then(receipt => {
					tools.toast("交易已发送")
					//eth是一个对象， tron是哈希值  trx是对象
					console.log('transcation:', transcation)
					uni.navigateBack()
				})
			}



		} catch (e) {
			//TODO handle the exception
			console.log(e)
			tools.toast(e.message)
		}
	}

	onMounted(async () => {
		await getSelectToken();
		await getBalance();
	})
</script>

<style lang="less">
	body {
		@apply bg-slate-100;
	}
</style>