<template>
	<u-popup :show="show" mode="left" @close="close" @open="open" :safeAreaInsetTop="true" bgColor="#7761ff">
		<view class="container" style="width: 200px;">
			<view class="avatar flex justify-center items-center">
				<image class="img py-4" src="@/static/img/chain/nrt-on.png" mode="widthFix"></image>
				<!-- <text class="name">{{userStore.user.nickname}}</text>
				<text class="uid">账户ID:{{userStore.user.id}}</text> -->
			</view>
			<view class="list">
				<view class="list-item" @click="itemClick('首页')">
					<uni-icons type="home-filled" size="30" color="#555555"></uni-icons>
					<text class="text">首页</text>
				</view>
				<view class="list-item" @click="itemClick('分析师')">
					<uni-icons type="fire-filled" size="30" color="#555555"></uni-icons>
					<text class="text">分析师</text>
				</view>
				<view class="list-item" @click="itemClick('API')">
					<uni-icons type="fire-filled" size="30" color="#555555"></uni-icons>
					<text class="text">API</text>
				</view>
				<view class="list-item" @click="itemClick('我的')">
					<uni-icons type="person-filled" size="30" color="#555555"></uni-icons>
					<text class="text">我的</text>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script setup lang="ts">
	import { useUserStore } from '@/stores/modules/user'
	const userStore = useUserStore()

	const props = defineProps(['show'])
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
	.container {
		.avatar {
			// padding: 20px 10px 20px 10px;
			background-color: #7761ff;
			border-bottom: 1px solid #7d7d7d;

			.img {
				width: 120rpx;
				border-radius: 999px;
			}

			// .name {
			// 	margin-top: 10px;
			// 	padding: 5px;
			// 	color: #ffffff;
			// }

			// .uid {
			// 	padding: 5px;
			// 	font-size: 14px;
			// 	color: #d8d8d8;
			// }
		}

		.list {
			background-color: #fff;
			padding: 10px 15px 10px 10px;
			height: 1000px;

			.list-item {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: 10px 5px;

				.text {
					margin-left: 10px;
					color: #000000;
					font-size: 14px;
				}
			}
		}
	}
</style>