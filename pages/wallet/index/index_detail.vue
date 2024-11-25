<template>
	<view class="detail">
		<view class="flex justify-between align-center detail_row1">
			<view class="flex align-center">
				<view>
					总资产
				</view>
				<view class="flex items-center">
					<image src="@/static/images/wallet/zhenyan-white@2x.png" mode="aspectFit"
						style="width: 26rpx; height: 15rpx; margin-left: 17rpx;" v-if="!showBalance"
						@click="swtichShow('open')"></image>
					<image src="@/static/images/wallet/biyan2@2x.png" mode="aspectFit"
						style="width: 26rpx; height: 26rpx; margin-left: 17rpx;" v-else @click="swtichShow('close')">
					</image>
				</view>
			</view>
			<view class="flex align-center" @click="walletClick()">
				<view class="detail_row1_more">
					详情
				</view>
				<view class="flex items-center">
					<image src="@/static/images/wallet/arrow-right-white@2x.png" mode="aspectFit"
						style="width: 6rpx; height: 10rpx; margin-left: 6rpx;"></image>
				</view>
			</view>
		</view>
		<view class="detail_row2">
			<view class="flex justify-center" v-if="showBalance">
				<view class="detail_row2_dollar mr-[10rpx]">
					{{appStore.unit == "CNY" ? '￥' : '$'}}
				</view>
				<view class="detail_row2_amount">
					{{appStore.unit == "CNY" ? tools.USDT2CNY(balance, 2) : tools.unitConverter(balance, 2)}}
				</view>
			</view>
			<view class="detail_row2_hide_amount flex justify-center items-start" v-else>
				*****
			</view>
		</view>
		<view class="detail_options">
			<view class="options_item options_item_border" @click="gridClick(0)">
				<image class="options_item_img" src="@/static/images/wallet/i-transfer(8)@2x.png" mode="aspectFit"
					style="width: 26rpx; height: 26rpx;"></image>
				<view class="options_item_txt">转账</view>
			</view>
			<view class="options_item options_item_border" @click="gridClick(1)">
				<image class="options_item_img" src="@/static/images/wallet/i-receiver@2x.png" mode="aspectFit"
					style="width: 26rpx; height: 26rpx;"></image>
				<view class="options_item_txt">收款</view>
			</view>
			<view class="options_item options_item_border" @click="gridClick(2)">
				<image class="options_item_img" src="@/static/images/wallet/i-shan@2x.png" mode="aspectFit"
					style="width: 26rpx; height: 26rpx;"></image>
				<view class="options_item_txt">闪兑</view>
			</view>
			<view class="options_item" @click="gridClick(3)">
				<image class="options_item_img" src="@/static/images/wallet/i-c2c@2x.png" mode="aspectFit"
					style="width: 26rpx; height: 26rpx;"></image>
				<view class="options_item_txt">C2C</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import tools from '@/utils/tools';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
	import {
		ref
	} from 'vue';
	import {
		useAppStore
	} from '@/stores/modules/app';

	const props = defineProps(["balance"])
	const walletStore = useWalletStore()
	const appStore = useAppStore();

	const showBalance = ref(true)
	
	if (uni.getStorageSync('showAsset')) {
		showBalance.value = uni.getStorageSync('showAsset') == 'open'
	}

	const swtichShow = (value) => {
		showBalance.value = value == 'open';
		uni.setStorageSync('showAsset', value)
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

	const walletClick = () => {
		tools.navigateToWithEncodeMultiply("/pages/wallet/detail", {
			wallet: walletStore.wallet,
			chain_id: walletStore.chain.id
		})
	}

	uni.$on('scan', (data) => {
		gridClick(0)
	})
</script>

<style lang="scss" scoped>
	.detail {
		width: 694rpx;
		height: 268rpx;
		position: relative;

		margin: 0 auto;

		background: url('/static/images/wallet/asset-bg@2x.png');
		background-size: 100% 100%;

		border-radius: 16rpx;

		color: #fff;

		&_row1 {
			padding: 38rpx 24rpx;
			display: flex;
			align-items: center;

			font-size: 24rpx;
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;

			&_more {
				font-size: 20rpx;
			}
		}

		&_row2 {
			position: relative;

			&_dollar {
				font-family: DIN-Bold;
				font-weight: 400;
				font-size: 30rpx;
			}

			&_amount {
				font-family: DIN-Bold;
				font-weight: 400;
				font-size: 60rpx;

				position: relative;
				top: -27rpx;
			}

			&_hide_amount {
				font-family: DIN-Bold;
				font-weight: 400;
				font-size: 60rpx;

				height: 24rpx;
				position: relative;
				top: -27rpx;
			}
		}

		&_options {

			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;

			background: #8E55DC;
			height: 80rpx;

			display: grid;
			grid-template-columns: repeat(4, 1fr);

			border-radius: 0px 0px 16rpx 16rpx;



			.options_item {
				display: flex;
				align-items: center;
				justify-content: center;


				&_txt {
					margin-left: 18rpx;

					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 24rpx;
				}
			}

			.options_item_border {
				position: relative;
			}

			.options_item_border::after {
				content: '';
				width: 2rpx;
				height: 30rpx;
				position: absolute;
				right: 0;
				background: #fff;
				opacity: 0.2;
			}
		}
	}
</style>