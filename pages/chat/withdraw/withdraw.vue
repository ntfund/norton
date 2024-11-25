<template>
	<view>
		<view>
			<view class="item flex justify-between items-center w-[100%] bg-white mt-4 px-2 py-3.5"
				@click="show = !show">
				<text class="ml-0.5">币种</text>
				<view class=" flex right items-center">
					<!-- <u-icon name="grid" size="22" class="ml-2"></u-icon> -->
					<image :src="selectedCoin.icon" mode="widthFix" style="width: 40rpx; height: 40rpx;"></image>
					<text class="ml-0.5">{{selectedCoin.name}}</text>
					<u-icon name="arrow-right" class="ml-2"></u-icon>
				</view>
			</view>
			<text class="mb-3 text-right w-[100%] mr-2 mt-1 text-sm text-gray-400">余额:{{balance}}</text>
		</view>
	</view>
	<com-choice-symbol-popup v-model:show="show" @change="change"></com-choice-symbol-popup>
</template>

<script setup lang="ts">
	import {
		nextTick,
		reactive,
		ref
	} from "vue";
	import {
		useBalanceStore
	} from '@/stores/modules/userBalance'
	import tools from '@/utils/tools'
	import project from "../../../utils/project";
	import {
		useUserStore
	} from "@/stores/modules/user";

	const userBalanceStore = useBalanceStore()

	let selectedCoin = ref({
		id: 7,
		name: 'USDT',
		icon: '/static/img/usdt.png'
	})

	const balance = ref(userBalanceStore.getBalance(selectedCoin.value.id))
	const show = ref(false);
	const change = (item) => {
		console.log('change', item)
		selectedCoin.value = item;
		balance.value = userBalanceStore.getBalance(selectedCoin.value.id)
	}
</script>

<style>

</style>