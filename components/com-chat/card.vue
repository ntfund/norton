<template>
	<view class="card">
		<view class="card_container">
			<view class="avatar">
				<image class="left" :src="project.getFullURL(data.avatar)" style="width: 100rpx; height: 100rpx;">
				</image>
				<view class="right flex flex-col">
					<view class="flex nickname">
						{{data.nickname}}
					</view>
					<view class="flex items-center uid">
						<view>
							UID
						</view>
						<view>
							{{data.uid}}
						</view>
					</view>
				</view>
			</view>
			<view class="footer">
				<view class="flex items-center">
					<image src="@/static/images/chat/emotionHappy@2x.png" mode="aspectFit" style="width: 24rpx; height: 24rpx;"></image>
					<text class="tuijian">推荐好友</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import project from '@/utils/project';

	const props = defineProps(["data"])
</script>

<style lang="scss" scoped>
	.card {
		width: 578rpx;
		height: 240rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		border: 4rpx solid #EEEEEE;

		&_container {
			padding: 16rpx 20rpx;
		}

		.avatar {
			padding: 38rpx 20rpx;
			padding-top: 26rpx;

			display: flex;
			align-items: center;
			
			.left {}

			.right {
				margin-left: 30rpx;
				
				.nickname {
					font-family: SourceHanSansCN-Heavy;
					font-weight: 800;
					font-size: 30rpx;
					color: #000000;
				}
				
				.uid {
					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 24rpx;
					color: #000000;
					opacity: 0.6;
					
					margin-top: 5rpx;
				}		
				
			}
			
			border-bottom:  2rpx solid #EEEEEE;;
		}
		
		.footer {
			
			margin-top: 19rpx;
			
			.tuijian {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 22rpx;
				color: #000000;
				opacity: 0.6;
				
				margin-left: 14rpx;
			}
		}
	}
</style>