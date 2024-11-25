<template>
	<view class="">
		<com-nav-bar title="Token详情" backgroundColor="#fff" :border="true"></com-nav-bar>
		<view class="py-[58rpx]">
			<view class="flex flex-col items-center token">
				<image :src="token.icon" class="rounded-full" mode="widthFix"
					style="width: 96rpx; height: 96rpx;">
				</image>
				<view class="token_balance">{{tools.floorAmount(token.balance, 6)}}</view>
				<!-- <view class="token_amount">≈ $ 564.26</view> -->
			</view>
		</view>
		<com-tab-token ref="tab" :current="current" @change="swtichSwiper"></com-tab-token>
		<swiper class="scroll-view-height px-4" @change="swipeIndex" :current="current" :circular="true" :duration="300"
			:skip-hidden-item-layout="true">
			<com-swiper-item-token-detail :wallet="wallet" :token="token" :current="current" :index="0"></com-swiper-item-token-detail>
			<com-swiper-item-token-detail :wallet="wallet" :token="token" :current="current" :index="1"></com-swiper-item-token-detail>
			<com-swiper-item-token-detail :wallet="wallet" :token="token" :current="current" :index="2"></com-swiper-item-token-detail>
		</swiper>
		
		<view class="exchange">
			<view class="item transfer" @click="transfer">
				<view class="iconfont icon-a-sorting2"></view>
				<view class="ml-1">转账</view>
			</view>
			<view class="item receiver" @click="receiver">
				<view class="iconfont icon-bottom"></view>
				<view class="ml-1">收款</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import project from '@/utils/project';
	import tools from '@/utils/tools';
	
</script>

<script>
	export default {
		data() {
			return {
				current: 0,
				token: {
					address: ''
				}
			}
		},
		methods: {
			swipeIndex(index) {
				// 获得swiper切换后的current索引				
				this.$refs.tab.switchTab(index.detail.current)
			},
			swtichSwiper(index) {
				// 通过tab组件回调点击切换的index同步swiper的current索引
				this.current = index
			},
			transfer() {
				uni.navigateTo({
					url: '/pages/wallet/transfer?address=' + this.token.address
				})
			},
			receiver() {
				uni.navigateTo({
					url: '/pages/wallet/receiver?wallet=' + encodeURIComponent(JSON.stringify(this.wallet))
				})
			}
		},
		onLoad(option) {
			this.current = 0

			// console.log('option.token', option.token)
			// console.log('option.wallet', option.wallet)
			this.wallet = JSON.parse(decodeURIComponent(option.wallet))
			this.token = JSON.parse(decodeURIComponent(option.token))
		}
	}
</script>

<style lang="scss" scoped>
	.scroll-view-height {
		/* 页面高度减去包含状态栏、标题、tab组件的高度 */
		height: calc(100vh - 240px);
		
		padding-bottom: 100rpx;
		
		background: #FFFFFF;
	}
	
	.token {
		&_balance {
			font-family: Gilroy-Medium;
			font-weight: bold;
			font-size: 60rpx;
			color: #000000;
			
			margin-top: 22rpx;
			// height: 44rpx;
		}
		&_amount {
			font-family: Gilroy-Medium;
			font-weight: 500;
			font-size: 32rpx;
			color: #999;
			
			// margin-top: 5rpx;
		}
	}
	
	.exchange {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		// background-color: #fff;
		background: #ffffff;
		padding: 33.33rpx;
		z-index: 999;
		
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.item {
			flex: 1;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 6px;
			padding: 8px 0;
			margin: 0 5px;
			color: white;
			@apply text-sm;
		}
		.transfer {
			// background: #00b658;
			background: #FC465C;
		}
		.receiver {
			// background: #00a3f5;
			background: #00C688;
		}
	}
</style>