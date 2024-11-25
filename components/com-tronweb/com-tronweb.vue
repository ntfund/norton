<template>
	<view>
		<!-- 排序最底部的优先传输 -->
		<view v-if="binit && transferData !== null" :transferData="transferData"
			:change:transferData="ethers.receiveTransferData"></view>
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
			}
		},
		data() {
			return {
				binit: false,
				transferData: null,
				transferTransaction: null,
				validAddress: null,
				validResult: null,
				signMessageData: null,
				signMessageResult: null,
				depositData: null,
				depositResult: null,
				balanceOfData: null,
				balanceOfResult: null,
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
			receiveInit(value) {
				// console.log('receiveInit : renderjs返回的值-->', value);
				this.binit = value;
				if (this.binit) {
					this.init(); //初始化数据操作。
				}
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
			receiveTokenPriceValue(value) {
				console.log('receiveTokenPriceValue : renderjs返回的值-->', value);
				this.tokenPriceResult = value;
			},
			receiveBalanceValue(value) {
				console.log('receiveBalanceValue : renderjs返回的值-->', value);
				this.balanceResult = value;
			},
			receiveBalanceOfValue(value) {
				console.log('receiveBalanceValue : renderjs返回的值-->', value);
				this.balanceOfResult = value;
			}

		}
	}
</script>


<script module="ethers" lang="renderjs">
	export default {
		data() {
			//视图层数据
			return {
				rpcRender: 'https://trx.mytokenpocket.vip',
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
				this.$ownerInstance.callMethod('receiveInit', this.tronInit)

				window.tronWeb = new TronWeb({
					fullHost: this.rpcRender,
				})
				this.tronWeb = window.tronWeb
			},
			async getBalance(address, tokenAddress = null) {

				try {
					if (!tokenAddress) {
						let balance = await tronWeb.trx.getBalance(address)
						console.log('get Trx Balance', balance)
						return tronWeb.fromSun(balance);
					} else {
						let contract = await tronWeb.contract(this.abi, tokenAddress);
						const result = await contract.balanceOf(address).call({
							from: address
						});
						let balance = tronWeb.BigNumber(result._hex)
						// console.log('getTronBalance', balance)
						return tronWeb.fromSun(balance.toString(10));
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e)
				}
			},
			async receiveRpcData(newValue, oldValue, ownerVm, vm) {
				if (newValue) {
					this.rpcRender = newValue
				}
			},
			async receiveBalanceOfData(newValue, oldValue, ownerVm, vm) {
				console.log('receiveBalanceOfData', newValue.address)
				if (newValue) {
					let balance = await this.getBalance(newValue.address, newValue.tokenAddress);
					this.$ownerInstance.callMethod('receiveBalanceOfValue', balance)
				}
			},
			async receiveBalanceData(newValue, oldValue, ownerVm, vm) {
				console.log('receiveBalanceData', newValue)
				if (newValue) {
					let balance = await this.getBalance(newValue, null);
					this.$ownerInstance.callMethod('receiveBalanceValue', balance)
				}
			},
			async receiveTokenPriceData(newValue, oldValue, ownerVm, vm) {
				// console.log('receiveTokenPriceData', newValue)
				if (newValue) {

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
					let contract = await tronWeb.contract(abi, newValue.routerAddress);

					let amount;
					try {

						let result = await contract.getAmountsOut(tronWeb.toSun("1.0"), [newValue.fromToken, newValue
							.toToken
						]).call({
							from: newValue.address
						});
						amount = tronWeb.fromSun(result.amounts[1]);
					} catch (e) {
						//TODO handle the exception
						amount = 1;
					}

					this.$ownerInstance.callMethod('receiveTokenPriceValue', amount)
				}
			},
			async receiveTransferData(newValue, oldValue, ownerVm, vm) {
				console.log('receiveTransferData', JSON.stringify(newValue))
				if (newValue) {
					console.log("确认交易")
					try {
						let private_key = newValue.private_key
						if (private_key.startsWith("0x")) {
							private_key = private_key.substr(2)
						}
						tronWeb.setPrivateKey(private_key)
						tronWeb.setAddress(newValue.from)
						if (!newValue.tokenAddress) {
							let receipt = await tronWeb.trx.sendTransaction(newValue.to, tronWeb.toSun("" + newValue
								.amount));
							this.$ownerInstance.callMethod('receiveTransferHash', receipt)
						} else {
							let contract = await tronWeb.contract(this.abi, newValue.tokenAddress);
							let receipt = await contract.transfer(newValue.to, tronWeb.toSun("" + newValue.amount))
								.send();
							this.$ownerInstance.callMethod('receiveTransferHash', receipt)
						}
					} catch (e) {
						//TODO handle the exception
						console.log(e)
						this.$ownerInstance.callMethod('receiveTransferHash', -1)
					}
				}
			},
			async checkAndApprove(newValue) {
				try {
					let usdtContract = await tronWeb.contract().at(newValue.usdtAddress);
					const balance = await usdtContract.allowance(newValue.from, newValue.tokenAddress).call({
						from: newValue.from
					});
					// let balance = tronWeb.BigNumber(result._hex)
					// console.log('getTronBalance', balance)
					// let amount = tronWeb.fromSun(balance.toString(10));
					let amount = tronWeb.fromSun(balance)
					console.log('checkHasApprove', amount, newValue.amount);


					if (parseFloat(amount) < parseFloat(newValue.amount)) {
						//授权操作
						console.log('approve start')
						tronWeb.setPrivateKey(newValue.private_key)
						tronWeb.setAddress(newValue.from)
						this.$ownerInstance.callMethod('receiveApprove')

						let result = await usdtContract.approve(newValue.tokenAddress,
								'115792089237316195423570985008687907853269984665640564039457584007913129639935')
							.send();
						console.log('Authorization Successful:', result);
						this.$ownerInstance.callMethod('receiveApproved')


					} else {
						console.log('approved')
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e)
				}
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
					try {
						console.log('newValue.private_key', newValue.private_key)
						tronWeb.setPrivateKey(newValue.private_key)
						tronWeb.setAddress(newValue.from)

						let contract = await tronWeb.contract(abi, newValue.tokenAddress);
						let amount = tronWeb.toSun("" + newValue.amount);
						let receipt = await contract.deposit(amount, newValue.good_id).send();

						this.$ownerInstance.callMethod('receiveDepositHash', receipt)

					} catch (e) {
						//TODO handle the exception
						console.log('deposit error:', e)
					}
				}
			},
			async receiveSignMessageData(newValue, oldValue, ownerVm, vm) {
				// console.log('receiveSignMessageData', newValue, this.rpcRender)
				if (newValue) {

					const sig = await TronWeb.Trx.signMessageV2(newValue.message, newValue.privateKey);

					this.$ownerInstance.callMethod('receiveSignMessage', sig)

				}
			},
			async receiveIsAddress(newValue, oldValue, ownerVm, vm) {
				// console.log('receiveIsAddress', newValue)
				if (newValue) {
					let isAddress = tronWeb.isAddress(newValue);
					this.$ownerInstance.callMethod('receiveIsValidAddress', isAddress)
				}
			},
		}
	}
</script>

<style>

</style>