<template>
	<view>
		<view class="item">
			<view class="item_container">
				<view class="item_row item_row1 flex justify-between items-center">
					<view :class="[data.type == 2 ? 'buy-title' : 'sell-title']">
						<span class="" v-if="data.type == 2">买入</span>
						<span class="" v-else>卖出</span>
						<span> USDT</span>
					</view>
					<!-- 用户买，商家卖 -->
					<view class="font-semibold" v-if="data.type == 1">
						<text class="text-gray-500" v-if="data.status == 0">交易完成</text>
						<text class="text-cyan-500" v-else-if="data.status == 1">等待对方付款</text>
						<text class="text-yellow-500" v-else-if="data.status == 2">请放币</text>
						<text class="text-gray-500" v-else-if="data.status == 3">已取消</text>
						<text class="text-gray-500" v-else-if="data.status == 4">已超时</text>
						<text class="text-red-500" v-else-if="data.status == 5">申诉中</text>
						<text class="text-gray-500" v-else-if="data.status == 6">交易完成</text>
					</view>
					<!-- 用户卖，商家买 -->
					<view class="font-semibold" v-else>
						<text class="text-gray-500" v-if="data.status == 0">交易完成</text>
						<text class="text-red-500" v-else-if="data.status == 1">等待付款至卖家</text>
						<text class="text-cyan-500" v-else-if="data.status == 2">待卖家确认转账</text>
						<text class="text-gray-500" v-else-if="data.status == 3">已取消</text>
						<text class="text-gray-500" v-else-if="data.status == 4">已取消</text>
						<text class="text-red-500" v-else-if="data.status == 5">申诉中</text>
						<text class="text-gray-500" v-else-if="data.status == 6">交易完成</text>
					</view>
				</view>
				<view class="item_row item_row2 flex justify-between items-center">
					<view class="left">
						<view class="title">价格</view>
						<view class="sub-title">{{tools.formatNumber(data.price)}} CNY</view>
					</view>
					<view class="right">
						<view class="title">
							时间
						</view>
						<view class="sub-title">
							{{data.created_at}}
						</view>
					</view>
				</view>
				<view class="item_row item_row3 flex justify-between items-center">
					<view class="left">
						<view class="title">数量</view>
						<view class="sub-title">{{tools.formatNumber(data.amount)}} USDT</view>
					</view>
					<view class="right">
						<view class="title">金额</view>
						<view class="amount">
							{{tools.formatNumber(data.money, 2, 2)}} CNY
						</view>
					</view>
				</view>

				<view class="item_row flex justify-end items-center mt-[10px]">
					<!-- <view class="title">剩余时间：</view> -->
					<view class="iconfont icon-clock-filling text-[#F98434] mr-[10rpx]"></view>
					<u-count-down :time="getRemain(data)" format="HH:mm:ss"></u-count-down>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import tools from '@/utils/tools';
	import {
		C2COrderType
	} from '@/enums/C2COrderType';
	import {
		C2CType
	} from '@/enums/C2CType';

	const props = defineProps(['data'])

	const getRemain = (data) => {
		// if (data.type == C2CType.Buy)
		// {
		// 	if (data.status == C2COrderType.New)
		// 	{
		// 		return new Date(data.over_time).getTime() - new Date()
		// 	}

		// 	if (data.status == C2COrderType.Paid)
		// 	{
		// 		return new Date(data.paid_time).getTime() + 30 * 60 * 1000 - new Date()
		// 	}
		// } else {
		// 	if (data.status == C2COrderType.New)
		// 	{
		// 		return new Date(data.over_time).getTime() - new Date()
		// 	}
		// 	if (data.status == C2COrderType.Paid)
		// 	{
		// 		return new Date(data.paid_time).getTime() + 30 * 60 * 1000 - new Date()
		// 	} 
		// }
		if (data.status == C2COrderType.New) {
			return new Date(data.over_time).getTime() - new Date()
		}
		if (data.status == C2COrderType.Paid) {
			return new Date(data.paid_time).getTime() + 30 * 60 * 1000 - new Date()
		}
		// console.log('data.over_time', 'data.created_at', data.over_time, data.created_at)
		return new Date(data.over_time).getTime() - new Date()
	}
</script>

<style lang="less" scoped>
	.item {
		width: 694rpx;
		// height: 210rpx;
		background: #FFFFFF;
		box-shadow: 0px 8rpx 20rpx 0px rgba(202, 202, 202, 0.3);
		border-radius: 8rpx;
		margin: 0 auto;
		margin-bottom: 20rpx;

		&_row {

			.left,
			.right {
				display: flex;
				align-items: center;
			}

			// margin-top: 10rpx;
		}

		&_container {
			padding: 28rpx;
		}

		&_row2 {
			margin-top: 20rpx;
		}

		&_row1 {
			// padding: 3rpx;

			padding-bottom: 20rpx;

			border-bottom: 2rpx dashed #eee;
		}

		&_row3 {
			margin-top: 10rpx;
		}

		.buy-title {
			font-family: Gilroy-Bold;
			font-weight: bold;
			font-size: 32rpx;
			color: #00C688;
		}

		.sell-title {
			font-family: Gilroy-Bold;
			font-weight: bold;
			font-size: 32rpx;
			color: #FC465C;
		}

		.title {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 22rpx;
			color: #000000;
			// line-height: 70px;
			opacity: 0.6;

			margin-right: 20rpx;
		}

		.sub-title {
			font-family: Gilroy-Medium;
			font-weight: 500;
			font-size: 24rpx;
			color: #000000;

		}

		.amount {
			font-family: Gilroy-Bold;
			font-weight: bold;
			font-size: 24rpx;
			color: #00C688;
		}

		.status {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 22rpx;
		}
	}
</style>