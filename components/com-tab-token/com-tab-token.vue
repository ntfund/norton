<template>
	<view class="tab">
		<view class="tab-item" v-for="(item,index) in list" :class="{'tab-item-active' : index === currentIndex}"
			:key="index" @click="switchTab(index)">
			{{item}}
		</view>
	</view>
</template>
<script>
	export default {
		name: "com-tab",
		props: ["current"],
		data() {
			return {
				list: ['全部', '转入', '转出'],
				currentIndex: this.current
			};
		},
		mounted() {
			console.log('tab index', this.current)
		},
		methods: {
			switchTab(index) {
				this.currentIndex = index
				// 向父页面回传tab索引
				console.log('向父页面回传', index)
				this.$emit('change', index)
			}
		}
	}
</script>

<style>
	.tab {
		/* 		height: 40rpx;
		line-height: 40rpx; */
		display: flex;
		background-color: #F8F8F8;
		border-radius: 10px;
		border: none;
		align-items: center;
		padding: 4px;
		border-bottom: 1px solid #eee;
	}

	.tab-item {
		/* width: 20%; */
		/* padding:  5px 10px 5px 10px; */
		height: 60rpx;
		padding: 20rpx;
		/* margin-top: 10px; */
		text-align: center;
		transition: all .3s ease-in-out;
		/* border-radius: 10px; */
		color: #999;
		font-weight: 500;
	}

	.tab-item-active {
		/* background-color: #eee; */
		color: #000;
		/* border-bottom: 2px solid #000; */
	}

	.tab-item-active::after {
		content: '';
		width: 40rpx;
		height: 4rpx;
		background-color: #7F17FE;
		color: #000;
		display: block;
		margin: 0 auto;
		margin-top: 13rpx;
		border-radius: 30px;
	}
</style>