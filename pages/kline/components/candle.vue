<template>
	<view class="flex text-white px-5 my-2 text-[0.85rem]">
		<view class="px-2 py-0.5 mr-1 rounded-md" v-for="(item, index) in barList" :key="index"
			:class="{'bg-[#282828]' : bar.value == item.value}" @click="barClick(item)">
			{{item.name}}
		</view>
	</view>
	
	<view class="charts-box">
		<qiun-data-charts type="candle" :opts="opts" :chartData="chartData" :disableScroll="true" :ontouch="true"
			:onmovetip="true" :onzoom="true" background="#000" scrollPosition="right" :update="true" :duration="0"
			@updateData="updateData" />
	</view>
</template>

<script setup>
	import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
	import { getOkxCandles, getOkxTrades } from "@/config/api";
	import tools from "@/utils/tools";
	import { wsOkx, wsOkxBusiness, wsOkxPublic } from '@/config/http.js'
	import useSocket from "@/hooks/socket/useSocket";
	
	const props = defineProps(['params'])
	const item = props.params ? JSON.parse(decodeURIComponent(props.params)) : null
	const symbol = item  ? item.name : 'BTC'
	
	let socketTask2;
	let bInit = false;
	
	
	const chartData = reactive({ categories: [], series: [] })
	//您可以通过修改 config-ucharts.js 文件中下标为 ['candle'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
	const opts = ref({
		update: true,
		// scrollPosition: 'right',
		duration: 0,
		rotate: false,
		rotateLock: false,
		color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
			"#ea7ccc"
		],
		padding: [15, 15, 0, 15],
		fontSize: 10,
		dataLabel: true,
		enableScroll: true,
		enableMarkLine: false,
		legend: {
			// padding: 30,
			// margin: 30
		},
		xAxis: {
			labelCount: 4,
			itemCount: 60,
			disableGrid: true,
			gridColor: "#ffffff",
			gridType: "solid",
			dashLength: 4,
			scrollShow: false,
			scrollAlign: "right",
			scrollColor: "#ffffff",
			scrollBackgroundColor: "#ffffff",
			titleFontSize: 10,
			// calibration: true,
			// splitNumber: 5,
		},
		yAxis: {
			disabled: true,
			disableGrid: false,
			gridColor: "#141414",
			splitNumber: 5,
			// showTitle: false,
			// min: 2000,
			// format: 'yAxisDemo3',
			// data: [{
			// 	type: 'candle',
			// 	position: 'right',
			// }]
		},
		extra: {
			candle: {
				color: {
					upLine: "#2fc25b",
					upFill: "#2fc25b",
					downLine: "#f04864",
					downFill: "#f04864"
				},
				average: {
					show: true,
					name: [
						"MA5",
						"MA10",
						"MA30"
					],
					day: [
						5,
						10,
						30
					],
					color: [
						"#1890ff",
						"#2fc25b",
						"#facc14"
					]
				}
			},
			markLine: {
				type: "dash",
				dashLength: 4,
				data: [{
					value: 0,
					lineColor: "#fff",
					showLabel: true,
					labelFontColor: '#fff',
					labelBgColor: '#000',
					// labelOffsetX: 30
				},
				{
					value: 0,
					lineColor: "#fff",
					showLabel: true,
					labelFontColor: '#fff',
					labelBgColor: '#000',
					// labelOffsetX: 30
				}
				]
			},
			tooltip: {
				showCategory: true,
				bgColor: '#3d3d3d',
				fontSize: 11
			}
		}
	})
	
	
	const barList = ref([
		{ name: '1分', value: '1m', candle: 'candle1M' },
		{ name: '15分', value: '15m', candle: 'candle15m' },
		{ name: '1小时', value: '1H', candle: 'candle1H' },
		{ name: '4小时', value: '4H', candle: 'candle4H' },
		{ name: '1日', value: '1D', candle: 'candle1D' },
	])
	const bar = ref({ name: '1日', value: '1D', candle: 'candle1D' })
	const barClick = (item) => {
		bInit = false;
	
		unsubscribeKline()
		bar.value = item
		getServerData()
		subscribeKline()
	}
	
	const subscribeKline = () => {
		let data = JSON.stringify({
			op: 'subscribe', args: [
				{ channel: bar.value.candle, instId: symbol + '-USDT' }
			]
		})
		socketTask2.send({ data })
	}
	
	const unsubscribeKline = () => {
		let data = JSON.stringify({
			op: 'unsubscribe', args: [
				{ channel: bar.value.candle, instId: symbol + '-USDT' }
			]
		})
		socketTask2.send({ data })
	}
	
	const updateData = (data) => {
		console.log('updateData', data)
	}
	
	const getServerData = () => {
	
		getOkxCandles(symbol + '-USDT', bar.value.value).then((res) => {
			let categories = [];
			let series = [{
				name: "货币行情",
				data: []
			}];
			for (let i = res.length - 1; i >= 0; i--) {
				let itemArr = res[i]
				const day = itemArr.shift()
				let dateTime;
				if (bar.value.value == '1D') {
					dateTime = tools.timestampToTime(day / 1000, 'm/d')
				} else {
					dateTime = tools.timestampToTime(day / 1000, 'm/d H:i')
				}
				categories.push(dateTime)
				let arr = [parseFloat(itemArr[0]), parseFloat(itemArr[3]), parseFloat(itemArr[2]), parseFloat(itemArr[1])]
				series[0].data.push(arr)
			}
			categories.push("")
			categories.push("")
			// chartData.value = { categories, series }
			chartData.categories = categories;
			chartData.series = series;
	
			setTimeout(() => {
				bInit = true
			}, 2000)
			// console.log(chartData.value)
		})
	
	}
	
	
	const onSocketMessage = (message) => {
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
	
		if (bInit && message.arg.channel == bar.value.candle) {
			let itemArr = message.data[0];
			if (chartData.series[0].data) {
				// console.log(bar.value.candle + ' ws', dataJson.data[0])
				const len = chartData.series[0].data.length - 1
	
				const day = itemArr.shift()
				// console.log(itemArr)
				let dateTime;
				if (bar.value.value == '1D') {
					dateTime = tools.timestampToTime(day / 1000, 'm/d')
				} else {
					dateTime = tools.timestampToTime(day / 1000, 'm/d H:i')
				}
				let arr = [parseFloat(itemArr[0]), parseFloat(itemArr[3]), parseFloat(itemArr[2]), parseFloat(itemArr[1])]
				chartData.series[0].data[len] = arr;
				// if (chartData.series[0].data[0].)
				if (dateTime == chartData.categories[len]) {
					chartData.series[0].data[len] = arr;
				} else {
					chartData.categories.push(dateTime)
					chartData.series[0].data.push(arr)
				}
			}
	
		}
	}
	
	onMounted(() => {
		getServerData()
		
		socketTask2 = useSocket({
			onOpen: send => {
				// subscribeKline(send)
				let data = JSON.stringify({
					op: 'subscribe', args: [
						{ channel: bar.value.candle, instId: symbol + '-USDT' }
					]
				})
				send(data)
			},
			onMessage: onSocketMessage
		}, wsOkxBusiness).socketTask
	})
	
	onUnmounted(() => {
		if (socketTask2) {
			socketTask2.close()
		}
	})
</script>

<style>
</style>