<template>
	<view>
		<!-- <com-wallet-helper :chain="chain" :address="address" :privateKey="privateKey" ref="ethers"></com-wallet-helper> -->
		<!-- <com-wallet-hepler ref="ethers"></com-wallet-hepler> -->
		<com-ethers ref="bsc" :rpc="ethChain.rpc"></com-ethers>
		<com-tronweb ref="tronWeb" :rpc="tronChain.rpc"></com-tronweb>
		<com-ethers ref="eth" :rpc="ChainList[1].rpc"></com-ethers>
		<com-ethers ref="polygon" :rpc="ChainList[3].rpc"></com-ethers>
	</view>
</template>

<script setup>
	import {
		onMounted,
		onUnmounted,
		ref,
		watch
	} from 'vue';
	import {
		onShow,
		onHide
	} from '@dcloudio/uni-app'
	import dbWallet from '@/utils/dbWallet';
	import {
		useUserStore
	} from '@/stores/modules/user';
	import {
		useBalanceStore
	} from '@/stores/modules/userBalance'
	import secret from '@/utils/secret';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
	import {
		useTabbarStore
	} from '@/stores/modules/tabbarStore';
	import {
		useAppStore
	} from '@/stores/modules/app';
	import ChainList from '@/data/chainData.js'

	import project from '@/utils/project';
import dbToken from '../../utils/dbToken';
	const walletStore = useWalletStore();
	let tabbarStore = useTabbarStore()
	const userStore = useUserStore();
	let balanceStore = useBalanceStore()
	const bsc = ref(null)
	const eth = ref(null)
	const polygon = ref(null)
	const tronWeb = ref(null)
	const ethChain = ref(ChainList[2])
	const tronChain = ref(ChainList.find(x => x.type == 'tron'))


	let pages = getCurrentPages();
	let page = pages[pages.length - 1];

	let timer1;
	let timer2;
	let timer3;
	let timer4;

	const getWalletsBalanceByChain = async (chain_id) => {
		let wallets = await dbWallet.getWallets(chain_id)
		let ethers;
		if (chain_id == 2) {
			ethers = eth
		} else if (chain_id == 3) {
			ethers = bsc
		} else if (chain_id == 4) {
			ethers = polygon
		} else if (chain_id == 6) {
			ethers = tronWeb
		}
		let tokens = await dbToken.getTokens(chain_id)
		for (let wallet of wallets) {
			for (let token of tokens) {
				let balance = await ethers.value.getBalanceValue(wallet.address, token.address);
				// dbToken.
			}			
		}
	}

	const getWalletsBalance = async () => {
		getWalletsBalanceByChain(2)
		getWalletsBalanceByChain(3)
		getWalletsBalanceByChain(4)
		getWalletsBalanceByChain(6)
	}

	//当前页监听钱包地址切换，如果发生改变。就会重新监听，防止5个底部首页，登录5次
	watch(() => walletStore.wallet, async (newVal, oldVal) => {
		console.log('watch user', userStore.user.account, newVal.address)
		if (newVal.address && userStore.user.account.toLowerCase() != newVal.address.toLowerCase()) {

			console.log('login starting', newVal.address)
			console.log('chain: ', walletStore.chain.rpc, walletStore.chain.type)
			//登录
			const message = 'LOGIN:' + newVal.address + new Date().getTime();
			let signature;
			if (walletStore.chain.type == 'eth') {
				signature = await bsc.value.signMessage(message, secret.decrypt(newVal.private_key));
				console.log('sign bsc message', message, signature)

			} else {
				signature = await tronWeb.value.signMessage(message, secret.decrypt(newVal.private_key));
				console.log('sign tronWeb message', message, signature)
			}
			console.log('watch user signature: ', signature)
			if (signature) {
				await project.login(newVal.address, message, signature, walletStore.chain.type)
			}

			// if ('/' + page.route != "/pages/chat/index/index") {
			// 	//如果是消息页面，就不用更新消息数。以及登录信息了。
			// 	webConnect()
			// }		

			// bsc.value.on('0x55d398326f99059ff775485246999027b3197955', '0x55d398326f99059ff775485246999027b3197955', result => {
			// 	console.log('bsc', result)
			// })
		}
	})
</script>

<style>

</style>