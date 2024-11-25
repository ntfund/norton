<template>
	<div class="notice-swipe">
		<image src="@/static/images/home/gonggao@2x.png" mode="aspectFit" style="width: 30rpx; height: 24rpx; margin-left: 28rpx;"></image>
		<u-notice-bar :text="textList" direction="column" fontSize="10" color="#1C1C1C" :icon="''" bg-color="#ffffff" @click="indexClick" :disableTouch="false"></u-notice-bar>
		<image src="@/static/images/home/arrow-right@2x.png" mode="aspectFit" style="width: 10rpx; height: 19rpx; margin-right: 35rpx;"></image>
	</div>

</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import tools from '@/utils/tools'
	import { getContentList } from "../../config/api";

	const dataList = ref([])

	const textList = ref([]);

	getContentList(5, 1, 5).then(res => {
		dataList.value = res.data

		for (let item of res.data) {
			textList.value.push(item.title);
		}

	})

	const indexClick = (index) => {

		console.log('indexClick', index)
		const item = dataList.value[index]
		if (item) {
			tools.navigateToWithEncode('/pages/news/detail', item)
		}

	}
</script>

<style scoped>
	.notice-swipe {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.u-notice-bar {
		padding: 0 !important;		
		padding-left: 12rpx !important;
	}
	.u-notice__swiper__item__text {
		font-family: Gilroy-Medium !important;
		font-weight: 500 !important;
		font-size: 20rpx !important;
		color: #1C1C1C !important;
	}
</style>