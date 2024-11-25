<template>
	<view class="fixed w-[750rpx] left-0 bottom-0" style="z-index: 99;">
		<view class="m-4 bg-gray-100 rounded-full flex text-center pt-[11px] pb-[9px] opacity-95">

			<view class="w-1/3" v-for="(item, i) in dataList" :key="i" @click="itemClick(item)">
				<uni-badge size="small" :text="item.badge" absolute="rightTop">
						<image :src="index == item.index ? item.iconOn : item.icon" mode="aspectFit" style="width: 50rpx; height: 50rpx;"></image>
					<view class="title" :class="{'active': index == item.index}">{{item.name}}</view>
				</uni-badge>
			</view>

		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import tools from '@/utils/tools'
	import {
		onShow
	} from '@dcloudio/uni-app';

	const props = defineProps(['index']);
	const index = ref(props.index ? props.index : 1)
	const dataList = ref([
		{
			index: 1,
			name: 'C2C',
			icon: '/static/images/c2c/c2c@2x.png',
			iconOn: '/static/images/c2c/c2c-fill@2x.png',
			badge: 0
		},
		{
			index: 2,
			name: '订单',
			icon: '/static/images/c2c/order_c@2x.png',
			iconOn: '/static/images/c2c/order-fill@2x.png',
			badge: 0
		},
		{
			index: 3,
			name: '我的',
			icon: '/static/images/c2c/my@2x.png',
			iconOn: '/static/images/c2c/my-fill@2x.png',
			badge: 0
		}
	])

	let orderPage = '/pages/market/order';
	const itemClick = (item) => {
		if (item.index == 1) {
			tools.redirectTo('/pages/market/market')
		}
		else if (item.index == 2) {
			tools.redirectTo(orderPage)
		}
		else if (item.index == 3) {
			tools.redirectTo('/pages/market/profile')
		}
	}
	
	onShow(() => {
		uni.$u.http.get('/c2cOrder', {
			params: {status: 1}
		}).then(res => {
			// console.log(res)
			dataList.value[1].badge = res.total;
			if (res.total == 0)
			{
				orderPage = '/pages/market/order?current=1'
			}
		})
	})
	
</script>

<style lang="less" scoped>
	.title {
		font-weight: normal;
		font-size: 24rpx;
		color: #999;
	}
	.active {
		color: #7F17FE;
	}
</style>