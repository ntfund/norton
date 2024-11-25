import {
	defineStore
} from 'pinia';
import {
	ref
} from "vue";
export const useWallectSelected = defineStore('wallectSelected', () => {
	let wallet = ref({
		id: 0,
		account: '',
		chain_id: 1,
		balance: 0,
		usdt: 0,
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
	});

	return {
		wallet,
		setValue(value) {
			wallet.value = value
		},
		setWalletValue(key, value) {
			wallet.value[key] = value
		}
	};
});