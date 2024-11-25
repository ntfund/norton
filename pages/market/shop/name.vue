<template>
	<view>
		<com-nav-bar title="店铺名管理"></com-nav-bar>

		<view class="p-4">
			<com-input label="当前店铺名称" v-model="data.name"></com-input>
		</view>

		<view class="btn-bottom">
			<button type="button" class="n-btn" @click="submit">确认</button>
		</view>

	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		useUserStore
	} from '@/stores/modules/user';
	import tools from '@/utils/tools';

	const data = ref({
		name: ''
	});

	// const userStore = useUserStore();
	const getC2cInfo = () => {
		uni.$u.http.get('/c2cShop/c2cInfo').then(result => {
			console.log(data)
			data.value = result
		})
	}
	getC2cInfo();


	const submit = () => {
		uni.$u.http.put('/c2cShop/' + data.value.id, {
			name: data.value.name
		}).then(res => {
			uni.navigateBack()
			tools.toast('修改成功')
		})
	}
</script>

<style lang="scss" scoped>

</style>