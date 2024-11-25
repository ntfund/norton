<template>
	<view>
		<!-- 排序最底部的优先传输 -->
		<view v-if="binit && transferData !== null" :transferData="transferData"
			:change:transferData="ethers.receiveTransferData"></view>
		<!-- 定存 -->
		<view v-if="binit && estimateData !== null" :estimateData="estimateData"
			:change:estimateData="ethers.receiveEstimateData"></view>
		<!-- 签名 -->
		<view v-if="binit && signMessageData !== null" :signMessageData="signMessageData"
			:change:signMessageData="ethers.receiveSignMessageDataData"></view>
		<view v-if="depositData !== null" :depositData="depositData" :change:depositData="ethers.receiveDepositData">
		</view>
		<view v-if="validAddress !== null" :isAddress="validAddress" :change:isAddress="ethers.receiveIsAddress"></view>
		<view v-if="binit" :step="step" :change:step="ethers.receiveStep"></view>
		<view v-if="binit" :address="address" :change:address="ethers.receiveAddress"></view>
		<view v-if="binit" :chain="chain" :change:chain="ethers.receiveChain"></view>
		<view v-if="binit" :token="token" :change:token="ethers.receiveToken"></view>
		<view v-if="binit" :privateKey="privateKey" :change:privateKey="ethers.receivePrivateKey"></view>

		<!-- 最优先数据 -->
		<view v-if="balance !== null" :balance="balance" :change:balance="ethers.receiveBalance"></view>
		<view v-if="fee !== null" :fee="fee" :change:fee="ethers.receiveFee"></view>
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
			privateKey: {
				type: String
			},
			chain: {
				type: Object
			},
			token: {
				type: String,
				default: ''
			},
			step: {
				type: Number,
				default: 0
			},
			balance: {
				default: null
			},
			fee: {
				default: null
			},
		},
		data() {
			return {
				binit: false,
				tempBalance: 0,
				tools: tools,
				transferData: null,
				transferTransaction: null,
				validAddress: null,
				validResult: null,
				depositData: null,
				depositResult: null,
				estimateData: null,
				estimateResult: null,
				signMessageData: null,
				signMessageResult: null,
			};
		},
		mounted() {
			// console.log('setup: mounted', this.wallet)
			// console.log('services mounted', this.chain_id)
			console.log(this.balance);
			console.log(this.fee);
		},
		methods: {
			init() {

			},
			isAddress(address) {
				return new Promise((resolve, reject) => {
					this.validAddress = address;
					let count = 0;
					let timer = setInterval(() => {
						if (this.validResult !== null) {
							clearInterval(timer);
							resolve(this.validResult);
							this.validResult = null;
							this.validAddress = null;
						}
						count++;
						if (count >= 100) { //10秒
							clearInterval(timer);
							reject("timeout")
						}
					}, 100)
				})
			},
			/**
			 * @param {Object} formData
			 * from 转账者
			 * to 收款用户
			 * tokenAddres 合约地址，如果为ETH 或TRX 则为null
			 * amount 金额
			 * private_key 私钥
			 * @return Transaction hash | txID
			 */
			transfer(formData) {
				if (!formData.from) {
					return "转账者为空";
				} else
				if (!formData.to) {
					return "收款地址为空";
				} else
				if (!formData.amount) {
					return "金额为空";
				} else
				if (!formData.private_key) {
					return "私钥为空";
				}
				return new Promise((resolve, reject) => {
					this.transferData = formData
					let count = 0;
					let timer = setInterval(() => {
						if (this.transferTransaction !== null) {
							clearInterval(timer);
							resolve(this.transferTransaction);
							this.transferTransaction = null;
							this.transferData = null;
						}
						count++;
						if (count >= 20) { //10秒
							clearInterval(timer);
							reject("timeout")
						}
					}, 500)
				})
			},
			/**
			 * @param {Object} formData
			 * from 转账者
			 * tokenAddres 合约地址 项目方合约地址
			 * usdtAddress 要参与的代币合约地址
			 * amount 金额
			 * private_key 私钥
			 * @return Transaction hash | txID
			 */
			deposit(formData) {
				console.log('deposit', formData)
				if (!formData.from) {
					return "转账者为空";
				} else
				if (!formData.tokenAddress) {
					return "合约地址不能为空";
				} else
				if (!formData.amount) {
					return "金额为空";
				} else
				if (!formData.private_key) {
					return "私钥为空";
				} else
				if (!formData.usdtAddress) {
					return "代币合约不能为空";
				}
				return new Promise((resolve, reject) => {
					this.depositData = formData
					let count = 0;
					let timer = setInterval(() => {
						if (this.depositResult !== null) {
							clearInterval(timer);
							resolve(this.depositResult);
							this.depositResult = null;
							this.depositData = null;
						}
						count++;
						if (count >= 20) { //10秒
							clearInterval(timer);
							reject("timeout")
						}
					}, 500)
				})
			},
			/**
			 * @param {Object} formData
			 * from 转账者
			 * tokenAddres 合约地址 项目方合约地址
			 * private_key 私钥
			 */
			estimateDepositGas(formData) {
				console.log('estimateDepositGas', formData)
				if (!formData.from) {
					return "转账者为空";
				} else
				if (!formData.tokenAddress) {
					return "合约地址不能为空";
				} else
				if (!formData.private_key) {
					return "私钥为空";
				}
				console.log('estimateDepositGas22')
				return new Promise((resolve, reject) => {
					this.estimateData = formData
					let count = 0;
					let timer = setInterval(() => {
						if (this.estimateResult !== null) {
							clearInterval(timer);
							resolve(this.estimateResult);
							this.estimateResult = null;
							this.estimateData = null;
						}
						count++;
						if (count >= 20) { //10秒
							clearInterval(timer);
							reject("timeout")
						}
					}, 500)
				})
			},
			signMessage(message) {
				console.log('signMessage')
				return new Promise((resolve, reject) => {
					this.signMessageData = message
					let count = 0;
					let timer = setInterval(() => {
						if (this.signMessageResult !== null) {
							clearInterval(timer);
							resolve(this.signMessageResult);
							this.signMessageResult = null;
							this.signMessageData = null;
						}
						count++;
						if (count >= 20) { //10秒
							clearInterval(timer);
							reject("timeout")
						}
					}, 500)
				})
			},
			receiveInit(value) {
				// console.log('receiveInit : renderjs返回的值-->', value);
				this.binit = value;
				if (this.binit) {
					this.init(); //初始化数据操作。
				}
			},
			receiveBalanceValue(value) {
				console.log('receiveBalanceValue : renderjs返回的值-->', value);
				this.$emit('update:balance', value)
			},
			receiveFeeValue(value) {
				console.log('receiveFeeValue : renderjs返回的值-->', value);
				this.$emit('update:fee', value)
			},
			receiveIsValidAddress(value) {
				console.log('receiveIsValidAddress : renderjs返回的值-->', value);
				// this.$emit('update:isAddress', value)
				this.validResult = value;
			},
			receiveTransferHash(value) {
				console.log('receiveTransferHash : renderjs返回的值-->', value);
				this.transferTransaction = value;
			},
			receiveDepositHash(value) {
				console.log('receiveDepositHash : renderjs返回的值-->', value);
				this.depositResult = value;
			},
			receiveSignMessage(value) {
				console.log('signMessageResult : renderjs返回的值-->', value);
				this.signMessageResult = value;
			},
			receiveApprove() {
				uni.$emit('approve');
			},
			receiveApproved() {
				uni.$emit('approved');
			},
			receiveEstimateDepositGas(value) {
				console.log('receiveEstimateDepositGas : renderjs返回的值-->', value);
				this.estimateResult = value;
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
				privateKeyRender: null,
				tokenAddress: null,
				addressRender: null,
				chainRender: null,
				stepRender: 0,
				balanceEnable: false, //是否查询余额
				feeEnable: false, //是否查询手续费
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
				console.log("ethers=", ethers.version);

				this.ethersInit = true;
				this.$ownerInstance.callMethod('receiveInit', this.ethersInit && this.tronInit)

			},
			async getTronbalance() {
				window.tronWeb = new TronWeb({
					fullHost: this.chainRender.rpc,
				})
				this.tronWeb = window.tronWeb

				try{
					if (!this.tokenAddress) {
						let balance = await tronWeb.trx.getBalance(this.addressRender)
						console.log('getTrxBalance', balance)
						return tronWeb.fromSun(balance);
					} else {
						let contract = await tronWeb.contract(this.abi, this.tokenAddress);
						const result = await contract.balanceOf(this.addressRender).call({
							from: this.addressRender
						});
						let balance = tronWeb.BigNumber(result._hex)
						console.log('getTronBalance', balance)
						return tronWeb.fromSun(balance.toString(10));
					}
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
			},
			async getEthBalance() {
				if (!this.tokenAddress) {
					let provider = new ethers.JsonRpcProvider(this.chainRender.rpc);
					const balance = await provider.getBalance(this.addressRender)
					console.log('eth Balance', balance)
					return ethers.formatEther(balance);
				} else {
					let provider = new ethers.JsonRpcProvider(this.chainRender.rpc);
					const token = new ethers.Contract(this.tokenAddress, this.abi, provider);
					const balance = await token.balanceOf(this.addressRender).catch(errors => console.log(errors
						.message));
					const decimals = await token.decimals().catch(errors => console.log(errors.message));
					console.log('token balance', balance, this.tokenAddress, decimals)
					if (!balance) {
						return 0;
					}
					return ethers.formatUnits(balance, decimals);
				}
			},
			async getBalance() {
				// console.log('getBalance', this.addressRender, this.chainRender.type)
				if (!this.chainRender || !this.addressRender) {
					return;
				}
				console.log('getBalance ... ... ... ', JSON.stringify(this.chainRender), this.addressRender)
				let balance = 0;
				if (this.chainRender.type == "eth") {
					balance = await this.getEthBalance();
				} else
				if (this.chainRender.type == "tron") {
					balance = await this.getTronBalance();
				}
				this.$ownerInstance.callMethod('receiveBalanceValue', balance)
			},
			async estimateGas() {
				if (!this.chainRender || !this.addressRender) return;
				let fee = 0;
				let balance = 0;
				if (this.chainRender.type == "eth") {
					let provider = new ethers.JsonRpcProvider(this.chainRender.rpc);
					let feeData = await provider.getFeeData();
					if (!this.tokenAddress) {
						let feeGas = (feeData.maxFeePerGas ? feeData.maxFeePerGas : feeData.gasPrice) * BigInt(21121);
						fee = ethers.formatEther(feeGas.toString(10));
					} else {
						let signer = new ethers.Wallet(this.privateKeyRender, provider)
						let contract = new ethers.Contract(this.tokenAddress, this.abi, signer);
						let feeGas = await contract.transfer.estimateGas(this.addressRender, 0)
						fee = ethers.formatEther((feeGas * feeData.gasPrice).toString(10));
					}

					this.$ownerInstance.callMethod('receiveFeeValue', fee)
				} else if (this.chainRender.type == "tron") {
					balance = await this.getTrxBalance(this.addressRender)
				}
			},
			async doSomething() {
				// console.log('doSomething', this.chainRender, this.addressRender, this.balanceEnable)
				if (!this.chainRender || !this.addressRender) return;
				if (this.balanceEnable) {
					this.getBalance();
				}
				if (this.feeEnable) {
					this.estimateGas()
				}
			},
			// 接收逻辑层发送的数据
			async receiveAddress(newValue, oldValue, ownerVm, vm) {
				console.log('receive Address', newValue)
				if (newValue) {
					this.addressRender = newValue;
					this.doSomething();
				}
			},
			async receiveIsAddress(newValue, oldValue, ownerVm, vm) {
				console.log('receiveIsAddress', newValue)
				if (newValue) {
					let isAddress = false;
					if (this.chainRender.type == "eth") {
						isAddress = ethers.isAddress(newValue);
					} else
					if (this.chainRender.type == "tron") {
						isAddress = tronWeb.isAddress(newValue);
					}
					this.$ownerInstance.callMethod('receiveIsValidAddress', isAddress)
				}
			},
			async receiveChain(newValue, oldValue, ownerVm, vm) {
				console.log('receive Chain', newValue, oldValue)
				if (newValue) {
					this.chainRender = newValue;
					this.doSomething();
				}
			},
			async receiveToken(newValue, oldValue, ownerVm, vm) {
				console.log('receive Token', newValue, oldValue)
				if (newValue) {
					this.tokenAddress = newValue;
					this.doSomething();
				}
			},
			async receivePrivateKey(newValue, oldValue, ownerVm, vm) {
				if (newValue) {
					this.privateKeyRender = newValue;
				}
			},
			async receiveStep(newValue, oldValue, ownerVm, vm) {
				// console.log('receive Step', newValue)
				if (newValue) {
					this.stepRender = newValue;
					if (this.stepRender > 0) {
						this.doSomething();
					}
				}
			},
			async receiveBalance(newValue, oldValue, ownerVm, vm) {
				console.log('receiveBalance', newValue)
				this.balanceEnable = true;
			},
			async receiveFee(newValue, oldValue, ownerVm, vm) {
				console.log('receiveFee', newValue)
				this.feeEnable = true;
			},
			async receiveTransferData(newValue, oldValue, ownerVm, vm) {
				console.log('receiveTransferData', JSON.stringify(newValue))
				if (newValue) {
					console.log("确认交易")
					try{
						if (this.chainRender.type == "eth") {
							let provider = new ethers.JsonRpcProvider(this.chainRender.rpc);
							let signer = new ethers.Wallet(newValue.private_key, provider)
							if (!newValue.tokenAddress) {
								let tx = await signer.sendTransaction({
									to: newValue.to,
									value: ethers.parseEther("" + newValue.amount)
								});
								this.$ownerInstance.callMethod('receiveTransferHash', tx)
								console.log('Transfer:', tx.hash)
								let receipt = await tx.wait();
								// this.$ownerInstance.callMethod('receiveBConfirmedValue', receipt)
							} else {
								let contract = new ethers.Contract(newValue.tokenAddress, this.abi, signer);
								let tx = await contract.transfer(newValue.to, ethers.parseUnits("" + newValue.amount,
									newValue.decimals))
								this.$ownerInstance.callMethod('receiveTransferHash', tx)
								console.log('Transfer:', tx.hash)
								let receipt = await tx.wait();
								// this.$ownerInstance.callMethod('receiveBConfirmedValue', receipt)
							}
						} else if (this.chainRender.type == "tron") {
							tronWeb.setPrivateKey(newValue.private_key)
							tronWeb.setAddress(newValue.from)
							if (!newValue.tokenAddress) {
								let receipt = tronWeb.trx.sendTransaction(newValue.to, tronWeb.toSun("" + newValue
									.amount));
								this.$ownerInstance.callMethod('receiveTransferHash', receipt)
							} else {
								let contract = await tronWeb.contract(this.abi, newValue.tokenAddress);
								let receipt = await contract.transfer(newValue.to, tronWeb.toSun("" + newValue.amount))
									.send();
								this.$ownerInstance.callMethod('receiveTransferHash', receipt)
							}
						}
					}catch(e){
						//TODO handle the exception
						console.log(e)
						this.$ownerInstance.callMethod('receiveTransferHash', -1)
					}
				}
			},
			async checkAndApprove(newValue) {
				if (this.chainRender.type == "eth") {
					let provider = new ethers.JsonRpcProvider(this.chainRender.rpc);
					let signer = new ethers.Wallet(newValue.private_key, provider)
					let usdtContract = new ethers.Contract(newValue.usdtAddress, this.abi, signer);
					const approveAmount = await usdtContract.allowance(newValue.from, newValue.tokenAddress)
					console.log('checkHasApprove', approveAmount, ethers.parseEther("" + newValue.amount));

					this.$ownerInstance.callMethod('receiveApprove')
					if (approveAmount < ethers.parseEther("" + newValue.amount)) {
						//授权操作
						this.$ownerInstance.callMethod('receiveApprove')
						let tx = await usdtContract.approve(newValue.tokenAddress,
							'115792089237316195423570985008687907853269984665640564039457584007913129639935')
						await tx.wait();
						this.$ownerInstance.callMethod('receiveApproved')
					} else {
						console.log('approved')
					}
				}
			},
			async receiveDepositData(newValue, oldValue, ownerVm, vm) {
				console.log('receiveDepositData', newValue)
				if (newValue) {
					console.log("确认交易")
					if (this.chainRender.type == "eth") {
						let provider = new ethers.JsonRpcProvider(this.chainRender.rpc);
						let signer = new ethers.Wallet(newValue.private_key, provider)

						await this.checkAndApprove(newValue)

						let abi = [{
							"inputs": [{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							}],
							"name": "deposit",
							"outputs": [{
								"internalType": "bool",
								"name": "",
								"type": "bool"
							}],
							"stateMutability": "nonpayable",
							"type": "function"
						}]
						let bnbContract = new ethers.Contract(newValue.tokenAddress, abi, signer);
						// let tx = await contract.deposit(ethers.parseEther("" + newValue.amount))
						// this.$ownerInstance.callMethod('receiveDepositHash', tx)
						// let receipt = await tx.wait();
					}
				}
			},
			async receiveEstimateData(newValue, oldValue, ownerVm, vm) {
				console.log('receiveEstimateData', newValue)
				if (newValue) {
					if (this.chainRender.type == "eth") {
						let provider = new ethers.JsonRpcProvider(this.chainRender.rpc);
						let feeData = await provider.getFeeData();

						let signer = new ethers.Wallet(newValue.private_key, provider)
						let abi = [{
							"inputs": [{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							}],
							"name": "deposit",
							"outputs": [{
								"internalType": "bool",
								"name": "",
								"type": "bool"
							}],
							"stateMutability": "nonpayable",
							"type": "function"
						}]
						let contract = new ethers.Contract(newValue.tokenAddress, abi, signer);
						let feeGas = await contract.deposit.estimateGas(0)
						let fee = ethers.formatEther((feeGas * feeData.gasPrice).toString(10));

						this.$ownerInstance.callMethod('receiveEstimateDepositGas', fee)
					}
				}
			},
			async receiveSignMessageDataData(newValue, oldValue, ownerVm, vm) {
				console.log('receiveSignMessageDataData', newValue, this.chainRender)
				if (newValue) {
					if (this.chainRender.type == "eth") {
						let provider = new ethers.JsonRpcProvider(this.chainRender.rpc);
						let feeData = await provider.getFeeData();

						let signer = new ethers.Wallet(this.privateKeyRender, provider)
						let sig = await signer.signMessage(newValue);

						this.$ownerInstance.callMethod('receiveSignMessage', sig)
					}
				}
			}
		}
	}
</script>

<style>

</style>