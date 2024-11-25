<template>
	<view class="list-item" v-for="(item, index) in data" :key="index">
		<view class="px-4">
			<view class="flex justify-between py-2 items-center ">
				<view class="flex items-center">
					<view class="font-semibold text-lg">{{ item.symbol }}</view>
					<view class=" text-white px-2 rounded ml-4"
						:class="[flowText(item.flow) == '多' ? 'bg-[#62b28b]' : 'bg-[#e2545c]']">
						{{ flowText(item.flow) }}{{ item.multiple }}倍
					</view>
				</view>
				<view class="  font-semibold" :class="[item.rate >= 0 ? 'text-[#62b28b]' : 'text-[#e2545c]']">
					{{ item.rate }}%
				</view>
			</view>

			<view class="flex py-1">
				<view class="w-1/2 flex justify-between">
					<view class="text-[#9da3ae]">
						持仓量[{{ item.name }}]
					</view>
					<view class="text-right font-semibold pr-2">
						{{ tools.roundNumber(item.amount, item.digits) }}
					</view>
				</view>
				<view class="w-1/2 flex justify-between">
					<view class="text-[#9da3ae] pl-2">
						收益
					</view>
					<view class="text-right font-medium"
						:class="[item.rate >= 0 ? 'text-[#62b28b]' : 'text-[#e2545c]']">
						{{ tools.roundNumber(item.profit, item.digits) }} USDT
					</view>
				</view>
			</view>

			<view class="flex py-1">
				<view class="w-1/2 flex justify-between">
					<view class="text-[#9da3ae]">
						开仓均价
					</view>
					<view class="text-right font-medium pr-2">
						${{ tools.roundNumber(item.price_in, item.digits) }}
					</view>
				</view>
				<view class="w-1/2 flex justify-between">
					<view class="text-[#9da3ae] pl-2">
						开仓时间
					</view>
					<view class="text-right font-medium">
						{{ item.time }}
					</view>
				</view>
			</view>

			<view class="flex py-1">
				<view class="w-1/2 flex justify-between">
					<view class="text-[#9da3ae]">
						平仓均价
					</view>
					<view class="text-right font-medium pr-2">
						${{ tools.roundNumber(item.price_out, item.digits) }}
					</view>
				</view>
				<view class="w-1/2 flex justify-between">
					<view class="text-[#9da3ae] pl-2">
						平仓时间
					</view>
					<view class="text-right font-medium">
						{{ item.time2 }}
					</view>
				</view>
			</view>

		</view>
		<!-- <view class="w-100 border-bottom-gray-50 mt-2" /> -->
	</view>
</template>

<script setup>
	import tools from "@/utils/tools";
	import { computed } from "vue";
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