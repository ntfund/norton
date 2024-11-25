<template>
	<view class="list-item mb-4" v-for="(item, index) in data" :key="index">
		<view class="px-4">
			<view class="flex justify-between py-2 items-center text-lg">
				<view class="font-semibold">{{ item.symbol }}永续 {{ flowText(item.flow) }}</view>
				<view class=" text-white px-2 rounded text-sm"
					:class="[flowText(item.flow) === '多' ? 'bg-[#62b28b]' : 'bg-[#e2545c]']"> {{ flowText(item.flow) }}
					{{ item.multiple }}倍
				</view>
			</view>
			<view class="flex py-2  border-bottom-gray-100">
				<view class="flex flex-col w-1/3">
					<view class="text-xl font-semibold">${{ tools.roundNumber(item.price_in, item.digits) }}</view>
					<view class="text-[#9da3ae]">开仓均价</view>
				</view>
				<view class="flex flex-col ml-5">
					<view class="text-xl font-semibold "
						:class="[item.profit > 0 ? 'text-[#62b28b]' : 'text-[#e2545c]']">
						{{ item.rate }}%
					</view>
					<view class="text-[#9da3ae]">收益率</view>
				</view>
			</view>
			<view class="flex py-1 pt-4">
				<view class="flex w-1/2 justify-between mr-1">
					<view class="text-[#9da3ae]">
						持仓量
					</view>
					<view class="text-right font-semibold">
						{{ tools.roundNumber(item.amount, item.digits) }}{{ item.name }}
					</view>
				</view>

				<view class="flex w-1/2 justify-between ml-1">
					<view class="text-[#9da3ae]">
						收益
					</view>
					<view class="text-right font-medium"
						:class="[item.rate >= 0 ? 'text-[#62b28b]' : 'text-[#e2545c]']">
						{{ tools.roundNumber(item.profit, item.digits) }} USDT
					</view>
				</view>
			</view>

			<view class="flex py-1 pb-4">
				<view class="flex flex-nowrap w-1/2 justify-between mr-1">
					<view class=" text-[#9da3ae]">
						预估强平价
					</view>
					<view class=" text-right font-medium">
						<span v-if="item.bao > 0">$</span> {{ item.bao > 0 ? tools.roundNumber(item.bao, item.digits) : item.bao }}
					</view>
				</view>
				<view class="flex w-1/2 justify-between ml-1">
					<view class=" text-[#9da3ae] ">
						保证金
					</view>
					<view class=" text-right font-medium">
						{{ tools.roundNumber(item.bond, item.digits) }} USDT
					</view>
				</view>

			</view>
		</view>
		<view class="w-100 border-bottom-gray-50 mt-2" />
	</view>
</template>

<script setup>
	import {
		computed
	} from "vue";
	import tools from "@/utils/tools";

	const props = defineProps(['data']);

	const flowText = computed(() => {
		return (flow) => {
			if (flow === 1 || flow === 'up') {
				return '多';
			}
			return '空'
		}
	})
</script>

<style lang="less" scoped>

</style>