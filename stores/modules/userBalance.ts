import { defineStore } from 'pinia';
import { IUserToken } from '@/type/UserToken';
import { ref, watchEffect } from "vue";
import tools from '../../utils/tools';

export const useBalanceStore = defineStore('userBalances', () => {
	let data = ref<IUserToken[]>([
		{
			id: 0,
			token_id: 6,
			name: "NRT",
			balance: 0,
			freeze: 0,
		},
		{
			id: 0,
			token_id: 7,
			name: "USDT",
			balance: 0,
			freeze: 0,			
		}
	]);

	try {
		const value = uni.getStorageSync('balances')
		if (value) {
			data.value = JSON.parse(value);
		}
	} catch (e) {
		// error
	}

	const getBalance = (token_id : number) : number => {
		let token = data.value.find(item => item.token_id == token_id)
		if (token) {
			return token.balance
		}
		return 0;
	}
	const usdt = ref(getBalance(7))
	watchEffect(() => {
		usdt.value = getBalance(7);
	})
	
	return {
		usdt,
		data,
		getBalance,
		usdtBalance() {
			return tools.floorAmountMinDigits(getBalance(7), 2);
		},
		tokenBalance() {
			return tools.floorAmountMinDigits(getBalance(6), 2);
		},
		setValue(values : IUserToken[]) {			
			uni.setStorageSync('balances', JSON.stringify(values))
			for (let value of values) {				
				let index = data.value.findIndex(item => item.token_id == value.token_id)
				if (index > -1) 
				{
					data.value[index].balance = value.balance;
					data.value[index].freeze = value.freeze;
					data.value[index].name = value.name;
				} else {
					data.value.push(value)
				}
			}
			// data.value = values;
		},
		getToken(token_id : number) {
			return data.value.find(item => item.token_id == token_id)
			//  ?? {
			// 	id: 0,
			// 	token_id: token_id,
			// 	token_name: "NONE",
			// 	balance: 0,
			// 	freeze: 0,
			// }
		},
		getUsdtToken() {
			return this.getToken(7);
		},
		setTokenValue(token_id : number, newAmount : number) {
			let index = data.value.findIndex(item => item.token_id == token_id)
			data.value[index].balance = newAmount;

			uni.setStorageSync('balances', JSON.stringify(data.value))
		},
		increment(token_id : number, newAmount : any) {
			let index = data.value.findIndex(item => item.token_id == token_id)
			data.value[index].balance = parseFloat(data.value[index].balance.toString()) + parseFloat(newAmount);

			uni.setStorageSync('balances', JSON.stringify(data.value))
		},
		decrement(token_id : number, newAmount : any) {
			let index = data.value.findIndex(item => item.token_id == token_id)
			data.value[index].balance = parseFloat(data.value[index].balance.toString()) - parseFloat(newAmount);

			uni.setStorageSync('balances', JSON.stringify(data.value))
		},
	};
});