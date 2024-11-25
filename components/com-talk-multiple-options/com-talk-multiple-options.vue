<template>
	<view style="height: 50px;">
		<!-- <view class="showMultipleMask" v-if="showMultiple" @click="showMultiple = false"></view> -->
		<view class="showMultiple">
			<view class="item-icon iconfont icon-upload" style="font-size: 24px; color: #363636;" @click="share(3)">
			</view>
			<view class="item-icon iconfont icon-product-list" style="font-size: 24px; color: #363636;"
				@click="share(4)">
			</view>
			<view class="item-icon iconfont icon-ashbin" style="font-size: 24px; color: #363636;"
				@click="showDelete = true" v-if="canDelete">
			</view>
			<view class="item-icon iconfont icon-arrow-left-circle" style="font-size: 24px; color: #363636;"
				@click="close()"></view>
		</view>

		<!-- <com-confirm v-if="showDelete" v-model:show="showDelete" title="是否删除消息?" @confirmed="deleteMsg()"></com-confirm> -->
		<com-confirm v-if="showDelete" v-model:show="showDelete" :showAll="showAll" title="是否删除所选消息?" :allText="allText"
			@confirmed="deleteMsg"></com-confirm>
	</view>
</template>

<script setup>
	import {
		inject,
		onUnmounted,
		ref,
		toRaw,
		watchEffect
	} from 'vue';
	import project from '@/utils/project';
	import {
		useUserStore
	} from '@/stores/modules/user';
	import {
		destoryChatMessage
	} from '@/config/api';
	import tools from '@/utils/tools';

	const props = defineProps(["data", "show"])
	const emit = defineEmits("update:show")

	const canDelete = ref(false);
	const showDelete = ref(false)
	const showAll = ref(false)
	const room_id = inject('room_id');
	const room = inject('room');
	const allText = ref('从我和对方的设备删除')
	let userStore = useUserStore();

	const roomType = project.getRoomType(room_id);
	if (roomType == "user") {
		showAll.value = true;
		canDelete.value = true;
	} else if (roomType == "group") {
		// showAll.value = props.data.msg.userinfo.id == userStore.user.id || project.isRoomAdminByRoomAndMe(room);
		if (project.isRoomAdminByRoomAndMe(room)) {
			showAll.value = true;
			allText.value = '从所有用户的设备中删除'
			canDelete.value = true;
		}
	}

	// watchEffect(async () => {
	// 	canDelete.value =
	// 		project.getRoomType(room_id) == "user" || await project.getIsRoomAdmin(room_id, userStore.user.id)
	// })


	const open = () => {
		console.log('showMultiple open')
	}

	const close = () => {
		emit("update:show", false)
	}

	const share = (type) => {
		tools.navigateToWithEncode('/pages/chat/user/share', {
			type: type,
			data: toRaw(props.data),
			room_id: room_id
		})
	}

	//删除消息
	const deleteMsg = (type) => {
		// console.log('多选删除');
		let dataArr = toRaw(props.data);
		for (var i = 0; i < dataArr.length; i++) {
			let id = dataArr[i];
			uni.$emit('talk', 'delete', {
				id
			})
			uni.$emit('chat', 'delete', {
				id
			})
			destoryChatMessage(id, type)
		}

		close()
	}

	onUnmounted(() => {
		uni.$emit('talk_full', false)
	})
</script>

<style lang="scss">
	.showMultiple {
		position: fixed;
		z-index: 10074;
		width: 100vw;
		height: 50px;
		bottom: 0;
		left: 0;
		z-index: 2000;
		background: white;

		display: flex;
		align-items: center;

		.item-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			flex: 1;
		}
	}

	.showMultipleMask {
		// background: green;
		// opacity: 0.3;
		width: calc(100vw - 100rpx);
		height: 100vh;
		position: fixed;
		z-index: 999999;
		right: 0;
		top: 0;
	}
</style>