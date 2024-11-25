<template>
	<u-popup :show="props.show" mode="top" duration="0" @close="close" overlayOpacity="0.01"
		bgColor="transparent" :safeAreaInsetTop="true" @open="open">
		<view style="width: 750rpx; height: 600rpx; " @click="close">
			<view class="list-container">
				<view class="arrow" style="position: relative; left: 200rpx;">
					<u-icon name="arrow-up-fill" color="#000000" top="8" size="20"></u-icon>
				</view>
				<view class="list-items">
					<view class="list-item" @click="itemClick('发起群聊')">
						<uni-icons type="chat-filled" size="30" color="#ffffff"></uni-icons>
						<text class="list-item-text">发起群聊</text>
					</view>
					<view class="list-item" @click="itemClick('添加朋友')">
						<uni-icons type="personadd-filled" size="30" color="#ffffff"></uni-icons>
						<text class="list-item-text">添加朋友</text>
					</view>
					<view class="list-item" @click="itemClick('扫一扫')">
						<uni-icons type="scan" size="30" color="#ffffff"></uni-icons>
						<text class="list-item-text">扫一扫</text>
					</view>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script setup lang="ts">
	const props = defineProps(['show', 'data'])
	const emit = defineEmits(['update:show', "change"]);

	const open = () => {
		// console.log('open');

	}
	const close = () => {
		console.log('close')
		emit('update:show', false);
	}
	const itemClick = (item : string) => {
		emit('change', item);
		close()
	}
</script>

<style lang="less" scoped>
	.list-container {
		position: absolute;
		height: 500rpx;
		width: 270rpx;
		right: 10px;
		top: 30px;
		z-index: 1007891;
		/*  #ifdef  APP-PLUS  */
		top: 130rpx;
		/*  #endif  */
		
		// background-color: aqua;
	}

	.list-items {
		background-color: #000;
		padding: 10px 15px 10px 10px;
		border-radius: 8px;
		color: #ffffff;

		.list-item {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 10px 5px;
			border-bottom: 1px solid #212121;
			white-space: nowrap;

			.list-item-text {
				margin-left: 10px;
				color: #ffffff;
				font-size: 14px;
				white-space: nowrap;
			}
		}
	}
	.bg-popup {
		width: 750rpx;
		height: 9999px;
		background-color: aqua;
		z-index: 1007690;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
	}
</style>