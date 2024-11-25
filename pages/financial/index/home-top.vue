<template>
	<view>
		<view class="licai-top-fixed">
			<!-- <image src="@/static/images/financial/bg-top.png" mode="aspectFit" style="width: 750rpx; height: 190rpx;"></image> -->
			<view class="status_bar"></view>
			<view class="licai-nav-bar">
				<view class="left flex items-center" @click="clickLeft">
					<image src="@/static/images/financial/left-ico@2x.png" mode="aspectFit"
						style="width: 42rpx; height: 30rpx;"></image>
					<com-wallet-address style="margin-left: 19rpx;"></com-wallet-address>
				</view>
				<view class="right" @click="tools.navigateTo('/pages/profile/profile')">
					<view class="info">{{ $t('deposit.my') }}</view>
					<image src="@/static/images/financial/zaiquan@2x.png" mode="aspectFit"
						style="width: 43rpx; height: 36rpx;"></image>
				</view>
			</view>
		</view>
		<view class="licai-top">
			<view class="content">
				<view class="huoqi-title flex align-center">
					<view class="title"><!-- 活期赚币 -->{{ $t('deposit.float.p2') }}</view>
					<view class="right">
						<image src="@/static/images/financial/fire@2x.png" mode="aspectFit"
							style="width: 32rpx; height: 41rpx;"></image>
						<view class="rate">{{ tools.floorAmount(huoqiData.rate * 365) }}%</view>
					</view>
				</view>
				<view class="info-row" style="margin-top: 22rpx">
					<view class="left"><!-- 安全可靠、复利计息、灵活存取 -->{{ $t('deposit.float.p19') }}</view>
					<view class="right"><!-- 参考年化 -->{{ $t('deposit.p2') }}</view>
				</view>
				<view class="nrt-info" style="margin: 20rpx 0;">
					<view class="left">
						<view class="symbol">NRT</view>
						<view class="up" v-if="marketArr[0]['rate'] >= 0">
							<image src="@/static/images/financial/up@2x.png" mode="aspectFit"
								style="width: 14rpx; height: 21rpx;"></image>
							<view class="rate">+{{ tools.unitConverter(marketArr[0]['rate'], 2) }}%</view>
						</view>
						<view class="down" v-else>
							<image src="@/static/images/financial/down@2x.png" mode="aspectFit"
								style="width: 14rpx; height: 21rpx;"></image>
							<view class="rate">-{{ tools.unitConverter(marketArr[0]['rate'], 2) }}%</view>
						</view>
					</view>
					<view class="right">
						<view class="price">${{ tools.unitConverter(marketArr[0]['price'], 2) }}</view>
						<view class="cny">≈ ￥{{ tools.USDT2CNY(marketArr[0]['price']) }}</view>
					</view>
				</view>
				<view class="info-row2">
					<view class="left"><!-- 全网持仓总量 -->{{ $t('home.platform.p1') }}</view>
					<view class="right">$ {{tools.floorAmount(depositTotal, 4)}}</view>
				</view>
				<view class="info-row2" style="margin-top: 29rpx;">
					<view class="left"><!-- 社区总持仓 -->{{ $t('home.platform.p7') }}</view>
					<view class="right">$ {{tools.floorAmount(userStore.user.info.team_deposit, 4)}}</view>
				</view>
				<button type="button" class="huoqi-btn"
					@click="buy(huoqiData)"><!--活期-->{{ $t('deposit.float.buy') }}
				</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import tools from '@/utils/tools'
	import { reactive, ref } from "vue";
	import { useUserStore } from '@/stores/modules/user'
	import { useI18n } from 'vue-i18n';

	const emit = defineEmits(['clickLeft'])
	const clickLeft = () => {
		emit('clickLeft');
	}
	let userStore = useUserStore()
	let { t } = useI18n()

	const huoqiData = reactive({ rate: 0, min: 100, buyAmount: '', payType: 1 })
	const depositTotal = ref(0)
	const marketArr = ref([
		{
			name: '',
			price: 1.0,
			symbol: 'NRT-USDT',
			digits: 4,
			up: true,
			dayUp: true,
			rate: 0
		}
	]);

	//获取活期商品信息
	const getGood = () => {
		uni.$u.http.get('/good/1').then(data => {
			for (let key in data) {
				huoqiData[key] = data[key]
			}
			console.log(huoqiData)
		})
	}
	getGood()

	//获取当前全网持仓总量
	const getTotalDeposit = () => {
		uni.$u.http.get('/deposit/total').then(total => {
			depositTotal.value = total
		})
	}
	getTotalDeposit();

	//活期申购
	const buy = async (record) => {
		// addOrder({
		// 	good_id: record.id,
		// 	amount: record.buyAmount,
		// 	pay_type: 2,
		// }).then(res => {
		// 	uni.$emit("newOrderCurrent")
		// 	isHuoqiActive.value = false;
		// 	project.getUser()
		// 	tools.toastSuccess(t('message.buySuccess'))
		// })
		// console.log(record)
		tools.navigateToWithEncode('/pages/financial/huoqi/huoqi', record)
	}
</script>

<style lang="scss" scoped>
	$top-height: 190rpx;
	$bar-height: 44px;
	.licai-top-fixed {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		width: 750rpx;
		/* #ifdef  H5 */
		height: $top-height;
		top: calc(44px - $top-height);
		/* #endif */
		/* #ifdef  APP-PLUS */
		height: $top-height;
		/* #endif */
		z-index: 999;

		background: url('/static/images/financial/bg-top.png') no-repeat center;
		background-size: 100% 100%;

		.status_bar {

			/* #ifdef  H5 */
			height: var(--status-bar-height);
			/* #endif */
			/* #ifdef  APP-PLUS */
			height: calc($top-height - $bar-height);
			/* #endif */
			width: 100%;
		}

		.licai-nav-bar {
			height: $bar-height;
			display: flex;
			justify-content: space-between;
			align-items: center;

			/* #ifdef  H5 */
			margin-top: calc($top-height - $bar-height);
			/* #endif */
			padding: 0 29rpx;

			.left {
				padding-left: 3rpx;
			}

			.right {
				display: flex;
				align-items: center;

				.info {
					font-family: SourceHanSansCN-Medium;
					font-weight: 500;
					font-size: 24rpx;
					color: #FFFFFF;

					margin-right: 20rpx;
				}
			}
		}
	}

	.licai-top {
		position: relative;
		left: 0;
		width: 750rpx;
		top: 0;
		/* #ifdef  H5 */
		height: calc(731rpx - $top-height + $bar-height);
		/* #endif */
		/* #ifdef  APP-PLUS */
		height: 731rpx;
		/* #endif */

		background: url('/static/images/financial/bg@2x.png') no-repeat center;
		// background-size: 750rpx calc(731rpx - $top-height + $bar-height);
		background-size: 750rpx 731rpx;
		/* #ifdef  H5 */
		background-position: 0 calc($bar-height - $top-height);
		/* #endif */

		.content {
			padding: 0 29rpx;
			/* #ifdef  H5 */
			padding-top: calc(202rpx - $top-height + $bar-height);
			/* #endif */
			/* #ifdef  APP-PLUS */
			padding-top: 202rpx;
			/* #endif */			

			.huoqi-title {
				justify-content: space-between;

				.title {
					font-family: SourceHanSansCN-Medium;
					font-weight: 500;
					font-size: 40rpx;
					color: #FFFFFF;
				}

				.right {
					display: flex;
					align-items: center;

					.rate {
						font-family: Gilroy-Bold;
						font-weight: bold;
						font-size: 44rpx;
						color: #FFFFFF;

						margin-left: 19rpx;
					}
				}
			}

			.info-row {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 22rpx;
					color: #FFFFFF;
				}

				.right {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 22rpx;
					color: #FFFFFF;
					opacity: 0.8;
				}
			}

			.info-row2 {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 22rpx;
					color: #FFFFFF;
					// line-height: 70px;
					opacity: 0.6;
				}

				.right {
					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 24rpx;
					color: #FFFFFF;
					// line-height: 70px;
				}
			}

			.nrt-info {
				display: flex;
				justify-content: space-between;
				align-items: center;

				width: 100%;
				height: 107rpx;

				box-shadow: 0px 8rpx 20rpx 0px rgba(202, 202, 202, 0.3);
				border-radius: 8rpx;
				border: 2rpx solid #EEEEEE;

				.left,
				.left .up,
				.left .down {
					display: flex;
					align-items: center;
				}

				.left {
					.symbol {
						font-family: Gilroy-Medium;
						font-weight: 500;
						font-size: 30rpx;
						color: #FFFFFF;

						margin-left: 29rpx;
					}

					.up,
					.down {
						margin-left: 21rpx;

						.rate {
							margin-left: 9rpx;

							font-family: Gilroy-Regular;
							font-weight: 400;
							font-size: 30rpx;
						}
					}

					.up .rate {
						color: #00C688;
					}

					.down .rate {
						color: #FC465C;
					}
				}

				.right {
					display: flex;
					flex-direction: column;
					align-items: end;
					justify-content: end;

					margin-right: 29rpx;
					text-align: right;

					.price {
						font-family: Gilroy-Medium;
						font-weight: 500;
						font-size: 30rpx;
						color: #FFFFFF;
						// line-height: 70px;
					}

					.cny {
						font-family: Gilroy-Regular;
						font-weight: 400;
						font-size: 20rpx;
						color: #FFFFFF;
						// line-height: 70px;
						opacity: 0.4;

						margin-top: 10rpx;
					}
				}
			}

			.huoqi-btn {
				width: 630rpx;
				height: 100rpx;
				background: #FFFFFF;
				border-radius: 8rpx;
				margin-top: 39rpx;

				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 34rpx;
				color: #000000;
				// line-height: 70px;
				display: flex;
				align-items: center;
				justify-content: center;

			}
		}
	}
</style>