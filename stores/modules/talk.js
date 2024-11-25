import {
	defineStore
} from 'pinia';
import {
	ref
} from "vue";
import { getC2CShopOrderList, getNewFriendCount, getUnreadCountList } from '@/config/api';
export const useTalkStore = defineStore('talkStore', () => {
	const msg = ref(null)
	
	
	return {
		msg,		
		setMsg(value) {
			msg.value = value;
		}
	};
});