import {
	defineStore
} from 'pinia';
import {
	ref
} from "vue";
export const useConfigStore = defineStore('config', () => {
	let data = ref({
		usdt_price: 7
	});

	return {
		data,
		setUser(value) {
			data.value = value
		},
		setValue(field, value) {
			data.value[field] = value
		}
	};
});