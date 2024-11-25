<template>
	<uni-nav-bar :fixed="true" :border="false" left-icon="left" left-width="30px" backgroundColor="#ffffff"
		:statusBar="true" title="" @clickLeft="tools.navigateBack()">
	</uni-nav-bar>
	<view class="px-4 text-sm">

		<view class="flex">
			<view class="w-1/3 h-0.5 bg-black"></view>
			<view class="w-1/3 h-0.5 mx-2 bg-black"></view>
			<view class="w-1/3 h-0.5 bg-gray-400"></view>
		</view>

		<view class="text-xl font-black mt-4">买家已付款</view>
		<view class="flex sub-title py-4 items-center">
			<view>买家已标记为转账成功，请确认收款</view>
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
					<view class="text-gray-400">[订单消息]安全提醒</view>
				</view>
			</view>
		</view>

		<view class="mt-6">
			<view class="flex justify-between py-2 items-center">
				<view class="flex items-center">
					<image src="/static/img/usdt.png" class="self-center" mode="widthFix" style="width: 50rpx" />
					<view class="ml-2 text-base font-bold">出售USDT</view>
				</view>
			</view>

			<view class="order-item">
				<view class="left">单价</view>
				<view class="right flex">
					<view>￥{{tools.formatNumber(item.price, 2, 2)}}</view>
				</view>
			</view>

			<view class="order-item">
				<view class="left">数量</view>
				<view class="right flex">
					<view>{{tools.formatNumber(item.amount, 2, 2)}}</view>
					<view class="ml-1">USDT</view>
				</view>
			</view>

			<view class="order-item">
				<view class="left">支付金额</view>
				<view class="right flex">
					<view>￥{{tools.formatNumber(item.money, 2, 2)}}</view>
					<view class="iconfont icon-fuzhi ml-1"
						@click="tools.copyClick(tools.formatNumber(item.money, 2, 2))"></view>
				</view>
			</view>


			<view class="order-item">
				<view class="left">收款方式</view>
				<view class="right flex">
					<view class="flex items-center justify-end ">
						<view class="w-[2px] h-[10px] " :class="{
						'bg-orange-400' : item.payment == 'bank', 
						'bg-blue-500' : item.payment == 'alipay', 
						'bg-green-500' : item.payment == 'wechat_pay'
					}"></view>
						<view class="ml-1">
							<text v-if="item.payment == 'bank'">银行卡</text>
							<text v-if="item.payment == 'alipay'">支付宝</text>
							<text v-if="item.payment == 'wechat_pay'">微信</text>
						</view>
					</view>
				</view>
			</view>


			<view class="order-item">
				<view class="left">姓名</view>
				<view class="right flex">
					<view>{{item.payment_info.account}}</view>
					<view class="iconfont icon-fuzhi ml-1" @click="tools.copyClick(item.payment_info.account)"></view>
				</view>
			</view>

			<view v-if="item.payment == 'bank'">
				<view class="order-item">
					<view class="left">银行</view>
					<view class="right flex">
						<view>{{item.payment_info.name}}</view>
						<view class="iconfont icon-fuzhi ml-1" @click="tools.copyClick(item.payment_info.name)"></view>
					</view>
				</view>
				<view class="order-item">
					<view class="left">账户</view>
					<view class="right flex">
						<view>{{item.payment_info.number}}</view>
						<view class="iconfont icon-fuzhi ml-1" @click="tools.copyClick(item.payment_info.number)">
						</view>
					</view>
				</view>
			</view>

			<view v-else-if="item.payment == 'alipay'">
				<view class="order-item">
					<view class="left">支付宝账号</view>
					<view class="right flex">
						<view>{{item.payment_info.number}}</view>
						<view class="iconfont icon-fuzhi ml-1" @click="tools.copyClick(item.payment_info.number)">
						</view>
					</view>
				</view>
				<view class="order-item">
					<view class="left">二维码</view>
					<view class="font-bold text-blue-600" @click="previewImage(item.payment_info.qrcode)">查看二维码</view>
				</view>
			</view>


			<view v-else-if="item.payment == 'wechat_pay'">
				<view class="order-item">
					<view class="left">微信账号</view>
					<view class="right flex">
						<view>{{item.payment_info.number}}</view>
						<view class="iconfont icon-fuzhi ml-1" @click="tools.copyClick(item.payment_info.number)">
						</view>
					</view>
				</view>
				<view class="order-item">
					<view class="left">二维码</view>
					<view class="font-bold text-blue-600" @click="previewImage(item.payment_info.qrcode)">查看二维码</view>
				</view>
			</view>


			<view class="order-item">
				<view class="left">订单编号</view>
				<view class="right flex">
					<view>{{item.order_number}}</view>
					<view class="iconfont icon-fuzhi ml-1" @click="tools.copyClick(item.order_number)"></view>
				</view>
			</view>

			<view class="order-item">
				<view class="left">下单时间</view>
				<view class="right flex">
					<view>{{item.created_at}}</view>
				</view>
			</view>

		</view>
		<view class="mt-4">
			<view class="font-black text-base">温馨提示</view>
			<view class="left text-gray-400">买家转账时备注或您收到非实名汇款，请联系客服将款项退回</view>
		</view>
	</view>
	<view class="btns">
		<view class="btn cancel" @click="close">取消订单</view>
		<view class="btn ok" @click="show = true">我已收到付款</view>
	</view>

	<paid-confirm v-model:show="show" :data="item.c2c_user_nickname" @ok="confirmed"></paid-confirm>
	
</template>

<script setup>
	import tools from '@/utils/tools'
	import {
		reactive,
		ref
	} from 'vue';
	import project from '@/utils/project';
	import paidConfirm from './components/paid-confirm.vue';

	const show = ref(false)
	const showUpload = ref(false)
	const showPayments = ref(false)
	const props = defineProps(['id'])
	const paymentName = ref('')
	const selectedPay = ref('')
	const item = ref({
		money: '',
		order_number: '',
		c2c_user_nickname: '',
		payment_info: {
			account: '',
			name: '',
			number: '',
			qrcode: '',
		},
		c2c: {
			payments: []
		},
		shop: {
			name: '',
			shop_level: 1
		},
	})
	const remain = ref(0)

	const getData = () => {
		uni.$u.http.get('/c2cOrder/' + props.id).then(data => {
			console.log(data);
			item.value = data
			selectedPay.value = data.payment
			paymentName.value = project.getPaymentName(data.payment)

			remain.value = tools.getRemain(data.over_time)
		})
	}
	getData()
		

	const confirmed = (img) => {
		console.log('confirmed', img)

		uni.$u.http.put('/c2cOrder/approve/' + props.id).then(data => {
			uni.reLaunch({
				url: '/pages/market/sell/success?id=' + props.id
			});
		})
	}
	
</script>

<style lang="scss" scoped>
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

	.my-button-2 {
		@apply rounded-full border-0 outline-none bg-gray-100 text-gray-400 font-semibold;
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

	.pay-border {
		padding: 2px 15px;
		border: 1px solid #ccc;
		border-radius: 99px;
	}
	
	.btns {
		// margin: 40rpx 33.33rpx 0 33.33rpx;
		position: fixed;
		bottom: 10px;
		left: 33.33rpx;
		right: 33.33rpx;
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