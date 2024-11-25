<template>
	<view class="bg-white p-4 text-sm">
		<view class="flex justify-between">
			<view class="left w-[150rpx]">
				<image :src="tools.getAvatar(user.avatar)" mode="widthFix" width="60" height="60"
					style="width: 120rpx; height: 120rpx;" class="rounded-xl" />
			</view>
			<view class="right flex flex-col flex-1 text-[#676767]">
				<h3 class="text-black">{{getNickname(user)}}</h3>
				<text class="py-0.5 pt-1">昵称：{{user.nickname}}</text>
				<text class="py-0.5">UID：{{user.uid}}</text>
			</view>
		</view>
	</view>
	<view class="bg-white px-4 text-sm mt-2">
		<view class=" py-4 flex justify-center items-center" @click="addFriend">
			<view class="text-blue-600">通过验证</view>
		</view>
	</view>
	<view class="bg-white px-4 text-sm mt-2">
		<view class=" py-4 flex justify-center items-center" @click="deleteFriend">
			<view class="text-red-600">拒绝</view>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from "vue";
	import tools from '@/utils/tools'
import { useAppStore } from "../../../stores/modules/app";
	const props = defineProps(['params'])
	let item = JSON.parse(decodeURIComponent(props.params));
	console.log(item)
	const user = item.from_user;

	// let user = ref({
	// 	friend: null,
	// 	id: 0,
	// 	nickname: '',
	// 	avatar: '',
	// 	uid: '',
	// })

	// if (props.id) {
	// 	uni.$u.http.get('/chat/user/' + props.id).then(data => {
	// 		console.log('get chat user', data);
	// 		user.value = data;
	// 	})
	// }
	
	const getNickname = (user) => {
		if (user.friend && user.friend.remark) {
			return user.friend.remark;
		}
		return user.nickname;
	}

	const addFriend = () => {
		uni.$u.http.put('/chat/newFriend/' + item.id, {
			status: 2
		}).then(data => {
			const appStore = useAppStore();
			appStore.decreaseNewFriendRecords()
			uni.showToast({
				title: "已通过对方好友申请",
				icon: 'none'
			});
		})
	}

	const deleteFriend = () => {
		uni.showModal({
			title: "删除联系人",
			content: "将联系人\"" + user.value.nickname + "\"删除，确认删除吗？",
			confirmText: "删除",
			confirmColor: "red",
			success: function(res) {
				console.log('deleteFriend success')
				uni.$u.http.post('/chat/friend/deleteFriend', {to_id: props.id}).then(() => {
					uni.showToast({
						title: "删除成功",
						icon: 'none'
					});					
					uni.switchTab({
						url: "/pages/chat/index/index"
					})
				})
			},
			fail: function(res) {

			}
		})
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}
</style>