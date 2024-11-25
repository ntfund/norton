import {
	defineStore
} from 'pinia';
import {
	ref
} from "vue";
import {
	getUsdtPrice
} from '@/config/api';
export const useExchangeStore = defineStore('exchange', () => {
	let rate = ref(0);
	if (rate.value == 0) {
		getUsdtPrice().then(data => {
			rate.value = data
		}).catch(err => console.log)
	}

	return {
		rate,
		updateRate(value) {
			rate.value = value
		}
	};
});