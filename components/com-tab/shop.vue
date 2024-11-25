<template>
	<view class="tab tab_border">
		<view class="tab-item" v-for="(item, index) in listArr" :class="{'tab-item-active' : index == currentIndex}"
			:key="index" @click="switchTab(index)">
			{{item}}
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
	.tab {
		height: 98rpx;
		line-height: 98rpx;
		display: flex;
		border-radius: 10px;
		border: none;
		align-items: center;

		&_border {
			border-bottom: 2rpx solid #eee;
		}

		padding-left: 27rpx;

		background: #fff;
	}

	.tab-item {

		transition: all .3s ease-in-out;

		font-family: SourceHanSansCN-Medium;
		font-weight: 500;
		font-size: 30rpx;

		margin-right: 41rpx;

		position: relative;

		color: #8D8D8D;

		display: flex;
		justify-content: end;
		align-items: end;

	}

	.tab-item-active {
		color: #000;
	}

	.tab-item-active::after {
		content: '';

		width: 100%;
		height: 4rpx;
		background: #7F17FE;

		position: absolute;
		bottom: 0;
	}
</style>