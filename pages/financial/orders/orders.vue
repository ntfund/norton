<template>
	<view>
		<com-nav-bar title="申购记录" backgroundColor="#fff"></com-nav-bar>
		<view class="p-[28rpx] min-h-screen">
			<com-float-deposit ref="current"></com-float-deposit>
			<com-fixed-deposit ref="fixed"></com-fixed-deposit>
			
			<u-empty mode="history" icon="/static/img/empty/list.png" v-if="isEmpty">
			</u-empty>
		</view>		
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref,
		watchEffect
	} from 'vue';
	const isEmpty = ref(false)
	const current = ref(null)
	const fixed = ref(null)

	onMounted(() => {
		watchEffect(() => {
			console.log('fixed.value.dataList.length', fixed.value.dataList.length)
			isEmpty.value = fixed.value.dataList.length == 0;
		})
	})
</script>

<style lang="scss" scoped>
	page {
		background: #EEEEEE;
	}
</style>