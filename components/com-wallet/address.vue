<template>
	<view>
		<view class="address" @click.stop="showWallet = true">
			<view class="img flex items-center justify-center">
				<image :src="walletStore.chain.icon" mode="aspectFit"
					style="width: 28rpx; height: 28rpx;">
				</image>
			</view>
			<view class="address_account">
				{{tools.hideAccount(walletStore.wallet.address, 10, 8)}}
			</view>
		</view>
		<com-wallet-manager v-if="showWallet" v-model:show="showWallet"></com-wallet-manager>
	</view>
</template>

<script setup>
	import tools from '@/utils/tools'
	import {
		ref
	} from 'vue';
	import {
		useWalletStore
	} from '/stores/modules/wallet';
	// import {
	// 	useUserStore
	// } from '@/stores/modules/user'

	const showWallet = ref(false);
	// let userStore = useUserStore()
	const walletStore = useWalletStore();
</script>

<style lang="scss" scoped>
	.address {
		display: flex;

		// width: 366rpx;
		padding: 0 20rpx;
		height: 40rpx;
		border-radius: 20rpx;
		border: 1rpx solid #FFFFFF;

		align-items: center;

		&_account {
			font-family: Gilroy-Medium;
			font-weight: 500;
			font-size: 22rpx;
			color: #FFFFFF;
			// line-height: 70px;

			margin-left: 10rpx;
		}
	}
</style>