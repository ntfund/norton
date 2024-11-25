<template>
	<view class="up_tabbar_container">
		<view class="up_tabbar">
			<up-tabbar :value="tabbarStore.selected" @change="change" :border="false" :fixed="true" :placeholder="false"
				activeColor="#7F17FE" inactiveColor="#D7D7D7" :safeAreaInsetBottom="true">
				<up-tabbar-item class="up-tabbar-item" v-for="(item, index) in list" :key="index">
					<template #active-icon>
						<image class="u-page__item__slot-icon" :src="item.selectedIconPath" mode="aspectFit"
							style="width: 40rpx; height: 40rpx;">
						</image>
					</template>
					<template #inactive-icon>
						<view v-if="index == 1">
							<uni-badge size="small" :text="tabbarStore.tabs.chat.count" absolute="rightTop" :offset="[0, 0]" type="error">
								<image class="u-page__item__slot-icon" :src="item.iconPath" mode="aspectFit"
									style="width: 40rpx; height: 40rpx;"></image>
							</uni-badge>
						</view>
						<view v-else>
							<image class="u-page__item__slot-icon" :src="item.iconPath" mode="aspectFit"
								style="width: 40rpx; height: 40rpx;"></image>
						</view>
					</template>
					<template #text>
						<view class="nav-bar-text" :class="{'nav-bar-text_active':index == tabbarStore.selected}">
							{{$t(item.text)}}
						</view>
					</template>
				</up-tabbar-item>
			</up-tabbar>
			<view class="up_tabbar_heng"></view>
			<com-watch-user v-if="isCurrent"></com-watch-user>
		</view>
	</view>
</template>

<script setup>
	import {
		computed,
		ref,
		watch
	} from 'vue';

	import {
		useTabbarStore
	} from '@/stores/modules/tabbarStore';
	import {
		useUserStore
	} from '@/stores/modules/user';
	import { useI18n } from 'vue-i18n';
	
	let { t } = useI18n();

	uni.hideTabBar();
	let tabbarStore = useTabbarStore()
	const userStore = useUserStore();

	const list = ref([{
			"pagePath": "/pages/index/index",
			"iconPath": "/static/tabbar/company@2x.png",
			"selectedIconPath": "/static/tabbar/company-fill@2x.png",
			"text": 'tabs.home',
		},
		{
			"pagePath": "/pages/chat/index/index",
			"iconPath": "/static/tabbar/contacts@2x.png",
			"selectedIconPath": "/static/tabbar/contacts-fill@2x.png",
			"text": 'tabs.chat',
			count: 0
		},
		{
			"pagePath": "/pages/financial/index",
			"iconPath": "/static/tabbar/inquiry-template@2x.png",
			"selectedIconPath": "/static/tabbar/inquiry-template-fill@2x.png",
			"text": 'tabs.financial',
			count: 0
		},
		{
			"pagePath": "/pages/explore/index",
			"iconPath": "/static/tabbar/Exportservices@2x.png",
			"selectedIconPath": "/static/tabbar/Exportservices-fill@2x.png",
			"text": 'tabs.explore',
			count: 0
		},
		{
			"pagePath": "/pages/wallet/index",
			"iconPath": "/static/tabbar/wallet@2x.png",
			"selectedIconPath": "/static/tabbar/wallet_1@2x.png",
			"text": 'tabs.wallet',
			count: 0
		}
	])

	let pages = getCurrentPages();
	let page = pages[pages.length - 1];
	//选中当前 tabbar
	for (var i = 0; i < list.value.length; i++) {
		const item = list.value[i]
		if ('/' + page.route == item.pagePath) {
			tabbarStore.updateValue(i);
			break;
		}		
	}
	
	
	//是否当前 tabbar
	const isCurrent = computed(() => {
		let currentIndex = -1;
		for (var i = 0; i < list.value.length; i++) {
			const item = list.value[i]
			if ('/' + page.route == item.pagePath) {
				currentIndex = i;
				break;
			}
		}

		return currentIndex == tabbarStore.selected;

	})

	//底部栏点击，切换tabbar
	const change = (index) => {
		tabbarStore.updateValue(index);

		let item = list.value[index];
		
		tabbarStore.clearTabValue(index);
		
		uni.switchTab({
			url: item.pagePath
		})
	}



</script>

<style lang="scss">	
	.nav-bar-text {
		font-family: SourceHanSansCN-Regular;
		font-weight: 400;
		font-size: 20rpx;
		color: #D7D7D7;

		padding-top: 10rpx;
		padding-bottom: 15rpx;
	}

	.nav-bar-text_active {
		color: #7F17FE;
	}

	.up_tabbar_container {
		height: 112rpx;
		width: 750rpx;
	}
	.up_tabbar {
		position: fixed;
		height: 112rpx;
		width: 750rpx;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
		background: #FFFFFF;

		display: flex;
		align-items: center;
		


		&_heng {
			width: 750px;
			height: 2rpx;
			background: #EEEEEE;

			position: fixed;
			left: 0;
			bottom: 110rpx;

			// z-index: 2;
		}
	}
</style>