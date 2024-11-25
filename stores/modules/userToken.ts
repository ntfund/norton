import { defineStore } from 'pinia';
import { IUserToken } from '@/type/UserToken';
import { ref } from "vue";
export const useUserTokenStore = defineStore('userToken', () => {
	let userTokens = ref<IUserToken[]>([]);

	const getBalance = (token_id : number) : number => {
		let token = userTokens.value.find(item => {
			return item.token_id == token_id;
		})
		if (token) {
			return token.balance
		}
		return 0;
	}
	const usdt = ref(getBalance(2))
	return {
		usdt,
		userTokens,
		getBalance,
		usdtBalance() {
			return getBalance(2);
		},
		tokenBalance() {
			return getBalance(1);
		}
	};
});