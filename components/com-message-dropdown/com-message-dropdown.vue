<template>
	<view class="container">
		<view class="dropdown" v-if="props.show">
			<uni-list class="dropdown-list" :border="true">
				<uni-list-item :style="dropdownlist" :show-extra-icon="true" :extra-icon="extraIconChat" title="发起群聊"
					:border="false" :showArrow="false" @click="rowClick('发起群聊')">
					<template v-slot:body>
						<view class="slot-box">
							<text class="slot-text">发起群聊</text>
						</view>
					</template>
				</uni-list-item>
				<uni-list-item :border="false" @click="rowClick('添加朋友')" :style="dropdownlist" :show-extra-icon="true"
					:extra-icon="extraIconPersonadd" title="添加朋友" :showArrow="false" :textStyle="'color: white;'">
					<template v-slot:body>
						<view class="slot-box">
							<text class="slot-text">添加朋友</text>
						</view>
					</template>
				</uni-list-item>
				<uni-list-item :border="false" @click="rowClick('扫一扫')" :style="dropdownlist" :show-extra-icon="true"
					:extra-icon="extraIconScan" title="扫一扫" :showArrow="false" :textStyle="'color: white;'">
					<template v-slot:body>
						<view class="slot-box">
							<text class="slot-text">扫一扫</text>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script setup lang="ts">
	const props = defineProps(['show', 'data'])
	const emit = defineEmits(['update:show', "change"]);
	
	const close = () => {
		emit('update:show', !props.show);
	}

	const rowClick = (item : string) => {
		emit('change', item);
	}

	let extraIconPersonadd = {
		color: 'white',
		size: '30',
		type: 'personadd-filled'
	}

	let extraIconScan = {
		color: 'white',
		size: '30',
		type: 'scan'
	}

	let extraIconChat = {
		color: 'white',
		size: '30',
		type: 'chat-filled'
	}

	let dropdownlist = 'padding:10rpx;  color:#fff'
</script>

<style lang="less">
	.container {
		width: 400px;
		height: 1000px;
		background: #000;
	}
	body {
		background-color: #000;
	}
	
	.dropdown {
		position: fixed;
		z-index: 10071;

		/*  #ifndef  MP-WEIXIN  */
		top: 180rpx;
		left: 20rpx;
		/*  #endif  */

		/*  #ifdef  MP-WEIXIN  */
		top: 160rpx;
		left: 20rpx;
		/*  #endif  */

		/*  #ifdef  H5  */
		top: 100rpx;
		left: 20rpx;
		/*  #endif  */

		background: #000;
		color: #fff;
	}

	.dropdown-list {
		background-color: #000;
		border-radius: 10rpx;
		color: #fff !important;

		.uni-list-item,
		.uni-list-item__container {
			background-color: #000 !important;
			color: #fff !important;
			border-bottom: 1px solid #181818;
		}

		.uni-list-item__content-title {
			color: #fff !important;
		}


		.slot-box {
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		.slot-box .slot-text {
			color: #fff;
			font-size: 14px;
		}
	}
</style>