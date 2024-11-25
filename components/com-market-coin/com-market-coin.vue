<template>
	<view class="market-box">
		<!-- <view class="text-xl font-bold ml-4">行情</view> -->
		<view>
			<view class="flex justify-between market-title">
				<view class="left">名称</view>
				<view class="middle">最新价格</view>
				<view class="right">24h涨跌幅</view>
			</view>
			<view class="coin-list">
				<view class="coin-list-item" v-for="(item, index) in tokenList" @click="itemClick(item)" :key="index">
					<view class="left">{{item.name}}</view>
					<view class="middle">
						<view class="price">{{tools.unitConverter(item.price, item.digits)}}</view>
						<view class="cny">￥{{tools.USDT2CNY(item.price, item.digits)}}</view>
					</view>
					<view class="right" :class="item.rate >= 0 ? 'bg-[#00C688]' : 'bg-[#FC465C]'">
						{{tools.getNumberUpOrDown(item.rate, 2)}}%
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import {
		onShow,
		onHide
	} from '@dcloudio/uni-app'
	import {
		getMarketList
	} from '@/config/api.js'
	import tools from "@/utils/tools";
	import useOkxWebSocket from "@/hooks/okx/useOkxWebSocket";
	import useSocket from "../../hooks/socket/useSocket";
	import {
		wsOkxPublic
	} from "@/config/http";

	const tokenList = ref([]);
	const args = ref([]);
	const getSubscribeParams = () => {
		// args.value = [];
		for (let item of tokenList.value) {
			if (item.id == 1) continue;
			args.value.push({
				channel: 'tickers',
				instType: 'SPOT',
				instId: item.symbol,
			})
		}
	}

	// const {
	// 	subscribe
	// } = useOkxWebSocket(null, (result) => {
	// 	// console.log('subscribe', result)
	// 	if (!result.data) {
	// 		return;
	// 	}

	// 	if (result.arg.channel == 'tickers') {
	// 		const data = result.data[0];
	// 		// console.log(data)
	// 		const find = tokenList.value.find(item => {
	// 			return item.symbol === data.instId;
	// 		})
	// 		if (find) {
	// 			find.price = data.last;
	// 			find.rate = (data.last - data.sodUtc8) / data.sodUtc8 * 100;
	// 		}
	// 	}
	// })

	let socketTask = null;
	const webConnect = () => {
		socketTask = useSocket({
			onOpen: send => {
				send(JSON.stringify({
					op: 'subscribe',
					args: args.value
				}))
			},
			onMessage: result => {
				if (!result.data) {
					return;
				}
				if (result.arg.channel == 'tickers') {
					const data = result.data[0];
					// console.log(data)
					const find = tokenList.value.find(item => {
						return item.symbol === data.instId;
					})
					if (find) {
						find.price = data.last;
						find.rate = (data.last - data.sodUtc8) / data.sodUtc8 * 100;
					}
				}
			}

		}, wsOkxPublic).socketTask;
	}



	onShow(async () => {
		if (args.value.length == 0) {
			//获取市场列表
			let data = await getMarketList();
			tokenList.value = data
			getSubscribeParams()
		}
		webConnect();
	})


	onHide(() => {
		if (socketTask) {
			socketTask.close();
		}
	})

	const itemClick = (item) => {
		if (item.name != 'NRT') {
			tools.navigateToWithEncode('/pages/kline/kline', item)
		}
	}
</script>

<style lang="scss" scoped>
	.market-box {
		margin-top: 57rpx;

		.market-title {
			height: 60rpx;
			padding: 0 30rpx;
			display: flex;
			align-items: center;

			font-family: SourceHanSansCN;
			font-weight: 500;
			font-size: 20rpx;
			color: #000000;
			opacity: 0.6;

			border-top: 1px solid #F4F4F4;
			border-bottom: 1px solid #F4F4F4;

			.middle {
				flex: 1;
				text-align: right;
			}

			.right {
				width: 158rpx;
				margin-left: 44rpx;
				text-align: right;
			}
		}

		.coin-list {
			padding: 0 30rpx;
			margin-top: 29rpx;
			padding-bottom: 60rpx;

			.coin-list-item {
				@apply flex justify-between items-center mb-[60rpx];

				.left {
					font-family: Gilroy-Bold;
					font-weight: bold;
					font-size: 30rpx;
					color: #000000;
				}

				.middle {
					flex: 1;
					text-align: right;

					.price {
						font-family: Gilroy-Bold;
						font-weight: bold;
						font-size: 28rpx;
						color: #000000;
					}

					.cny {
						font-family: Gilroy-Medium;
						font-weight: 500;
						font-size: 20rpx;
						color: #000000;
						opacity: 0.4;

						margin-top: 21rpx;
					}
				}

				.right {
					width: 158rpx;
					height: 60rpx;
					margin-left: 44rpx;

					border-radius: 8px;
					display: flex;
					align-items: center;
					justify-content: center;

					font-family: Gilroy-Bold;
					font-weight: bold;
					font-size: 28rpx;
					color: #FFFFFF;
				}
			}
		}
	}
</style>