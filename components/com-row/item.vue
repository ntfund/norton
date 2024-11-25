<template>
	<view class="row-item">
		<view class="row-item_container" :class="{'row-item_border_bottom': border}">
			<view class="row-item_left">
				{{left}}
			</view>
			<view class="row-item_right">
				<view class="row-item_right_len" v-if="len">{{len}}</view>
				<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit" style="width: 12rpx; height: 20rpx;"></image>
			</view>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps(["left", "right", "border", "len"])
</script>

<style lang="less" scoped>
	.row-item {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		background: #fff;
		
		&_container {
			flex: 1;
			height: 100%;
			padding: 0 30rpx;
			// padding-right: 35rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		
		&_left {
			
		}
		
		&_right {
			display: flex;
			align-items: center;
			
			&_len {
				width: 48rpx;
				height: 30rpx;
				background: #FC465C;
				border-radius: 15rpx;
				
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				
				font-family: DIN-Bold;
				font-weight: 400;
				font-size: 20rpx;
				color: #FFFFFF;
				// line-height: 106px;
				
				margin-right: 20rpx;
			}
		}
		
		&_border_bottom {
			border-bottom: 1rpx solid #eee;
		}
	}
	
	
</style>