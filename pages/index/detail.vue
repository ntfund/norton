<template>
	<view class="body">
		<view class="flex avatar justify-start items-center">
			<image class=" img py-4" src="@/static/img/chain/nrt-on.png" mode="widthFix"></image>
			<view class="flex justify-start items-start flex-col ml-4">
				<text class="name">150****3366</text>
				<text class="uid">账户ID:65586558</text>
				<span class="card no flex-shrink-0">未认证</span>
			</view>
		</view>

		<view class="my-list">
			<view class="title">买币</view>
			<view class="icons grid grid-cols-4 gap-4">
				<view class="icon-item">
					<view class="iconfont icon-add-circle"></view>
					<text class="sub-title">买币</text>
				</view>
				<view class="icon-item">
					<view class="iconfont icon-association"></view>
					<text class="sub-title">C2C交易</text>
				</view>
			</view>
		</view>

		<view class="my-list">
			<view class="title">C2C商家中心</view>
			<view class="icons grid grid-cols-4 gap-4">
				<view class="icon-item">
					<view class="iconfont icon-click"></view>
					<text class="sub-title">管理中心</text>
				</view>
				<view class="icon-item flex flex-col">
					<!-- <uni-badge text="1"></uni-badge> -->
					<uni-badge size="small" :text="1" absolute="rightTop" :offset="[10, 0]" type="error">
						<view class="iconfont icon-order-manage"></view>
					</uni-badge>

					<text class="sub-title">订单列表</text>
				</view>
			</view>
		</view>

		<view class="my-list">
			<view class="title">交易</view>
			<view class="icons grid grid-cols-4 gap-4">
				<view class="icon-item">
					<view class="iconfont icon-shandian"></view>
					<text class="sub-title">闪兑</text>
				</view>
			</view>
		</view>

		<view class="my-list">
			<view class="title">金融</view>
			<view class="icons grid grid-cols-4 gap-4">
				<view class="icon-item">
					<view class="iconfont icon-money-finance-buyer"></view>
					<text class="sub-title">活期</text>
				</view>
				<view class="icon-item">
					<view class="iconfont icon-money-exchange-settlement"></view>
					<text class="sub-title">定期</text>
				</view>
			</view>
		</view>

		<view class="my-list my-list-last">
			<view class="title">福利</view>
			<view class="icons grid grid-cols-4 gap-4">
				<view class="icon-item">
					<view class="iconfont icon-lipin"></view>
					<text class="sub-title">邀请好友</text>
				</view>
			</view>
		</view>

		<view class="flex justify-between items-center p-4">
			<view class="flex items-center ml-2">
				<view class="iconfont icon-guanyuwomen text-[20px]"></view>
				<text class="ml-2">关于诺顿</text>
			</view>
			<view class="text-gray-600">v{{version}} <span class="text-gray-400">></span></view>
		</view>

		<view class="flex justify-between items-center p-4 pb-6">
			<view class="flex items-center ml-2 text-red-500" @click="tools.logout()">
				<view class="iconfont icon-export text-[20px]"></view>
				<text class="ml-2">退出登录</text>
			</view>
		</view>

	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import tools from '@/utils/tools';
	const version = uni.getSystemInfoSync().appWgtVersion || uni.getSystemInfoSync().appVersion;
</script>

<style lang="scss">
	.body {
		@apply pt-0;
	}

	.avatar {
		@apply m-4;
		border-bottom: 1px solid #eaeaea;

		.img {
			width: 100rpx;
		}

		.name {
			@apply text-xl font-bold;
		}

		.uid {
			@apply py-0.5 text-sm;
			color: $uni-text-color-grey;
		}

		.card {
			@apply p-1 py-0.5 text-xs;
			border: 1px solid #eaeaea;
			border-radius: 4px;
		}

		.yes {
			color: $uni-color-success;
		}

		.no {
			color: $uni-color-warning;
		}
	}

	.my-list {
		@apply m-4 pb-2;
		border-bottom: 1px solid #eaeaea;

		.title {
			@apply text-xl font-medium;
		}

		.icons {
			@apply px-2;

			.icon-item {
				@apply py-4 text-center;

				.iconfont {
					font-size: 30px;
				}

				.sub-title {
					@apply text-sm;
				}
			}

		}
	}

	.my-list-last {
		@apply m-0 p-4 pb-2;
	}
</style>