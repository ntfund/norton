<template>
	<view class="page-main">
		<liu-indexed-list :dataList="dataList" @change="change"></liu-indexed-list>
	</view>
</template>

<script setup>
	import {
		ref, watchEffect
	} from 'vue';
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		getFriendAll, getServer
	} from "@/config/api";
	import project from '@/utils/project';
	import tools from '@/utils/tools'
	const server = ref({
		nickname: '客服',
		avatar: ''
	})
	
	const dataList = ref([
		{
			id: '1',
			name: '',
			phone: '',
			img: '',
			first_char: "↑",
			official: 1
		}
	])
	
	watchEffect(() => {
		dataList.value[0].name = server.value.nickname
		dataList.value[0].img = project.getFullURL(server.value.avatar)
	})
	
	getServer().then(res => {
		server.value = res;
	})
	
	const friendCount = ref(0)

	onShow(() => {
		dataList.value = [{
			id: '1',
			name: 'NT-FUND',
			phone: '',
			img: '',
			first_char: "↑",
			official: 1
		}];
		getFriendAll().then(data => {
			console.log('gerFriendList', data);
			for (let item of data) {
				dataList.value.push({
					id: item.friend.id,
					name: item.remark ? item.remark : item.friend.nickname,
					phone: '',
					first_char: item.friend.first_char,
					uid: item.friend.uid,
					img: project.getFullURL(item.friend.avatar),
					official: 0
				})
			}

		})
	})

	const change = (e) => {
		console.log('点击列表回调：', e)
		tools.navigateTo('/pages/chat/user/info?id=' + e.id)
	}
</script>

<style>
</style>