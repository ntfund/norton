<template>
	<com-nav-bar title="" backgroundColor="white"></com-nav-bar>
	<view class="flex items-center justify-center text-center">
		<view>
			<view class="mt-10 text-center flex items-center justify-center">
				<u-icon name="checkmark-circle-fill" color="#40c35c" size="60"></u-icon>
			</view>
			<view v-if="isMe">
				<view class="my-4" v-if="item.msg.content.type == 'transfer'">对方已收款</view>
				<view class="my-4" v-if="item.msg.content.type == 'receiver'">您已收款，资金已存入零钱</view>
			</view>
			<view v-else>
				<view class="my-4" v-if="item.msg.content.type == 'receiver'">对方已收款</view>
				<view class="my-4" v-if="item.msg.content.type == 'transfer'">您已收款，资金已存入零钱</view>
			</view>
			<view class="text-center flex items-end justify-center">
				<view class="font-bold text-3xl">{{item.msg.content.amount}}</view>
				<view class="ml-1 text-orange-500 font-semibold text-xl">{{item.msg.content.name}}</view>
			</view>
			<u-divider text=" " class="w-[700rpx] my-4 py-4"></u-divider>
			<view class="flex justify-between px-4 text-gray-400 text-sm">
				<view>转账时间</view>
				<view>2023年07月22日 22:09:15</view>
			</view>
			<view class="flex my-1 justify-between px-4 text-gray-400 text-sm">
				<view>收款时间</view>
				<view>2023年07月22日 22:09:15</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useUserStore } from '@/stores/modules/user'
	import tools from '@/utils/tools'

	const userStore = useUserStore()
	const props = defineProps(['params']);
	const item = JSON.parse(decodeURIComponent(props.params))
	// const item = ref(props.data)
	const isMe = ref(item.msg.userinfo.user_id == userStore.user.id);

	console.log('isMe', isMe.value, item.msg.userinfo.user_id, userStore.user.id)

	const disabled = ref(false)

	const receiver = () => {
		tools.navigateBack()
	}
</script>

<style>

</style>