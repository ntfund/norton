<template>
	<uni-nav-bar :fixed="true" :border="false" left-icon="left" @clickLeft="clickLeft" backgroundColor="#F8F8F8"
		:statusBar="true" title="更改名字">
		<template #right>
			<view>
				<u-button type="primary" color="#00aa00" text="保存" :disabled="disabled" size="small"
					@click="rightClick"></u-button>
			</view>
		</template>
	</uni-nav-bar>
	<view class="p-4">
		<u--input placeholder="请输入名称" maxlength="8" border="bottom" clearable v-model="name"></u--input>
		<view class="m-2 text-sm text-gray-300">好名字可以让你的朋友更容易记住你</view>
	</view>
</template>

<script setup lang="ts">
	import { computed, ref } from "vue";
	import tools from "@/utils/tools";
	import { useUserStore } from '@/stores/modules/user'
	const userStore = useUserStore()
	
	const name = ref(userStore.user.nickname)

	const disabled = computed(() => {
		return name.value == userStore.user.nickname;
	})

	const clickLeft = () : void => {
		console.log("click left")
		tools.navigateBack()
	}

	const rightClick = () : void => {
		console.log("rightClick", "update name")
		
		uni.$u.http.put('/chat/user/' + userStore.user.id, {nickname : name.value}).then(data => {
			console.log(data)
		})
		
		userStore.setUserValue('nickname', name.value);
		
		tools.navigateBack();
	}
</script>

<style>

</style>