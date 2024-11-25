import { defineStore } from 'pinia';
import { User, IUser } from '@/type/User';
import { ref } from "vue";
export const useUserStore = defineStore('user', () => {

	// user.value.nickname = "大哥不哭"
	// user.value.id = 55784154
	// user.value.token = '$2y$10$FtN9naCiXhCKtT/JXqwF6.gvk1DPDT5.Jwb4NEJ3mx/5bangu24uC'
	// user.value.yqm = 'AABBCC'
	let tempUser = new User();
	tempUser.id = 0
	tempUser.account = ''
	
	try {
		const value = uni.getStorageSync('user')
		if (value) {			
			tempUser = JSON.parse(value);
			// console.log('getStorageSync user', user.value)
			tempUser.uid = tempUser.uid.toString().padStart(8, '0');
		}
	} catch (e) {
		// error
	}
	let user = ref<IUser>(tempUser);
	
	//是否是C2C商家 1:认证商家，2:钻石商家，3：认证+钻石
	const isShoper = () => {
		return user.value.shop_level >= 1;
	}

	return {
		user,
		isShoper,
		getFullAvatar() {
			return uni.$u.http.config.baseURL + user.value.avatar
		},
		setUser(value : IUser) {
			console.log('setUser', value)
			value.uid = value.uid.toString().padStart(8, '0');
			user.value = value
			uni.setStorageSync('user', JSON.stringify(user.value))
		},
		setUserValue(field : string, value : any) {
			user.value[field] = value
			uni.setStorageSync('user', JSON.stringify(user.value))
		}
	};
});