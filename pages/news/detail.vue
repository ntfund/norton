<template>
	<view>
		<com-nav-bar :title="item.title" :border="true"></com-nav-bar>
		<!-- <view class="title">{{item.title}}</view> -->
		<view class="time">{{item.created_at}}</view>
		<view class="content">
			<rich-text :nodes="item.content" space="emsp" style="text-indent: 2em;"></rich-text>
		</view>
	</view>
</template>

<script setup lang="ts">
	const props = defineProps(['params']);
	const item = JSON.parse(decodeURIComponent(props.params));
</script>

<style lang="scss">
	page {
		// width: 750rpx;
		padding: 20rpx;
	}

	.title {
		font-size: 32rpx;
		font-weight: bold;
	}

	.time {
		text-align: right;
		color: #858687;
		padding: 20rpx 0;
		border-bottom: 2rpx dashed #ccc;
	}

	.content {
		background-color: #FFFFFF;
		padding: 20rpx 0;
		font-size: 32rpx;
		color: #000000;
	}
</style>