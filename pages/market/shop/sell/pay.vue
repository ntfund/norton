<template>
	<!-- 	<uni-nav-bar :fixed="true" :border="false" left-icon="left" left-width="30px" backgroundColor="#ffffff"
		:statusBar="true" title="" @clickLeft="tools.navigateBack()">
	</uni-nav-bar> -->
	<com-nav-bar title="" backgroundColor="#ffffff"
		@clickLeft="tools.navigateTo('/pages/market/shop/order')"></com-nav-bar>
	<view class="px-4 text-sm pb-10">

		<view class="flex">
			<view class="w-1/3 h-0.5 bg-black"></view>
			<view class="w-1/3 h-0.5 mx-2 bg-gray-400"></view>
			<view class="w-1/3 h-0.5 bg-gray-400"></view>
		</view>

		<view class="text-xl font-black mt-4">等待买家付款</view>
		<view class="flex sub-title py-4 items-center">
			<view class="text-green-500  ml-2 font-bold flex items-center">
				<view><u-count-down :time="remain * 1000" format="mm:ss"></u-count-down></view>
				<!-- <view>秒</view> -->
			</view>
			<view> 内买家未付款，将自动取消订单</view>
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
					<view class="text-gray-400">[订单消息]您有一笔出售订单</view>
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
			<view class="left text-gray-400">请使用本人实名账户进行转账汇款, 非本人账户汇款将导致交易被退回</view>
		</view>
	</view>
	<view class="btns">
		<view class="btn cancel" @click="close">取消订单</view>
		<view class="btn ok" @click="showUpload = true">我已转账</view>
	</view>

	<!-- 	<com-payment-list-c2c v-model:show="showPayments" :data="item.c2c.payments" :selectedItem="selectedPay"
		@change="change"></com-payment-list-c2c> -->

	<com-market-order-upload v-model:show="showUpload" @ok="confirmed"></com-market-order-upload>
</template>

<script setup>
	import tools from '@/utils/tools'
	import {
		reactive,
		ref
	} from 'vue';
	import project from '@/utils/project';
	import {
		C2COrderType
	} from '@/enums/C2COrderType'

	const showUpload = ref(false)
	const showPayments = ref(false)
	const props = defineProps(['id'])
	const paymentName = ref('')
	const selectedPay = ref('')
	const item = ref({
		money: '',
		order_number: '',
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

			if (data.status == C2COrderType.Success) {
				console.log('success');
				uni.reLaunch({
					url: '/pages/market/sell/paid?id=' + props.id
				})
			}

			if (data.status == C2COrderType.Timeout) {
				console.log('Timeout');
				uni.reLaunch({
					url: '/pages/market/order?current=' + 1
				})
			}

		})
	}
	getData()

	const switchPayment = () => {
		if (item.value.c2c.payments.length > 1) {
			showPayments.value = true
		}
	}

	const change = (item, index) => {
		selectedPay.value = item;
		//switchPayment
		uni.$u.http.put('/c2cOrder/' + props.id, {
			payment: selectedPay.value
		}).then(data => {
			uni.showToast({
				icon: 'success',
				title: '切换支付方式成功'
			})
			getData()
		})

	}

	const confirmed = (img) => {
		console.log('confirmed', img)

		uni.$u.http.put('/c2cOrder/' + props.id, {
			img
		}).then(data => {
			uni.reLaunch({
				url: '/pages/market/shop/sell/paid?id=' + props.id
			});
		})
	}

	const previewImage = (imgSrc) => {
		// 预览图片
		uni.previewImage({
			urls: [project.getFullURL(imgSrc)],
			longPressActions: {
				itemList: ['发送给朋友', '保存图片', '收藏'],
				success: function(data) {
					console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				},
				fail: function(err) {
					console.log(err.errMsg);
				}
			}
		});
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