<template>
	<view v-if="show">
		<u-popup :safeAreaInsetBottom="false" :safeAreaInsetTop="false" mode="bottom" :show="show"
			@close="close" @open="open" :round="24" :duration="200">
			<view class="pop-content">
				<view class="title">
					<view class="title_left">
						钱包列表
					</view>
					<view class="title_close" @click="close">
						<image src="@/static/images/wallet/close@2x.png" mode="aspectFit"
							style="width: 27rpx; height: 27rpx;"></image>
					</view>
				</view>
				<view class="pop-content_body">
					<scroll-view class="pop-content_body_left" scroll-y="true" upper-threshold="50">
						<view class="pop-content_body_left_item"
							:class="{'pop-content_body_left_active': item.id == selectedChain.id}"
							v-for="item in chainList" @click="chainClick(item)">
							<image :src="selectedChain.id == item.id ? item.img : item.img2" mode="aspectFit"
								style="width: 84rpx; height: 84rpx;"></image>
						</view>
					</scroll-view>
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
								<view
									class="pop-content_body_right_scroll-view_item_row-2 flex justify-between items-end">
									<view class="flex items-end">
										<view class="address">{{tools.hideAccount(item.address, 15, 6)}}</view>
										<view class="copy" @click.stop="tools.copyClick(item.address)">
											<image src="@/static/images/wallet/copy@2x.png" mode="aspectFit"
												style="width: 23rpx; height: 23rpx;"></image>
										</view>
									</view>
								</view>
							</view>
							<view class="h-[20rpx]"></view>
						</scroll-view>
					</view>
				</view>
				<view class="pop-content_footer">
					<view class="pop-content_footer_btns">
						<button type="button" class="pop-content_footer_btns_btn pop-content_footer_btns_btn1"
							@click="manager">管理钱包</button>
						<button type="button" class="pop-content_footer_btns_btn pop-content_footer_btns_btn2"
							@click="showAdd = true">添加钱包</button>
					</view>
				</view>
			</view>
		</u-popup>
		<manager-add v-model:show="showAdd" @change="addChange"></manager-add>		
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref,
		toRaw,
		watchEffect
	} from 'vue';
	import chainDataList from '@/data/chainData';
	import tools from '@/utils/tools';
	import managerAdd from './manager-add.vue';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
	import dbWallet from '@/utils/dbWallet';

	const props = defineProps(['show', 'chains'])
	const emit = defineEmits(['update:show', "change"]);
	const showAdd = ref(false);

	const walletStore = useWalletStore();

	const chainList = ref([]);
	const selectedChain = ref({name: ''})
	const init = () => {
		if (props.chains) {
			chainList.value = chainDataList.filter(x => props.chains.includes(x.id));
			selectedChain.value = chainList.value.find(x => x.id == props.chains[0])
		} else {
			chainList.value = chainDataList;
			selectedChain.value = chainList.value.find(x => x.id == walletStore.chain.id)
		}
	}

	const wallets = ref([])

	//获取钱包
	const getWallets = async () => {
		wallets.value = await dbWallet.getWallets(selectedChain.value.id);
	}

	//链选中
	const chainClick = (item) => {
		selectedChain.value = item
		getWallets();
	}

	//选中钱包
	const walletClick = async (item) => {
		close();
		await dbWallet.selectWallet(item, selectedChain.value.id)
	}

	//钱包管理
	const manager = () => {
		close();
		uni.navigateTo({
			url: '/pages/wallet/walletManager'
		})
	}
	//添加钱包
	const addChange = (index) => {
		close();
		if (index == 0) {
			//创建新钱包
			uni.navigateTo({
				url: '/pages/wallet/create/create?chain_id=' + selectedChain.value.id
			})
		} else if (index == 1) {
			//导入钱包			
			uni.navigateTo({
				url: '/pages/wallet/import/type?chain_id=' + selectedChain.value.id
			})
		}
	}

	const open = () => {
		console.log('open getWallets')
		// selectedChain.value = chainList.find(x => x.id == walletStore.chain.id)
		init();
		getWallets();
	}
	const close = () => {
		console.log('close')
		emit('update:show', false);
	}

	// onMounted(() => {
	// 	console.log('onMounted getWallets')
	// 	getWallets();
	// })
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
									// width: 60rpx;
									// height: 28rpx;
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
							.address {
								font-family: Gilroy-Medium;
								font-weight: 500;
								font-size: 24rpx;
								color: #999999;
							}

							margin-top: 12rpx;

							.copy {
								margin-left: 16rpx;
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