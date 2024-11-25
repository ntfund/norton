<template>
	<u-popup :safeAreaInsetBottom="false" :safeAreaInsetTop="false" mode="bottom" zIndex="9999999"
	 :show="show" @close="close" :round="24" :duration="150">
		<view class="pop-content">
			<view class="title">
				<view class="title_left">
					创建或者导入钱包
				</view>
				<view class="title_close" @click="close">
					<image src="@/static/images/wallet/close@2x.png" mode="aspectFit"
						style="width: 27rpx; height: 27rpx;"></image>
				</view>
			</view>
			<view class="pop-content_body">
				<view class="pop-content_body_row-item" @click="rowClick(0)">
					<view class="pop-content_body_row-item_left">
						<image src="@/static/images/wallet/wallet_add@3x@2x.png" mode="aspectFit" style="width: 36rpx; height: 40rpx;"></image>
					</view>
					<view class="pop-content_body_row-item_middle flex-1">
						<view class="pop-content_body_row-item_middle_title">创建新钱包</view>
						<view class="pop-content_body_row-item_middle_info">
							<view>系统自动创建新的助记词钱包，请及时备份确保</view>
							<view>您的资金安全</view>
						</view>
					</view>
					<view class="pop-content_body_row-item_right">
						<image src="@/static/images/explore/arrow-right@2x.png" mode="aspectFit" style="width: 15rpx; height: 24rpx;"></image>
					</view>
				</view>
				<view class="pop-content_body_row-item" @click="rowClick(1)">
					<view class="pop-content_body_row-item_left">
						<image src="@/static/images/wallet/wallet_add@3x@2x.png" mode="aspectFit" style="width: 36rpx; height: 40rpx;"></image>
					</view>
					<view class="pop-content_body_row-item_middle flex-1">
						<view class="pop-content_body_row-item_middle_title">导入钱包</view>
						<view class="pop-content_body_row-item_middle_info">
							<view>通过助记词、私钥或者 <span class="font-[Gilroy-Regular]">Keystore</span> 导入钱包</view>
						</view>
					</view>
					<view class="pop-content_body_row-item_right">
						<image src="@/static/images/explore/arrow-right@2x.png" mode="aspectFit" style="width: 15rpx; height: 24rpx;"></image>
					</view>
				</view>
			</view>			
		</view>
	</u-popup>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import chainList from '@/data/chainData';
	import tools from '@/utils/tools';
	
	
	const props = defineProps(['show'])
	const emit = defineEmits(['update:show', "change"]);
	
	
	const close = () => {
		console.log('close')
		emit('update:show', false);
	}
	
	
	const rowClick = (index) => {
		emit('change', index)
		close()
	}
	
</script>

<style lang="scss" scoped>
	.pop-content {
		width: 750rpx;
		// height: 1172rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		
	
		.title {
			padding: 44rpx 29rpx 39rpx 28rpx;
	
			display: flex;
			justify-content: space-between;
			align-items: center;
	
			&_left {
				font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 38rpx;
			}
	
			&_close {}
		}
	
		&_body {
			// border-top: 2rpx solid #EEEEEE;
			// padding-top: 10rpx;
			padding-bottom: 47rpx;
	
			&_row-item {
				// width: 694rpx;
				// height: 160rpx;
				background: #F8F8F8;
				border-radius: 16rpx;
				margin: 20rpx;
				padding: 32rpx;
				
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				&_left {
					
				}
				&_middle {
					display: flex;
					flex-direction: column;
					margin-left: 44rpx;
					margin-right: 44rpx;
										
					
					text-align: left;
					
					&_title {
						font-family: SourceHanSansCN-Bold;
						font-weight: bold;
						font-size: 30rpx;
						color: #000000;
					}
					&_info {
						font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 22rpx;
						color: #999999;
						
						margin-top: 10rpx;
					}
				}
				&_right {
					
				}
			}
		}
	}
	
</style>