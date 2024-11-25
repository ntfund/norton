<template>
	<view>
		<u-navbar :safeAreaInsetTop="false" leftText="返回" title="个人中心" height="408rpx">
			<template #left>
				<view></view>
			</template>
			<template #center>
				<view class="w-[100%] h-[408rpx] navbar-top relative">

					<image src="@/static/images/explore/bg@2x.png" mode="aspectFit"
						style="width: 750rpx; height: 408rpx; left:0; top: 0; position: absolute;"></image>
					<image src="@/static/images/explore/THE NORTON Blockchain Explorer@2x.png" mode="aspectFit"
						style="width: 602rpx; height: 99rpx; margin-left: 29rpx; margin-top: 127rpx;"></image>

					<div class="flex items-end justify-between bg-white nav-search h-[68rpx]">
						<input type="text" v-model="keyword" placeholder="请输入地址/交易Hash/区块号"
							class="flex-1 p-2 pl-[28rpx] ">
						<div class="flex items-center justify-center w-[100rpx] bg-[#7F17FE] p-2 search"
							@click="search">
							<!-- <u-icon name="search" color="#fefefe" size="35"></u-icon> -->
							<image src="@/static/images/explore/search@2x.png" mode="aspectFit"
								style="width: 35rpx; height: 36rpx; "></image>

						</div>
					</div>
				</view>

			</template>
		</u-navbar>
		<view>
			<view class="w-[100] h-[408rpx]"></view>
			<view class="bg-white relative block-info">
				<view class="block-info_nrt">
					<view class="left flex align-center">
						<image src="@/static/logo.png" mode="aspectFit" style="width: 80rpx; height: 80rpx;"></image>
						<view class="symbol">NRT</view>
					</view>
					<view class="right flex align-center">
						<view class="rate flex align-center">
							<image src="@/static/images/explore/up@2x.png" mode="aspectFit"
								style="width: 21rpx; height: 14rpx;"></image>
							<view class="font-[Gilroy-Regular] text-[#00C688] text-[30rpx]">+0.00%</view>
						</view>
						<view class="font-[Gilroy-Bold] font-bold text-[48rpx] mr-[3rpx] ml-[49rpx]">
							$ {{tools.floorAmountMinDigits(platformInfo.nrt, 2)}}
						</view>
					</view>
				</view>
				<view class="h-[2rpx] bg-[#F4F4F4] w-[100%] mt-[37rpx]"></view>
				<view class="flex justify-between align-center mt-[38rpx]">
					<view class="font-[SourceHanSansCN-Medium] text-[30rpx] font-medium">区块高度</view>
					<view class="font-[Gilroy-Medium] text-[30rpx] font-medium">{{platformInfo.blockNumber}}</view>
				</view>
				<view class="flex justify-between align-center mt-[38rpx]">
					<view class="font-[SourceHanSansCN-Medium] text-[30rpx] font-medium">超级节点</view>
					<view class="font-[Gilroy-Medium] text-[30rpx] font-medium">100</view>
				</view>
				<view class="flex justify-between align-center mt-[45rpx]">
					<view class="font-[SourceHanSansCN-Medium] text-[30rpx] font-medium">超级节点</view>
					<view class="font-[Gilroy-Medium] text-[30rpx] font-medium">
						{{tools.floorAmount(platformInfo.gasPrice, 0)}}Gwei
					</view>
				</view>
			</view>

			<view class="data-container">
				<view class="title-row">
					<view class="name">区块列表</view>
					<view class="more">更多 ></view>
				</view>
				<view class="data-list">
					<view class="data-list_item" v-for="(item) in blockList"
						@click="tools.navigateTo('/pages/explore/block/block', {block: item.number})">
						<view class="row row1">
							<view class="left">{{item.txns}} Txns</view>
							<view class="right">{{timeBefore(item.time)}} secs ago</view>
						</view>
						<view class="h-[2rpx] bg-[#F4F4F4] w-[100%] mt-[31rpx]"></view>
						<view class="row row2">
							<!-- 59229891 -->{{item.number}}
						</view>
						<view class="row row3">
							<view class="row3_1">
								Hash
							</view>
							<view class="row3_2">
								{{tools.hideAccount(item.hash, 15, 0).toUpperCase()}}
							</view>
							<view class="row3_3">
								大小
							</view>
							<view class="row3_4">
								{{item.size}}
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="data-container">
				<view class="title-row">
					<view class="name">交易列表</view>
					<view class="more">更多 ></view>
				</view>
				<view class="data-list">
					<view class="data-list_item" v-for="(item, index) in hashList" :key="index"
						@click="tools.navigateTo('/pages/explore/tx/tx', {tx: item.hash})">
						<view class="row row1">
							<view class="left">Transfer</view>
							<view class="right">{{timeBefore(item.time)}} secs ago</view>
						</view>
						<view class="h-[2rpx] bg-[#F4F4F4] w-[100%] mt-[31rpx]"></view>
						<view class="row row2">
							{{item.hash}}
						</view>
						<view class="row row3">
							<view class="row3_1">
								From
							</view>
							<view class="row3_2">
								<!-- 0x33a5F4b24102B... -->{{tools.hideAccount(item.hash, 15, 0).toUpperCase()}}
							</view>
							<view class="row3_3">
								数目
							</view>
							<view class="row3_4">
								{{tools.floorAmount(item.value, 6)}} NRT
							</view>
						</view>
					</view>
				</view>
			</view>

		</view>


		<!-- <view class="bg-white border-all mx-4 my-8 rounded-md shadow-md text-sm">
			<view class="border-bb">
				<h3 class="p-4">交易</h3>
			</view>
			<view class="px-4">
				<view class="row py-3 flex items-start justify-between border-bbb" v-for="(item, index) in hashList"
					:key="index" @click="tools.navigateTo('/pages/explore/tx/tx', {tx: item.hash})">
					<view class=" text-left w-1/3">
						<view class="text-cyan-500">{{tools.hideAccount(item.hash, 4, 6)}}</view>
						<view class="text-gray-500">{{timeBefore(item.time)}} secs ago</view>
					</view>
					<view class="text-left w-1/3 ">
						<view>
							<span>From</span><span
								class="text-cyan-500 ml-1">{{tools.hideAccount(item.from, 8, 0)}}</span>
						</view>
						<view>
							<span>To</span><span class="text-cyan-500 ml-1">{{tools.hideAccount(item.to, 8, 0)}}</span>
						</view>
					</view>
					<view class=" text-right  w-1/3">
						<view class="text-gray-700 ">{{tools.floorAmount(item.value, 6)}}</view>
						<view class="">NRT</view>
					</view>
				</view>
			</view>
		</view> -->

		<view class="h-[20rpx]"></view>

		<view v-if="binit" :rpc="rpc" :change:rpc="ethers.receiveStart"></view>

		<com-tab-bar></com-tab-bar>
	</view>

</template>
<style lang="scss" scoped>
	page {
		padding-bottom: 112rpx;
	}
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.border-all {
		@apply border border-solid border-gray-200;
	}

	.border-bb {
		@apply border-0 border-b border-solid border-gray-200;
	}

	.border-bbb {
		@apply border-0 border-b border-solid border-gray-100;
	}

	.nav-search {
		position: absolute;
		left: 28rpx;
		bottom: 50rpx;
		width: 694rpx;
		height: 68rpx;
		border-radius: 8rpx;

		.search {
			:active {
				background: #666 !important;
			}
		}
	}

	.block-info {
		background: #FFFFFF;
		box-shadow: 0px 8rpx 20rpx 0px rgba(202, 202, 202, 0.3);
		border-radius: 8rpx;
		padding: 38rpx 29rpx 48rpx 28rpx;
		margin: 42rpx 28rpx;



		.block-info_nrt {
			display: flex;
			align-items: center;
			justify-content: space-between;


			.left,
			.right {
				display: flex;
				align-items: center;
			}

			.left {
				.symbol {
					font-family: Gilroy-Bold;
					font-weight: bold;
					font-size: 40rpx;
					color: #000000;

					margin-left: 25rpx;
				}
			}

			.right {
				.rate {
					align-items: center;
				}
			}
		}
	}

	.data-container {
		margin: 80rpx 28rpx;

		.title-row {
			display: flex;
			justify-content: space-between;
			align-items: center;

			margin-bottom: 4rpx;

			.name {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 30rpx;
			}

			.more {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 24rpx;
			}

		}

		.data-list {
			&_item {
				padding: 39rpx 30rpx 30rpx 28rpx;

				margin-top: 20rpx;

				// width: 694px;
				// height: 220px;
				background: #FFFFFF;
				box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(202, 202, 202, 0.3);
				border-radius: 8rpx;

				.row {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.row2 {
					margin-top: 27rpx;
					margin-left: 1rpx;

					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 30rpx;
					color: #8456EB;

					text-overflow: ellipsis; //让超出的用...实现
					white-space: nowrap; //禁止换行
					overflow: hidden; //超出的隐藏
					display: block;
				}

				.row3 {
					margin-top: 25rpx;
					margin-left: 2rpx;

					&_1 {
						font-family: Gilroy-Medium;
						font-weight: 500;
						font-size: 26rpx;
						color: #999;
					}

					&_2 {
						font-family: Gilroy-Medium;
						font-weight: 500;
						font-size: 26rpx;
						color: #000;

						flex-grow: 1;
						flex-shrink: 1;

						margin-left: 36rpx;
					}

					&_3 {
						font-family: SourceHanSansCN-Medium;
						font-weight: 500;
						font-size: 26rpx;
						color: #999;

						flex-grow: 1;
						flex-shrink: 1;

						text-align: right;
						margin-right: 21rpx;
					}

					&_4 {
						font-family: Gilroy-Medium;
						font-weight: 500;
						font-size: 26rpx;
						color: #000;
					}
				}
			}
		}
	}
</style>
<script setup>
	import {
		computed,
		onMounted,
		reactive,
		ref,
		toRaw
	} from "vue";
	import tools from '@/utils/tools'

	const keyword = ref('')

	const timeBefore = computed(() => {
		return (time) => {
			return ((new Date).getTime() / 1000 - time) <= 0 ? 0 : ((new Date).getTime() / 1000 - time)
				.toFixed(0)
		}
	})

	const search = () => {
		console.log('search', keyword.value)
		if (!keyword.value) {
			return;
		}
		if (keyword.value.startsWith('0x')) {
			tools.navigateTo('/pages/explore/tx/tx', {
				tx: keyword.value
			})
		}
		if (!Number.isNaN(keyword.value)) {
			tools.navigateTo('/pages/explore/block/block', {
				block: keyword.value
			})
		}
	}
</script>

<script>
	import {
		rpcUrl
	} from '@/config/http.js'
	export default {
		data() {
			//视图层数据
			return {
				binit: false,
				rpc: null,
				blockList: [],
				hashList: [],
				platformInfo: {
					blockNumber: 0,
					gasPrice: '',
					nrt: 1
				}
			}
		},
		mounted() {

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
			receiveBlockListValue(value) {
				this.blockList = value;
				this.platformInfo.blockNumber = this.blockList[0].number
				// console.log('receiveBlockListValue : renderjs返回的值-->', value);
			},
			receiveHashListValue(value) {
				this.hashList = value;
				// console.log('receiveHashListValue : renderjs返回的值-->', value);
			},
			receiveGasPriceValue(value) {
				this.platformInfo.gasPrice = value;
				// console.log('receiveGasPriceValue : renderjs返回的值-->', value);
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
				blockList: [],
				hashList: [],
				platformInfo: {
					blockNumber: 0,
					gasPrice: ''
				},
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

			handBlock(block) {
				if (!block) return;
				let blockInfo = this.getBlockInfo(block);
				// console.log('blockInfo', blockInfo)
				if (blockInfo.number > this.maxBlockNumber) {
					this.maxBlockNumber = blockInfo.number
					// platformInfo.blockNumber = maxBlockNumber
				}
				this.blockList.push(blockInfo)
				this.blockList.sort(function(a, b) {
					return Number(b.number) - Number(a.number);
				})
				if (this.blockList.length > 3) {
					this.blockList.length = 3;
				}

				this.$ownerInstance.callMethod('receiveBlockListValue', this.blockList)
				this.getHashList([block])
			},

			async getBlockListEthers() {
				let provider = new ethers.JsonRpcProvider(this.rpc);
				let number = await provider.getBlockNumber()
				// console.log('number', number)
				// let block = await provider.getBlock(number);
				let block = await provider.send(
					'eth_getBlockByNumber',
					['0x' + number.toString(16), true]
				)
				// console.log(block)
				this.handBlock(block);

				for (var i = 1; i < 3; i++) {
					provider.send(
						'eth_getBlockByNumber',
						['0x' + (number - i).toString(16), true]
					).then(async (block) => {
						this.handBlock(block);
					})
				}

				setTimeout(() => {
					this.waitUntilNextBlock();
				}, 2000)
			},


			getHashList(blockTempArr) {
				blockTempArr.sort(function(a, b) {
					return Number(b.number) - Number(a.number);
				})
				for (let block of blockTempArr) {
					for (let hash of block.transactions) {
						this.hashList.push({
							hash: hash.hash,
							from: hash.from,
							to: hash.to,
							value: ethers.formatEther(hash.value),
							time: Number(block.timestamp) //初始数据时间随便，混乱就混乱
						})

						this.hashList.sort((a, b) => {
							return b.time - a.time;
						})

						if (this.hashList.length > 3) {
							this.hashList.length = 3;
						}

						break;
					}

					if (this.hashList.length >= 3) {
						break;
					}
				}

				this.$ownerInstance.callMethod('receiveHashListValue', this.hashList)
			},

			waitUntilNextBlock() {
				let provider = new ethers.JsonRpcProvider(this.rpc);
				provider.send(
					'eth_getBlockByNumber',
					['0x' + (this.maxBlockNumber + 1).toString(16), true]
				).then((block) => {
					if (block) {
						this.handBlock(block)
					}
				})

				setTimeout(() => {
					this.waitUntilNextBlock()
				}, 2000)
				// console.log('waitUntilNextBlock')
			},

			getBlockInfo(block) {
				return {
					number: Number(block.number),
					hash: block.hash,
					txns: block.transactions? block.transactions.length : 0,
					size: parseInt(block.size),
					time: Number(block.timestamp)
				}
			},

			async getGasPrice() {
				let provider = new ethers.JsonRpcProvider(this.rpc);
				let gasPrice = (await provider.getFeeData()).gasPrice;
				this.platformInfo.gasPrice = ethers.formatUnits(gasPrice, 'gwei');
				this.$ownerInstance.callMethod('receiveGasPriceValue', this.platformInfo.gasPrice)
			},

			// 接收逻辑层发送的数据
			async receiveStart(newValue, oldValue, ownerVm, vm) {
				console.log('receiveStart1', newValue)
				if (newValue) {
					console.log('receiveStart2', newValue)
					this.rpc = newValue;
					this.getGasPrice();
					this.getBlockListEthers();
				}
			},

		}
	}
</script>