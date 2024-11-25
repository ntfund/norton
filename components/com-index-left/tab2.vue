<template>
	<view>
		<view class="content">
			<view class="list-title">
				验证方式
			</view>
			<view class="list-item">
				<view class="list-item_left">手机号码</view>
				<view class="list-item_right list-item_arrow">
					<view class="text-green" v-if="userStore.user.mobile">已认证</view>
					<view class="text-red" v-else>未认证</view>
				</view>
			</view>
			<view class="list-title list-title-border">
				基础安全设置
			</view>
			<view class="list-item">
				<view class="list-item_left">资金密码</view>
				<view class="list-item_right list-item_arrow">
					<view></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { useUserStore } from '@/stores/modules/user';
import {
		useWalletStore
	} from '@/stores/modules/wallet';
	import tools from '@/utils/tools';
	const walletStore = useWalletStore();
	const userStore = useUserStore();
</script>

<style lang="scss" scoped>
	.content {
		// padding-top: 34rpx;
		
		.list-title {
			padding: 32rpx 29rpx;
			font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 36rpx;
			color: #000000;
			
			&-border {
				border-top: 1rpx solid #EEEEEE;;
			}
		}
		
		.list-item {
			display: flex;
			justify-content: space-between;
			align-items: center;

			// padding: 35rpx 33rpx 34rpx 31rpx;
			padding: 0 33rpx 0 31rpx;
			height: 100rpx;

			&_left {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 32rpx;
				color: #000000;
			}

			&_right {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 28rpx;
				color: #999;

				display: flex;
				justify-content: center;
				align-items: center;
			}

			&_arrow::after {
				content: '';
				background: url('/static/images/home/arrow-right@2x.png') no-repeat;
				background-size: 12rpx 20rpx;

				width: 12rpx;
				height: 20rpx;
				margin-left: 16rpx;

			}
		}
	}
	

</style>