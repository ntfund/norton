<template>
	<com-nav-bar title="我的群聊" backgroundColor="#fff" :border="true"></com-nav-bar>
	<view class="chat-list">
		<uni-list :border="true" :show-scrollbar="false">
			<uni-list-chat v-for="(item, index) in dataList" :key="index" :title="item.chat_room.name"
				:avatar-list="getAvatarList(item.chat_room.avatar_list)" :clickable="true"
				@click="chatClick(item)"></uni-list-chat>
		</uni-list>
		<view class="flex justify-center my-4 pb-4 text-gray-400">共{{dataList.length}}个群聊</view>
	</view>
</template>

<script setup lang="ts">
	import {
		onMounted,
		reactive,
		ref
	} from 'vue';
	import { onShow } from '@dcloudio/uni-app'
	import tools from '@/utils/tools'
	import { getMyGroupList } from '../../../config/api';


	const getAvatarList = (avatarArr) => {
		let arr = [];
		for (var i = 0; i < avatarArr.length; i++) {
			let url = uni.$u.http.config.baseURL + avatarArr[i]
			arr.push({
				url
			})
		}

		return arr;
	}

	const dataList = ref([]);

	const chatClick = (item) => {
		console.log('chat join', item)
		item.unread = 0;
		tools.navigateTo('/pages/chat/talk/talk', { room_id: 'room-' + item.chat_room_id })
	}

	const getMessage = () => {
		getMyGroupList().then((res : any) => {
			console.log('getMyGroupList', res)
			dataList.value = res
		})
	}

	onShow(() => {
		getMessage();
	})


	onMounted(() => {
		console.log('talk onMounted')
	})
</script>

<style>

</style>