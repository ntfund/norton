<template>
	<view>
		<com-nav-bar title="选择代币"></com-nav-bar>
		<view class="m-4">
			<view class="py-4 flex justify-between items-center bbottom" v-for="(item, index) in tokens" :kye="index"
				style="border-bottom: 1px solid #ececec;" @click="selectRow(item)">
				<view class=" flex items-center">
					<image :src="item.icon" mode="widthFix" style="width: 80rpx;" class="rounded-full">
					</image>
					<view class="ml-4 font-semibold">{{item.name}}</view>
					<!-- <u-tag text="BEP20" type="warning" shape="circle" size="mini" class="ml-2"></u-tag> -->
				</view>
				<view class="flex text-right">
					<com-balance :address="walletStore.wallet.address" :token="item.address"
						:chain="walletStore.chain"></com-balance>
					<view class="ml-1 font-bold">{{item.symbol}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		getCurrentInstance,
		ref
	} from 'vue';
	import project from '@/utils/project';
	import tools from '@/utils/tools';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
	import dbToken from '@/utils/dbToken';
	const tokens = ref([]);
	const walletStore = useWalletStore();

	const getTokens = async () => {
		tokens.value = []; //不加这句废话的话，com-balance组件在销毁的时候，会触发余额查询。
		tokens.value = await dbToken.getTokens(walletStore.chain.id)
	}
	getTokens();
	
	
	let eventChannel;
	onMounted(() => {
		const instance = getCurrentInstance().proxy;
		eventChannel = instance.getOpenerEventChannel();
	})
	const selectRow = async (token) => {
		
		uni.navigateBack({
			success: (res) => {
				eventChannel.emit('selectToken', token)
			}
		})
	}
</script>

<style>

</style>