<template>
	<view>
		<view>{{tools.floorAmount(tempBalance, 6)}}</view>
		<view v-if="binit" :step="step" :change:step="ethers.receiveStep"></view>
		<view v-if="binit" :chain="chain" :change:chain="ethers.receiveChain"></view>
		<view v-if="binit" :token="token" :change:token="ethers.receiveToken"></view>
		<view v-if="binit" :address="address" :change:address="ethers.receiveAddress"></view>
	</view>
</template>
<script>
	import {
		onUnmounted
	} from 'vue';
	import tools from '@/utils/tools.js'
	export default {
		name: "com-wallet-create",
		props: {
			address: {
				type: String
			},
			chain: {
				type: Object
			},
			token: {
				type: String,
				default: null
			},
			step: {
				type: Number,
				default: 0
			},
			balance: {
				default: 0
			},
		},
		data() {
			return {
				binit: false,
				tempBalance: 0,
				tools: tools
			};
		},
		mounted() {
			// console.log('setup: mounted', this.wallet)
			// console.log('services mounted', this.chain_id)
		},
		methods: {
			init() {

			},
			receiveInit(value) {
				// console.log('receiveInit : renderjs返回的值-->', value);
				this.binit = value;
				if (this.binit) {
					this.init(); //初始化数据操作。
				}
			},
			receiveBalanceValue(value) {
				// console.log('receiveBalanceValue : renderjs返回的值-->', value);
				this.tempBalance = value
				this.$emit('update:balance', value)
			}
		}
	}
</script>


<script module="ethers" lang="renderjs">
	export default {
		data() {
			//视图层数据
			return {
				ethersInit: false,
				tronInit: false,
				tokenAddress: null,
				addressRender: null,
				chainRender: null,
				stepRender: 0,
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
			// console.log('ethers: mounted')
			if (typeof window.Buffer === 'function') {
				this.handleInitBuffer()
			} else {
				// console.log('not function')
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
				// console.log('not function')
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
				// console.log('not function')
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
				// console.log('handleInitBuffer')
			},
			async handleInitTronWeb() {
				// console.log('handleInittronWeb')
				console.log("TronWeb=", TronWeb.version);

				this.tronInit = true;
				this.$ownerInstance.callMethod('receiveInit', this.ethersInit && this.tronInit)

			},
			async handleInitEthers() {
				// console.log('handleInitEthers')
				// console.log('ethers', ethers)
				// console.log("ethers=", ethers.version);				

				this.ethersInit = true;
				this.$ownerInstance.callMethod('receiveInit', this.ethersInit && this.tronInit)				
				
			},
			async getTronBalance() {
				window.tronWeb = new TronWeb({
					fullHost: this.chainRender.rpc,
				})
				this.tronWeb = window.tronWeb
				if (!tronWeb.isAddress(this.addressRender)) {
					return 0;
				}

				if (!this.tokenAddress) {
					let balance = await tronWeb.trx.getBalance(this.addressRender)
					// console.log('getTrxBalance', balance)
					return tronWeb.fromSun(balance);
				} else {
					let contract = await tronWeb.contract(this.abi, this.tokenAddress);
					const result = await contract.balanceOf(this.addressRender).call({
						from: this.addressRender
					});
					let balance = tronWeb.BigNumber(result._hex)
					// console.log('getTronBalance', balance)
					return tronWeb.fromSun(balance.toString(10));
				}
			},
			async getEthBalance() {
				if (!ethers.isAddress(this.addressRender)) {
					return 0;
				}
				if (!this.tokenAddress) {
					let provider = new ethers.JsonRpcProvider(this.chainRender.rpc);
					const balance = await provider.getBalance(this.addressRender)
					// console.log('eth Balance', balance)
					return ethers.formatEther(balance);
				} else {
					let provider = new ethers.JsonRpcProvider(this.chainRender.rpc);
					const token = new ethers.Contract(this.tokenAddress, this.abi, provider);
					const balance = await token.balanceOf(this.addressRender).catch(errors => console.log(errors
						.message));
					const decimals = await token.decimals().catch(errors => console.log(errors.message));
					// console.log('token balance', balance, this.tokenAddress, decimals)
					if (!balance) {
						return 0;
					}
					return ethers.formatUnits(balance, decimals);
				}
			},
			async getBalance() {
				if (!this.chainRender || !this.addressRender) {
					return;
				}
				// console.log('getBalance ... ... ... ', this.chainRender, this.addressRender)
				let balance = 0;
				if (this.chainRender.type == "eth") {
					balance = await this.getEthBalance();
				} else
				if (this.chainRender.type == "tron") {
					balance = await this.getTronBalance();
				}
				this.$ownerInstance.callMethod('receiveBalanceValue', balance)
			},
			// 接收逻辑层发送的数据
			async receiveAddress(newValue, oldValue, ownerVm, vm) {
				console.log('receive Address', newValue)
				if (newValue) {
					this.addressRender = newValue;
					this.getBalance();
				}
			},
			async receiveChain(newValue, oldValue, ownerVm, vm) {
				// console.log('receive Chain', newValue, oldValue)
				if (newValue) {
					this.chainRender = newValue;
					this.getBalance();
				}
			},
			async receiveToken(newValue, oldValue, ownerVm, vm) {
				console.log('receive Token', newValue, oldValue)
				if (newValue) {
					this.tokenAddress = newValue;
					this.getBalance();
				}
			},
			async receiveStep(newValue, oldValue, ownerVm, vm) {
				// console.log('receive Step', newValue)
				if (newValue) {
					this.stepRender = newValue;
					if (this.stepRender > 0) {
						this.getBalance();
					}
				}
			}

		}
	}
</script>

<style>

</style>