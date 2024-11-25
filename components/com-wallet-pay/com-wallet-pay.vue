<template>
	<view>
		<u-popup :show="props.show" :round="10" mode="bottom" :closeable="true" @close="close" @open="open">
			<view>
				<view class="title p-2 flex items-center justify-between" style="border-bottom: 1px solid #eee;">
					<image :src="props.data.icon" mode="widthFix" style="width: 60rpx; height: 60rpx;"
						class="rounded-full"></image>
					<h3 class="text-gray-400 flex-1 ml-2">交易详情</h3>
					<view></view>
				</view>

				<view class="p-4">
					<view class="bg-gray-100 p-4 rounded-xl font-medium text-xl text-center">
						{{props.data.amount}} {{props.data.symbol}}
					</view>
					<view class="flex py-4" style="border-bottom: 1px solid #eee;">
						<view class="whitespace-nowrap min-w-[130rpx] text-gray-500">付款地址</view>
						<view class="break-all flex-1 ml-4">{{props.data.from}}</view>
					</view>
					<view class="flex py-4" style="border-bottom: 1px solid #eee;">
						<view class="whitespace-nowrap min-w-[130rpx] text-gray-500">收款地址</view>
						<view class="break-all flex-1 ml-4">{{props.data.to}}</view>
					</view>
					<view class="flex py-4" style="border-bottom: 1px solid #eee;">
						<view class="whitespace-nowrap min-w-[130rpx]  text-gray-500">网络费</view>
						<view class="break-all flex-1 ml-4">{{props.data.fee}}</view>
					</view>
				</view>

				<view class="pb-2">
					<!-- <button type="button" class="bg-blue-500 text-white m-5" @click="confirmedClick()">确认支付</button> -->
					<button type="button" class="n-btn" :class="{'disabled': loading}" :disabled="loading"
						@click="confirmedClick()">{{btnText}}</button>
				</view>
			</view>
		</u-popup>

		<com-ethers ref="ethers" :rpc="walletStore.chain.rpc" v-if="walletStore.chain.type == 'eth'"></com-ethers>
		<com-tronweb ref="tronWeb" :rpc="walletStore.chain.rpc" v-if="walletStore.chain.type == 'tron'"></com-tronweb>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
	
	const props = defineProps(['show', 'data'])
	const emit = defineEmits(['update:show', "confirmed"]);

	const loading = ref(true);
	const btnText = ref('确认支付')
	const ethers = ref(null);
	const tronWeb = ref(null);
	const walletStore = useWalletStore();


	console.log(props.data)


	const open = async () => {
		// console.log('open');
		// console.log(props.data)			
		
		//波场网络没有预估矿工费用。
		if (walletStore.chain.type == 'eth') {
			let ethBalance = await ethers.value.getBalanceValue(walletStore.wallet.address);
			if (parseFloat(ethBalance) < parseFloat(props.data.fee)) {
				loading.value = true;
				btnText.value = "矿工费不足";
				return;
			}
		}
		
		if (parseFloat(props.data.tokenBalance) < parseFloat(props.data.amount)) {
			loading.value = true;
			btnText.value = "余额不足";
			return;
		}
		
		loading.value = false;	
	}
	const close = () => {
		emit('update:show', !props.show);
		loading.value = false;
	}

	const confirmedClick = () => {
		loading.value = true;
		emit('confirmed');
		close()
	}
</script>

<style>

</style>