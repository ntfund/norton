<template>
	<u-popup :show="props.show" :round="20" mode="bottom" :overlayOpacity="0.7" duration="200" @close="close">
		<view class="rounded-xl confirme-view">
			<view class="title">{{props.title ? '是否确认该操作?' : ''}}</view>
			<view class="hr"></view>
			<view class="ok" @click="ok('all')" v-if="showAll">{{allText ? allText : '从我和对方的设备删除'}}</view>
			<view class="ok" @click="ok('me')">仅为我删除</view>
			<view class="space"></view>
			<view class="cancel" @click="close()">取消</view>
		</view>
	</u-popup>
</template>

<script setup>
	const props = defineProps(['show', 'title', 'showAll', 'allText'])
	const emit = defineEmits(['update:show', "confirmed", "close"]);

	const close = () => {
		emit('close');
		emit('update:show', false);
	}
	
	const ok = (type) => {
		close()
		emit('confirmed', type)
	}	
</script>

<style lang="less" scoped>
	.confirme-view {
		background: white;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
		.title {
			padding: 33.33rpx;
			font-size: 26.8rpx;
			color: #787878;
		}
		
		.hr {
			height: 1rpx;
			width: 100%;
			background-color: #ececec;
		}
		
		.ok {
			// padding: 33.33rpx;
			color: red;
			font-weight: 500;
			
			width: 100%;
			padding: 33.33rpx 0;
			text-align: center;
		}
		
		.space {
			height: 14rpx;
			width: 100%;
			background-color: #ececec;
		}
		
		.cancel {
			// padding: 33.33rpx;
			font-weight: 500;
			margin-bottom: 20rpx;
			
			width: 100%;
			padding: 33.33rpx 0;
			text-align: center;
		}
	}
</style>