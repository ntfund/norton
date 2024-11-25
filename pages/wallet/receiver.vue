<template>	
	<com-nav-bar title="收款" :border="true"></com-nav-bar>
	<view class="view-content p-6">
		<view class="bg-white mt-4 px-4 py-6 rounded-lg text-center flex items-center flex-col">
			<view class="bg-red-50 p-4 py-2 rounded-lg flex justify-center">
				<uni-icons type="info" size="20" color="#ef4444"></uni-icons>
				<view class="text-red-500 text-sm">
					仅向该地址转入{{walletStore.chain.name}}相关资产
				</view>
			</view>
			<com-qrcode :data="walletStore.wallet.address" class="mt-2"></com-qrcode>
			<view class="mt-4 text-gray-500 text-sm">钱包地址</view>
			<view class="break-all text-sm p-2 text-black">{{walletStore.wallet.address}}</view>
			<u-button text="复制地址" type="primary" class="my-2" @click="tools.copyClick(walletStore.wallet.address)"></u-button>
		</view>
	</view>

</template>

<script setup lang="ts">
	import { useWalletStore } from '@/stores/modules/wallet';
	import tools from '@/utils/tools'

	const walletStore = useWalletStore();
</script>

<style lang="less" scoped>
	page {
		background: #F8F8F8;
	}
	
	.view-content {
		background: #F8F9FB;
	}
</style>