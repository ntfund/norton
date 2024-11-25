<template>
	<com-nav-bar title="分析师详情" :border="true" backgroundColor="#fff"></com-nav-bar>
	<view>
		<view
			class="flex flex-row justify-between items-center px-4 py-2 border-0 border-b border-solid border-gray-100 py-6">
			<!--        <img src="https://norton.im/uploads/20221128/ea07b9f7064e9ebc81fb7241ff715011.png" class="self-start" alt="fxs" width="60">-->
			<image :src="analyst.img" class="self-start" alt="fxs" mode="widthFix" style="width: 60px;" />
			<view class="flex flex-col justify-center ml-4">
				<view class="text-lg font-semibold">{{ analyst.name }}</view>
				<view class="mt-1 text-gray-600">{{ analyst.level }}</view>
			</view>
			<view class="flex  flex-1 flex-row items-end justify-end">
				<view class="text-right text-gray-400" v-if="analyst.platform === 1">欧易OKX</view>
				<view class="text-right text-gray-400" v-else-if="analyst.platform === 2">火必</view>
			</view>
		</view>
		<com-analyst-account :id="analyst.id"></com-analyst-account>
	</view>
</template>

<script setup>
	import { onMounted, onUnmounted, ref } from "vue";
	import { onShow, onHide } from '@dcloudio/uni-app'
	import socketHelper from "../../utils/socketHelper";
	import { useUserStore } from "@/stores/modules/user";
		
	const props = defineProps(['params']);
	const analyst = ref(JSON.parse(decodeURIComponent(props.params)))
	const userStore = useUserStore()
	
		
	onShow(() => {		
		if (analyst.value.id > 0) {
			socketHelper.send({type: 'session', data: {visibility: 1}});
			socketHelper.send({type: 'update', data: {room_id: 'good_' + analyst.value.id, good_id: analyst.value.id, uid: userStore.user.id, user: userStore.user, visibility: 1}});
		}
	})
	
	
	onHide(() => {		
		if (analyst.value.id > 0) {
			socketHelper.send({type: 'session', data: {visibility: 0}});
			socketHelper.send({type: 'update', data: {room_id: 'good_' + analyst.value.id, good_id: analyst.value.id, uid: userStore.user.id, user: userStore.user, visibility: 0}});
		}
	})
	
	onMounted(() => {
		if (analyst.value.id > 0) {
			socketHelper.send({ type: 'good_join', data: { room_id: 'good_' + analyst.value.id, good_id: analyst.value.id, uid: userStore.user.id, user: userStore.user, visibility: 1 } });
		}
	})
	
	onUnmounted(() => {		
		console.log('leave_good')
		if (analyst.value.id > 0) {
			socketHelper.send({ type: 'leave_good', data: { room_id: 'good_' + analyst.value.id, good_id: analyst.value.id, uid: userStore.user.id } });
		}
	})
</script>

<style lang="less" scoped>

</style>