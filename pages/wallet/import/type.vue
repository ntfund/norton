<template>
	<view>
		<com-nav-bar title="导入方式" border="true" backgroundColor="#fff"></com-nav-bar>
		<view class="list">
			<view class="list-item flex justify-between items-center" @click="importWallet('mnemonic')">
				<view class="left">
					<image src="@/static/images/wallet/word@2x.png" mode="aspectFit"
						style="width: 60rpx; height: 60rpx;"></image>
				</view>
				<view class="right flex-1 flex  justify-between items-center">
					<view class="flex flex-col">
						<view class="sub-title">助记词导入</view>
						<view class="sub-info">通过输入助记词或扫描二维码进行导入</view>
					</view>
					<view class="flex items-center justify-center">
						<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
							style="width: 12rpx; height: 20rpx;"></image>
					</view>
				</view>
			</view>
			<view class="list-item flex justify-between items-center" @click="importWallet('privateKey')">
				<view class="left">
					<image src="@/static/images/wallet/private@2x.png" mode="aspectFit"
						style="width: 60rpx; height: 60rpx;"></image>
				</view>
				<view class="right flex-1 flex  justify-between items-center">
					<view class="flex flex-col">
						<view class="sub-title">私钥导入</view>
						<view class="sub-info">通过输入明文私钥或扫描二维码进行导入</view>
					</view>
					<view class="flex items-center justify-center">
						<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
							style="width: 12rpx; height: 20rpx;"></image>
					</view>
				</view>
			</view>
			<view class="list-item flex justify-between items-center" @click="importWallet('keystore')">
				<view class="left">
					<image src="@/static/images/wallet/keystore@2x.png" mode="aspectFit"
						style="width: 60rpx; height: 60rpx;"></image>
				</view>
				<view class="right flex-1 flex  justify-between items-center">
					<view class="flex flex-col">
						<view class="sub-title">Keystore 导入</view>
						<view class="sub-info">通过输入助记词或扫描二维码进行导入</view>
					</view>
					<view class="flex items-center justify-center">
						<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
							style="width: 12rpx; height: 20rpx;"></image>
					</view>
				</view>
			</view>
			<view class="list-item flex justify-between items-center" @click="importWallet('sync')">
				<view class="left">
					<image src="@/static/images/wallet/sync@2x.png" mode="aspectFit"
						style="width: 60rpx; height: 60rpx;"></image>
				</view>
				<view class="right flex-1 flex  justify-between items-center">
					<view class="flex flex-col">
						<view class="sub-title">一键同步</view>
						<view class="sub-info">将其他网络钱包同步至本网络</view>
					</view>
					<view class="flex items-center justify-center">
						<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
							style="width: 12rpx; height: 20rpx;"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import tools from '@/utils/tools';
	
	const props = defineProps(["chain_id"])
	
	const importWallet = (type) => {
		if (type == "mnemonic") {
			tools.navigateTo('/pages/wallet/import?current=0&chain_id=' + props.chain_id)
		} else
		if (type == "privateKey") {
			tools.navigateTo('/pages/wallet/import?current=1&chain_id=' + props.chain_id)
		} else
		if (type == "keystore") {
			tools.navigateTo('/pages/wallet/import?current=2&chain_id=' + props.chain_id)
		} else
		if (type == "sync") {
			tools.navigateTo('/pages/wallet/import/sync?chain_id=' + props.chain_id)
		}
	}
</script>

<style lang="scss" scoped>
	.list {

		&-item {
			height: 140rpx;
			padding: 0 28rpx;

			// width: 750rpx;

			display: flex;

			justify-content: space-between;

			.right {
				border-bottom: 1rpx solid #eee;

				height: 140rpx;

				margin-left: 21rpx;
				padding-right: 5rpx;

				.sub-title {
					font-family: SourceHanSansCN-Medium;
					font-weight: 500;
					font-size: 32rpx;
					color: #000000;
				}

				.sub-info {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 24rpx;
					color: #000000;
					opacity: 0.6;

					margin-top: 14rpx;
				}
			}
		}
	}
</style>