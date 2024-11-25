<template>
	<view>
		<!-- <u-tabs :list="list1" :current="current" @click="click"></u-tabs> -->
		<com-nav-bar title="发布委托" :border="true" backgroundColor="#fff"></com-nav-bar>
		<com-tab-shop :list="['购买委托', '出售委托']" v-model:current="current"></com-tab-shop>
		<view class="content">
			<view v-if="current == 0">
				<com-shop-buy :data="data"></com-shop-buy>
			</view>

			<view v-else-if="current == 1">
				<com-shop-sell :data="data"></com-shop-sell>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				data: {},
				list1: [{
						name: '购买委托'
					},
					{
						name: '出售委托'
					},
				]
			}
		},
		onLoad(options) {
			if (options.params) {
				this.data = JSON.parse(decodeURIComponent(options.params))
				console.log('this.data', this.data)
				// this.current = this.data.type
				if (this.data.type == 1) {
					this.current = 0
				} else {
					this.current = 1;
				}
			}
		},
		methods: {
			click(item) {
				console.log('item', item);
				this.current = item.index;
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: $uni-bg-color-grey;
	}

	.content {
		padding: 54rpx 29rpx;
	}
</style>