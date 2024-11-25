<template>
	<com-nav-bar title="区块详情" :border="true" backgroundColor="#fff"></com-nav-bar>
	<view class="text-sm bg-[#eeeeee] min-h-full">
		<view class="p-4">
			<h3>区块详情</h3>
		</view>
		<view class="mx-4 bg-white rounded-xl">
			<view class="border-bb p-3 text-base font-semibold">区块</view>
			<view class="p-3">
				<view class="text-gray-500 py-0.5">区块高度</view>
				<view class=" py-0.5 text-orange-400">{{parseInt(item.number)}}</view>
			</view>
			<view class="p-3 ">
				<view class="text-gray-500 py-0.5">区块哈希</view>
				<view class="text-gray-600 py-0.5">
					<view>{{tools.subString(item.hash, 0, -30)}}</view>
					<view class="flex items-end">
						<view>{{tools.subString(item.hash, -30)}}</view>
						<u-icon name="file-text-fill" class="ml-1" color="#fa923c" size="22"
							@click="tools.copyClick(item.hash)"></u-icon>
					</view>
				</view>
			</view>
			<view class="p-3 ">
				<view class="text-gray-500 py-0.5">时间</view>
				<view class="text-gray-600 py-0.5">
					{{ tools.timeAlgo(item.timestamp) }}前 ({{tools.timestampToTime(item.timestamp, 'Y-m-d H:i:s')}})
				</view>
			</view>
			<view class="p-3 ">
				<view class="text-gray-500 py-0.5">出块者</view>
				<view class="text-gray-600 py-0.5  w-[600rpx] break-words">
					<view>{{tools.subString(item.miner, 0, -6)}}</view>
					<view class="flex items-end">
						<view>{{tools.subString(item.miner, -6)}}</view>
						<u-icon name="file-text-fill" class="ml-1" color="#fa923c" size="22"
							@click="tools.copyClick(item.miner)"></u-icon>
					</view>
				</view>
			</view>
			<view class="p-3 ">
				<view class="text-gray-500 py-0.5">区块大小</view>
				<view class="text-gray-600 py-0.5 ">
					{{parseInt(item.size)}} Bytes
				</view>
			</view>
			<view class="p-3 pb-8">
				<view class="text-gray-500 py-0.5">状态</view>
				<view class="text-gray-600 py-0.5 ">Success</view>
			</view>
		</view>
		<view class="h-[200rpx]"></view>
		<view :block="block" :change:block="ethers.receiveBlockNumber"></view>
		<view v-if="binit" :rpc="rpc" :change:rpc="ethers.receiveStart"></view>
	</view>
</template>

<script setup>
	import tools from '../../../utils/tools.js'
</script>

<script>	
	import {
		rpcUrl
	} from '@/config/http.js'
	export default {
		props: ['block'],
		data() {
			//视图层数据
			return {
				binit: false,
				rpc: null,
				// myBlock: this.block,
				item: {
					number: '',
					hash: '',
					timestamp: '',
					miner: '',
					size: '',
				}
			}
		},		
		mounted() {
			console.log('props', this.block)
		},
		methods: {
			init() {
				this.rpc = rpcUrl;
			},
			receiveInit(value) {
				console.log('receiveInit : renderjs返回的值-->', value);
				this.binit = value;
				if (this.binit) {
					this.init(); //初始化数据操作。
				}
			},
			receiveBlockValue(value) {
				this.item = value;
				console.log('receiveBlockValue : renderjs返回的值-->', value);
			}
		}
	}
</script>

<script module="ethers" lang="renderjs">
	export default {
		data() {
			//视图层数据
			return {
				rpc: null,
				blockNumber: 0,
				maxBlockNumber: 0,
			}
		},
		mounted() {
			console.log('logic mounted')
			if (typeof window.ethers === 'function') {
				this.handleInitEthers()
			} else {
				console.log('not function')
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录其相对路径相对于 www 计算
				script.src = 'static/ethers/dist/ethers.umd.min.js'
				//  script.type="text/plain"
				script.onload = this.handleInitEthers.bind(this)
				document.head.appendChild(script)
			}

		},
		methods: {
			handleInitEthers() {
				console.log('handleInitEthers')
				// console.log('ethers', ethers)
				console.log("ethers=", ethers.version);
				this.$ownerInstance.callMethod('receiveInit', true)
			},

			async getBlock() {
				let provider = new ethers.JsonRpcProvider(this.rpc);
				let blockResult = await provider.send(
					'eth_getBlockByNumber',
					['0x' + parseInt(this.blockNumber).toString(16), true]
				)
				this.$ownerInstance.callMethod('receiveBlockValue', blockResult)
			},

			// 接收逻辑层发送的数据
			async receiveBlockNumber(newValue, oldValue, ownerVm, vm) {
				if (newValue) {
					console.log('receiveBlockNumber', newValue)
					this.blockNumber = newValue;
				}
			},
			async receiveStart(newValue, oldValue, ownerVm, vm) {
				console.log('receiveStart1', newValue)
				if (newValue) {
					console.log('receiveStart2', newValue)
					this.rpc = newValue;
					this.getBlock();
				}
			},
			
		}
	}
</script>
<style lang="less" scoped>
	.border-bb {
		@apply border-0 border-b border-solid border-gray-200;
	}
</style>