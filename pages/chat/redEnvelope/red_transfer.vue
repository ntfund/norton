<template>
	<com-nav-bar title="" backgroundColor="white"></com-nav-bar>
	<view class="flex items-center justify-center text-center">
		<view>
			<view class="mt-10 text-center flex items-center justify-center">
				<u-icon name="clock-fill" color="#2979ff" size="60"></u-icon>
			</view>
			<view>
				<view class="my-4" v-if="isMe">等待对方收款</view>
				<view class="my-4" v-else>待你收款</view>
			</view>

			<view class="text-center flex items-end justify-center">
				<view class="font-bold text-3xl">{{item.msg.content.amount}}</view>
				<view class="ml-1 text-orange-500 font-semibold text-xl">{{item.msg.content.name}}</view>
			</view>
			<u-divider text=" " class="w-[700rpx] mt-4"></u-divider>
			<view class="flex justify-between px-4 text-gray-400 text-sm">
				<view>转账时间</view>
				<!-- <view>2023年07月22日 22:09:15</view> -->
				<view>{{tools.timestampToTime(item.msg.content.timestamp, 'Y年m月d日 H:i:s')}}</view>
			</view>

			<view v-if="!isMe" class="fixed w-[750rpx]" style="bottom: 100rpx; left: 0;">
				<view class="flex justify-center text-center">
					<button type="button" class="py-2 px-16 bg-green-500 text-white text-xl" :disabled="disabled"
						@click="receiver">收款</button>
				</view>
				<view class="text-sm text-gray-600 mt-3">1天内如果未确认，将退还给对方</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useUserStore } from '@/stores/modules/user'
	import { useBalanceStore } from '@/stores/modules/userBalance'
	import tools from '@/utils/tools'

	const userStore = useUserStore()
	const userBalanceStore = useBalanceStore()
	const props = defineProps(['params']);
	const item = JSON.parse(decodeURIComponent(props.params))
	// const item = ref(props.data)
	const isMe = ref(item.msg.userinfo.id == userStore.user.id);

	console.log('isMe', isMe.value, item.msg.userinfo.id, userStore.user.id)

	const disabled = ref(false)

	const receiver = () => {	
		
		uni.$u.http.post('/chat/receiver/', {
			id: item.msg.content.rid
		}).then(res=> {
			console.log('receiver', item.msg.content.amount);
			userBalanceStore.increment(item.msg.content.token_id, item.msg.content.amount)
			
			tools.navigateBack()
		})
		
	}
</script>

<style>

</style>