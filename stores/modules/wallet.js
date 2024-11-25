import {
	defineStore
} from 'pinia';
import {
	ref,
	watch
} from "vue";

import dbWallet from '@/utils/dbWallet';
export const useWalletStore = defineStore('walletStore', () => {
	const wallet = ref({
		id: 0,
		// chain_id: 1,
		name: '',
		address: '',
		mnemonic: '',
		private_key: '',
		keystore: '',
		balance: 0,
		usdt: 0,
		selected: 0
	});

	const chain = ref({
		id: 0,
		name: '',
		symbol: '',
		icon: '',
		rpc: '',
		rpc2: '',
		tag: '',
		token: '', // 发行合约，用于申购
		router: '', // SWAP 交易所,
		weth: '', //eth
		type: 'eth'
	})

	if (chain.value.id == 0) {
		let _chain = uni.getStorageSync('chain');
		let _chain_id = 3;
		if (_chain) {
			_chain_id = _chain.id;
		}
		chain.value = dbWallet.getChain(_chain_id);
		// console.log('chain.value', chain.value)
	}

	const setWallet = (value) => {
		wallet.value = value
	}

	console.log('Use wallet store')

	async function getWallet() {
		if (!wallet.value.address) {
			console.log('Use wallet getDefaultWallet start ...')
			let result = await dbWallet.getDefaultWallet(chain.value.id)
			console.log('Use wallet getDefaultWallet', result)
			if (result) {
				setWallet(result)
			} else {
				console.log("Use wallet getDefaultWallet is null")
			}		
		}
	}
	getWallet()


	return {
		wallet,
		chain,
		setWallet,
		setWalletValue(field, value) {
			wallet.value[field] = value
		},
		setChainById(value) {
			let _chain = dbWallet.getChain(value);
			uni.setStorageSync('chain', _chain)
			chain.value = _chain;
		},
		setChain(value) {
			uni.setStorageSync('chain', value)
			chain.value = value;
		}
	};
});