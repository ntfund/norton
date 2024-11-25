<template>
	<com-nav-bar title="群成员"></com-nav-bar>
	<view class="p-2 py-4 grid grid-cols-5 bg-white">
		<view class="flex flex-col justify-center items-center my-2" v-for="(user, index) in dataList" :key="index">
			<image :src="tools.getAvatar(user.avatar)" mode="widthFix" width="60" height="60" style="width: 120rpx; height: 120rpx;"
				class="rounded-xl" />
			<text class="text-gray-600 text-xs w-[60px] text-ellipsis text-center whitespace-nowrap overflow-hidden">{{user.nickname}}</text>
		</view>
		<view class=" flex items-center justify-center m-2 rounded-lg"
			style="width: 115rpx; height: 115rpx; border: 1px dashed #ccc;">
			<u-icon name="plus" size="24"></u-icon>
		</view>
	</view>
	
</template>

<script setup lang="ts">
	import {
		ref
	} from "vue";

	import tools from '@/utils/tools'
	import {
		useUserStore
	} from "@/stores/modules/user";
	const props = defineProps(['id'])
	const userStore = useUserStore();

	const dataList = ref([])
	
	uni.$u.http.get('/chat/chatRoom/more/' + props.id).then(data => {
		dataList.value = data;
	})
	
</script>

<style lang="scss">
	page {
		// background-color: $uni-bg-color-grey;
	}

	.item {
		border-bottom: 1px solid #efefef;

		.right {
			@apply text-gray-500;
		}
	}
</style>