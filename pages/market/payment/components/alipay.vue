<template>
	<view class="box">
		<view class="box_content flex flex-col justify-between flex-1">
			<view class="box_content_row1 flex items-center justify-between">
				<image class="box_content_row1_logo" src="@/static/images/c2c/payments/alipay@2x.png" mode="aspectFit"
					style="width: 54rpx; height: 54rpx;"></image>
				<view class="box_content_row1_name flex-1">
					支付宝
				</view>
				<view class="flex items-center">
					<view class="box_content_row1_more">查看详情</view>
					<image src="@/static/images/c2c/payments/arrow-right@2x.png" mode="aspectFit"
						style="width: 10rpx; height: 16rpx;"></image>
				</view>
			</view>
			<view class="box_content_footer">
				<view class="box_content_footer_account"> {{data.account}} </view>
				<view class="box_content_footer_number flex">
					{{data.number}}
				</view>
			</view>
		</view>
		<image class="img" src="@/static/images/c2c/payments/transfer@2x.png" mode="aspectFit" style="width: 33rpx; height: 7rpx;"></image>
	</view>
</template>

<script setup>
	import tools from '@/utils/tools';
	const props = defineProps(["data"])
</script>

<style lang="scss" scoped>
	.box {
		width: 694rpx;
		height: 224rpx;
		margin: 0 auto;

		margin-bottom: 50rpx;

		background: url('/static/images/c2c/payments/alipay_bg@2x.png');
		background-size: 694rpx 224rpx;

		display: flex;
		
		position: relative;

		&_content {
			padding: 31rpx;


			&_row1 {
				&_name {
					font-family: SourceHanSansCN-Medium;
					font-weight: 500;
					font-size: 32rpx;
					color: #FFFFFF;

					margin-left: 23rpx;
				}

				&_more {
					font-family: SourceHanSansCN-Medium;
					font-weight: 500;
					font-size: 20rpx;
					color: #FFFFFF;

					margin-right: 10rpx;
				}
			}


			&_footer {
				&_account {
					font-family: SourceHanSansCN-Medium;
					font-weight: 500;
					font-size: 24rpx;
					color: #FFFFFF;
				}

				&_number {
					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 24rpx;
					color: #FFFFFF;
					
					margin-top: 10rpx;
				}
			}
		}
		
		.img {
			position: absolute;
			right: 31rpx;
			bottom: 34rpx;
		}
	}
</style>