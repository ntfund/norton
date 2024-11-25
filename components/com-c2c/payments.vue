<template>
	<view class="flex items-center">
		<view class="img" v-for="(payment, index) in list" :key="index">
			<image src="@/static/images/c2c/shop/bank@2x.png" mode="aspectFit" style="width: 40rpx; height: 40rpx;" v-if="payment == 'bank'"></image>
			<image src="@/static/images/c2c/shop/wechat@2x.png" mode="aspectFit" style="width: 40rpx; height: 40rpx;" v-else-if="payment == 'alipay'"></image>
			<image src="@/static/images/c2c/shop/alipay@2x.png" mode="aspectFit" style="width: 40rpx; height: 40rpx;" v-else-if="payment == 'wechat_pay'"></image>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps(["list"])
</script>

<style lang="scss" scoped>
	.img {
		margin-right: 23rpx;
	}
</style>