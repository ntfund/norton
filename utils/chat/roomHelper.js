import {
	isProxy,
	isRef,
	toRaw
} from "vue";
import {
	useUserStore
} from "@/stores/modules/user";
export default {

	getRoomData(room) {
		let roomData = null;
		if (isProxy(room) || isRef(room)) {
			roomData = toRaw(room)
		} else {
			roomData = room
		}

		return roomData;
	},
	getUserGroupNickname(room, user) {
		let roomData = this.getRoomData(room);
		// console.log('getUserGroupNickname', user)
		for (let key in roomData.infos) {

			if (key == user.id) {
				if (roomData.infos[key].nickname) {
					return roomData.infos[key].nickname
				} else {
					break;
				}
			}
		}

		return user.nickname;
	},

	updateUserGroupInfos(room, infos) {
		let userStore = useUserStore();

		let roomData = this.getRoomData(room);
		for (let key in roomData.infos) {

			if (key == userStore.user.id) {
				let item = roomData.infos[key];
				for (let k in item) {
					infos[k] = item[k]
				}
			}
		}
	},
	getUserGroupInfos(room) {
		let userStore = useUserStore();

		let roomData = this.getRoomData(room);
		for (let key in roomData.infos) {

			if (key == userStore.user.id) {
				let item = roomData.infos[key];

				//返回默认值				
				if (typeof item.show_nickname == "undefined") {
					console.log('item.show_nickname undefined')
					item.show_nickname = 1;
				}
				if (typeof item.pin == "undefined") {
					console.log('item.show_nickname undefined')
					item.pin = 0;
				}
				if (typeof item.mute == "undefined") {
					console.log('item.show_nickname undefined')
					item.mute = 0;
				}

				return item;
			}
		}

		//返回默认值
		return {
			nickname: '',
			pin: 0,
			mute: 0,
			show_nickname: 1
		}
	}
}