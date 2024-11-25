<template>
	<view v-if="props.show">
		<u-popup :show="props.show" mode="left" @close="close" @open="open" :safeAreaInsetTop="false"
			:safeAreaInsetBottom="false" bgColor="#fff" duration="200">
			<view class="content">
				<com-nav-bar title="" backgroundColor="#fff" @clickLeft="close()" @clickRight="showProfile = true">
					<template #right>
						<view>
							<!-- <image src="@/static/images/left/scan@2x.png" mode="aspectFit"
								style="width: 33rpx; height: 33rpx;"></image> -->
							<image src="@/static/images/left/chang_user@2x.png" mode="aspectFit"
								style="width: 33rpx; height: 33rpx; margin-left: 35rpx;"></image>
						</view>
					</template>
				</com-nav-bar>
				<scroll-view class="content_scroll-view" scroll-y="true" upper-threshold="50">
					<view class="flex avatar  items-center justify-between" @click="showProfile = true">
						<view class="img_border">
							<image class="img rounded-full" :src="project.getFullURL(userStore.user.avatar)"
								mode="aspectFill" style="width: 120rpx; height: 120rpx;"></image>
						</view>
						<view class="flex justify-start items-start flex-col ml-4 flex-1">
							<view class="name flex items-center ">
								<view>{{userStore.user.nickname}}</view>
								<image :src="'/static/images/profile/vip/'+userStore.user.real_vip+'@2x.png'"
									mode="aspectFit" style="width: 120rpx; height: 30rpx; margin-left: 18rpx;"></image>
							</view>
							<view class="uid flex items-center">
								<view>账户UID:{{userStore.user.uid}}</view>
								<image src="@/static/images/left/copy6@2x.png" mode="aspectFit"
									style="width: 22rpx; height: 22rpx; margin-left: 15rpx;"
									@click.stop="tools.copyClick(userStore.user.uid)"></image>
							</view>
							<view class="flex items-center">
								<view class="card no flex-shrink-0">
									未认证
								</view>
								<view class="setting">个人资料和设置</view>
							</view>
						</view>
						<view>
							<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
								style="width: 12rpx; height: 20rpx;"></image>
						</view>
					</view>
					<view class="asset flex flex-col justify-between">
						<view class="asset_row1 flex justify-between items-center">
							<view class="flex items-center">
								<image src="@/static/images/arrow-right-filled@2x.png" mode="aspectFit"
									style="width: 12rpx; height: 20rpx;"></image>
								<view class="asset_title">余额资产</view>
							</view>
							<!-- <view class="right asset_btns flex items-center">
								<button type="button" class="asset_btn asset_btn_recharge">充币</button>
								<button type="button" class="asset_btn asset_btn_withdraw">提币</button>
							</view> -->
						</view>
						<view class="asset_balances flex justify-between items-center">
							<view class="w-1/2 flex items-center text-left asset_balances_item">
								<view class="flex items-center">
									<image src="@/static/images/token/usdt.png" mode="aspectFit"
										style="width: 41rpx; height: 41rpx;"></image>
								</view>
								<view class="asset_balances_item_name">
									USDT 余额
								</view>
								<view class="asset_balances_item_amount">
									{{tools.unitConverter(balanceStore.usdtBalance())}}
								</view>
							</view>
							<view class="w-1/2 flex items-center justify-end asset_balances_item">
								<view class="flex items-center">
									<image src="@/static/img/chain/nrt-on.png" mode="aspectFit"
										style="width: 41rpx; height: 41rpx;"></image>
								</view>
								<view class="asset_balances_item_name">
									NRT 余额
								</view>
								<view class="asset_balances_item_amount">
									{{tools.unitConverter(balanceStore.tokenBalance())}}
								</view>
							</view>							
						</view>
					</view>
					<view class="my-list my-list_border">
						<view class="title">交易</view>
						<view class="icons grid grid-cols-4 gap-4">
							<view class="icon-item">
								<view class="flex items-center justify-center">
									<image src="@/static/images/left/Save@2x.png" mode="aspectFit"
										style="width: 50rpx; height: 50rpx;"></image>
								</view>
								<text class="sub-title">充币</text>
							</view>
							<view class="icon-item" @click="urlClick('/pages/profile/withdraw')">
								<view class="flex items-center justify-center">
									<image src="@/static/images/left/withdraw@2x.png" mode="aspectFit"
										style="width: 50rpx; height: 50rpx;"></image>
								</view>
								<text class="sub-title">提币</text>
							</view>
							<view class="icon-item" @click="urlClick('/pages/market/market')">
								<view class="flex items-center justify-center">
									<image src="@/static/images/left/Users@2x.png" mode="aspectFit"
										style="width: 50rpx; height: 50rpx;"></image>
								</view>
								<text class="sub-title">C2C</text>
							</view>
							<view class="icon-item" @click="urlClick('/pages/profile/transfer')">
								<view class="flex items-center justify-center">
									<image src="@/static/images/left/Lightning bolt@2x.png" mode="aspectFit"
										style="width: 50rpx; height: 50rpx;"></image>
								</view>
								<text class="sub-title">内转</text>
							</view>
						</view>
					</view>

					<view class="my-list my-list_border" v-if="userStore.isShoper()">
						<view class="title">商家</view>
						<view class="icons grid grid-cols-4 gap-4">
							<view class="icon-item" @click="urlClick('/pages/market/shop/manager')">
								<view class="">
									<image src="@/static/images/left/Library@2x.png" mode="aspectFit"
										style="width: 50rpx; height: 50rpx;"></image>
								</view>
								<text class="sub-title">商家中心</text>
							</view>

							<view class="icon-item" @click="urlClick('/pages/market/shop/order')">
								<view class="">
									<uni-badge size="small" :text="appStore.c2cOrderCount" absolute="rightTop" :offset="[0, 0]"
										type="error">
										<image src="@/static/images/left/Clipboard list@2x.png" mode="aspectFit"
											style="width: 50rpx; height: 50rpx;"></image>
									</uni-badge>
								</view>
								<text class="sub-title">订单列表</text>
							</view>
						</view>
					</view>

					<view class="my-list my-list_border">
						<view class="title">理财</view>
						<view class="icons grid grid-cols-4 gap-4">
							<view class="icon-item" @click="urlClick('/pages/financial/index', true)">
								<view class="flex items-center justify-center">
									<image src="@/static/images/left/Presentation_chart_line@2x.png" mode="aspectFit"
										style="width: 50rpx; height: 50rpx;"></image>
								</view>
								<text class="sub-title">活期</text>
							</view>
							<view class="icon-item" @click="urlClick('/pages/financial/index', true)">
								<view class="flex items-center justify-center">
									<image src="@/static/images/left/Presentation_chart_bar@2x.png" mode="aspectFit"
										style="width: 50rpx; height: 50rpx;"></image>
								</view>
								<text class="sub-title">定期</text>
							</view>
							<view class="icon-item" @click="urlClick('/pages/profile/profile')">
								<view class="flex items-center justify-center">
									<image src="@/static/images/left/Icon@2x.png" mode="aspectFit"
										style="width: 50rpx; height: 50rpx;"></image>
								</view>
								<text class="sub-title">我的持仓</text>
							</view>
							<view class="icon-item" @click="urlClick('/pages/financial/orders/orders')">
								<view class="flex items-center justify-center">
									<image src="@/static/images/left/Icon@2x(1).png" mode="aspectFit"
										style="width: 50rpx; height: 50rpx;"></image>
								</view>
								<text class="sub-title">申购记录</text>
							</view>
						</view>
					</view>

					<view class="my-list my-list_border" @click="urlClick('/pages/profile/invite')">
						<view class="title">福利</view>
						<view class="icons grid grid-cols-4 gap-4">
							<view class="icon-item">
								<view class="flex items-center justify-center">
									<image src="@/static/images/left/Gift@2x.png" mode="aspectFit"
										style="width: 50rpx; height: 50rpx;"></image>
								</view>
								<text class="sub-title">邀请好友</text>
							</view>
						</view>
					</view>

					<view class="my-list">
						<view class="title">工具</view>
						<view class="icons grid grid-cols-4 gap-4">
							<!-- <view class="icon-item" @click="urlClick('/pages/api/api')">
								<view class="flex items-center justify-center">
									<image src="@/static/images/left/Code@2x.png" mode="aspectFit"
										style="width: 50rpx; height: 50rpx;"></image>
								</view>
								<text class="sub-title">API</text>
							</view> -->
							<view class="icon-item" @click="urlClick('/pages/analyst/analyst')">
								<view class="flex items-center justify-center">
									<image src="@/static/images/left/Academic cap@2x.png" mode="aspectFit"
										style="width: 50rpx; height: 50rpx;"></image>
								</view>
								<text class="sub-title">API</text>
							</view>
						</view>
					</view>

					<view class="flex justify-between items-center abount pb-4" @click="showAbout = true">
						<view class="flex items-center">
							<text class="abount_title">关于我们</text>
						</view>
						<view class="abount_version flex items-center">
							<view>v{{version}} </view>
							<view class="iconfont icon-arrow-right-bold"></view>
						</view>
					</view>

					<!-- <view class="flex justify-between items-center p-4 pb-6">
						<view class="flex items-center ml-2 text-red-500" @click="tools.logout()">
							<view class="iconfont icon-export text-[20px]"></view>
							<text class="ml-2">退出登录</text>
						</view>
					</view> -->
				</scroll-view>
			</view>
		</u-popup>

		<com-index-left-profile v-model:show="showProfile"></com-index-left-profile>
		<com-index-left-about v-model:show="showAbout"></com-index-left-about>
	</view>

</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import tools from '@/utils/tools';
	import project from '@/utils/project';
	import { useUserStore } from '@/stores/modules/user'
	import {
		useTabbarStore
	} from '@/stores/modules/tabbarStore';
	import {
		onBackPress
	} from '@dcloudio/uni-app';
	import { useBalanceStore } from '@/stores/modules/userBalance';
	import { useAppStore } from '@/stores/modules/app';

	const version = uni.getSystemInfoSync().appWgtVersion || uni.getSystemInfoSync().appVersion;

	const userStore = useUserStore()
	const balanceStore = useBalanceStore()
	const appStore = useAppStore();

	const props = defineProps(['show'])
	const emit = defineEmits(['update:show', "change"]);

	const showProfile = ref(false)
	const showAbout = ref(false)

	const open = () => {
		// console.log('open');

	}
	const close = () => {
		console.log('close')
		emit('update:show', false);
	}

	const urlClick = (url, isTab = false) => {
		close();
		if (isTab) {
			let tabbarStore = useTabbarStore()
			if ('/pages/financial/index' == url) {
				tabbarStore.updateValue(2);
			}
			uni.switchTab({
				url
			})
		} else {
			uni.navigateTo({
				url
			})
		}
	}

	// const itemClick = (item : string) => {
	// 	if (item == "退出登录") {
	// 		uni.removeStorageSync('user')
	// 		uni.removeStorageSync('balances')
	// 		uni.removeStorageSync('token')

	// 		uni.navigateTo({
	// 			url: '/pages/login/login'
	// 		})
	// 	} else {
	// 		emit('change', item);
	// 		close()
	// 	}
	// }

	onBackPress(options => {
		if (options.from === 'navigateBack') {
			return false;
		}
		if (!showProfile.value && !showAbout.value) {
			close();
		}
		return true;
	})
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		// height: 100vh;

		&_scroll-view {
			height: calc(100vh - 110rpx - var(--status-bar-height))
		}

		.asset {
			width: 690rpx;
			height: 200rpx;
			background: #FFFFFF;
			box-shadow: 0px 8rpx 20rpx 0rpx rgba(202, 202, 202, 0.3);
			border-radius: 8rpx;
			margin: 30rpx auto;

			&_row1 {
				padding: 30rpx;
				padding-left: 0;
			}

			&_title {
				font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 30rpx;
				color: #010101;
				margin-left: 18rpx;
			}

			&_btns {}

			&_btn {
				padding: 0;
				width: 146rpx;
				height: 56rpx;

				border-radius: 8rpx;

				display: flex;
				align-items: center;
				justify-content: center;

				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 28rpx;


				&_recharge {
					background: #00C688;
					color: #FFFFFF;
				}

				&_withdraw {
					background: #FC465C;
					color: #FFFFFF;

					margin-left: 34rpx;
				}
			}

			&_btn::after {
				display: none;
			}

			&_balances {
				padding: 29rpx;
				padding-top: 0;
				flex-shrink: 0;

				&_item {
					flex-shrink: 0;

					&_name {
						font-family: Gilroy-Regular;
						font-weight: 400;
						font-size: 22rpx;
						color: #000000;
						opacity: 0.4;

						margin-left: 16rpx;
					}

					&_amount {
						font-family: Gilroy-Medium;
						font-weight: 500;
						font-size: 24rpx;
						color: #000000;

						margin-left: 16rpx;
					}
				}
			}
		}

		.my-list {
			margin: 0 29rpx;
			padding: 54rpx 0;


			&_border {
				border-bottom: 2rpx solid #EEEEEE;
			}

			.title {
				font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 32rpx;
				color: #000000;

			}

			.icons {

				padding-top: 50rpx;
				padding-left: 50rpx;
				padding-right: 50rpx;

				.icon-item {
					// @apply py-4 text-center;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.iconfont {
						font-size: 30px;
					}

					.sub-title {
						font-family: SourceHanSansCN-Medium;
						font-weight: 500;
						font-size: 26rpx;
						color: #000000;

						margin-top: 10rpx;
					}
				}

			}
		}

		.abount {
			margin-top: 302rpx;

			height: 139rpx;

			padding: 0 29rpx;

			border-top: 2rpx solid #EEEEEE;

			&_title {
				font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 32rpx;
				color: #000000;
			}

			&_version {
				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 30rpx;
				color: #999;

				.iconfont {
					margin-left: 20rpx;
					font-weight: bold;
					color: #999;
				}
			}
		}
	}


	.avatar {
		padding: 25rpx 29rpx 31rpx 29rpx;

		border-bottom: 1px solid #eaeaea;

		.img_border {}

		.img {
			// width: 120rpx;
			// height: 120rpx;			

			border: 2rpx solid #7F17FE;
			border-radius: 50%;
		}

		.name {
			@apply text-xl font-bold;
		}

		.uid {
			font-family: Gilroy-Medium;
			font-weight: 500;
			font-size: 24rpx;
			color: #000000;
			opacity: 0.6;

			padding: 10rpx 0 15rpx 0;
		}

		.card {
			padding: 5rpx 5rpx 4rpx 6rpx;

			border-radius: 4rpx;

			display: flex;
			align-items: center;
			justify-content: center;
		}

		.yes {
			color: $uni-color-success;
		}

		.no {
			// color: $uni-color-warning;
			background: #000000;
			border-radius: 4rpx;
			opacity: 0.4;

			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 22rpx;
			color: #FFFFFF;


		}

		.setting {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 22rpx;
			color: #000000;
			opacity: 0.6;

			margin-left: 16rpx;
		}
	}
</style>