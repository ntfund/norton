<template>
	<view class="root-tab">
		<view class="tab-list">
			<view class="tab-list_item" :class="{'tab-list_active': current === 0}" @click="change(0)">消息列表</view>
			<view class="tab-list_item" :class="{'tab-list_active': current === 1}" @click="change(1)">
				<uni-badge size="small" :text="appStore.newFriendRecords" absolute="rightTop" :offset="[0, 0]" type="error">
					通讯录
				</uni-badge>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		useAppStore
	} from '@/stores/modules/app';
	const props = defineProps(['current', 'len'])
	const emits = defineEmits(['update:current', 'change'])
	const appStore = useAppStore();

	const change = (index) => {
		emits('update:current', index)
		emits('change', index);
	}
</script>

<style lang="scss" scoped>
	.root-tab {
		width: 750rpx;
		height: 100rpx;
	}

	.tab-list {
		display: flex;
		width: 750rpx;
		height: 100rpx;
		background: #ffffff;

		position: fixed;
		z-index: 9999;
		left: 0;
		top: calc(44px + var(--status-bar-height));


		&_item {
			@apply w-1/2;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: flex-end;
			// height: 40px;
			padding-bottom: 36rpx;

			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 30rpx;
			color: #999999;
		}

		&_item::after {
			content: '';
			background: #EEEEEE;
			width: 100%;
			height: 2rpx;
			position: absolute;
			left: 0;
			bottom: 0;
		}

		&_active {
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 30rpx;
			color: #000000;
		}

		&_active::after {
			content: '';
			background: #7F17FE;
			width: 100%;
			height: 4rpx;
			position: absolute;
			left: 0;
			bottom: 0;
		}
	}
</style>