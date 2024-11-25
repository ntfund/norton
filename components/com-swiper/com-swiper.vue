<template>
	<!-- 	<view class="uni-margin-wrap">
		<swiper class="swiper" circular :indicator-dots="swapData.indicatorDots" :autoplay="swapData.autoplay"
			:interval="swapData.interval" :duration="swapData.duration">
			<swiper-item v-for="(item, index) in swiperList" :key="index">
				<view class="swiper-item uni-bg-green rounded-md">
					<image :src="item" mode="scaleToFill" style="width: 750rpx;"></image>
				</view>
			</swiper-item>
		</swiper>
	</view> -->
	<l-swiper type="card" :banner="swiperList" :height="338" :autoplay="false" :indicatorDots="false" v-model:value="curr"></l-swiper>
</template>

<script lang="ts" setup>
	import { reactive, ref } from "vue";
	const swiperList = reactive([
		'/static/bananer/b3.png',
		'/static/bananer/b2.png',
		'/static/bananer/b4.png',
	])
	const curr = ref(0)
	const swapData = reactive({
		background: ['color1', 'color2', 'color3'],
		indicatorDots: true,
		autoplay: true,
		interval: 5000,
		duration: 500
	})
</script>

<style lang="scss" scoped>
	.uni-margin-wrap {
		width: 690rpx;
		width: 100%;
	}

	.swiper {
		height: 300rpx;
	}

	.swiper-item {
		display: block;
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
	}

	.swiper-list {
		margin-top: 40rpx;
		margin-bottom: 0;
	}

	.uni-common-mt {
		margin-top: 60rpx;
		position: relative;
	}

	.info {
		position: absolute;
		right: 20rpx;
	}

	.uni-padding-wrap {
		width: 550rpx;
		padding: 0 100rpx;
	}
</style>