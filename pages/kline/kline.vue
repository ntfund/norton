<template>
	<com-nav-bar title="K线" backgroundColor="black" color="white"></com-nav-bar>
	<view class="p-5 text-sm text-white">
		<view class="flex">
			<view class="w-1/2">
				<view class="font-bold text-2xl" :class="rate >=0 ? 'text-green-500' : 'text-red-500'">
					{{tools.toThousands(tokenDayInfo.last)}}
				</view>
				<view class="flex py-2">
					<view class="">≈￥{{tools.toThousands(tools.USDT2CNY(tokenDayInfo.last), false)}}</view>
					<view class="ml-2" :class="rate >=0 ? 'text-green-500' : 'text-red-500'">
						{{rate}}%
					</view>
				</view>
			</view>
			<view class="w-1/2 ml-2 text-xs">
				<view class="flex justify-between">
					<view class="text-gray-400">24h最高</view>
					<view class="">{{tools.toThousands(tokenDayInfo.high24h, false)}}</view>
				</view>
				<view class="flex justify-between">
					<view class="text-gray-400">24h最低</view>
					<view class="">{{tools.toThousands(tokenDayInfo.low24h, false)}}</view>
				</view>
				<view class="flex justify-between">
					<view class="text-gray-400">24h量({{symbol}})</view>
					<view class="">{{tools.simplifyNum(tokenDayInfo.vol24h)}}</view>
				</view>
				<view class="flex justify-between">
					<view class="text-gray-400">24h额(USDT)</view>
					<view class="">{{tools.simplifyNum(tokenDayInfo.vol24h * tokenDayInfo.high24h)}}</view>
				</view>
			</view>
		</view>
	</view>

	<!-- 蜡烛K线走势图 -->
	<candle :params="params"></candle>

	<view class="p-5 text-white">
		<view class="font-bold py-2">最新成交</view>
		<u-line color="#434343"></u-line>

		<view class="flex text-xs py-2 mt-2 text-gray-400">
			<view class="w-1/4">
				时间
			</view>
			<view class="w-1/4">
				方向
			</view>
			<view class="w-1/4 text-center">
				价格(USDT)
			</view>
			<view class="w-1/4 text-right">
				数量({{symbol}})
			</view>
		</view>
		<view class="flex text-xs py-2 mt-2" v-for="(item, index) in orderList" :key="index">
			<view class="w-1/4 text-gray-400">
				{{tools.timestampToTime(item.ts / 1000, 'H:i:s')}}
			</view>
			<view class="w-1/4 " :class="[item.side == 'buy' ? 'text-green-500' : 'text-red-500']">
				{{ item.side == 'buy' ? '买入' : '卖出' }}
			</view>
			<view class="w-1/4 text-center">
				{{item.px}}
			</view>
			<view class="w-1/4 text-right">
				{{item.sz}}
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
	import { getOkxCandles, getOkxTrades } from "../../config/api";
	import tools from "../../utils/tools";
	import { wsOkx, wsOkxBusiness, wsOkxPublic } from '@/config/http.js'
	import useSocket from "../../hooks/socket/useSocket";
	import candle from './components/candle.vue';

	const props = defineProps(['params'])
	const item = props.params ? JSON.parse(decodeURIComponent(props.params)) : null
	const symbol = (item != null && item.name) ? item.name : 'BTC'
	uni.setNavigationBarTitle({
		title: symbol + '/USDT'
	});
	let socketTask1;


	const price = ref(0)
	const tokenDayInfo = reactive({
		open24h: 0,
		high24h: 0,
		low24h: 0,
		volCcy24h: 0,
		vol24h: 0,
		last: 0,
		sodUtc8: 0
	})

	const rate = computed(() => {
		if (tokenDayInfo.sodUtc8 == 0) return 0;
		let rateNumber : any = (tokenDayInfo.last - tokenDayInfo.sodUtc8) / tokenDayInfo.sodUtc8 * 100
		rateNumber = tools.floorAmount(rateNumber, 2)
		if (rateNumber >= 0) {
			rateNumber = '+' + rateNumber
		}
		return rateNumber;
	})

	const orderList = ref([]);


	const onSocketMessage = (message : any) => {
		// console.log('message', message)
		if (message.event && message.event == "error") {
			console.log('onSocketMessage', message)
			return;
		}
		// console.log('onSocketMessage', message)
		if (!message.data) {
			console.log('onSocketMessage data not found', message)
			return;
		}

		//当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
		if (message.arg.channel == 'tickers') {
			let data = message.data[0];
			// console.log("tickers", data)

			tokenDayInfo.high24h = parseFloat(data.high24h);
			tokenDayInfo.last = parseFloat(data.last);
			tokenDayInfo.low24h = parseFloat(data.low24h);
			tokenDayInfo.open24h = parseFloat(data.open24h);
			tokenDayInfo.volCcy24h = parseFloat(data.volCcy24h);
			tokenDayInfo.vol24h = parseFloat(data.vol24h);
			tokenDayInfo.sodUtc8 = parseFloat(data.sodUtc8);

			// opts.value.extra.markLine.data[0].value = parseInt(data.low24h)
			// opts.value.extra.markLine.data[1].value = parseInt(data.high24h)
		}

		if (message.arg.channel == 'trades') {
			let data = message.data[0];
			// console.log(data)
			// console.log('candle1D ws', dataJson.data[0])
			if (orderList.value.length < 30) {
				orderList.value.unshift(data)
			} else {
				orderList.value.unshift(data)
				orderList.value.pop()
			}
		}
	}



	onMounted(() => {
		console.log('kline onMounted')


		// setInterval(async () => {
		// 	getServerData()
		// }, 2000)

		getOkxTrades(symbol + '-USDT', 30).then(res => {
			// console.log(res)
			orderList.value = res
		})

		socketTask1 = useSocket({
			onOpen: send => {
				// send("")
				console.log("socketTask1 open");
				let data = JSON.stringify({
					op: 'subscribe', args: [
						{ channel: 'tickers', instId: symbol + '-USDT' },
						{ channel: 'trades', instId: symbol + '-USDT' },
						// { channel: 'candle1D', instId: symbol + '-USDT' },
					]
				})
				send(data);
			},
			onMessage: onSocketMessage
		}, wsOkxPublic).socketTask;



		//申请一个WebSocket对象，参数是服务端地址，同http协议使用http://开头一样，WebSocket协议的url使用ws://开头，另外安全的WebSocket协议使用wss://开头
		// socketTask1 = uni.connectSocket({
		// 	// url: 'wss://ws.okx.com:8443/ws/v5/public',
		// 	url: wsOkxPublic,
		// 	header: {
		// 		'content-type': 'application/json'
		// 	},
		// 	// protocols: ['protocol1'],
		// 	// method: 'GET',
		// 	success: () => {
		// 		console.log("Socket1 connect success");
		// 	}
		// });


		// socketTask1.onOpen(() => {
		// 	//当WebSocket创建成功时，触发onopen事件
		// 	console.log("socketTask1 open");
		// 	let data = JSON.stringify({
		// 		op: 'subscribe', args: [
		// 			{ channel: 'tickers', instId: symbol + '-USDT' },
		// 			{ channel: 'trades', instId: symbol + '-USDT' },
		// 			// { channel: 'candle1D', instId: symbol + '-USDT' },
		// 		]
		// 	})
		// 	socketTask1.send({ data })
		// })


		// socketTask2 = uni.connectSocket({
		// 	// url: 'wss://norton.im/wss',
		// 	// url: 'wss://ws.okx.com:8443/ws/v5/business',
		// 	url: wsOkxBusiness,
		// 	header: {
		// 		'content-type': 'application/json'
		// 	},
		// 	// protocols: ['protocol1'],
		// 	// method: 'GET',
		// 	success: () => {
		// 		console.log("Socket2 connect success");
		// 	}
		// });

		// socketTask2.onOpen(() => {
		// 	//当WebSocket创建成功时，触发onopen事件
		// 	console.log("socketTask2 open");
		// 	subscribeKline()
		// })

		// socketTask1.onMessage(onSocketMessage);
		// socketTask2.onMessage(onSocketMessage);
	})

	onUnmounted(() => {
		console.log('kine onUnmounted')
		if (socketTask1) {
			socketTask1.close()
		}

	})
</script>


<style lang="scss">
	page {
		background-color: #000;
	}

	/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
	.charts-box {
		width: 750rpx;
		height: 604rpx;
		background-color: #000;
	}
</style>