<template>
	<view>
		<view class="welcome">
			<view class="flex items-center">
				<view class="welcome_title">欢迎来到</view>
				<image src="@/static/images/login/norton@2x.png" mode="aspectFit" style="width: 251rpx; height: 37rpx;">
				</image>
			</view>
			<view class="welcome_sub_title">请选择创建新钱包或者通过助记词导入钱包</view>
			<view>
				<image class="welcome_img" src="@/static/images/login/norton_welcome@2x.png" mode="aspectFit"
					style="width: 396rpx; height: 385rpx;"></image>
			</view>
		</view>
		<view class="pop-content_body">
			<view class="pop-content_body_row-item" @click="create()">
				<view class="pop-content_body_row-item_left">
					<image src="@/static/images/wallet/wallet_add@3x@2x.png" mode="aspectFit"
						style="width: 36rpx; height: 40rpx;"></image>
				</view>
				<view class="pop-content_body_row-item_middle flex-1">
					<view class="pop-content_body_row-item_middle_title">创建新钱包</view>
					<view class="pop-content_body_row-item_middle_info">
						<view>系统自动创建新的助记词钱包，请及时备份确保</view>
						<view>您的资金安全</view>
					</view>
				</view>
				<view class="pop-content_body_row-item_right">
					<image src="@/static/images/explore/arrow-right@2x.png" mode="aspectFit"
						style="width: 15rpx; height: 24rpx;"></image>
				</view>
			</view>
			<view class="pop-content_body_row-item" @click="importWallet()">
				<view class="pop-content_body_row-item_left">
					<image src="@/static/images/wallet/wallet_add@3x@2x.png" mode="aspectFit"
						style="width: 36rpx; height: 40rpx;"></image>
				</view>
				<view class="pop-content_body_row-item_middle flex-1">
					<view class="pop-content_body_row-item_middle_title">导入钱包</view>
					<view class="pop-content_body_row-item_middle_info">
						<view>通过助记词、私钥或者 <span class="font-[Gilroy-Regular]">Keystore</span> 导入钱包</view>
					</view>
				</view>
				<view class="pop-content_body_row-item_right">
					<image src="@/static/images/explore/arrow-right@2x.png" mode="aspectFit"
						style="width: 15rpx; height: 24rpx;"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted
	} from 'vue';
	// import dbWallet from '@/utils/dbWallet';
	// onMounted(async () => {
	// 	const wallets = await dbWallet.getWallets(3);
	// 	if (wallets.length > 0) {
	// 		uni.switchTab({
	// 			url: '/pages/wallet/index'
	// 		})
	// 	}
	// })

	import chainData from '@/data/chainData';

	const create = () => {
		//创建新钱包
		uni.navigateTo({
			url: '/pages/wallet/create/create?chain_id=3&type=first'
		})
	}

	const importWallet = () => {
		//导入钱包
		uni.navigateTo({
			url: '/pages/wallet/import/type?chain_id=3&type=first'
		})
	}
</script>

<style lang="scss" scoped>
	.pop-content_body {
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

			&_left {}

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

			&_right {}
		}
	}

	.welcome {
		display: flex;
		flex-direction: column;
		align-items: center;

		margin-top: calc(165rpx + var(--status-bar-height));

		&_title {
			font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 48rpx;
			color: #0A0A0A;

			margin-right: 26rpx;
		}

		&_sub_title {
			font-family: SourceHanSansCN-Bold;
			font-weight: 400;
			font-size: 30rpx;
			color: #8D8D8D;

			margin-top: 10rpx;
		}

		&_img {
			margin-top: 181rpx;
			margin-bottom: 131rpx;
		}
	}
</style>