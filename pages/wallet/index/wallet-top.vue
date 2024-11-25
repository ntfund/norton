<template>
	<view class="header-root">
		<view class="header-root_top1">
			<view class="content">
				<view class="top">
					<view class="left" @click="emit('clickLeft')">
						<view class="img">
							<!-- <image src="@/static/images/chains/bnb_selected@2x.png" mode="aspectFit"
								style="width: 70rpx; height: 70rpx; border-radius: 50%;"></image> -->
								<image :src="walletStore.chain.img" mode="aspectFit"
									style="width: 70rpx; height: 70rpx; "></image>
						</view>
						<view class="name">{{walletStore.chain.name}}</view>
						<image src="@/static/images/wallet/Rectangle 22@2x.png" mode="aspectFit"
							style="width: 24rpx; height: 15rpx; border-radius: 50%;"></image>
					</view>
					<view class="right" @click="clickRight">
						<image src="@/static/images/wallet/scan@2x.png" mode="aspectFit"
							style="width: 34rpx; height: 34rpx; margin-right: 1rpx;"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="header-root_top2 relative">
			<view class="flex flex-col justify-center items-center pt-[121rpx]">
				<view class="flex items-center" @click="showBalance = !showBalance">
					<view class="font-[SourceHanSansCN-Regular] text-[24rpx] text-[#fff] mr-[9rpx]">总资产</view>
					<uni-icons type="eye-filled" size="20" color="#fff" v-if="showBalance"></uni-icons>
					<uni-icons type="eye-slash-filled" size="20" color="#fff" v-else></uni-icons>
				</view>
				<view class="balance">
					<view v-if="showBalance">${{tools.unitConverter(balance, 2)}}</view>
					<view v-else class="relative ">******</view>
				</view>
			</view>
			<view class="layout">
				<view class="grid-item" v-for="(item, index) in list" :key="index" @click="gridClick(index)">
					<image :src="item.src" mode="aspectFit" style="width: 98rpx; height: 98rpx;"></image>
					<text class="item-text">{{item.title}}</text>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from 'vue';
	import tools from '@/utils/tools';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
	const walletStore = useWalletStore()
	
	const list = [{
			src: '/static/images/wallet/transfer@2x.png',
			title: '转账'
		},
		{
			src: '/static/images/wallet/shoukuan@2x.png',
			title: '收款'
		},
		{
			src: '/static/images/wallet/shandui@2x.png',
			title: '闪兑'
		},
		{
			src: '/static/images/wallet/c2c@2x.png',
			title: 'C2C'
		},
	]
	
	const emit = defineEmits(['clickLeft', 'clickRight'])
	
	const showBalance = ref(false)
	const balance = ref(0)
	
	const clickRight = () => {
		emit('clickRight');
		
		console.log("right left")
		uni.scanCode({
			success: function(res) {
				console.log('条码类型：' + res.scanType);
				console.log('条码内容：' + res.result);
				if (res.scanType == "QR_CODE" && res.result.startsWith("ethereum:0x"))
				{
					gridClick(0)
				}				
			}
			
		});
	}
	
	const gridClick = (index) => {
		if (index == 0) {
			//转账
			// tools.navigateTo('/pages/wallet/transfer')
			uni.navigateTo({
				url: '/pages/wallet/transfer?address='
			})
		} else if (index == 1) {
			//收款
			// tools.navigateTo('/pages/wallet/receiver', {
			// 	account: this.wallet.account
			// })
			uni.navigateTo({
				url: '/pages/wallet/receiver'
			})
		} else if (index == 2) {
			//闪兑
			tools.navigateTo('/pages/wallet/swap')
		} else if (index == 3) {
			//购买
			tools.navigateTo('/pages/market/market')
		}
	}
	
</script>

<style lang="scss" scoped>
	.header-root {
		width: 750rpx;
		height: 744rpx;

		&_top1 {
			width: 750rpx;
			height: 200rpx;
			background: url('/static/images/wallet/top1@2x.png') no-repeat;
			background-size: 100% 100%;

			.content {
				position: fixed;
				left: 0;
				top: 0;
				z-index: 9999;
				width: 750rpx;
				height: 200rpx;

				display: flex;


				.top {
					width: 100%;

					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					padding: 0 28rpx;
					padding-bottom: 20rpx;

					.left {
						display: flex;
						align-items: center;

						.img {
							width: 70rpx;
							height: 70rpx;
							// border-radius: 50%;

							// background: green;
						}

						.name {
							font-family: SourceHanSansCN-Regular;
							font-weight: 400;
							font-size: 32rpx;
							color: #FFFFFF;

							margin-left: 20rpx;
							margin-right: 17rpx;
						}
					}
				}
			}


		}

		&_top2 {
			width: 750rpx;
			height: 544rpx;
			background: url('/static/images/wallet/top2@2x.png') no-repeat;
			background-size: 100% 100%;
			margin-top: -2rpx;

			.balance {
				font-family: DIN-Bold;
				font-weight: 400;
				font-size: 60rpx;
				color: #FFFFFF;

				margin-top: 33rpx;
			}
		}
	}


	.grid-item {

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.item-text {
			// font-size: 24rpx;
			margin-top: 12rpx;
			// margin-bottom: 49rpx;
			white-space: nowrap;

			// font-family: Source Han Sans CN;
			font-family: SourceHanSansCN-Regular;
			font-weight: 550;
			font-size: 24rpx;
			color: #fff;
		}
	}

	.layout {
		// width: 750rpx;
		padding: 0 80rpx;
		// margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		row-gap: 49rpx;
		column-gap: 66rpx;
		
		position: absolute;
		left: 0;
		bottom: 51rpx;
	}
</style>