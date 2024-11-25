<template>
	<view>
		<view class="item22">
			<view class="box" @tap="chooseVideo">
				<!-- <view class="iconfont icon-a-videogeneration" style="font-size: 32px;"></view> -->
				<image class="img" src="@/static/images/chat/video@2x.png" mode="aspectFit"></image>
			</view>
			<view class="name">视频</view>
		</view>
	</view>
</template>

<script setup>
	const emit = defineEmits(["selected"])
	const chooseVideo = () => {
		uni.chooseVideo({
			sourceType: ['camera', 'album'],
			success: function(res) {
				res.path = res.tempFilePath;
				emit("selected", res)
			}
		});
	}
</script>

<style lang="less">
	.item22 {
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		// width: 100%;
		// background: green;
		.box{
			// width: 18vw;
			// height: 18vw;
			width: 112rpx;
			height: 112rpx;
			background: #F2F2F2;
			border-radius: 38rpx;
			// border-radius: 20upx;
			display: flex;
			justify-content: center;
			align-items: center;
			// margin: 3vw 3vw 2vw 3vw;
			.icon{
				font-size: 70upx;
			}
			
			.img {
				width: 40rpx;
				height: 40rpx;
			}
		}
		
		.name {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 24rpx;
			color: #000000;
			margin-top: 16rpx;
		}
	}
</style>