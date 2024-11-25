import {
	defineStore
} from 'pinia';
import {
	ref
} from "vue";
export const useTabbarStore = defineStore('tabbarStore', () => {
	let selected = ref(0);
	const tabs = ref({
		home: {
			count: 0,
		},
		chat: {
			count: 0,
		},
		financial: {
			count: 0,
		},
		explore: {
			count: 0,
		},
		wallet: {
			count: 0,
		},
	})
	return {
		selected,
		tabs,
		updateValue(value) {
			selected.value = value
		},
		// updateTabsValue() {
		// 	var len = arguments.length;
		// 	let a = tabs.value;
		// 	for (var i = 0; i < len - 1; i++) {
		// 		// console.log("调用参数" + i + "是:" + arguments[i] + "\n");
		// 		a = a[arguments[i]];
		// 	}
		// 	a = arguments[len - 1];
		// },
		// increaseTabsValue() {
		// 	var len = arguments.length;
		// 	console.log(arguments[len - 1]);
		// 	let a = tabs.value;
		// 	for (var i = 0; i < len - 1; i++) {
		// 		// console.log("调用参数" + i + "是:" + arguments[i] + "\n");
		// 		a = a[arguments[i]];
		// 	}
		// 	a++;
		// },
		increaseChatValue() {
			console.log('tabs.value.chat.count', tabs.value.chat.count)
			tabs.value.chat.count = tabs.value.chat.count + 1;
		},
		increaseTabValue(index) {
			if (index == 0) {
				tabs.value.home.count++;
			} else if (index == 1) {
				tabs.value.chat.count++;
			} else if (index == 2) {
				tabs.value.financial.count++;
			} else if (index == 3) {
				tabs.value.explore.count++;
			} else if (index == 4) {
				tabs.value.wallet.count++;
			}
		},
		clearTabValue(index) {
			if (index == 0) {
				tabs.value.home.count = 0;
			} else if (index == 1) {
				tabs.value.chat.count = 0;
			} else if (index == 2) {
				tabs.value.financial.count = 0;
			} else if (index == 3) {
				tabs.value.explore.count = 0;
			} else if (index == 4) {
				tabs.value.wallet.count = 0;
			}
		},
		updateChatValue(field, value) {
			tabs.value.chat[field] = value
		}
	};
});