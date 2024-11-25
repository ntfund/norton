<template>
	<com-nav-bar title="" backgroundColor="#fff"></com-nav-bar>
	<view class="px-4 text-sm">
		<view class="text-xl font-black mt-4">订单已生成</view>
		<view class="flex sub-title py-4 items-center">
			<view>付款剩余时间:</view>
			<view class="text-green-500  ml-2 font-bold flex items-center">
				<view><u-count-down :time="remain * 1000" format="mm:ss"></u-count-down></view>
				<view>秒</view>
			</view>
		</view>

		<view class="bg-gray-100 p-4 rounded-lg flex ">
			<view class="flex items-center">
				<view class="p-2 rounded-full bg-red-500 text-center">
					<view class="w-[30px] h-[30px] text-white font-bold text-xl text-center">{{item.shop.first_name}}
					</view>
				</view>
				<view class="ml-2">
					<view class="flex">
						<view class="font-bold">{{item.shop.name}}</view>
						<view class="flex ml-1">
							<view class="w-[20px] h-[20px] text-center bg-blue-600 rounded-full"
								v-if="item.shop.shop_level == 1">
								<uni-icons type="star-filled" color="#fff" size="18"></uni-icons>
							</view>
							<view class="w-[20px] h-[20px] text-center bg-fuchsia-600 rounded-full" v-else>
								<uni-icons type="vip-filled" color="#fff" size="18"></uni-icons>
							</view>
						</view>
					</view>
					<view class="text-gray-400">必须使用本人实名账户转账</view>
				</view>
			</view>
		</view>

		<view class="mt-6">
			<view class="flex py-2 items-center">
				<image src="@/static/img/usdt.png" mode="widthFix" style="width: 50rpx;"></image>
				<view class="font-semibold text-base ml-2">购买USDT</view>
			</view>
			<view class="order-item">
				<view class="left">订单编号</view>
				<view class="right">{{item.order_number}}</view>
			</view>
			<view class="order-item">
				<view class="left">单价</view>
				<view class="right">￥{{item.price}}</view>
			</view>
			<view class="order-item">
				<view class="left">数量</view>
				<view class="right">{{tools.formatNumber(item.amount, 2, 2)}} USDT</view>
			</view>
			<view class="order-item">
				<view class="left">总金额</view>
				<view class="right">￥{{tools.formatNumber(item.money, 2, 2)}}</view>
			</view>
			<view class="order-item">
				<view class="left">卖家收款方式</view>
				<view class="right">
					<view class="flex items-center" v-if="item.payment == 'bank'">
						<view class="w-[2px] h-[10px] bg-orange-400"></view>
						<view class="ml-1">银行卡</view>
					</view>
					<view class="flex items-center" v-if="item.payment == 'alipay'">
						<view class="w-[2px] h-[10px] bg-blue-500"></view>
						<view class="ml-1">支付宝</view>
					</view>
					<view class="flex items-center" v-if="item.payment == 'wechat_pay'">
						<view class="w-[2px] h-[10px] bg-green-500"></view>
						<view class="ml-1">微信支付</view>
					</view>
				</view>
			</view>
		</view>
		<view class="mt-4">
			<view class="font-black text-base">温馨提示</view>
			<view class="left text-gray-400">谨防交易诈骗，切勿轻信对方提供的支付截图，或使用其他平台聊天</view>
		</view>
	</view>
	<view class="fixed w-[750rpx] left-0 bottom-0">
		<view class="p-4 flex justify-center items-center">
			<view type="default" :border="false" class="normal-button" @click="cancel">取消订单</view>
			<button type="button" class="my-button px-10 font-bold flex-1 ml-4" @click="nextClick">下一步</button>
		</view>
	</view>
</template>

<script setup>
	import tools from '@/utils/tools'
	import {
		ref
	} from 'vue';

	const props = defineProps(['params'])
	const item = JSON.parse(decodeURIComponent(props.params))
	const remain = ref(tools.getRemain(item.over_time))

	const cancel = () => {
		tools.navigateTo('/pages/market/cancel?id=' + item.id)
	}

	const nextClick = () => {
		tools.navigateTo('/pages/market/buy/pay?id=' + item.id)
	}
</script>

<style lang="scss">
	.sub-title {
		color: $uni-color-subtitle;
	}

	.order-item {
		@apply flex items-center justify-between py-2;

		.left {
			@apply text-gray-600;
		}

		.right {
			@apply font-bold text-gray-800;
		}
	}

	.normal-button {
		@apply font-bold outline-none shadow-none border-solid rounded-full py-2.5 px-7 border-gray-200 text-xl;
		border-width: 1px;
	}

	.my-button {
		@apply rounded-full text-white bg-black font-semibold;
	}

	.u-count-down {
		.u-count-down__text {
			color: green !important;
		}
	}

	.u-count-down__text {
		span {
			color: green !important;
		}

		color: green !important;
	}
</style>