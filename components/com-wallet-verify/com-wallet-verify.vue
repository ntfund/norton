<template>
	<view>
		<view v-if="binit" :wallet="wallet" :change:wallet="ethers.receiveStart"></view>
		<view v-if="binit" :wallet="wallet.mnemonic" :change:wallet="ethers.receiveMnemonic"></view>
		<view v-if="binit" :wallet="wallet.privateKey" :change:wallet="ethers.receivePrivateKey"></view>
		<view v-if="binit" :wallet="wallet.keystore" :change:wallet="ethers.receiveKeystore"></view>
		<view v-if="binit" :wallet="wallet.keystore_password" :change:wallet="ethers.receiveKeystorePassword"></view>
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
			console.log('setup: mounted', this.wallet)
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
			receiveWalletValue(_wallet) {
				// console.log('receiveWalletValue : renderjs返回的值-->', _wallet);
				this.wallet.address = _wallet.address
				if (_wallet.mnemonic) {
					this.wallet.mnemonic = _wallet.mnemonic
				}				
				this.wallet.privateKey = _wallet.privateKey //会触发2次验证，因为这里赋值了。
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
				walletData: {
					name: '',
					mnemonic: '',
					privateKey: '',
					keystore: '',
					keystore_password: '',
					address: '',
					type: ''
				}
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
			verifyTronWallet() {
				this.tronWeb = window.tronWeb
				let walletVerify = null;
				if (this.walletData.mnemonic) {
					try{
						walletVerify = tronWeb.fromMnemonic(this.walletData.mnemonic);
					}catch(e){
						//TODO handle the exception
					}
				} else
				if (this.walletData.privateKey) {
					try{
						tronWeb.setPrivateKey(this.walletData.privateKey);
						walletVerify = {
							mnemonic: null,
							address: tronWeb.defaultAddress.base58,
							privateKey: this.walletData.privateKey,
						}
					}catch(e){
						//TODO handle the exception
					}
				}
				// console.log('walletVerify', walletVerify)
				if (walletVerify != null) {
					this.$ownerInstance.callMethod('receiveWalletValue', {
						address: walletVerify.address,
						privateKey: walletVerify.privateKey,
						mnemonic: walletVerify.mnemonic ? walletVerify.mnemonic.phrase : null,
					})
				}
			},
			verifyEthWallet() {
				let walletVerify = null;
				if (this.walletData.keystore || this.walletData.keystore_password) {
					let isKeystoreJson = ethers.isKeystoreJson(this.walletData.keystore)
					if (isKeystoreJson) {
						try{
							walletVerify = ethers.decryptKeystoreJsonSync(this.walletData.keystore, this.walletData.keystore_password)
						}catch(e){
							//TODO handle the exception
						}
					}					
				} else
				if (this.walletData.mnemonic) {
					try{
						walletVerify = ethers.HDNodeWallet.fromPhrase(this.walletData.mnemonic);
					}catch(e){
						//TODO handle the exception
					}
				} else
				if (this.walletData.privateKey) {
					try{
						walletVerify = new ethers.Wallet(this.walletData.privateKey);
					}catch(e){
						//TODO handle the exception
					}
				}
				// console.log('walletVerify', walletVerify)
				if (walletVerify != null) {
					this.$ownerInstance.callMethod('receiveWalletValue', {
						address: walletVerify.address,
						privateKey: walletVerify.privateKey,
						mnemonic: walletVerify.mnemonic? walletVerify.mnemonic.phrase : null,
					})
				}

			},
			verifyWallet() {
				if (!this.walletData.type) {
					return;
				}
				if (this.walletData.type == "eth") {
					this.verifyEthWallet();
				} else
				if (this.walletData.type == "tron") {
					this.verifyTronWallet();
				}
			},
			// 接收逻辑层发送的数据
			async receiveStart(newValue, oldValue, ownerVm, vm) {
				console.log('receiveStart', newValue)
				if (newValue) {
					this.walletData = newValue;
					this.verifyWallet();
				}
			},
			async receiveMnemonic(newValue, oldValue, ownerVm, vm) {
				console.log('receiveMnemonic', newValue)
				if (newValue) {
					this.walletData.mnemonic = newValue;
					this.verifyWallet();
				}
			},
			async receivePrivateKey(newValue, oldValue, ownerVm, vm) {
				console.log('receivePrivateKey', newValue)
				if (newValue) {
					this.walletData.privateKey = newValue;
					this.verifyWallet();
				}
			},
			async receiveKeystore(newValue, oldValue, ownerVm, vm) {
				console.log('receiveKeystore', newValue)
				if (newValue) {
					this.walletData.keystore = newValue;
					this.verifyWallet();
				}
			},
			async receiveKeystorePassword(newValue, oldValue, ownerVm, vm) {
				console.log('receiveKeystorePassword', newValue)
				if (newValue) {
					this.walletData.keystore_password = newValue;
					this.verifyWallet();
				}
			}

		}
	}
</script>

<style>

</style>