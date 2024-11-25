<template>
	<com-nav-bar title="交易详情" :border="true" backgroundColor="#fff"></com-nav-bar>
	<view class="text-sm bg-[#eeeeee] min-h-full">
		<view class="p-2 mx-4">
			<h3>交易详情</h3>
		</view>
		<view class="mx-4 bg-white rounded-xl">
			<view class="border-bb p-3 text-base font-semibold">Transfer</view>
			<view class="p-3">
				<view class="text-gray-500 py-0.5">区块高度</view>
				<view class=" py-0.5 text-orange-400">{{hash.blockNumber}}</view>
			</view>
			<view class="p-3 ">
				<view class="text-gray-500 py-0.5">哈希</view>
				<view class="text-gray-600 py-0.5">
					<view>{{tools.subString(hash.hash, 0, -30)}}</view>
					<view class="flex items-end">
						<view>{{tools.subString(hash.hash, -30)}}</view>
						<u-icon name="file-text-fill" class="ml-1" color="#fa923c" size="22"
							@click="tools.copyClick(hash.hash)"></u-icon>
					</view>
				</view>
			</view>
			<view class="p-3 ">
				<view class="text-gray-500 py-0.5">区块</view>
				<view class="text-gray-600 py-0.5 flex">
					<view>{{hash.blockNumber}}</view>
					<u-icon name="file-text-fill" class="ml-1" color="#fa923c" size="22"
						@click="tools.copyClick(hash.blockNumber)"></u-icon>
				</view>
			</view>
			<view class="p-3 ">
				<view class="text-gray-500 py-0.5">时间</view>
				<view class="text-gray-600 py-0.5">
					{{tools.timeAlgo(hash.time)}}前 ({{tools.timestampToTime(hash.time, 'Y-m-d H:i:s')}})
				</view>
			</view>
			<view class="p-3 ">
				<view class="text-gray-500 py-0.5">From</view>
				<view class="text-gray-600 py-0.5  w-[600rpx] break-words">
					<view class="text-cyan-500">{{tools.subString(hash.from, 0, -7)}}</view>
					<view class="flex items-end text-cyan-500">
						<view>{{tools.subString(hash.from, -7)}}</view>
						<u-icon name="file-text-fill" class="ml-1" color="#fa923c" size="22"
							@click="tools.copyClick(hash.from)"></u-icon>
					</view>
				</view>
			</view>
			<view class="p-3 ">
				<view class="text-gray-500 py-0.5">To</view>
				<view class="text-gray-600 py-0.5  w-[600rpx] break-words">
					<view class="text-cyan-500">{{tools.subString(hash.to, 0, -7)}}</view>
					<view class="flex items-end">
						<view class="text-cyan-500">{{tools.subString(hash.to, -7)}}</view>
						<u-icon name="file-text-fill" class="ml-1" color="#fa923c" size="22"
							@click="tools.copyClick(hash.to)"></u-icon>
					</view>
				</view>
			</view>
			<view class="p-3 ">
				<view class="text-gray-500 py-0.5">Value</view>
				<view class="text-gray-600 py-0.5 ">
					{{parseFloat(hash.value)}} NRT
				</view>
			</view>
			<view class="p-3 ">
				<view class="text-gray-500 py-0.5">交易费</view>
				<view class="text-gray-600 py-0.5 ">
					{{tools.floorAmount(hash.fee, 8)}} NRT
				</view>
			</view>
			<view class="p-3 ">
				<view class="text-gray-500 py-0.5">Gas Price</view>
				<view class="text-gray-600 py-0.5 ">
					{{hash.gasPrice}}
				</view>
			</view>
			<view class="p-3 ">
				<view class="text-gray-500 py-0.5">Gas Limit</view>
				<view class="text-gray-600 py-0.5 ">
					{{hash.gasLimit}} | {{hash.gasUsed}} ({{usedPecent}}%)
				</view>
			</view>
			<view class="p-3 pb-8">
				<view class="text-gray-500 py-0.5">状态</view>
				<view class=" py-0.5 text-cyan-500" v-if="hash.status == 1">Success</view>
				<view class=" py-0.5 text-red-500" v-if="hash.status == 0">Fail</view>
			</view>
		</view>
		<view class="h-[200rpx]"></view>

		<view :tx="tx" :change:tx="ethers.receiveTxValue"></view>
		<view v-if="binit" :rpc="rpc" :change:rpc="ethers.receiveStart"></view>
	</view>
</template>

<script setup>
	import tools from '@/utils/tools'
</script>



<script>
	import {
		rpcUrl
	} from '@/config/http.js'
	export default {
		props: ['tx'],
		data() {
			//视图层数据
			return {
				binit: false,
				rpc: null,
				// txNumber: this.tx,
				hash: {
					blockNumber: 0,
					hash: '',
					from: '',
					to: '',
					cumulativeGasUsed: '',
					effectiveGasPrice: '',
					fee: 0,
					gasPrice: '0',
					gasLimit: 0,
					gasUsed: 0,
					status: '',
					time: 0,
					value: 0,
				}
			}
		},
		mounted() {
			console.log('props', this.tx)
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
			receiveTxHashValue(value) {
				this.hash = value;
				console.log('receiveTxHashValue : renderjs返回的值-->', value);
			}
		},
		computed: {
			usedPecent() {
				if (Number(this.hash.gasLimit) == 0) {
					return '0.00';
				}
				return (Number(this.hash.gasUsed) / Number(this.hash.gasLimit) * 100).toFixed(2)
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
				txNumber: ''
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

			async getHash() {
				let provider = new ethers.JsonRpcProvider(this.rpc);
				console.log('this.txNumber', this.txNumber)
				let receipt = await provider.getTransactionReceipt(this.txNumber);
				console.log('receipt', receipt)
				let hash = {
					gasLimit: 0,
					blockNumber: receipt.blockNumber,
					hash: receipt.hash,
					from: receipt.from,
					to: receipt.to,
					// cumulativeGasUsed: receipt.cumulativeGasUsed,
					// effectiveGasPrice: receipt.effectiveGasPrice,
					cumulativeGasUsed: '',
					effectiveGasPrice: '',
					fee: ethers.formatEther(receipt.fee),
					gasPrice: ethers.formatUnits(receipt.gasPrice, 'ether'),
					gasUsed: parseInt(receipt.gasUsed),
					status: parseInt(receipt.status),
					time: '',
					value: 0,
				}
				// hash.blockNumber = receipt.blockNumber
				// hash.hash = receipt.hash
				// hash.from = receipt.from
				// hash.to = receipt.to
				// hash.fee = parseFloat(ethers.formatEther(receipt.fee))
				// hash.gasPrice = ethers.formatUnits(receipt.gasPrice, 'ether')				
				// hash.gasUsed = parseInt(receipt.gasUsed)
				// hash.status = receipt.status


				let transaction = await provider.getTransaction(this.txNumber);
				console.log('transaction', transaction)
				hash.gasLimit = parseInt(transaction.gasLimit);
				hash.value = parseFloat(ethers.formatEther(transaction.value));
				// this.hash.gasPrice = ethers.formatEther(transaction.gasPrice);
				// this.hash.fee = parseFloat(this.hash.gasPrice) * this.hash.gasUsed

				let block = await provider.getBlock(receipt.blockNumber)
				console.log('block', block)
				hash.time = block.timestamp

				console.log('hash.value', hash)
				this.$ownerInstance.callMethod('receiveTxHashValue', hash)
			},

			// 接收逻辑层发送的数据
			async receiveTxValue(newValue, oldValue, ownerVm, vm) {
				console.log('receiveTxValue1', newValue)
				if (newValue) {
					console.log('receiveTxValue2', newValue)
					this.txNumber = newValue;
				}
			},
			async receiveStart(newValue, oldValue, ownerVm, vm) {
				console.log('receiveStart1', newValue)
				if (newValue) {
					console.log('receiveStart2', newValue)
					this.rpc = newValue;
					this.getHash();
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