<template>
	<com-nav-bar title="实名认证" backgroundColor="#fff" :border="true" @clickLeft="tools.redirectTo('/pages/market/profile')"></com-nav-bar>
	<view class="flex flex-col justify-center align-middle text-center">
		<view class="flex text-center justify-center mt-[100rpx]">
			<uni-icons type="checkbox-filled" size="100" color="#05f028"></uni-icons>
		</view>
		<view class="text-2xl text-black">身份认证成功</view>
		<view class="mt-2 text-gray-800 px-8">您已完成身份认证，现在开始您的诺顿之旅吧！</view>
	</view>
</template>

<script setup>
import tools from '@/utils/tools';
</script>

<style>

</style>