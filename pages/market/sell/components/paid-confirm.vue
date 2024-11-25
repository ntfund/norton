<template>
	<u-popup :show="show" :duration="200" :round="10" mode="bottom" @close="close" @open="open"
		:safeAreaInsetTop="false" :closeable="true">
		<view class="pop-content">
			<view class="title w-[80vw]">查看您的收款账户或询问买家，确认付款人姓名是否为：<span class="text-green-500">{{data}}</span></view>

			<view class="tip">
				<view class="py-1">*若您收到非实名转账，这可能导致您的收款账户被冻结或产生订单纠纷。如遇此情况，请立即提交申诉</view>
				<view class="py-1">*请务必前往收款账户核实款项，避免只参考买家提供的付款凭证或截图。诺顿绝不会扣留任何款项。若款项未到账或金额有误，请联系客服获取帮助。</view>
			</view>

			<view class="btns">
				<view class="btn ok" @click="confirm">确认放币</view>
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