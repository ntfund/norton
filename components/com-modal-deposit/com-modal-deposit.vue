<template>
	<view>
		<u-popup :show="show" @close="close" mode="bottom" :round="20">
			<view class=" py-4 px-5  text-sm leading-6">
				<view class="border-0 border-b border-solid border-[#f0f2f3]">
					<view class="title flex justify-between items-center">
						<view class="flex flex-col">
							<view class="flex flex-row items-center">
								<h2 class="font-bold"><!--定期-->{{t('deposit.fixed.name')}}</h2>
								<span class="rounded px-1 ml-2"
									style="background: #f0f0f0">{{ data.cycle }}{{ t('timer.day') }}</span>
							</view>
							<view class="flex items-center mt-1">
								<view class="text-sm text-[#929292]"><!--剩余可投-->{{t('deposit.float.p17')}}</view>
								<span class=" ml-1 pb-0.5 text-[#000000d9]">
									{{ tools.floorAmount(data.total - data.number) }} USDT
								</span>
							</view>
						</view>
						<view class="flex justify-between items-center self-center rounded-xl py-2 px-2 bg-[#f5f7fb]"
							@click="data.payType = data.payType === 1 ? 2 : 1; tools.toastSuccess(t('message.exchangeSuccess')) ">
							<image v-if="data.payType === 1" src="/static/img/usdt.png" class="self-center"
								mode="aspectFit" alt="" style="width: 25px; height: 25px;" />
							<view v-else class="iconfont icon-money-wallet text-[22px] text-blue-600"></view>
							<view class="ml-1 flex-1">{{ typename }}</view>
						</view>
						<view>
							<u-icon name="close" @click="close"></u-icon>
						</view>
					</view>
					<view class="flex justify-end items-center" v-if="data.payType === 1">
						{{tools.hideAccount(wallet.account, 12, 8)}}
						<view class="ml-2 text-blue-500" @click="choiceWallet">选择钱包</view>
					</view>
				</view>

				<view class="body py-2">
					<view class="flex justify-between items-center">
						<view class="text-[#929292]"><!--申购数量-->{{t('deposit.p7')}}</view>
						<view class="text-[#000000d9] flex items-center">
							<!-- <view class="text-gray-500">{{tools.hideAccount("0x95Ba9b72FD3Cb8335DD30B340208F024F4863196", 7, 4)}}</view> -->
							<span
								class="ml-2 font-medium">{{ data.payType === 1 ? tools.formatNumber2(walletStore.wallet.usdt, 2) : tools.formatNumber2(balanceStore.usdt, 2)}}</span>
							<span class="ml-1">USDT 余额</span>
						</view>
					</view>
					<view class="flex justify-between my-1 items-center border border-solid border-[#333] rounded">
						<input type="digit" v-model="data.buyAmount" step="1" class="w-50 outline-0 p-4 pl-2"
							:class="{'font-bold' : data.buyAmount > 0}" autofocus
							:placeholder="t('deposit.min')+data.min" ref="userAmountInput" cursor-spacing="50">
						<view class="text-sm pr-2">USDT</view>
					</view>
					<view class="flex justify-between">
						<view class="text-[#929292]"><!--申购时间-->{{t('deposit.fixed.p5')}}</view>
						<view class="text-[#000000d9]">{{ tools.getNowTime("YYYY/mm/dd HH:MM") }}</view>
					</view>
					<view class="flex justify-between">
						<view class="text-[#929292]">{{t('deposit.fixed.p6')}}</view>
						<view class="text-[#000000d9]">{{t('deposit.fixed.p7')}}</view>
					</view>
					<view class="flex justify-between">
						<view class="text-[#929292]">{{t('deposit.fixed.p8')}}</view>
						<view class="text-[#000000d9]">{{t('deposit.fixed.p9')}}</view>
					</view>
					<view class="flex justify-between">
						<view class="text-[#929292]">{{t('deposit.fixed.p10')}}</view>
						<view class="text-[#000000d9]">
							{{ tools.getNowTimeDelta(data.cycle * 86400, "YYYY/mm/dd HH:MM") }}
						</view>
					</view>
					<view class="flex justify-between">
						<view class="text-[#929292]"><!--参考月化-->{{t('deposit.fixed.p11')}}</view>
						<view class="text-[#000000d9]">{{ tools.floorAmount(data.rate * 30) }}%</view>
					</view>
					<view class="flex justify-between">
						<view class="text-[#929292]"><!--到期收益-->{{t('deposit.fixed.p13')}}</view>
						<view class="text-[#000000d9]">{{ profit }}</view>
					</view>
				</view>
				<view class="footer mt-2 mb-1">
					<button type="button" :disabled="disable || disable2"
						class="w-100 rounded-xl py-3 border-0 text-white text-lg"
						:class="{'bg-gray-600': (disable || disable2), 'bg-blue-600': !disable && !disable2}"
						@click="HandClicked(wallet)">
						{{ t('Ido.buy') }}
					</button>
				</view>
			</view>

		</u-popup>

		<view v-if="binit" :wallet="wallet" :change:wallet="ethers.receiveWallet"></view>
		<view v-if="binit" :index="index" :change:index="ethers.receiveIndex"></view>
		<!-- <u-notify :message="t('message.exchangeSuccess')" :show="show"></u-notify> -->
	</view>
</template>

<script setup>
	import {
		computed,
		ref
	} from "vue";
	import {
		useBalanceStore
	} from "@/stores/modules/userBalance";
	import {
		useUserStore
	} from "@/stores/modules/user";
	import {
		useWallectSelected
	} from "@/stores/modules/wallectSelected";

	const balanceStore = useBalanceStore();
	const userStore = useUserStore();
	const walletStore = useWallectSelected();

</script>

<script>
	import ChainId from '@/data/ChainId.js'
	import tools from "@/utils/tools";
	import project from "@/utils/project";
	import {
		useI18n
	} from "vue-i18n";
	import {
		addOrder
	} from "@/config/api";
	import {
		formatEther,
		parseEther
	} from "ethers";
	// import {
	// 	useWallectSelected
	// } from "@/stores/modules/wallectSelected";
	import i18n from '@/lang/'
	const { locale, t } = i18n.global


	export default {
		props: {
			show: false,
			data: Object
		},
		data() {
			return {
				index: 0,
				timer: '',
				showBalance: false,
				binit: false,
				wallet: {
					id: 0,
					account: '', //随机地址
					chain_id: 4,
					chain: {
						name: '',
						symbol: '',
						icon: '',
						rpc: '',
						rpc2: '',
						chain_id: 0,
						type: 'eth',
						tokens: []
					},
				},
				tokens: [],
				disable: false,
				tools,
				project,
				t
			};
		},
		onLoad(options) {
			console.log('options', options)
			// this.data = this.props.data
		},
		mounted(options) {
			console.log('sercies mounted', this.data, this.show)
			//更新资产列表余额 / 5秒
			this.timer = setInterval(() => {
				this.index++;
			}, 5000)


			uni.$on('onShow', data => {
				console.log('onShow data', data);

				if (this.binit) {
					this.init()
				}
			});
		},
		beforeDestroy() {
			console.log('beforeDestroy')
			clearInterval(this.timer)
		},
		// onLoad() {
		// 	console.log('onLoad Vue2')
		// },
		// onShow() {

		// 	console.log('onShow Vue2 Vue2 Vue2 Vue2 Vue2 Vue2')
		// 	// const walletStr = uni.getStorageSync('wallet')
		// 	// console.log('onShow walletStr', JSON.parse(walletStr))
		// 	this.wallet = {} //防止选择相同钱包后，余额不刷新。 其实也是可以优化，更改wallet变化条件
		// 	if (this.binit) {
		// 		this.init()
		// 	}
		// },
		methods: {
			async init() {
				await this.getWallet()
				this.index++;
			},
			receiveInit(value) {
				console.log('receiveInit : renderjs返回的值-->', value);
				this.binit = value;
				if (this.binit) {
					this.init(); //初始化数据操作。
				}
			},
			async getWallet() {
				//获取钱包。 先从缓存获取。
				const walletStr = uni.getStorageSync('walletSelected')
				let walletId = 0;
				let chain_id = 0;
				console.log('getwallet', walletStr)
				if (walletStr) {
					try {
						let wallet = JSON.parse(walletStr);
						console.log('getwallet', wallet)
						// walletId = wallet.id
						// chain_id = wallet.chain_id
						this.wallet = wallet
					} catch (e) {
						//TODO handle the exception
					}
				} else {
					//从用户账户获得默认钱包
					let result = await uni.$u.http.get('/userWallet/?chain_id=' + ChainId.BNB)
					console.log('http wallet', result)

					this.wallet = result[0]
				}
				let walletStore = useWallectSelected()
				walletStore.setValue(this.wallet)
			},
			choiceWallet() {
				tools.navigateToWithEncode('/pages/wallet/walletManager', {
					type: 3, //1.选择钱包（钱包列表），2钱包管理，3选择钱包（转账认购）
					chain_id: ChainId.BNB,
					account: this.wallet.account,
					ids: [ChainId.BNB]
				})
			},
			receiveTokenValue(value) {
				console.log('receiveTokensValue : renderjs返回的值-->', value);
				let walletStore = useWallectSelected()
				walletStore.setWalletValue('usdt', value)
				this.wallet.usdt = value
				// console.log(wallectStore.wallect.usdt)
			},
			async HandClicked(wallet) {
				this.disable = true;
				setTimeout(() => {
					this.disable = false
				}, 1000)
								
				let userStore = useUserStore()
				if (userStore.user.vip < this.data.min_buy_level && userStore.user.svip < this.data.min_buy_level) {
					tools.toastError(t('message.noLevel'));
					return false;
				}

				const isOpen = await uni.$u.http.get('/setting/getIsOpenTime');
				if (!!!isOpen) {
					tools.toastError(t('buy.noOpen'));
					return false;
				}

				if (!this.data.buyAmount || parseFloat(this.data.buyAmount) < parseFloat(this.data.min)) {
					tools.toastError(t('buy.min') + this.data.min)
					return false;
				}

				//验证剩余申购额度
				if (this.data.buyAmount > this.data.total - this.data.number) {
					tools.toastError(t('buy.noAmount'))
					return false;
				}

				// console.log('HandClicked', this.data, this.wallet)

				if (this.data.payType === 2) {
					let balanceStore = useBalanceStore()
					if (parseFloat(this.data.buyAmount) > balanceStore.usdt) {
						tools.toastError(t('message.noBalance') + this.data.min)
						return false;
					}

					//余额支付 -- 提交至服务器
					addOrder({
						good_id: this.data.id,
						amount: this.data.buyAmount,
						pay_type: this.data.payType,
					}).then(res => {

						uni.$emit("newOrderFixed")
						project.getUser()
						tools.toastSuccess(t('message.buySuccess'))
						
						this.close()
					})
				} else {
					//钱包支付
					
					
					let walletStore = useWallectSelected()
					if (parseFloat(this.data.buyAmount) > walletStore.wallet.usdt) {
						tools.toastError(t('message.noBalance') + this.data.min)
						return false;
					}
					this.close()
					this.$emit('pay', this.data, this.wallet)
				}

			},
			close() {
				this.$emit('update:show', false)
			}
		},
		computed: {
			disable2() {
				return !!(this.data.total - this.data.number <= 0 || !!!this.data.buyAmount || this.data.buyAmount < this
					.data.min);
			},
			profit() {
				if (!this.data.buyAmount) return '0.0000';
				return tools.floorAmount(this.data.buyAmount * this.data.cycle * this.data.rate / 100, 4)
			},
			typename() {
				return this.data.payType === 1 ? t('pay.wallet') : t('pay.balance');
			}
		}
	};
</script>




<script module="ethers" lang="renderjs">
	export default {
		data() {
			//视图层数据
			return {
				title: '钱包列表',
				ethersInit: false,
				tronInit: false,
				chain: {},
				wallet: {},
				abi: [{
						"inputs": [{
								"internalType": "string",
								"name": "tokenName",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "symbolName",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "total",
								"type": "uint256"
							}
						],
						"stateMutability": "nonpayable",
						"type": "constructor"
					},
					{
						"anonymous": false,
						"inputs": [{
								"indexed": true,
								"internalType": "address",
								"name": "owner",
								"type": "address"
							},
							{
								"indexed": true,
								"internalType": "address",
								"name": "spender",
								"type": "address"
							},
							{
								"indexed": false,
								"internalType": "uint256",
								"name": "value",
								"type": "uint256"
							}
						],
						"name": "Approval",
						"type": "event"
					},
					{
						"inputs": [{
								"internalType": "address",
								"name": "spender",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							}
						],
						"name": "approve",
						"outputs": [{
							"internalType": "bool",
							"name": "",
							"type": "bool"
						}],
						"stateMutability": "nonpayable",
						"type": "function"
					},
					{
						"inputs": [{
								"internalType": "address",
								"name": "spender",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "subtractedValue",
								"type": "uint256"
							}
						],
						"name": "decreaseAllowance",
						"outputs": [{
							"internalType": "bool",
							"name": "",
							"type": "bool"
						}],
						"stateMutability": "nonpayable",
						"type": "function"
					},
					{
						"inputs": [],
						"name": "destroy",
						"outputs": [],
						"stateMutability": "nonpayable",
						"type": "function"
					},
					{
						"inputs": [{
								"internalType": "address",
								"name": "spender",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "addedValue",
								"type": "uint256"
							}
						],
						"name": "increaseAllowance",
						"outputs": [{
							"internalType": "bool",
							"name": "",
							"type": "bool"
						}],
						"stateMutability": "nonpayable",
						"type": "function"
					},
					{
						"inputs": [{
							"internalType": "uint256",
							"name": "amount",
							"type": "uint256"
						}],
						"name": "mint",
						"outputs": [{
							"internalType": "bool",
							"name": "",
							"type": "bool"
						}],
						"stateMutability": "nonpayable",
						"type": "function"
					},
					{
						"anonymous": false,
						"inputs": [{
								"indexed": true,
								"internalType": "address",
								"name": "previousOwner",
								"type": "address"
							},
							{
								"indexed": true,
								"internalType": "address",
								"name": "newOwner",
								"type": "address"
							}
						],
						"name": "OwnershipTransferred",
						"type": "event"
					},
					{
						"inputs": [],
						"name": "renounceOwnership",
						"outputs": [],
						"stateMutability": "nonpayable",
						"type": "function"
					},
					{
						"inputs": [{
								"internalType": "address",
								"name": "recipient",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							}
						],
						"name": "transfer",
						"outputs": [{
							"internalType": "bool",
							"name": "",
							"type": "bool"
						}],
						"stateMutability": "nonpayable",
						"type": "function"
					},
					{
						"anonymous": false,
						"inputs": [{
								"indexed": true,
								"internalType": "address",
								"name": "from",
								"type": "address"
							},
							{
								"indexed": true,
								"internalType": "address",
								"name": "to",
								"type": "address"
							},
							{
								"indexed": false,
								"internalType": "uint256",
								"name": "value",
								"type": "uint256"
							}
						],
						"name": "Transfer",
						"type": "event"
					},
					{
						"inputs": [{
								"internalType": "address",
								"name": "sender",
								"type": "address"
							},
							{
								"internalType": "address",
								"name": "recipient",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							}
						],
						"name": "transferFrom",
						"outputs": [{
							"internalType": "bool",
							"name": "",
							"type": "bool"
						}],
						"stateMutability": "nonpayable",
						"type": "function"
					},
					{
						"inputs": [{
							"internalType": "address",
							"name": "newOwner",
							"type": "address"
						}],
						"name": "transferOwnership",
						"outputs": [],
						"stateMutability": "nonpayable",
						"type": "function"
					},
					{
						"inputs": [],
						"name": "withdraw",
						"outputs": [],
						"stateMutability": "nonpayable",
						"type": "function"
					},
					{
						"stateMutability": "payable",
						"type": "receive"
					},
					{
						"inputs": [{
								"internalType": "address",
								"name": "owner",
								"type": "address"
							},
							{
								"internalType": "address",
								"name": "spender",
								"type": "address"
							}
						],
						"name": "allowance",
						"outputs": [{
							"internalType": "uint256",
							"name": "",
							"type": "uint256"
						}],
						"stateMutability": "view",
						"type": "function"
					},
					{
						"inputs": [{
							"internalType": "address",
							"name": "account",
							"type": "address"
						}],
						"name": "balanceOf",
						"outputs": [{
							"internalType": "uint256",
							"name": "",
							"type": "uint256"
						}],
						"stateMutability": "view",
						"type": "function"
					},
					{
						"inputs": [],
						"name": "decimals",
						"outputs": [{
							"internalType": "uint8",
							"name": "",
							"type": "uint8"
						}],
						"stateMutability": "view",
						"type": "function"
					},
					{
						"inputs": [],
						"name": "getOwner",
						"outputs": [{
							"internalType": "address",
							"name": "",
							"type": "address"
						}],
						"stateMutability": "view",
						"type": "function"
					},
					{
						"inputs": [],
						"name": "name",
						"outputs": [{
							"internalType": "string",
							"name": "",
							"type": "string"
						}],
						"stateMutability": "view",
						"type": "function"
					},
					{
						"inputs": [],
						"name": "owner",
						"outputs": [{
							"internalType": "address",
							"name": "",
							"type": "address"
						}],
						"stateMutability": "view",
						"type": "function"
					},
					{
						"inputs": [],
						"name": "symbol",
						"outputs": [{
							"internalType": "string",
							"name": "",
							"type": "string"
						}],
						"stateMutability": "view",
						"type": "function"
					},
					{
						"inputs": [],
						"name": "totalSupply",
						"outputs": [{
							"internalType": "uint256",
							"name": "",
							"type": "uint256"
						}],
						"stateMutability": "view",
						"type": "function"
					}
				]

			}
		},
		mounted() {
			let params = new URLSearchParams(location.search);
			console.log('params', params, location.href)
			console.log('logic mounted')
			if (typeof window.Buffer === 'function') {
				this.handleInitBuffer()
			} else {
				console.log('not function')
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录其相对路径相对于 www 计算
				script.src = 'static/vue-buffer/buffer.js'
				// script.type = "text/javascript"
				script.onload = this.handleInitBuffer.bind(this)
				document.head.appendChild(script)
			}
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
			if (typeof window.TronWeb === 'function') {
				this.handleInitTronWeb()
			} else {
				console.log('not function')
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录其相对路径相对于 www 计算
				script.src = 'static/tronweb/dist/TronWeb.js'
				//  script.type="text/plain"
				script.onload = this.handleInitTronWeb.bind(this)
				document.head.appendChild(script)
			}


		},
		methods: {
			handleInitBuffer() {
				console.log('handleInitBuffer')
			},
			async handleInitTronWeb() {
				console.log('handleInittronWeb')
				console.log("TronWeb=", TronWeb.version);

				window.tronWeb = new TronWeb({
					fullHost: 'https://trx.mytokenpocket.vip',
				})
				this.tronWeb = window.tronWeb
				this.tronInit = true;
				this.$ownerInstance.callMethod('receiveInit', this.ethersInit && this.tronInit)
			},
			handleInitEthers() {
				console.log('handleInitEthers')
				// console.log('ethers', ethers)
				console.log("ethers=", ethers.version);
				this.ethersInit = true;
				this.$ownerInstance.callMethod('receiveInit', this.ethersInit && this.tronInit)
			},
			async getTrxBalance(account) {
				let balance = await tronWeb.trx.getBalance(account)
				console.log('getTrxBalance', balance)
				return tronWeb.fromSun(balance);
			},
			async getEthBalance(account, Rpc) {
				console.log('getEthBalance', account, Rpc)
				let provider = new ethers.JsonRpcProvider(Rpc);
				const balance = await provider.getBalance(account)
				console.log('getEthBalance', balance)
				return ethers.formatEther(balance);
			},

			async getBalance(account, tokenAddress, decimals, Rpc) {
				if (tokenAddress == null) {
					return this.getEthBalance(account, Rpc);
				}
				let provider = new ethers.JsonRpcProvider(Rpc);
				const token = new ethers.Contract(tokenAddress, this.abi, provider);
				const balance = await token.balanceOf(account).catch(errors => console.log(errors.message));
				console.log('balance', balance)
				return ethers.formatUnits(balance, decimals);
			},


			// 接收逻辑层发送的数据
			async receiveWallet(newValue, oldValue, ownerVm, vm) {
				// console.log('receiveWallet变化了newValue', newValue)
				// console.log('receiveWallet变化了oldValue', oldValue)
				// console.log('receiveWallet变化了ownerVm', ownerVm)
				// console.log('receiveWallet变化了vm', vm)
				// this.wallet = await newValue
				// 
				console.log('receiveWallet newValue', newValue.account)
				if (newValue.account) {
					this.wallet = newValue
				}

			},
			async receiveIndex(newValue, oldValue, ownerVm, vm) {
				console.log('receiveIndex变化了newValue', newValue)
				if (newValue) {
					let balance = await this.getBalance(this.wallet.account,
						"0x55d398326f99059ff775485246999027b3197955", 18, "https://bsc.mytokenpocket.vip");
					console.log('balance', balance)
					this.$ownerInstance.callMethod('receiveTokenValue', balance)
				}
			},
		}
	}
</script>

<style lang="less" scoped>

</style>