<template>
	<com-nav-bar title="" backgroundColor="#fff"  @clickLeft="tools.navigateTo('/pages/market/order')"></com-nav-bar>
	<view class="px-4 text-sm">
		
		<view class="flex">
			<view class="w-1/3 h-0.5 bg-black"></view>
			<view class="w-1/3 h-0.5 mx-2 bg-gray-400"></view>
			<view class="w-1/3 h-0.5 bg-gray-400"></view>
		</view>

		<view class="text-xl font-black mt-4">打开 {{paymentName}} 转账</view>
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
			<view class="flex justify-between py-2 items-center">
				<view class="flex items-center">
					<view class="w-[22px] h-[22px] items-center flex bg-black rounded-full justify-center text-white">1
					</view>
					<view class="ml-2 text-base font-bold">提供以下信息</view>
				</view>
				<view class="font-bold text-base flex items-center" :class="{'pay-border': item.c2c.payments.length > 1}"
					@click="switchPayment">
					{{paymentName}}
					<view class="iconfont icon-down ml-1" v-if="!showPayments && item.c2c.payments.length > 1"></view>
					<view class="iconfont icon-right ml-1" v-if="showPayments && item.c2c.payments.length > 1"></view>
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
						<view class="iconfont icon-fuzhi ml-1" @click="tools.copyClick(item.payment_info.number)"></view>
					</view>
				</view>
			</view>

			<view v-else-if="item.payment == 'alipay'">
				<view class="order-item">
					<view class="left">支付宝账号</view>
					<view class="right flex">
						<view>{{item.payment_info.number}}</view>
						<view class="iconfont icon-fuzhi ml-1" @click="tools.copyClick(item.payment_info.number)"></view>
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
						<view class="iconfont icon-fuzhi ml-1" @click="tools.copyClick(item.payment_info.number)"></view>
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

		</view>
		<view class="mt-4">
			<view class="font-black text-base">温馨提示</view>
			<view class="left text-gray-400">请确保付款卡所属人与平台实名信息一致，若不一致卖家有权不放币。请不要使用支付宝转银行卡等到账时间较长的付款方式</view>
		</view>
	</view>
	<view class="fixed w-[750rpx] left-0 bottom-0">
		<view class="p-4 flex items-center">
			<view class="w-[22px] h-[22px] items-center flex bg-black rounded-full justify-center text-white">2</view>
			<view class="ml-2 text-base font-bold">点击“我已支付”通知卖家</view>
		</view>
		<view class="p-4 flex justify-center items-center">
			<button type="button" class="my-button px-10 font-bold flex-1 ml-4" @click="showUpload = true">我已支付</button>
		</view>
	</view>
	<com-payment-list-c2c v-model:show="showPayments" :data="item.c2c.payments" :selectedItem="selectedPay"
		@change="change"></com-payment-list-c2c>
		
	<com-market-order-upload v-model:show="showUpload" @ok="confirmed"></com-market-order-upload>
</template>

<script setup>
	import tools from '@/utils/tools'
	import {
		reactive,
		ref
	} from 'vue';
	import project from '@/utils/project';

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
		uni.$u.http.put('/c2cOrder/' + props.id, {payment: selectedPay.value}).then(data => {
			uni.showToast({
				icon: 'success',
				title: '切换支付方式成功'
			})
			getData()
		})
		
	}
	
	const confirmed = (img) => {
		console.log('confirmed', img)
		
		uni.$u.http.put('/c2cOrder/' + props.id, {img}).then(data => {
			uni.reLaunch({
				url: '/pages/market/buy/paid?id=' + props.id
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

	.pay-border {
		padding: 2px 15px;
		border: 1px solid #ccc;
		border-radius: 99px;
	}
</style>