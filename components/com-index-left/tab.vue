<template>
	<view class="root-tab">
		<view class="tab-list">
			<view class="tab-list_item" :class="{'tab-list_active': current === index}" @click="change(index)" v-for="(item,index) in list">
				{{item}}
			</view>
		</view>
		<view></view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	const props = defineProps(['current', 'list'])
	const emits = defineEmits(['update:current', 'change'])
	
	// console.log(props.current)
	
	const change = (index) => {
		emits('update:current', index)
		emits('change', index);
	}
</script>

<style lang="scss" scoped>
	.root-tab {
		// width: 750rpx;
		// width: 100%;
		height: 110rpx;		
		
		// padding: 0 28rpx;
	}
	.tab-list {		
		display: flex;				
		height: 110rpx;	
		// background: #F8F8F8;
		margin: 0 9rpx;
		
		
		&_item {
			// @apply w-1/2;			
			position: relative;
			display: flex;
			justify-content: center;
			align-items: flex-end;
			// height: 40px;
			padding: 20rpx;
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
			width: calc(100% - 40rpx);
			height: 4rpx;
			position: absolute;
			left: 20rpx;
			// margin: 0 auto;
			bottom: 0;
			
			
		}
	}
</style>