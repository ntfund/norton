<template>
	<view>
		<view class="content">
			<view class="list-title">
				通用
			</view>
			<view class="list-item" @click="showLang = true">
				<view class="list-item_left">语言设置</view>
				<view class="list-item_right list-item_arrow">
					<view>{{appStore.locale == 'zh' ? '简体中文' : 'English'}}</view>
				</view>
			</view>
			<view class="list-item" @click="showUnit=true">
				<view class="list-item_left">汇率切换</view>
				<view class="list-item_right list-item_arrow">
					<view>{{appStore.unit}}</view>
				</view>
			</view>
		</view>
		<com-index-left-unit v-if="showUnit" v-model:show="showUnit"></com-index-left-unit>
		<com-index-left-lang v-if="showLang" v-model:show="showLang"></com-index-left-lang>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		useUserStore
	} from '@/stores/modules/user';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
	import tools from '@/utils/tools';
	import {
		useAppStore
	} from '@/stores/modules/app';
	const walletStore = useWalletStore();
	const userStore = useUserStore();
	const appStore = useAppStore();
	const showUnit = ref(false);
	const showLang = ref(false);

	defineExpose({
		showUnit,
		showLang
	})
</script>

<style lang="scss" scoped>
	.content {
		// padding-top: 34rpx;

		.list-title {
			padding: 32rpx 29rpx;
			font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 36rpx;
			color: #000000;

			&-border {
				border-top: 1rpx solid #EEEEEE;
				;
			}
		}

		.list-item {
			display: flex;
			justify-content: space-between;
			align-items: center;

			// padding: 35rpx 33rpx 34rpx 31rpx;
			padding: 0 33rpx 0 31rpx;
			height: 100rpx;

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
		}
	}
</style>