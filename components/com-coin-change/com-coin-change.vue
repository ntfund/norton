<template>
	<view>
		<view class="flex item-box">
			<image src="@/static/images/home/coin@2x.png" mode="aspectFit" style="width: 136rpx; height: 136rpx; margin-left: 22rpx; margin-top: 14rpx;"></image>
			<view class="fast-buy-box">
				<view class="fast-buy">快捷买币</view>
				<view class="fast-info-box">
					<view class="fast-info">支持银行卡转账等交易方式</view>
					<view class="qu">
						<view class="qu-info">去购买</view>
						<image mode="aspectFit" src="@/static/images/home/yindaoxian@2x.png" style="width: 31rpx; height: 9rpx;"></image>
					</view>
				</view>
				
			</view>
			
		</view>
	</view>
</template>

<script lang="ts" setup>
	
</script>

<style lang="scss" scoped>
	.item-box {		
		width: 694rpx;
		height: 150rpx;
		margin: 48rpx 28rpx 0 28rpx;
		
		background: #FFFFFF;
		box-shadow: 0px 8rpx 20rpx 0px rgba(202,202,202,0.3);
		border-radius: 8rpx;
		position: relative;
		
		// background: yellowgreen;
		
		.fast-buy-box {
			display: flex;
			flex-direction: column;
			margin-left: 23rpx;
			// margin-top: 44rpx;
			height: 136rpx;
			margin-top: 14rpx;
			// background: green;
			flex: 1;
			
			.fast-buy{
				font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 30rpx;
				color: #000000;
				margin-top: 30rpx;
			}
			
			
			.fast-info-box {
				margin-top: 11rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.fast-info {
					font-family: SourceHanSansCN-Medium;
					font-weight: 500;
					font-size: 22rpx;
					color: #000000;
					opacity: 0.6;					
				}
				
				
				.qu {
					display: flex;
					align-items: center;
					margin-right: 44rpx;
					height: 18rpx;
					
					.qu-info {
						font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 18rpx;
						color: #000000;
						opacity: 0.6;
						
						margin-right: 10rpx;
					}
				}
			}
			
		} 
		
	
		
		
		
	}
</style>