<template>
	<view>
		<view class="item">
			<view class="item_container">
				<view class="item_row item_row1 flex justify-between items-center">
					<view :class="[data.type == 1 ? 'buy-title' : 'sell-title']">
						<span class="" v-if="data.type == 1">买入</span>
						<span class="" v-else>卖出</span>
						<span> USDT</span>
					</view>
					<view class="right">
						<view class="status" v-if="data.type == 1">
							<text class="text-gray-500" v-if="data.status == 0">交易完成</text>
							<text class="text-red-500" v-else-if="data.status == 1">待付款</text>
							<text class="text-yellow-500" v-else-if="data.status == 2">待放币</text>
							<text class="text-gray-500" v-else-if="data.status == 3">已取消</text>
							<text class="text-gray-500" v-else-if="data.status == 4">超时已取消</text>
							<text class="text-gray-500" v-else-if="data.status == 5">等待介入</text>
							<text class="text-gray-500" v-else-if="data.status == 6">交易完成</text>
						</view>
						<view class="status" v-else>
							<text class="text-gray-500" v-if="data.status == 0">交易完成</text>
							<text class="text-red-500" v-else-if="data.status == 1">等待买家付款</text>
							<text class="text-yellow-500" v-else-if="data.status == 2">待确认收款</text>
							<text class="text-gray-500" v-else-if="data.status == 3">已取消</text>
							<text class="text-gray-500" v-else-if="data.status == 4">超时已取消</text>
							<text class="text-gray-500" v-else-if="data.status == 5">等待介入</text>
							<text class="text-gray-500" v-else-if="data.status == 6">交易完成</text>
						</view>
					</view>
				</view>
				<view class="item_row item_row2 flex justify-between items-center">
					<view class="left">
						<view class="title">价格</view>
						<view class="sub-title">{{tools.formatNumber(data.price)}} CNY</view>
					</view>
					<view class="right ">
						<view class="title">
							时间
						</view>
						<view class="sub-title">
							{{ tools.dateFormat('YYY-mm-dd HH:MM', new Date(data.created_at)) }}
						</view>
					</view>
				</view>
				<view class="item_row item_row3 flex justify-between items-center">
					<view class="left">
						<view class="title">支付</view>
						<view class="sub-title">{{tools.formatNumber(data.money, 2, 2)}} CNY</view>
					</view>
					<view class="right">
						<view class="title">到账</view>
						<view class="amount">{{tools.formatNumber(data.amount)}} USDT</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import tools from '@/utils/tools';
	const props = defineProps(['data'])
</script>

<style lang="scss" scoped>
	.item {
		width: 694rpx;
		height: 210rpx;
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