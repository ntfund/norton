<template>
	<com-nav-bar title="详情" :border="true" backgroundColor="#fff"></com-nav-bar>
	<view class="flex flex-row justify-between items-center px-4 border-0 border-b border-solid border-gray-100 py-6">
		<!--        <img src="https://norton.im/uploads/20221128/ea07b9f7064e9ebc81fb7241ff715011.png" class="self-start" alt="fxs" width="60">-->
		<img src="https://norton.im/uploads/20221128/ea07b9f7064e9ebc81fb7241ff715011.png" class="" alt="fxs"
			width="60">
		<!--        <img src="/static/media/avatar.png" class="" alt="fxs" width="60">-->
		<view class="flex flex-col justify-center ml-4">
			<view class="text-lg font-semibold">{{ userStore.user.uid }}</view>
			<view class="mt-1 text-gray-600 flex text-xs flex flex-wrap" style="max-width: 180px;">
				<view class=" flex border border-solid mr-1  flex-wrap mb-1 "
					:class="[item.active ? 'border-blue-500' : 'border-gray-300']" v-for="(item, index) in apiList"
					@click="handApiClick(item)">
					<view class="text-center w-100 px-1 ">Okex-{{ index + 1 }}</view>
				</view>
			</view>
		</view>
		<view class="flex flex-1 flex-row items-start justify-end">
			<view class="text-right text-blue-400" @click="addMore">+接入更多</view>
			<view class="text-right text-red-400 ml-2" @click="deleteApi">删除</view>
		</view>
	</view>
	<com-analyst-account :api="selectedItem"></com-analyst-account>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import tools from '../../utils/tools.js'
	import { useUserStore } from '@/stores/modules/user'
	import { deleteUserApi } from "../../config/api";

	const props = defineProps(['params']);
	const params = JSON.parse(decodeURIComponent(props.params));
	const userStore = useUserStore()

	const selectedItem = ref(params.api);
	for (let item of params.apiList) {
		item.active = false
	}
	const apiList = ref(params.apiList);
	apiList.value[0].active = true;

	const http = uni.$u.http;

	const handApiClick = (item) => {
		for (let it of apiList.value) {
			it.active = false;
		}
		item.active = true;
		selectedItem.value = item;
	}
	const deleteApi = () => {
		deleteUserApi(selectedItem.value.id).then(res => {
			// apiList.value.remove(selectedItem.value)
			// uni.$u.toast('删除成功')
			// console.log(apiList.value);
			// if (apiList.value.length == 0) {
			// 	tools.navigateBack();
			// } else {
			// 	selectedItem.value = apiList.value[0]
			// }
			tools.navigateBack();
		})
	}

	const addMore = () => {
		// router.push({name: 'analystManager'})
		tools.navigateTo('/pages/api/api', { add: true })
	}
</script>

<style>

</style>