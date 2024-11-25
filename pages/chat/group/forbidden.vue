<template>
	<view>
		<com-nav-bar title="群内禁言" backgroundColor="#fff"></com-nav-bar>
		<view class="flex justify-between items-center row-item">
			<view class="left">
				全员禁言
			</view>
			<view class="right">
				<u-switch activeColor="#7F17FE" inactiveColor="#dadada" size="20" v-model="room.mute" :activeValue="1"
					:inactiveValue="0" :loading="loading" @change="changeSwitch"></u-switch>
			</view>
		</view>
		<view class="tips">
			<view class="tips_1">“全员禁言”开启后，只允许群主和管理员发言。</view>
			<view class="tips_2">进入群成员名片，可对单个成员设置禁言</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		useUserStore
	} from '@/stores/modules/user';
	import project from '/utils/project';
	import tools from '@/utils/tools';
	import {
		getRoomInfo, updateChatRom
	} from '@/config/api';

	const props = defineProps(["room"])
	const room = ref(JSON.parse(decodeURIComponent(props.room)))


	const loading = ref(false)
	const isTop = ref(1)
	const changeSwitch = (value) => {
		updateChatRom(room.value.id, {mute: value}).then(res => {
			// tools.toastSuccess("设置成功");
		})
	}

	onShow(() => {
		getRoomInfo(room.value.id).then(res => {
			room.value = res;
		})
	})
</script>

<style lang="scss" scoped>
	page {
		background: $uni-bg-color-grey;
	}

	.row-item {
		width: 750rpx;
		height: 100rpx;
		background: #FFFFFF;

		.left {
			margin-left: 29rpx;

			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 32rpx;
			color: #000000;

		}

		.right {
			margin-right: 30rpx;
		}
	}

	.tips {
		padding: 30rpx;

		font-family: SourceHanSansCN-Medium;
		font-weight: 500;
		font-size: 24rpx;
		color: #999;

		.tips_2 {
			margin-top: 8rpx;
		}
	}
</style>