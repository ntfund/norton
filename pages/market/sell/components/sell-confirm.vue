<template>
	<u-popup :show="show" :duration="200" :round="10" mode="bottom" @close="close" @open="open"
		:safeAreaInsetTop="false" :closeable="true">
		<view class="pop-content">
			<view class="title">确认出售</view>

			<view class="tip">
				<view class="py-1">*确认出售后，您不可主动取消订单</view>
				<view class="py-1">*<span class="text-red-500">请使用本人实名账户进行收款</span>, 否则会导致订单失败且账号存在被冻结风险</view>
			</view>

			<view class="row-item">
				<view class="left">单价</view>
				<view class="right">￥{{tools.unitConverter(data.price)}}</view>
			</view>
			<view class="row-item">
				<view class="left">数量</view>
				<view class="right">{{tools.unitConverter(data.amount)}} USDT</view>
			</view>
			<view class="row-item">
				<view class="left">总金额</view>
				<view class="right">￥{{tools.unitConverter(data.money)}}</view>
			</view>
			<view class="row-item">
				<view class="left">收款账号</view>
				<view class="right flex">
					<view class="flex items-center justify-end ">
						<view class="w-[2px] h-[10px] " :class="{
						'bg-orange-400' : data.payment == 'bank', 
						'bg-blue-500' : data.payment == 'alipay', 
						'bg-green-500' : data.payment == 'wechat_pay'
					}"></view>
						<view class="ml-1">
							<text v-if="data.payment == 'bank'">银行卡</text>
							<text v-if="data.payment == 'alipay'">支付宝</text>
							<text v-if="data.payment == 'wechat_pay'">微信</text>
						</view>
					</view>
				</view>
			</view>

			<view class="btns">
				<view class="btn cancel" @click="close">取消</view>
				<view class="btn ok" @click="confirm">卖出</view>
			</view>
		</view>
	</u-popup>
</template>

<script setup>
	import tools from '@/utils/tools';
	const props = defineProps(['show', 'data'])
	const emit = defineEmits(['update:show', "ok"]);

	const open = () => {
		// console.log('open');
	}
	const close = () => {
		emit('update:show', false);
	}
	
	const confirm = () => {
		emit('ok');
		close();
	}
</script>

<style lang="scss" scoped>
	.pop-content {
		border-radius: 10px 10px 0 0;
		position: relative;

		// background-color: green;
	}

	.title {
		font-size: 40rpx;
		border-bottom: 1px solid #ebebeb;
		padding: 33.33rpx 33.33rpx;
		font-weight: bold;
	}

	.tip {
		background-color: #f4f4f4;
		padding: 10px;
		margin: 33.33rpx;
		border-radius: 10px;
		font-size: 25.6rpx;
		color: #929292;
	}

	.row-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 33.33rpx 33.33rpx;

		.left {
			color: #929292;
		}

		.right {
			font-weight: bold;
		}
	}

	.btns {
		margin: 40rpx 33.33rpx 20rpx 33.33rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.btn {
			padding: 30rpx 40rpx;
			border-radius: 999rpx;
			font-weight: bold;
		}

		.cancel {
			border: 1px solid #ccc;
		}

		.ok {
			background: black;
			color: white;
			flex: 1;
			text-align: center;
			margin-left: 30rpx;
		}
	}
</style>