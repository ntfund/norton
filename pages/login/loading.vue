<template>
	<view>
		<!-- 遮罩层 -->
		<view style="width: 100vw; height: 100vh; background-color: #7F17FE">
			<view v-if="address === ''" style="color: #fff; font-size: 20px; text-align: center">未检测到钱包</view>
			<view style="color: #1e9fe7" class="la-line-scale-pulse-out">
				<view></view>
				<view></view>
				<view></view>
				<view></view>
				<view></view>
			</view>
		</view>
		<!-- <com-wallet-helper :chain="chain" :address="address" :privateKey="privateKey" ref="ethers"></com-wallet-helper> -->
		<com-ethers-bsc ref="bsc"></com-ethers-bsc>
		<com-tronweb ref="tronWeb"></com-tronweb>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	import {
		onShow
	} from '@dcloudio/uni-app'
	import dbWallet from '@/utils/dbWallet';
	import {
		useUserStore
	} from '@/stores/modules/user';
	import {
		useBalanceStore
	} from '@/stores/modules/userBalance'
	import secret from '@/utils/secret';
	import project from '@/utils/project';
	const address = ref(null)
	const privateKey = ref(null)
	const chain = dbWallet.getChain(3);
	const userStore = useUserStore();
	let balanceStore = useBalanceStore()
	const bsc = ref(null)
	const tronWeb = ref(null)
	onMounted(async () => {
		try {
			const wallets = await dbWallet.getWallets(3);
			if (wallets.length == 0) {
				uni.redirectTo({
					url: '/pages/login/welcome'
				})
				return;
			}
		} catch (e) {
			//TODO handle the exception
			uni.redirectTo({
				url: '/pages/login/welcome'
			})
			return;
		}
	})

	onShow(async () => {
		let _chain = uni.getStorageSync('chain');
		let _chain_id = 3;
		if (_chain) {
			_chain_id = _chain.id;
		}

		let wallet = await dbWallet.getDefaultWallet(_chain_id);
		if (wallet == null) {
			wallet = await dbWallet.getWallet(userStore.user.account, _chain_id);

			if (wallet == null) {
				wallet = await dbWallet.getAnyWallet(_chain_id);
			}
		}
		address.value = wallet.address;
		privateKey.value = secret.decrypt(wallet.private_key);


		const message = 'LOGIN:' + wallet.address + new Date().getTime();
		let signature;
		if (_chain_id == 6) {
			signature = await tronWeb.value.signMessage(message, privateKey.value);
		} else {
			// console.log('privateKey.value', privateKey.value)
			signature = await bsc.value.signMessage(message, privateKey.value);
		}
		let type = _chain_id == 6 ? 'tron' : 'eth'
		console.log('signMessage', signature)
		try{
			let result = await project.login(wallet.address, message, signature, type)
			console.log('loading login result', result)
			if (result) {
				uni.switchTab({
					url: "/pages/index/index"
				})
			}
		}catch(e){
			//TODO handle the exception
			console.log('login err', e)
		}
	})
</script>

<style>
	/*!
* Load Awesome v1.1.0 (http://github.danielcardoso.net/load-awesome/)
                       * Copyright 2015 Daniel Cardoso <@DanielCardoso>
* Licensed under MIT
*/
	.la-line-scale-pulse-out {
		margin: 0 auto;
		padding-top: 10vh;
	}

	.la-line-scale-pulse-out,
	.la-line-scale-pulse-out>view {
		position: relative;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}

	.la-line-scale-pulse-out {
		display: block;
		font-size: 0;
		color: #fff;
	}

	.la-line-scale-pulse-out.la-dark {
		color: #333;
	}

	.la-line-scale-pulse-out>view {
		display: inline-block;
		float: none;
		background-color: currentColor;
		border: 0 solid currentColor;
	}

	.la-line-scale-pulse-out {
		width: 40px;
		height: 32px;
	}

	.la-line-scale-pulse-out>view {
		width: 4px;
		height: 32px;
		margin: 0 2px;
		border-radius: 0;
		-webkit-animation: line-scale-pulse-out .9s infinite cubic-bezier(.85, .25, .37, .85);
		-moz-animation: line-scale-pulse-out .9s infinite cubic-bezier(.85, .25, .37, .85);
		-o-animation: line-scale-pulse-out .9s infinite cubic-bezier(.85, .25, .37, .85);
		animation: line-scale-pulse-out .9s infinite cubic-bezier(.85, .25, .37, .85);
	}

	.la-line-scale-pulse-out>view:nth-child(3) {
		-webkit-animation-delay: -.9s;
		-moz-animation-delay: -.9s;
		-o-animation-delay: -.9s;
		animation-delay: -.9s;
	}

	.la-line-scale-pulse-out>view:nth-child(2),
	.la-line-scale-pulse-out>view:nth-child(4) {
		-webkit-animation-delay: -.7s;
		-moz-animation-delay: -.7s;
		-o-animation-delay: -.7s;
		animation-delay: -.7s;
	}

	.la-line-scale-pulse-out>view:nth-child(1),
	.la-line-scale-pulse-out>view:nth-child(5) {
		-webkit-animation-delay: -.5s;
		-moz-animation-delay: -.5s;
		-o-animation-delay: -.5s;
		animation-delay: -.5s;
	}

	.la-line-scale-pulse-out.la-sm {
		width: 20px;
		height: 16px;
	}

	.la-line-scale-pulse-out.la-sm>view {
		width: 2px;
		height: 16px;
		margin: 0 1px;
	}

	.la-line-scale-pulse-out.la-2x {
		width: 80px;
		height: 64px;
	}

	.la-line-scale-pulse-out.la-2x>view {
		width: 8px;
		height: 64px;
		margin: 0 4px;
	}

	.la-line-scale-pulse-out.la-3x {
		width: 120px;
		height: 96px;
	}

	.la-line-scale-pulse-out.la-3x>view {
		width: 12px;
		height: 96px;
		margin: 0 6px;
	}

	/*
 * Animation
 */
	@-webkit-keyframes line-scale-pulse-out {
		0% {
			-webkit-transform: scaley(1);
			transform: scaley(1);
		}

		50% {
			-webkit-transform: scaley(.3);
			transform: scaley(.3);
		}

		100% {
			-webkit-transform: scaley(1);
			transform: scaley(1);
		}
	}

	@-moz-keyframes line-scale-pulse-out {
		0% {
			-moz-transform: scaley(1);
			transform: scaley(1);
		}

		50% {
			-moz-transform: scaley(.3);
			transform: scaley(.3);
		}

		100% {
			-moz-transform: scaley(1);
			transform: scaley(1);
		}
	}

	@-o-keyframes line-scale-pulse-out {
		0% {
			-o-transform: scaley(1);
			transform: scaley(1);
		}

		50% {
			-o-transform: scaley(.3);
			transform: scaley(.3);
		}

		100% {
			-o-transform: scaley(1);
			transform: scaley(1);
		}
	}

	@keyframes line-scale-pulse-out {
		0% {
			-webkit-transform: scaley(1);
			-moz-transform: scaley(1);
			-o-transform: scaley(1);
			transform: scaley(1);
		}

		50% {
			-webkit-transform: scaley(.3);
			-moz-transform: scaley(.3);
			-o-transform: scaley(.3);
			transform: scaley(.3);
		}

		100% {
			-webkit-transform: scaley(1);
			-moz-transform: scaley(1);
			-o-transform: scaley(1);
			transform: scaley(1);
		}
	}
</style>