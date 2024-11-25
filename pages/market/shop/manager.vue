<template>
	<view>
		<com-nav-bar title="商家中心" backgroundColor="transparent">
			<template #right>
				<view class="flex flex-col justify-center items-center"
					@click="tools.navigateTo('/pages/market/shop/order')">
					<uni-badge size="small" :text="total" absolute="rightTop" :offset="[4, 0]" type="error">
						<!-- <view class="iconfont icon-order-manage text-[30px]"></view> -->
						<image src="@/static/images/c2c/shop/order@2x.png" mode="aspectFit"
							style="width: 39rpx; height: 45rpx;"></image>
					</uni-badge>
				</view>
			</template>
		</com-nav-bar>
		<view class="bg">
			<view>
				<image src="@/static/images/c2c/bg@2x.png" mode="aspectFit" style="width: 750rpx; height: 750rpx;">
				</image>
			</view>
		</view>
		<view class="content">
			<view class="content_profile">
				<view class="content_profile_left">
					<view class="nickname">
						{{userStore.user.identity ? userStore.user.identity.nickname : userStore.user.nickname}}
					</view>
					<view class="content_profile_left_auth">
						<view class="yes" v-if="userStore.user.identity && userStore.user.identity.status == 2">已认证
						</view>
						<view class="no" v-else>未认证</view>
						<view class="time">
							成为商家时间： {{tools.dateFormat('YYYY-mm-dd', new Date(c2cInfo.created_at))}}
						</view>
					</view>
					<view class="content_profile_left_bao flex items-center">
						<image src="@/static/images/c2c/ok@2x.png" mode="aspectFit"
							style="width: 20rpx; height: 14rpx;"></image>
						<view class="content_profile_left_bao_txt">
							保证金 {{tools.formatNumber2(c2cInfo.amount, 0)}} USDT
						</view>
					</view>
				</view>
				<view class="content_profile_right">
					<view class="avatar">
						<image :src="project.getFullURL(userStore.user.avatar)" class="rounded-full" mode="aspectFit"
							style="width: 120rpx; height: 120rpx;">
						</image>
					</view>
				</view>
			</view>

			<view class="asset flex flex-col justify-between">
				<view class="asset_row1 flex justify-between items-center">
					<view class="flex items-center">
						<image src="@/static/images/arrow-right-filled@2x.png" mode="aspectFit"
							style="width: 12rpx; height: 20rpx;"></image>
						<image src="@/static/images/wallet/usdt@2x.png" mode="aspectFit"
							style="width: 40rpx; height: 40rpx; margin-left: 18rpx;"></image>
						<view class="asset_title">USDT</view>
					</view>
					<!-- <view class="right asset_btns flex items-center">
						<button type="button" class="asset_btn asset_btn_recharge">充币</button>
						<button type="button" class="asset_btn asset_btn_withdraw">提币</button>
					</view> -->
				</view>
				<view class="asset_balances flex justify-between items-center">
					<view class="flex flex-col   asset_balances_item">
						<view class="asset_balances_item_name">
							可用
						</view>
						<view class="asset_balances_item_amount">
							{{tools.unitConverter(usdtToken.balance, 2)}}
						</view>
					</view>
					<view class="flex flex-col   asset_balances_item">
						<view class="asset_balances_item_name">
							冻结
						</view>
						<view class="asset_balances_item_amount">
							{{tools.unitConverter(usdtToken.freeze, 2)}}
						</view>
					</view>
					<view class="flex flex-col   asset_balances_item">
						<view class="asset_balances_item_name">
							折合
						</view>
						<view class="asset_balances_item_amount">
							{{tools.unitConverter(usdtToken.balance, 2)}} CNY
						</view>
					</view>
				</view>
			</view>


			<view class="my-list bg-white">
				<view class="flex my-list_item my-list_item_border justify-between">
					<view class="left">成交单数（近30天）</view>
					<view class="right">{{tools.formatNumber2(info.month_success_total, 0)}}</view>
				</view>
				<view class="flex my-list_item my-list_item_border justify-between">
					<view class="left">成交率（近30天）</view>
					<view class="right">{{tools.unitConverter(info.month_rate)}}%</view>
				</view>
				<template v-if="showMore">
					<view class="flex my-list_item justify-between items-center">
						<view class="flex items-center left">
							<view class="w-[3px] py-1.5 bg-green-600"></view>
							<text class="ml-2">购买</text>
						</view>
						<view class="right">{{tools.unitConverter(info.month_buy_rate)}}%</view>
					</view>
					<view class="flex my-list_item justify-between items-center">
						<view class="flex items-center left">
							<view class="w-[3px] py-1.5 bg-red-600"></view>
							<text class="ml-2">出售</text>
						</view>
						<view class="right">{{tools.unitConverter(info.month_sell_rate)}}%</view>
					</view>
					<u-line margin="10px 0"></u-line>
					<view class="flex my-list_item  justify-between">
						<view class="left">总成交单数</view>
						<view class="right">{{tools.formatNumber2(info.success_total, 2)}}</view>
					</view>
					<view class="flex my-list_item my-list_item_border justify-between">
						<view class="left">总成交率</view>
						<view class="right">{{tools.unitConverter(info.total_rate)}}%</view>
					</view>
				</template>
				<view class="more flex items-center justify-center" @click="showMore = !showMore">
					<view class="cat">查看更多数据</view>
					<image src="@/static/images/c2c/shop/arrow-down@2x.png" mode="aspectFit"
						style="width: 20rpx; height: 12rpx;"></image>
				</view>
			</view>
			<view class="tabs">
				<!-- <u-tabs :list="list1" :current="current" @click="click"></u-tabs> -->
				<com-tab-shop :list="list1" v-model:current="current" @change="click"></com-tab-shop>
				<view class="flex items-center justify-center tabs_add" @click="add">
					<image class="tabs_add_img" src="@/static/images/c2c/shop/edit@2x.png" mode="aspectFit"
						style="width: 27rpx; height: 28rpx;"></image>
					<view class="tabs_add_txt">发布委托</view>
				</view>
			</view>
			<view v-if="current == 0">
				<com-c2c-manager-buy></com-c2c-manager-buy>
			</view>
			<view v-else-if="current == 1">
				<com-c2c-manager-sell></com-c2c-manager-sell>
			</view>

		</view>
	</view>
</template>

<script setup>
	import {
		onShow
	} from '@dcloudio/uni-app';
	import {
		useBalanceStore
	} from '@/stores/modules/userBalance'
	import tools from '@/utils/tools'
	import project from "@/utils/project";

	const showMore = ref(false)

	const userBalanceStore = useBalanceStore()
	const usdtToken = userBalanceStore.getUsdtToken()
	console.log(usdtToken)

	const info = reactive({
		month_success_total: 0,
		month_rate: '100.00',
		month_buy_rate: '100.00',
		month_sell_rate: '100.00',
		success_total: 0,
		total_rate: '100.00',
	})

	const c2cInfo = reactive({
		shop_level: '',
		amount: '',
		created_at: '',
	})

	const total = ref(0)
	getC2CShopOrderList({
		status: 1
	}).then(res => {
		console.log(res)
		total.value = res.total;
	})

	const getInfo = () => {
		uni.$u.http.get('/c2cShop/info').then(res => {
			for (let key in info) {
				info[key] = res[key]
			}
		})
	}

	const getC2CInfo = () => {
		uni.$u.http.get('/c2cShop/c2cInfo').then(res => {
			for (let key in res) {
				c2cInfo[key] = res[key]
			}
		})
	}

	onShow(() => {
		getInfo()
		getC2CInfo()
		project.getUser()
	})
</script>

<script>
	import {
		useUserStore
	} from "@/stores/modules/user";
	import {
		getC2CShopOrderList,
		getUserInfo
	} from '@/config/api';
	import {
		reactive,
		ref
	} from 'vue';

	export default {
		data() {
			return {
				current: 0,
				list1: ['购买委托','出售委托'],
				userStore: {}
			}
		},
		onLoad() {
			this.userStore = useUserStore()
		},
		onShow() {
			uni.$emit('onShow')
		},
		methods: {
			click(item) {
				console.log('item', item);
				this.current = item.index;
			},
			//发布委托
			add() {
				tools.navigateToWithEncode('/pages/market/shop/push', {
					type: this.current == 0 ? 1 : 2
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg {
		position: fixed;
		left: 0;
		top: 0;
		height: 0;
		z-index: -1;
	}

	.content {
		&_profile {
			padding: 28rpx;

			display: flex;
			justify-content: space-between;


			&_left {
				display: flex;
				flex-direction: column;



				// align-content: center;

				.nickname {
					font-family: SourceHanSansCN-Bold;
					font-weight: bold;
					font-size: 48rpx;
					color: #000000;
				}


				&_auth {
					display: flex;
					align-content: center;

					margin-top: 10rpx;

					.yes {
						width: 76rpx;
						height: 30rpx;
						background: #7F17FE;
						border-radius: 4rpx;

						font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 22rpx;
						color: #FFFFFF;

						text-align: center;
					}

					.no {
						width: 76rpx;
						height: 30rpx;
						background: #000000;
						border-radius: 4rpx;
						opacity: 0.4;

						font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 22rpx;
						color: #FFFFFF;

						text-align: center;
					}

					.time {
						font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 22rpx;
						color: #000000;
						opacity: 0.6;

						padding-left: 16rpx;
					}
				}

				&_bao {
					margin-top: 10rpx;
				}

				&_bao_txt {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 22rpx;
					color: #7F17FE;

					margin-left: 14rpx;
				}

			}

			&_right {

				.avatar {
					width: 120rpx;
					height: 120rpx;
					background: #EEEEEE;
					border-radius: 50%;
					border: 2rpx solid #7F17FE;

					flex-shrink: 0;
				}
			}
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
						font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 22rpx;
						color: #000000;
						opacity: 0.4;

					}

					&_amount {
						font-family: Gilroy-Medium;
						font-weight: 500;
						font-size: 24rpx;
						color: #000000;

						margin-top: 20rpx;
					}
				}
			}
		}

		.my-list {
			margin-top: 19rpx;

			&_item {
				padding: 0 29rpx;


				&_border {
					border-bottom: 1rpx solid #eee;
				}

				.left {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 22rpx;
					color: #000000;
					line-height: 70rpx;
					opacity: 0.6;
				}

				.right {
					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 30rpx;
					color: #000000;
					line-height: 70rpx;
				}
			}

			.more {
				margin-top: 30rpx;

				.cat {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 22rpx;
					color: #000000;
					// line-height: 70rpx;
					opacity: 0.4;


					margin-right: 10rpx;
				}
			}
		}

		.tabs {
			margin-top: 75rpx;
			position: relative;

			&_add {
				position: absolute;
				right: 24rpx;
				bottom: 30rpx;

				padding: 12rpx 13rpx 10rpx 13rpx;

				background: #7F17FE;
				border-radius: 8rpx;

				display: flex;
				align-items: center;
				justify-content: center;

				&_img {}

				&_txt {

					font-family: SourceHanSansCN-Medium;
					font-weight: 500;
					font-size: 24rpx;
					color: #FFFFFF;

					margin-left: 10rpx;
				}
			}
		}
	}
</style>