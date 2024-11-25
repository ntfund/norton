<template>
	<view>
		<view v-if="binit" :chain="chain" :change:chain="ethers.receiveStart"></view>
	</view>
</template>

<script>
	import dbWallet from '@/utils/dbWallet';
	export default {
		name: "com-wallet-create",
		props: {
			wallet: {
				type: Object
			},
			chain_id: {

			}
		},
		data() {
			return {
				binit: false,
				chain: {
					id: 0,
					type: ''
				},
			};
		},
		mounted() {
			console.log('setup: mounted', this.chain_id)
			// console.log('services mounted', this.chain_id)
			this.chain = dbWallet.getChain(this.chain_id);
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
			receiveCreateWalletValue(_wallet) {
				console.log('receiveCreateWalletValue : renderjs返回的值-->', _wallet);
				this.wallet.address = _wallet.address
				this.wallet.mnemonic = _wallet.mnemonic
				this.wallet.privateKey = _wallet.privateKey
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
			}
		},
		mounted() {
			console.log('ethers: mounted')
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
				console.log('handleInitBuffer')
			},
			async handleInitTronWeb() {
				console.log('handleInittronWeb')
				console.log("TronWeb=", TronWeb.version);
				
				window.tronWeb = new TronWeb({
					fullHost: 'https://trx.mytokenpocket.vip',
				})
				
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
			createTronWallet() {
				this.tronWeb = window.tronWeb
				let walletRanom = tronWeb.createRandom();
				console.log('createTronWallet', walletRanom)
				this.$ownerInstance.callMethod('receiveCreateWalletValue', {
					address: walletRanom.address,
					privateKey: walletRanom.privateKey,
					mnemonic: walletRanom.mnemonic.phrase,
				})
			},
			createEthWallet() {
				let walletRanom = ethers.HDNodeWallet.createRandom();
				console.log('createEthWallet', walletRanom)
				this.$ownerInstance.callMethod('receiveCreateWalletValue', {
					address: walletRanom.address,
					privateKey: walletRanom.privateKey,
					mnemonic: walletRanom.mnemonic.phrase,
				})
			},
			// 接收逻辑层发送的数据
			async receiveStart(newValue, oldValue, ownerVm, vm) {
				console.log('receiveStart', newValue)
				if (newValue) {
					if (newValue.type == "eth") {
						this.createEthWallet()
					} else if (newValue.type == "tron") {
						this.createTronWallet()
					}
				}
			}
		}
	}
</script>

<style>

</style>