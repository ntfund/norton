<template>
	<view>
		<com-nav-bar title="闪兑"></com-nav-bar>
		<view class="swap-content">
			<view class="content">
				<view class="content_row1 flex justify-between items-center">
					<view class="left flex items-center">
						<view>
							<image src="@/static/images/wallet/send@2x.png" mode="aspectFit"
								style="width: 26rpx; height: 21rpx;"></image>
						</view>
						<view class="font-[SourceHanSansCN-Regular] text-[24rpx] text-[#999] ml-[16rpx]">
							发送币种
						</view>
					</view>
					<view class="right flex items-center">
						<span class="right_1">可用余额：</span> <span class="right_2">0.00</span>
					</view>
				</view>
				<view class="content_bg mt-[22rpx]">
					<view class="content_bg_row1 flex items-center justify-between">
						<view class="content_bg_row1_left flex items-center">
							<view class="left">
								<image src="@/static/img/chain/nrt-on.png" mode="aspectFit"
									style="width: 62rpx; height: 62rpx;"></image>
							</view>
							<view class="right flex flex-col items-start">
								<view class="flex right_name items-center items-center">
									<view class="right_symbol">NRT</view>
									<view class="right_icon iconfont icon-arrow-down-filling"></view>
								</view>
								<view class="right_tag">
									NRT20
								</view>
							</view>
						</view>
						<view class="content_bg_row1_right">
							<input class="content_bg_row1_right_input" placeholder="消耗数量" type="digit"
								value="">
						</view>
					</view>
				</view>
				<view class="content_bg_row2 flex items-center justify-end">
					<view class="content_bg_row2_tag content_bg_row2_clear">Clear</view>
					<view class="content_bg_row2_tag content_bg_row2_max">Max</view>
				</view>
				<view class="mt-[61rpx] flex justify-center">
					<image src="@/static/images/wallet/change@2x.png" mode="aspectFit"
						style="width: 34rpx; height: 36rpx;"></image>
				</view>
				<view class="content_row1 flex justify-between items-center mt-[19rpx]">
					<view class="left flex items-center">
						<view>
							<image src="@/static/images/wallet/receive@2x.png" mode="aspectFit"
								style="width: 25rpx; height: 28rpx;"></image>
						</view>
						<view class="font-[SourceHanSansCN-Regular] text-[24rpx] text-[#999] ml-[16rpx]">
							接收（预估）
						</view>
					</view>
				</view>
				<view class="content_bg mt-[22rpx]">
					<view class="content_bg_row1 flex items-center justify-between">
						<view class="content_bg_row1_left flex items-center">
							<view class="left">
								<image src="@/static/images/wallet/no-select@2x.png" mode="aspectFit"
									style="width: 64rpx; height: 64rpx;"></image>
							</view>
							<view class="right flex  items-start">
								<view class="flex items-center items-center">
									<view class="right_select">选择</view>
									<view class="right_icon right_select_down iconfont icon-arrow-down-filling "></view>
								</view>
							</view>
						</view>
						<!-- <view class="content_bg_row1_left flex items-center">
							<view class="left">
								<image src="@/static/img/chain/nrt-on.png" mode="aspectFit"
									style="width: 62rpx; height: 62rpx;"></image>
							</view>
							<view class="right flex flex-col items-start">
								<view class="flex right_name items-center items-center">
									<view class="right_symbol">NRT</view>
									<view class="right_icon iconfont icon-arrow-down-filling"></view>
								</view>
								<view class="right_tag">
									BEP20
								</view>
							</view>
						</view> -->
						<view class="content_bg_row1_right">
							<input class="content_bg_row1_right_input" placeholder="接收数量" type="digit"
								value="">
						</view>
					</view>
					<view class="content_bg_row2 content_bg_row2_input flex items-center justify-between">
						<view>
							<input class="content_bg_row2_input_input" type="text" placeholder="接收地址">
						</view>
						<view class="flex items-center">
							<view class="close">
								<image src="@/static/images/wallet/close2@2x.png" mode="aspectFit" style="width: 34rpx; height: 34rpx;"></image>
							</view>
							<view class="shu"></view>
							<view class="ml-[26rpx] mr-[31rpx]">
								<image src="../../static/images/wallet/wallet@2x.png" mode="aspectFit" style="width: 42rpx; height: 38rpx;"></image>
							</view>
						</view>
					</view>
					<view class="content_bg_row3_tip">
						接收地址请勿填写交易所账号
					</view>
				</view>
			</view>
		</view>
		
		<view class="btn-bottom">
			<button type="button" class="n-btn disabled" disabled @click="submit">确认兑换</button>
		</view>
	</view>
</template>
<script setup>
	import {
		reactive,
		ref
	} from 'vue';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
	
	const walletStore = useWalletStore();
	
	const submit = () => {
		
	}
</script>


<style lang="scss" scoped>
	page {}

	.swap-content {
		width: 694rpx;
		// height: 790rpx;
		margin: 34rpx 28rpx;
		box-shadow: 0px 8rpx 20rpx 0px rgba(202, 202, 202, 0.3);
		border-radius: 8rpx;

		.content {
			padding: 32rpx;

			&_bg {
				background: #F8F8F8;
				border-radius: 8rpx;
				padding: 15rpx 20rpx;

				&_row1 {
					&_left {
						background: #fff;
						width: 240rpx;
						height: 94rpx;
						border-radius: 8rpx;
						padding: 16rpx 20rpx;

						align-items: center;
						;


						.left {

							width: 62rpx;
							height: 62rpx;
						}

						.right {
							margin-left: 23rpx;


							&_name {
								height: 25rpx;
								// background: green;
								position: relative;
								bottom: 5rpx;
							}

							&_select {
								font-family: SourceHanSansCN-Bold;
								font-weight: bold;
								font-size: 32rpx;
								color: #000000;
							}
							&_select_down {
								margin-left: 32rpx !important;
							}
							
							&_symbol {

								font-family: SourceHanSansCN-Regular;
								font-weight: 500;
								font-size: 32rpx;

							}

							&_icon {
								margin-left: 11rpx;
								font-size: 18rpx;
							}

							&_tag {
								font-family: Gilroy-Medium;
								font-weight: 500;
								font-size: 22rpx;
								color: #7F17FE;

								height: 17rpx;

							}
						}
					}

					&_right {
						&_input {
							height: 100rpx;

							text-align: right;

							font-family: Gilroy-Medium;
							font-weight: 500;
							font-size: 36rpx;
							color: #000000;
						}
					}
				}

				&_row2 {
					margin-top: 22rpx;

					&_tag {
						width: 104rpx;
						height: 42rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						border-radius: 8px;

						font-family: Gilroy-Medium;
						font-weight: 500;
						font-size: 22rpx;
					}

					&_clear {
						background: #FEDADE;
						color: #FC465C;

					}

					&_max {
						background: #E5D1FF;
						color: #7F17FE;

						margin-left: 20rpx;
					}
					
					
					
					.shu {
						width: 1rpx;
						height: 40rpx;
						background: #EEEEEE;
						margin-left: 12rpx;
					}
					
					&_input {
						background: #fff;
						height: 90rpx;
						border-radius: 8rpx;
						
						&_input {
							margin-left: 20rpx;
							
							font-family: Gilroy-Medium;
							font-weight: 400;
							font-size: 28rpx;
							color: #000000;
							
							width: 412rpx;
						}
					}
				}
				
				&_row3_tip {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 22rpx;
					color: #FC465C;
					
					margin-top: 17rpx;
				}
				
				
			}

			&_row1 {

				.right {
					&_1 {
						font-family: SourceHanSansCN-Regular;
					}

					&_2 {
						font-family: Gilroy-Regular;
						font-weight: 400;
						font-size: 24rpx;
						color: #000000;
					}
				}
			}

			&_from {}
		}
	}
</style>