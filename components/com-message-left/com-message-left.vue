<template>
	<u-popup :show="show" :duration="200" mode="left" @close="close" @open="open" :safeAreaInsetTop="true" bgColor="#7761ff">
		<view class="container" style="width: 200px; color: #fff;">
			<view class="avatar" @click="itemClick('个人信息')">
				<view class="img">
					<image class="rounded-full" width="75px" height="75px" style="width: 150rpx; height: 150rpx;"
						:src="userStore.getFullAvatar()" mode="aspectFit"></image>
				</view>
				<text class="name">{{userStore.user.nickname}}</text>
				<text class="uid">账户ID: {{userStore.user.uid}}</text>
			</view>
			<u-line color="#6250d3"></u-line>
			<view class="token" style="padding: 10px;">
				<view class="token-item">
					<image mode="aspectFit" style="width: 50rpx; height: 50rpx;" src="@/static/img/chain/nrt-on.png"></image>
					<text class="balance" style="color: #ffffff;">{{userBalanceStore.tokenBalance()}}</text>
				</view>
				<view class="token-item">
					<image mode="aspectFit" style="width: 50rpx; height: 50rpx;" src="/static/img/usdt.png"></image>
					<text class="balance" style="color: #ffffff;">{{userBalanceStore.usdtBalance()}}</text>
				</view>
			</view>
			<u-line color="#6250d3"></u-line>
			<view class="exchange" style="padding: 20px 10px 20px 10px;">
				<view class="btn-list" style="color: #eeeeee;">
					<button type="button" @click="navigate('/pages/chat/recharge/recharge')" class="my-btn" style="width: 70px; height: 30px; margin: 0 10px;   
					background-image: linear-gradient(to bottom right, #2d4de0, #7b4fd8); padding: 0; border: none; outline: none;">
						<text style="color: #eeeeee;font-size: 12px;">充币</text>
					</button>
					<button type="button" @click="navigate('/pages/chat/withdraw/withdraw')" class="my-btn" style="width: 70px; height: 30px; margin: 0 10px;  
					background-image: linear-gradient(to bottom right, #7b4fd8, #2d4de0); padding: 0; border: none; outline: none;">
						<text style="color: #eeeeee;font-size: 12px;">提币</text>
					</button>
				</view>
			</view>
			<view class="list">
				<view class="list-item" @click="itemClick('发起群聊')">
					<uni-icons type="chat-filled" size="30" color="#555555"></uni-icons>
					<text class="text">发起群聊</text>
				</view>
				<view class="list-item" @click="itemClick('通讯录')">
					<uni-icons type="staff-filled" size="30" color="#555555"></uni-icons>
					<text class="text">通讯录</text>
				</view>
				<view class="list-item" @click="itemClick('个人信息')">
					<uni-icons type="person-filled" size="30" color="#555555"></uni-icons>
					<text class="text">个人信息</text>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script setup lang="ts">
	import { useUserStore } from '@/stores/modules/user'
	import { useBalanceStore } from '@/stores/modules/userBalance'
	import tools from '@/utils/tools'
	
	const userStore = useUserStore()
	console.log('userStore', userStore.user);
	const userBalanceStore = useBalanceStore()

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
	const navigate = (url) =>
	{
		emit('update:show', false);
		tools.navigateTo(url);
	}
</script>


<style lang="less" scoped>
	.container {
		color: #ffffff;

		.avatar {
			padding: 20px 10px 20px 10px;
			background-color: #7761ff;
			// border-bottom: 1px solid #7d7d7d;
			display: flex;
			flex-direction: column;
			align-items: start;

			.img {
				width: 150rpx;
				height: 150rpx;
				border-radius: 999px;
				background-color: #fff;
				
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.name {
				margin-top: 10px;
				padding: 5px;
				color: #ffffff;
			}

			.uid {
				padding: 5px;
				font-size: 14px;
				color: #d8d8d8;
			}
		}

		.token {
			padding: 10px;

			.token-item {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin: 6px 0;

				.balance {
					margin-left: 10px;
				}
			}
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

		.btn-list {
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			button {
				background-image: linear-gradient(to bottom right, #2d4de0, #8857eb);
				color: #eee;
				// width: 100%;
				width: 70px;
				margin: 0 10px;
				font-size: 12px;
			}

			button:last-child {
				background-image: linear-gradient(to bottom right, #8857eb, #2d4de0);
			}
		}
	}
</style>