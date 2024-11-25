<template>
	<u-popup :show="props.show" mode="left" @close="close" @open="open" :safeAreaInsetTop="false"
		:safeAreaInsetBottom="false" bgColor="#fff">
		<view class="content">
			<com-nav-bar title="语言" :border="true" backgroundColor="#fff" @clickLeft="close()"></com-nav-bar>

			<view class="list-item list-item-bottom mt-[10px]" @click="appStore.setLocale('zh'); locale = 'zh'; close()">
				<view class="list-item_left">简体中文</view>
				<view class="list-item_right" v-if="appStore.locale == 'zh'">
					<image src="@/static/images/chat/check@2x.png" mode="aspectFill"
						style="width: 26rpx; height: 23rpx;"></image>
				</view>
			</view>
			<view class="list-item" @click="appStore.setLocale('en'); locale = 'en'; close();">
				<view class="list-item_left">English</view>
				<view class="list-item_right" v-if="appStore.locale == 'en'">
					<image src="@/static/images/chat/check@2x.png" mode="aspectFill"
						style="width: 26rpx; height: 23rpx;"></image>
				</view>
			</view>
		</view>
	</u-popup>

</template>

<script setup>
	import tools from '@/utils/tools';
	import {
		useUserStore
	} from '@/stores/modules/user'
	import {
		onBackPress
	} from '@dcloudio/uni-app';
	import {
		ref
	} from 'vue';
	import {
		useAppStore
	} from '@/stores/modules/app';
import { useI18n } from 'vue-i18n';

	const props = defineProps(['show'])
	const emit = defineEmits(['update:show', "change"]);
	const appStore = useAppStore();
	const {locale, t} = useI18n()

	
	const open = () => {
		// console.log('open');		
	}
	const close = () => {
		console.log('close')
		emit('update:show', false);
	}


	onBackPress(options => {
		if (options.from === 'navigateBack') {
			return false;
		}
		close();
		return true;
	})
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		height: 100vh;
		background: #F8F8F8;

		&_logo {
			margin-top: 154rpx;

			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;

			&_title {
				font-family: Gilroy-Bold;
				font-weight: bold;
				font-size: 48rpx;
				color: #000000;

				margin-top: 22rpx;
			}

			&_version {
				font-family: Gilroy-Medium;
				font-weight: 400;
				font-size: 28rpx;
				color: #999;

				// margin-top: 5rpx;
			}
		}

		.heng {
			width: 694rpx;
			height: 2rpx;
			margin: 18rpx 28rpx;
			background: #eee;

			border-radius: 50%;
		}

		.list-item {
			display: flex;
			justify-content: space-between;
			align-items: center;

			// padding: 35rpx 33rpx 34rpx 31rpx;
			padding: 0 33rpx 0 31rpx;
			height: 100rpx;
			background: white;

			&_left {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 32rpx;
				color: #000000;
			}

			&_right {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 28rpx;
				color: #999;

				display: flex;
				justify-content: center;
				align-items: center;
			}

			&_arrow::after {
				content: '';
				background: url('/static/images/home/arrow-right@2x.png') no-repeat;
				background-size: 12rpx 20rpx;

				width: 12rpx;
				height: 20rpx;
				margin-left: 16rpx;

			}

			&-bottom {
				border-bottom: 1rpx solid #eee;
			}
		}
	}
</style>