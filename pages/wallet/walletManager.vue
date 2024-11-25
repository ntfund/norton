<template>
	<view>
		<!-- <uni-nav-bar :fixed="true" :border="false" left-icon="left" :right-text="rightText" backgroundColor="#F8F8F8"
			status-bar :title="title" @clickLeft="tools.navigateBack()" @clickRight="rightClick">
		</uni-nav-bar> -->
		<com-nav-bar title="管理钱包" right="添加" @clickRight="show = true"></com-nav-bar>
		<view class="pop-content">
			<view class="pop-content_body">
				<view
					class="w-[150rpx] flex flex-col items-center bg-gray-100 h-[100vh] overflow-hidden  justify-items-start">
					<view class="mb-2 p-4" :class="{'active': item.id == selectedChain.id}" v-for="item in chainList"
						@click="chainClick(item)">
						<image :src="selectedChain.id == item.id ? item.img : item.img2" mode="aspectFit"
							style="width: 84rpx; height: 84rpx;"></image>
					</view>
				</view>
				<view class="pop-content_body_right">
					<view class="pop-content_body_right_top">
						<view class="name">{{selectedChain.name}}</view>
						<view class="add"></view>
					</view>
					<scroll-view class="pop-content_body_right_scroll-view" scroll-y="true" upper-threshold="50">
						<view class="pop-content_body_right_scroll-view_item" :class="'card'+selectedChain.id"
							v-for="item in wallets" @click="walletClick(item)">
							<view
								class="pop-content_body_right_scroll-view_item_row-1 flex align-center justify-between">
								<view class="name flex align-center">
									<view class="symbol">{{item.name}}</view>
									<view class="current" v-if="item.selected == 1">
										当前</view>
								</view>
								<view class="amount flex align-center">
									<com-balance :address="item.address" :chain="selectedChain"></com-balance>
									<span class="ml-[5rpx]">{{selectedChain.symbol}}</span>
								</view>
							</view>
							<view class="pop-content_body_right_scroll-view_item_row-2 flex justify-between items-end">
								<view class="flex justify-between items-end">
									<view class="address">{{tools.hideAccount(item.address, 15, 6)}}</view>
									<view class="copy" @click.stop="tools.copyClick(item.address)">
										<image src="@/static/images/wallet/copy@2x.png" mode="aspectFit"
											style="width: 23rpx; height: 23rpx;"></image>
									</view>									
								</view>
								<view class="more">
									<view>
										详情
									</view>
									<image src="@/static/images/wallet/arrow-right@2x.png" mode="aspectFit" style="width: 8rpx; height: 14rpx;"></image>
								</view>
							</view>
						</view>
						<view class="h-[20rpx]"></view>
					</scroll-view>
				</view>
			</view>
		</view>
		<com-bottom-popup v-model:show="show" :data="['创建钱包','导入钱包']" @change="change"></com-bottom-popup>

	</view>
</template>

<script setup>
	import {
		onMounted,
		ref,
		toRaw,
		watchEffect
	} from 'vue';
	import chainList from '@/data/chainData';
	import tools from '@/utils/tools';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
	import dbWallet from '@/utils/dbWallet';

	const show = ref(false);
	const walletStore = useWalletStore();
	const wallets = ref([])

	const selectedChain = ref(chainList.find(x => x.id == walletStore.chain.id))

	//获取钱包
	const getWallets = async () => {
		wallets.value = await dbWallet.getWallets(selectedChain.value.id);
	}
	getWallets();

	//链选中
	const chainClick = (item) => {
		selectedChain.value = item
		getWallets();
	}
	
	const walletClick = (item) => {
		tools.navigateToWithEncodeMultiply("/pages/wallet/detail", {wallet: item, chain_id: selectedChain.value.id})
	}

	const change = (item, index) => {
		console.log(item)
		console.log(index)
		if ("创建钱包" == item) {
			tools.navigateTo("/pages/wallet/create/create", {
				chain_id: selectedChain.value.id
			})
		} else
		if ("导入钱包" == item) {
			tools.navigateTo("/pages/wallet/import", {
				chain_id: selectedChain.value.id
			})
		}
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
			border-top: 2rpx solid #EEEEEE;

			display: flex;
			justify-content: space-between;
			align-items: flex-start;

			&_left {
				width: 140rpx;
				// height: 860rpx;
				max-height: 910rpx;

				// padding-top: 31rpx;
				border-right: 1rpx solid #EEEEEE;

				// background: hotpink;

				&_item {
					width: 140rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					padding: 31rpx 0;
					position: relative;
					text-align: center;
				}

				&_active::after {
					content: '';
					position: absolute;
					width: 2rpx;
					height: 84rpx;
					background: #7F17FE;
					right: 0;
					top: 31rpx;
				}
			}

			&_right {
				flex: 1;
				flex-grow: 1;
				flex-shrink: 1;
				// background: green;
				padding: 0 30rpx 0 40rpx;

				&_top {
					padding-top: 39rpx;
					padding-bottom: 23rpx;

					.name {
						font-family: Gilroy-Bold;
						font-weight: bold;
						font-size: 32rpx;
					}
				}

				&_scroll-view {
					height: 796rpx;
					padding-bottom: 28rpx;

					&_item {
						// width: 100%;
						// height: 140rpx;
						margin-bottom: 20rpx;

						background: #7F17FE;
						border-radius: 16rpx;

						padding: 32rpx 33rpx 34rpx 22rpx;

						&_row-1 {
							.name {
								.symbol {
									font-family: Gilroy-Bold;
									font-weight: bold;
									font-size: 30rpx;
									color: #FFFFFF;
								}

								.current {
									width: 60rpx;
									height: 28rpx;
									background: #FFFFFF;
									border-radius: 8rpx;

									display: flex;
									align-items: center;
									justify-content: center;

									padding: 4rpx 11rpx;
									margin-left: 9rpx;

									font-family: SourceHanSansCN-Bold;
									font-weight: bold;
									font-size: 20rpx;
									color: #000000;
								}
							}

							.amount {
								font-family: Gilroy-Bold;
								font-weight: bold;
								font-size: 26rpx;
								color: #FFFFFF;
							}
						}

						&_row-2 {
							margin-top: 12rpx;
							.address {
								font-family: Gilroy-Medium;
								font-weight: 500;
								font-size: 24rpx;
								color: #999999;
							}
														
							.copy {
								margin-left: 16rpx;
							}
							
							.more {
								display: flex;
								justify-content: flex-end;
								align-items: center;
								
								
								font-family: SourceHanSansCN-Regular;
								font-weight: 400;
								font-size: 18rpx;
								color: #FFFFFF;
								opacity: 0.6;
								
								image {
									margin-left: 9rpx;
								}
							}
						}
					}
				}
			}
		}

		&_footer {
			height: 140rpx;
			// position: relative;
			// top: -100rpx;

			border-top: 2rpx solid #EDEDED;

			&_btns {
				// width: 100%;
				height: 88rpx;
				padding: 26rpx 28rpx;

				// background: green;

				display: flex;
				justify-content: space-between;
				align-items: flex-start;

				&_btn {
					width: 340rpx;
					height: 88rpx;
					margin: 0;

					display: flex;
					justify-content: center;
					align-items: center;

					border-radius: 44rpx;

					font-family: SourceHanSansCN-Bold;
					font-weight: bold;
					font-size: 34rpx;
					color: #FFFFFF;
				}

				&_btn1 {
					background: black;
				}

				&_btn2 {
					background: #7F17FE;
				}
			}
		}
	}

	.active {
		// background-color: #fff;
		// width: 100%;
		// text-align: center;
	}



	.card1 {
		background-color: #7F17FE;
		// color: #efefef;

		.name {
			.address {}
		}

		.amount {}
	}

	.card2 {
		background-color: #3c7195;
		color: #efefef;

		.name {
			.address {}
		}

		.amount {}
	}

	.card3 {
		background-color: #000;
		color: #f0b90b;

		.name {}

		.address {
			color: #9e7805;
		}

		.amount {}
	}

	.card4 {
		background-color: #9145ee;
		color: #fff;

		.name {}

		.address {
			color: #ccc;
		}

		.amount {}
	}


	.card5 {
		background-color: #000;
		color: #fff;

		.name {}

		.address {
			color: #ccc;
		}

		.amount {}
	}

	.card6 {
		background-color: #ac1b0a;
		color: #fff;

		.name {}

		.address {
			color: #ccc;
		}

		.amount {}
	}
</style>