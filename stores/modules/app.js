import {
	defineStore
} from 'pinia';
import {
	ref
} from "vue";
import {
	getC2CShopOrderList,
	getNewFriendCount,
	getUnreadCountList
} from '@/config/api';

export const useAppStore = defineStore('appStore', () => {
	const newFriendRecords = ref(0);
	const c2cOrderCount = ref(0);
	const unreadCount = ref(0);
	const isClean = ref(false);
	const unit = ref('CNY');
	const locale = ref('zh');

	const getNewFirendRecords = () => {
		getNewFriendCount().then(result => {
			// console.log('getNewFriendCount result', result)
			newFriendRecords.value = result.data;
		})
	}
	const getC2CShopOrderCount = () => {
		getC2CShopOrderList({
			status: 1
		}).then(res => {
			// console.log(res)
			c2cOrderCount.value = res.total;
		})
	}
	const getUnreadCount = () => {
		getUnreadCountList().then(res => {
			// console.log(res)
			unreadCount.value = res.total;
		})
	}
	if (uni.getStorageSync('unit')) {
		unit.value = uni.getStorageSync('unit')
	}
	if (uni.getStorageSync('locale')) {
		locale.value = uni.getStorageSync('locale')
	}

	return {
		newFriendRecords,
		getNewFirendRecords,
		c2cOrderCount,
		getC2CShopOrderCount,
		unreadCount,
		getUnreadCount,
		isClean,
		unit,
		locale,
		setNewFriendRecords(value) {
			newFriendRecords.value = value
		},
		increaseNewFriendRecords() {
			newFriendRecords.value++;
		},
		decreaseNewFriendRecords() {
			newFriendRecords.value--;
		},
		setClean(value) {
			isClean.value = value;
		},
		setPending(value) {
			pendingCount.value = value;
		},
		setUnit(value) {
			unit.value = value;
			uni.setStorageSync('unit', value)
		},
		setLocale(value) {
			locale.value = value;
			uni.setStorageSync('locale', value)						
		}
	};
});