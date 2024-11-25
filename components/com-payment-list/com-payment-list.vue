<template>
	<view>
		<view class="flex items-end text-xs">
			<view class="flex items-center justify-end mr-4" v-for="(item, index) in list" :key="index">
				<view class="w-[2px] h-[10px] " :class="{
					'bg-orange-400' : item == 'bank', 
					'bg-blue-500' : item == 'alipay', 
					'bg-green-500' : item == 'wechat_pay'
				}"></view>
				<view class="ml-1">
					<text v-if="item == 'bank'">银行卡</text>
					<text v-if="item == 'alipay'">支付宝</text>
					<text v-if="item == 'wechat_pay'">微信</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps(['list'])
</script>

<style>

</style>