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
				list: ['助记词', '私钥'],
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
		height: 70rpx;
		line-height: 70rpx;
		display: flex;
		background-color: #efefef;
		border-radius: 10px;
		border: none;
		align-items: center;
		padding: 4px;
	}

	.tab-item {
		width: 50%;
		text-align: center;
		transition: all .3s ease-in-out;
		border-radius: 10px;
	}

	.tab-item-active {
		background-color: #fff;
		color: #000;
	}
</style>