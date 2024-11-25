<template>
	<view>
		<!-- 	<uni-nav-bar :fixed="true" :border="false" :statusBar="true" left-icon="bars" title="首页" @clickLeft="clickLeft">
		</uni-nav-bar> -->
		<uni-nav-bar :fixed="true" :border="false" :statusBar="true" @clickLeft="leftShow = true"
			@clickRight="tools.navigateTo('/pages/news/news')">
			<template #default>
				<view class="w-[100%] h-[100%] flex items-center justify-center p-0 m-0">
					<view class="nav-title">NORTON</view>
				</view>
			</template>
			<template #left>
				<view class="w-[100%] h-[100%] p-0 m-0 nav-left">
					<image src="@/static/images/home/Group 787@2x.png" mode="aspectFit"
						style="width: 42rpx; height: 30rpx;"></image>
				</view>
			</template>
			<template #right>
				<view class="w-[100%] p-0 m-0 nav-right">
					<image src="@/static/images/home/tongzhi@2x.png" mode="aspectFit"
						style="width: 33rpx; height: 35rpx;"></image>
					<view class="notice-number" v-if="appStore.unreadCount">{{appStore.unreadCount}}</view>
				</view>
			</template>
		</uni-nav-bar>

		<view class="">
			<com-swiper style="margin-top: 20rpx;"></com-swiper>
			<com-notice-bar style="margin-top: 24rpx;"></com-notice-bar>
			<com-grid-list style="margin-top: 31rpx;"></com-grid-list>
			<com-coin-change @click="tools.navigateTo('/pages/market/market')"></com-coin-change>
			<!-- 		<com-float-block class="mt-2"></com-float-block> -->
			<com-market-coin style="margin-bottom: 31rpx;"></com-market-coin>
		</view>
		<com-index-left v-model:show="leftShow"></com-index-left>
		<com-tab-bar></com-tab-bar>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref,
		watch
	} from "vue";
	import tools from '@/utils/tools'
	import {
		onShow
	} from '@dcloudio/uni-app';
	import checkVersion from './lq-upgrade/checkVersion.js'
	import {
		getVersion
	} from "@/config/api.js";
	import {
		useUserStore
	} from "@/stores/modules/user";
	import {
		useAppStore
	} from "@/stores/modules/app.js";

	const leftShow = ref(false)
	const userStore = useUserStore()
	const appStore = useAppStore();

	//升级检测
	const upgrade = () => {
		getVersion().then(data => {
			// console.log(data)
			checkVersion({
				name: data.version,
				content: data.desc,
				url: data.url,
				forceUpdate: true,
				ios: data.ios,
				type: data.type
			})
		})
	}

	onMounted(async () => {
		// uni.preloadPage({url: "/pages/chat/index/index"});
		// uni.preloadPage({url: "/pages/financial/index"});
		// uni.preloadPage({url: "/pages/explore/index"});
		// uni.preloadPage({url: "/pages/wallect/index"});	
	})

	onShow(() => {		
		upgrade()
		appStore.getUnreadCount();
	})

	watch(() => userStore.user.account, (newVal, oldVal) => {
		appStore.getUnreadCount();
	})
</script>

<style lang="less" scoped>
	.status_bar_height {
		margin-top: var(--status-bar-height);
	}

	.nav-right {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		position: relative;
		margin-right: calc(56rpx - 10px);

		// background: green;

		.notice-number {
			width: 48rpx;
			height: 30rpx;
			background: #FC465C;
			border-radius: 15rpx;

			position: absolute;
			right: -27rpx;
			top: -15rpx;

			// font-family: DIN-Bold;
			font-weight: 400;
			font-size: 20rpx;
			color: #FFFFFF;
			// line-height: 106px;

			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>