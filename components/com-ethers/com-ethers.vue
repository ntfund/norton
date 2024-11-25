<template>
	<view>
		<!-- 排序最底部的优先传输 -->
		<view v-if="binit && transferData !== null" :transferData="transferData"
			:change:transferData="ethers.receiveTransferData"></view>
		<!-- 定存 -->
		<view v-if="binit && estimateData !== null" :estimateData="estimateData"
			:change:estimateData="ethers.receiveEstimateData"></view>
		<view v-if="binit && estimateFeeData !== null" :estimateFeeData="estimateFeeData"
			:change:estimateFeeData="ethers.receiveEstimateFeeData"></view>
		<!-- 签名 -->
		<view v-if="binit && signMessageData !== null" :signMessageData="signMessageData"
			:change:signMessageData="ethers.receiveSignMessageData"></view>
		<!-- 获取价格 -->
		<view v-if="binit && tokenPrice !== null" :tokenPrice="tokenPrice"
			:change:tokenPrice="ethers.receiveTokenPriceData"></view>
		<view v-if="binit && depositData !== null" :depositData="depositData"
			:change:depositData="ethers.receiveDepositData">
		</view>
		<view v-if="binit && validAddress !== null" :isAddress="validAddress"
			:change:isAddress="ethers.receiveIsAddress"></view>
		<view v-if="binit && balanceData !== null" :balanceData="balanceData"
			:change:balanceData="ethers.receiveBalanceData">
		</view>
		<view v-if="binit && balanceOfData !== null" :balanceOfData="balanceOfData"
			:change:balanceOfData="ethers.receiveBalanceOfData"></view>
			
		<view v-if="binit && onData !== null" :onData="onData"
			:change:onData="ethers.receiveOnData"></view>

		<view :rpc="rpc" :change:rpc="ethers.receiveRpcData"></view>
	</view>
</template>
<script>
	import {
		onUnmounted
	} from 'vue';
	export default {
		name: "com-wallet-create",
		props: {
			rpc: {
				type: String,
				default: null
			},
		},
		data() {
			return {
				binit: false,
				transferData: null,
				transferTransaction: null,
				validAddress: null,
				validResult: null,
				depositData: null,
				depositResult: null,
				estimateData: null,
				estimateResult: null,
				estimateFeeData: null,
				estimateFeeResult: null,
				signMessageData: null,
				signMessageResult: null,
				balanceOfData: null,
				balanceOfResult: null,
				onData: null,
				onCallback: null,
				balanceData: null,
				balanceResult: null,
				tokenPrice: null,
				tokenPriceResult: null,
			};
		},
		mounted() {
			// console.log('setup: mounted', this.wallet)
			// console.log('services mounted', this.chain_id)
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
			//查询BNB
			balance(address) {
				return new Promise((resolve, reject) => {
					this.balanceData = address;
					let count = 0;
					let timer = setInterval(() => {
						if (this.balanceResult !== null) {
							clearInterval(timer);
							resolve(this.balanceResult);
							this.balanceResult = null;
							this.balanceData = null;
						}
						count++;
						if (count >= 100) { //10秒
							clearInterval(timer);
							reject("timeout")
						}
					}, 100)
				})
			},
			//查询合约代币余额
			balanceOf(address, tokenAddress) {
				return new Promise((resolve, reject) => {
					this.balanceOfData = {
						address,
						tokenAddress
					};
					let count = 0;
					let timer = setInterval(() => {
						if (this.balanceOfResult !== null) {
							clearInterval(timer);
							resolve(this.balanceOfResult);
							this.balanceOfResult = null;
							this.balanceOfData = null;
						}
						count++;
						if (count >= 100) { //10秒
							clearInterval(timer);
							reject("timeout")
						}
					}, 100)
				})
			},
			getBalanceValue(address, tokenAddress = null) {
				if (tokenAddress) {
					return this.balanceOf(address, tokenAddress);
				} else {
					return this.balance(address)
				}
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
			 * 自动判断是否有授权，没有则会进行授权操作后处理
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
						if (count >= 3600) { //3600秒
							clearInterval(timer);
							reject("timeout")
						}
					}, 1000)
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
				// console.log('estimateDepositGas22')
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
			estimateTransferGas(formData) {
				console.log('estimateTransferGas', formData)
				if (!formData.from) {
					return "转账者为空";
				} else
				// if (!formData.tokenAddress) {
				// 	return "合约地址不能为空";
				// } else
				if (!formData.private_key) {
					return "私钥为空";
				}
				return new Promise((resolve, reject) => {
					this.estimateFeeData = formData
					let count = 0;
					let timer = setInterval(() => {
						if (this.estimateResult !== null) {
							clearInterval(timer);
							resolve(this.estimateResult);
							this.estimateFeeResult = null;
							this.estimateFeeData = null;
						}
						count++;
						if (count >= 20) { //10秒
							clearInterval(timer);
							reject("timeout")
						}
					}, 500)
				})
			},
			signMessage(message, privateKey) {
				console.log('signMessage')
				return new Promise((resolve, reject) => {
					this.signMessageData = {
						message,
						privateKey
					}
					let count = 0;
					let timer = setInterval(() => {
						if (this.signMessageResult !== null) {
							clearInterval(timer);
							resolve(this.signMessageResult);
							this.signMessageResult = null;
							this.signMessageData = null;
						}
						count++;
						if (count >= 10) { //5秒
							clearInterval(timer);
							reject("timeout")
						}
					}, 500)
				})
			},
			getTokenPrice(formData) {
				console.log('getTokenPrice')
				return new Promise((resolve, reject) => {
					this.tokenPrice = formData
					let count = 0;
					let timer = setInterval(() => {
						if (this.tokenPriceResult !== null) {
							clearInterval(timer);
							resolve(this.tokenPriceResult);
							this.tokenPriceResult = null;
							this.tokenPrice = null;
						}
						count++;
						if (count >= 10) { //5秒
							clearInterval(timer);
							reject("timeout")
						}
					}, 500)
				})
			},
			on(tokenAddress, address, callback) {
				this.onData = {
					address,
					tokenAddress
				};
				this.onCallback = callback
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
				this.balanceResult = value;
			},
			receiveBalanceOfValue(value) {
				console.log('receiveBalanceOfValue : renderjs返回的值-->', value);
				this.balanceOfResult = value;
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
				// console.log('signMessageResult : renderjs返回的值-->', value);
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
			},
			receiveEstimateFeeGas(value) {
				console.log('receiveEstimateDepositGas : renderjs返回的值-->', value);
				this.estimateResult = value;
			},
			receiveTokenPriceValue(value) {
				console.log('receiveTokenPriceValue : renderjs返回的值-->', value);
				this.tokenPriceResult = value;
			},
			receiveOnValue(value) {
				console.log('receiveOnValue : renderjs返回的值-->', value);
				this.onCallback(value)
			}
		}
	}
</script>


<script module="ethers" lang="renderjs">
	export default {
		data() {
			//视图层数据
			return {
				rpcRender: '',
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
			// || typeof globalThis !== "undefined"
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
		},
		methods: {
			async handleInitEthers() {
				// console.log('handleInitEthers')
				// console.log('ethers', ethers)
				console.log("ethers=", ethers.version);

				this.ethersInit = true;
				this.$ownerInstance.callMethod('receiveInit', this.ethersInit)

			},
			async getBalance(address, tokenAddress = null) {
				if (!tokenAddress) {
					let provider = new ethers.JsonRpcProvider(this.rpcRender);
					const balance = await provider.getBalance(address)
					console.log('eth Balance', balance)
					return ethers.formatEther(balance);
				} else {
					let provider = new ethers.JsonRpcProvider(this.rpcRender);
					const token = new ethers.Contract(tokenAddress, this.abi, provider);
					const balance = await token.balanceOf(address).catch(errors => console.log(errors
						.message));
					const decimals = await token.decimals().catch(errors => console.log(errors.message));
					console.log('token balance', balance, tokenAddress, decimals)
					if (!balance) {
						return 0;
					}
					return ethers.formatUnits(balance, decimals);
				}
			},
			async receiveEstimateFeeData(newValue, oldValue, ownerVm, vm) {
				if (newValue) {
					try{
						let provider = new ethers.JsonRpcProvider(this.rpcRender);
						let feeData = await provider.getFeeData();
						
						let signer = new ethers.Wallet(newValue.private_key, provider)
						
						let fee = 0;
						if (!newValue.tokenAddress) {
							let feeGas = (feeData.maxFeePerGas ? feeData.maxFeePerGas : feeData.gasPrice) * BigInt(21121);
							fee = ethers.formatEther(feeGas.toString(10));
						} else {
							let signer = new ethers.Wallet(newValue.private_key, provider)
							let contract = new ethers.Contract(newValue.tokenAddress, this.abi, signer);
							let feeGas = await contract.transfer.estimateGas(newValue.from, 0)
							fee = ethers.formatEther((feeGas * feeData.gasPrice).toString(10));
						}
						this.$ownerInstance.callMethod('receiveEstimateFeeGas', fee)
					}catch(e){
						//TODO handle the exception
						this.$ownerInstance.callMethod('receiveEstimateFeeGas', '~')
					}
				}
			},
			async receiveRpcData(newValue, oldValue, ownerVm, vm) {
				if (newValue) {
					this.rpcRender = newValue
				}
			},
			async receiveIsAddress(newValue, oldValue, ownerVm, vm) {
				console.log('receiveIsAddress', newValue)
				if (newValue) {
					let isAddress = ethers.isAddress(newValue);
					this.$ownerInstance.callMethod('receiveIsValidAddress', isAddress)
				}
			},
			async receiveBalanceData(newValue, oldValue, ownerVm, vm) {
				let balance = await this.getBalance(newValue);
				this.$ownerInstance.callMethod('receiveBalanceValue', balance)
			},
			async receiveBalanceOfData(newValue, oldValue, ownerVm, vm) {
				console.log('receiveBalanceOfData', newValue)
				if (newValue) {
					let balance = await this.getBalance(newValue.address, newValue.tokenAddress);
					this.$ownerInstance.callMethod('receiveBalanceOfValue', balance)
				}
			},
			async receiveOnData(newValue, oldValue, ownerVm, vm) {
				console.log('receiveOnData', newValue)
				if (newValue) {
					let provider = new ethers.JsonRpcProvider(this.rpcRender);
					const token = new ethers.Contract(newValue.tokenAddress, this.abi, provider);
					token.on('Transfer', (to, amount, from) => {
						// console.log(to, amount, from);
						this.$ownerInstance.callMethod('receiveOnValue', {to, amount, from})
					})
				}
			},			
			async receiveTransferData(newValue, oldValue, ownerVm, vm) {
				console.log('receiveTransferData', newValue)
				if (newValue) {
					try{
						console.log("确认交易")
						let provider = new ethers.JsonRpcProvider(this.rpcRender);
						let signer = new ethers.Wallet(newValue.private_key, provider)
						if (!newValue.tokenAddress) {
							let tx = await signer.sendTransaction({
								to: newValue.to,
								value: ethers.parseEther("" + newValue.amount)
							});
							this.$ownerInstance.callMethod('receiveTransferHash', tx)
							let receipt = await tx.wait();
							// this.$ownerInstance.callMethod('receiveBConfirmedValue', receipt)
						} else {
							let contract = new ethers.Contract(newValue.tokenAddress, this.abi, signer);
							let tx = await contract.transfer(newValue.to, ethers.parseUnits("" + newValue.amount, newValue.decimals))
							this.$ownerInstance.callMethod('receiveTransferHash', tx)
							let receipt = await tx.wait();
							// this.$ownerInstance.callMethod('receiveBConfirmedValue', receipt)
						}
					}catch(e){
						//TODO handle the exception
						this.$ownerInstance.callMethod('receiveTransferHash', -1)
						console.log(e)
					}
				}
			},
			async checkAndApprove(newValue) {
				let provider = new ethers.JsonRpcProvider(this.rpcRender);
				let signer = new ethers.Wallet(newValue.private_key, provider)
				let usdtContract = new ethers.Contract(newValue.usdtAddress, this.abi, signer);
				const approveAmount = await usdtContract.allowance(newValue.from, newValue.tokenAddress)
				console.log('checkHasApprove', approveAmount);


				if (parseFloat(ethers.formatUnits(approveAmount, newValue.decimals)) < parseFloat(newValue.amount)) {
					//授权操作
					this.$ownerInstance.callMethod('receiveApprove')
					let tx = await usdtContract.approve(newValue.tokenAddress,
						'115792089237316195423570985008687907853269984665640564039457584007913129639935')
					
					console.log('Approve tx:', JSON.stringify(tx))					
					this.$ownerInstance.callMethod('receiveApproved')
					await tx.wait();
				} else {
					console.log('approved')
				}
				
				return null;
			},
			async receiveDepositData(newValue, oldValue, ownerVm, vm) {
				console.log('receiveDepositData', newValue)
				if (newValue) {
					console.log("确认交易")
					await this.checkAndApprove(newValue)

					let abi = [{
						"inputs": [{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "good_id",
								"type": "uint256"
							}
						],
						"name": "deposit",
						"outputs": [{
							"internalType": "bool",
							"name": "",
							"type": "bool"
						}],
						"stateMutability": "nonpayable",
						"type": "function"
					}]
					try{
						let provider = new ethers.JsonRpcProvider(this.rpcRender);
						let signer = new ethers.Wallet(newValue.private_key, provider)
						let contract = new ethers.Contract(newValue.tokenAddress, abi, signer);
						let amount = ethers.parseUnits("" + newValue.amount, newValue.decimals);
						let tx = await contract.deposit(amount, newValue.good_id)
						console.log('deposit tx:', JSON.stringify(tx))
						this.$ownerInstance.callMethod('receiveDepositHash', tx)
						await tx.wait();
					}catch(e){
						//TODO handle the exception
						console.log('deposit error:', e)
						console.log(newValue.tokenAddress, amount, newValue.good_id)
						this.$ownerInstance.callMethod('receiveDepositHash', -1)
					}
				}
			},
			async receiveEstimateData(newValue, oldValue, ownerVm, vm) {
				// console.log('receiveEstimateData', newValue.tokenAddress)
				if (newValue) {					
					try{
						let provider = new ethers.JsonRpcProvider(this.rpcRender);
						let feeData = await provider.getFeeData();
						
						let signer = new ethers.Wallet(newValue.private_key, provider)
						let abi = [{
							"inputs": [{
									"internalType": "uint256",
									"name": "amount",
									"type": "uint256"
								},
								{
									"internalType": "uint256",
									"name": "good_id",
									"type": "uint256"
								}
							],
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
						let feeGas = await contract.deposit.estimateGas(0, 0)
						console.log('feeGas', feeGas, feeData.gasPrice, newValue.decimals)
						//ETH, BSC, POL 的本币 都是18位精度
						let fee = ethers.formatEther((feeGas * feeData.gasPrice).toString(10));
						
						this.$ownerInstance.callMethod('receiveEstimateDepositGas', fee)
					}catch(e){
						//TODO handle the exception
						console.log('receiveEstimateData error:', e)
						this.$ownerInstance.callMethod('receiveEstimateDepositGas', -1)
					}
				}
			},
			async receiveTokenPriceData(newValue, oldValue, ownerVm, vm) {
				// console.log('receiveTokenPriceData', newValue)
				if (newValue) {
					let provider = new ethers.JsonRpcProvider(this.rpcRender);

					let signer = new ethers.Wallet(newValue.private_key, provider)
					let abi = [{
						"inputs": [{
							"internalType": "uint256",
							"name": "amountIn",
							"type": "uint256"
						}, {
							"internalType": "address[]",
							"name": "path",
							"type": "address[]"
						}],
						"name": "getAmountsOut",
						"outputs": [{
							"internalType": "uint256[]",
							"name": "amounts",
							"type": "uint256[]"
						}],
						"stateMutability": "view",
						"type": "function"
					}]
					let contract = new ethers.Contract(newValue.routerAddress, abi, signer);
					let amount;
					try {
						let amounts = await contract.getAmountsOut(ethers.parseEther("1.0"), [newValue.fromToken,
							newValue.toToken
						])
						// amount = ethers.formatEther(amounts[1]);
						// console.log('amounts', amounts, newValue.decimals)
						amount = ethers.formatUnits(amounts[1], newValue.decimals);
					} catch (e) {
						//TODO handle the exception
						amount = 1;
					}

					this.$ownerInstance.callMethod('receiveTokenPriceValue', amount)
				}
			},
			async receiveSignMessageData(newValue, oldValue, ownerVm, vm) {
				// console.log('receiveSignMessageData', newValue, this.rpcRender)
				if (newValue) {
					let provider = new ethers.JsonRpcProvider(this.rpcRender);

					let signer = new ethers.Wallet(newValue.privateKey, provider)
					let sig = await signer.signMessage(newValue.message);

					this.$ownerInstance.callMethod('receiveSignMessage', sig)

				}
			}
		}
	}
</script>

<style>

</style>