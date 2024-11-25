import {
	defineStore
} from 'pinia';
import {
	reactive,
	ref
} from "vue";
export const useChatStore = defineStore('chatStore', () => {
	let roomId = ref('');
	let rooms = reactive({})
	return {
		roomId,
		rooms,
		setRoomId(value) {
			roomId.value = value
		},
		setRoom(room_id, value) {
			rooms[room_id] = value
		}
	};
});