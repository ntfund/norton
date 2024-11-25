<template>
	<div class="flex search">
		<image class="search_img" src="@/static/images/chat/search@2x.png" mode="aspectFit" @click="search"></image>
		<input type="text" class="search_input" v-model="keyword" :placeholder="placeholder" @input="input">
		<button type="button" class="search_btn" @click="search" v-if="keyword != ''">
			<!-- <text>搜索</text> -->
			<view class="iconfont icon-search text-white font-bold"></view>
		</button>
	</div>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue';
	const props = defineProps(["modelValue", "placeholder"])
	const emit = defineEmits(["update:modelValue", "search"])
	const keyword = ref(props.modelValue);

	watch(() => props.modelValue, (newVal, oldVal) => {
		keyword.value = newVal;
	})

	const input = (event) => {
		// console.log('event', event)
		emit('update:modelValue', event.detail.value);
	}
	
	const search = () => {
		// console.log('search emit', keyword.value)
		emit('search', keyword.value)
	}
</script>

<style lang="scss" scoped>
	.search {
		height: 80rpx;
		margin: 0 28rpx;
		margin-top: 39rpx;

		position: relative;
		background: #fff;

		background: #FFFFFF;
		border-radius: 40rpx;
		border: 2rpx solid #EEEEEE;

		display: flex;
		align-items: center;


		&_img {
			width: 30rpx;
			height: 30rpx;

			position: absolute;
			left: 32rpx;
		}

		&_input {

			background: #fff;

			padding-left: 77rpx;

			font-family: Gilroy-Medium;
			font-weight: 500;
			font-size: 28rpx;
			color: #0A0A0A;
			opacity: 0.6;

			display: flex;
			align-items: center;
		}

		&_btn {
			background: #7F17FE;
			height: 80rpx;

			position: absolute;
			right: 0;
			top: 0;

			border-top-right-radius: 40rpx;
			border-bottom-right-radius: 40rpx;

			display: flex;
			align-items: center;
			justify-content: center;

			text {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 24rpx;
				color: #FFFFFF;
			}
		}
	}
</style>