<template>
	<view class="">		
		<view class="tip-box">
			<view class="flex items-center tip-box_row1">
				<image src="@/static/images/c2c/warn@2x.png" mode="aspectFit" style="width: 18rpx; height: 18rpx; margin-right: 5rpx;"></image>
				<view class="tip-box_row_txt">购买委托完成将获得USDT</view>
			</view>
			<view class="tip-box_row2">
				<text class="tip-box_row_txt">如果有用户发起订单，请务必在规定时间向用户发起转账，并完成订单</text>
			</view>
		</view>
						
		<view class="data-list">
			<view class="data-list_item" v-for="(item, index) in dataList"
				:key="index" @click="rowClick(item)">
				
				<view class="data-list_item_content">
					<view class="flex items-center justify-between mt-[10rpx]">
						<view class="left flex items-center">
							<view class="amount">数量</view>
							<view class="flex value">
								<text>{{tools.toThousands(item.amount)}}</text>
								<text class="ml-1">USDT</text>
							</view>
						</view>
						<view class="right amount">
							单价
						</view>
					</view>
					<view class="flex items-center justify-between mt-[10rpx]">
						<view class="left flex items-center">
							<view class="amount">限额</view>
							<view class="flex value">
								<text>{{tools.formatNumber(item.min_cny)}}</text>
								<text class="mx-1">-</text>
								<text>{{tools.formatNumber(item.max_cny)}}</text>
								<text class="ml-1">CNY</text>
							</view>
						</view>
						<view class="right flex items-center">
							<view class="price">{{item.price}} CNY</view>
						</view>
					</view>
					<view class="flex justify-between items-center mt-[40rpx]">
						<com-c2c-payments :list="item.payments"></com-c2c-payments>
						<view class="data-list_item_status">
							购买中
						</view>
					</view>
				</view>
			</view>
		</view>

		
	</view>
</template>

<script setup>
	import tools from '@/utils/tools';
</script>
<script>
	import {
		getC2CList
	} from '@/config/api';

	export default {
		name: "com-c2c-manager-buy",
		data() {
			return {
				dataList: []
			};
		},
		mounted() {
			uni.$on('onShow', () => {
				this.getDataList();
			})
			this.getDataList();
		},
		methods: {
			rowClick(item) {
				tools.navigateToWithEncode('/pages/market/shop/push', item)
			},
			getDataList(){
				getC2CList({
					type: 1
				}).then(res => {
					this.dataList = res
				})
			}
		},
		beforeDestroy() {
			uni.$off('onShow');
		}
	}
</script>

<style lang="scss" scoped>
	.tip-box {
		padding: 29rpx;		
		margin-top: 11rpx;
		
		&_row_txt {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 22rpx;
			color: #000000;
			opacity: 0.6;
		}
	}
	
	.data-list {
		&_item {
			width: 694rpx;
			height: 240rpx;
			background: #FFFFFF;
			box-shadow: 0px 8rpx 20rpx 0px rgba(202,202,202,0.3), 0px -8rpx 20rpx 0px rgba(202,202,202,0.3);
			border-radius: 8rpx;
			margin: 0 auto;
			margin-bottom: 40rpx;
			
			&_content {
				padding: 32rpx;
			}
			
			.amount {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 22rpx;
				color: #000000;
				opacity: 0.6;
			}
			.value {
				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 24rpx;
				color: #000000;
				
				margin-left: 20rpx;
			}
			.price {
				font-family: Gilroy-Bold;
				font-weight: bold;
				font-size: 30rpx;
				color: #00C688;
			}
			
			&_status {
				width: 146rpx;
				height: 56rpx;
				background: #00C688;
				border-radius: 8rpx;
				
				display: flex;
				align-items: center;
				justify-content: center;
				
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 28rpx;
				color: #FFFFFF;
				// line-height: 70rpx;
			}
		}
		
		padding-bottom: 100rpx;
	}
</style>