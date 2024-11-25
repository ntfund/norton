<template>
	<view>
		<!-- <u-grid :border="false" col="4" @click="handClick">
			<u-grid-item v-for="(item, index) in list" :key="index">
				<view class="grid-item">
					<image :src="item.src" mode="aspectFit" style="width: 92rpx; height: 92rpx;"></image>
					<text class="item-text">{{item.title}}</text>
				</view>
			</u-grid-item>
		</u-grid> -->
		
		<view class="layout">
			<view class="grid-item" v-for="(item, index) in list" :key="index">
				<image :src="item.src" mode="aspectFit" style="width: 92rpx; height: 92rpx;"></image>
				<text class="item-text">{{item.title}}</text>
			</view>
		</view>
		<u-toast ref="toastRef" />
	</view>
</template>

<script lang="ts" setup>
	import { ref } from "vue";
	const list = [
		{
			src: '/static/images/home/guanwang@2x.png',
			title: '官网'
		},
		{
			src: '/static/images/home/jiedian@2x.png',
			title: '监管节点'
		},
		{
			src: '/static/images/home/daima@2x.png',
			title: '开源代码'
		},
		{
			src: '/static/images/home/shequ@2x.png',
			title: '社区自治'
		},
		{
			src: '/static/images/home/licai@2x.png',
			title: '理财'
		},
		{
			src: '/static/images/home/liulan@2x.png',
			title: '浏览'
		},
		{
			src: '/static/images/home/baipi@2x.png',
			title: '白皮书'
		},
		{
			src: '/static/images/home/api@2x.png',
			title: 'API'
		},
	]

	// const list = [
	// 	{
	// 		icon: 'icon-home',
	// 		title: '官网',
	// 		bgColor: '#005500'
	// 	},
	// 	{
	// 		icon: 'icon-security',
	// 		title: '监管节点',
	// 		bgColor: '#00aaff'
	// 	},
	// 	{
	// 		icon: 'icon-code',
	// 		title: '开源代码',
	// 		bgColor: '#aa5500'
	// 	},
	// 	{
	// 		icon: 'icon-customer-certified',
	// 		title: '社区自治',
	// 		bgColor: '#00aa00'
	// 	},
	// 	{
	// 		icon: 'icon-money-finance-seller',
	// 		title: '理财',
	// 		bgColor: '#aaaa00'
	// 	},
	// 	{
	// 		icon: 'icon-business-icon-one-touch',
	// 		title: '浏览',
	// 		bgColor: '#0055ff'
	// 	},
	// 	{
	// 		icon: 'icon-fair',
	// 		title: '白皮书',
	// 		bgColor: '#00557f'
	// 	},
	// 	{
	// 		icon: 'icon-reads',
	// 		title: 'API',
	// 		bgColor: '#5555ff'
	// 	},
	// ]
	const toastRef = ref<any>(null);
	const handClick = (name : string | number) => {
		console.log(name)
		// toastRef.value.success(`点击了第${name}个`)
	}
</script>

<style lang="scss" scoped>
	// @font-face {
	// 	font-family: 'SourceHanSansCN-Medium';
	// 	src: url('/static/fonts/SourceHanSansCN-Medium-Alphabetic.ttf');
	// }

	.grid-item {

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.item-text {
			// font-size: 24rpx;
			margin-top: 12rpx;
			// margin-bottom: 49rpx;
			white-space: nowrap;

			// font-family: Source Han Sans CN;
			font-family: 'SourceHanSansCN-Medium';
			font-weight: 550;
			font-size: 24rpx;
			color: #000000;
		}
	}
	
	.layout {
		// width: 750rpx;
		padding: 0 70rpx;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		row-gap: 49rpx;
		column-gap: 80rpx;
	}
</style>