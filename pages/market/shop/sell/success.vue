<template>
	<view class="status_bar"></view>
	<view class="px-4 mt-1">
		<view class="iconfont icon-close font-bold text-2xl text-right" @click="close"></view>
	</view>

	<view class="flex items-center justify-center mt-20">

		<view class="flex flex-col justify-center items-center">
			<view class="iconfont icon-success-fill text-8xl text-green-600"></view>
			<view class="text-4xl font-bold py-1 mt-4">￥{{tools.unitConverter(item.money)}}</view>
			<view class="text-base text-gray-700">您已成功买入 {{tools.unitConverter(item.amount)}} USDT</view>
		</view>

	</view>

</template>

<script setup>
	import tools from '@/utils/tools'
	import {
		reactive,
		ref
	} from 'vue';
	import project from '@/utils/project';
	
	const props = defineProps(['id'])
	const item = ref({
		money: '',
		order_number: '',
		c2c_user_nickname: '',
		payment_info: {
			account: '',
			name: '',
			number: '',
			qrcode: '',
		},
		c2c: {
			payments: []
		},
		shop: {
			name: '',
			shop_level: 1
		},
	})

	const close = () => {
		uni.reLaunch({
			// url: '/pages/market/profile?current=1'
			url: '/pages/market/shop/order?current=1'
		})
	}

	const getData = () => {
		uni.$u.http.get('/c2cOrder/' + props.id).then(data => {
			console.log(data);
			item.value = data
		})
	}
	getData()
</script>

<style lang="scss">
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
</style>