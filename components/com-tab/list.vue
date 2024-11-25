<template>
	<view class="tabs flex items-center">
		<view v-for="(item,index) in listArr" class="tabs_item" :class="{'tabs_item_active': currentIndex == index}" @click="switchTab(index)">{{item}}
		</view>
	</view>
</template>

<script>
	export default {
		name: "com-tab",
		props: ["current", "list"],
		data() {
			return {
				// list: ['购买委托', '出售委托'],
				currentIndex: this.current,
				listArr: this.list ? this.list : ['购买委托', '出售委托']
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
				this.$emit('update:current', index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabs {
	
		// font-family: SourceHanSansCN-Regular;
		// font-weight: 400;
		// font-size: 30rpx;
	
		&_item {
			margin-left: 40rpx;
			color: #999;
	
			&_active {
				position: relative;
				// background: green;
				color: #2d2d2d;
	
				display: flex;
				align-items: end;
				justify-content: center;
			}
	
			&_active::after {
				content: '';
				position: absolute;
				width: 60rpx;
				height: 6rpx;
				bottom: -15rpx;
	
				background: #7F17FE;
				border-radius: 3rpx;
			}
		}
	}
</style>