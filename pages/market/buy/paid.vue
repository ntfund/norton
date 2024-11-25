<template>
	<view>
		<com-nav-bar title="" backgroundColor="#fff"  @clickLeft="tools.navigateTo('/pages/market/order')"></com-nav-bar>
		<view class="flex">
			<view class="w-1/3 h-0.5 bg-black"></view>
			<view class="w-1/3 h-0.5 mx-2 bg-black"></view>
			<view class="w-1/3 h-0.5 bg-gray-400"></view>
		</view>
		<view class="px-4">
			<view class="text-2xl font-bold mt-6">等待卖家确认收款</view>
			<view class="bg-gray-100 p-4 rounded-lg flex my-4">
				<view class="flex items-center">
					<view class="p-2 rounded-full bg-red-500 text-center">
						<view class="w-[30px] h-[30px] text-white font-bold text-xl text-center">
							{{item.shop.first_name}}
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
						<view class="text-gray-400">付款后，请勿取消订单</view>
					</view>
				</view>
			</view>

			<view class="mt-6">
				<view class="flex justify-between py-2 items-center">
					<view class="flex items-center">
						<image src="/static/img/usdt.png" class="self-center" mode="widthFix" style="width: 50rpx" />
						<view class="ml-2 text-base font-bold">购买USDT</view>
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
					<view class="left">总金额</view>
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
						<view class="iconfont icon-fuzhi ml-1" @click="tools.copyClick(item.payment_info.account)">
						</view>
					</view>
				</view>

				<view v-if="item.payment == 'bank'">
					<view class="order-item">
						<view class="left">银行</view>
						<view class="right flex">
							<view>{{item.payment_info.name}}</view>
							<view class="iconfont icon-fuzhi ml-1" @click="tools.copyClick(item.payment_info.name)">
							</view>
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
						<view class="font-bold text-blue-600" @click="previewImage(item.payment_info.qrcode)">查看二维码
						</view>
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
						<view class="font-bold text-blue-600" @click="previewImage(item.payment_info.qrcode)">查看二维码
						</view>
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


		</view>

		<view class="fixed bottom-0 left-0 right-0 mx-auto p-4">
			<button type="button">等待放币</button>
		</view>


	</view>
</template>

<script setup>
	import tools from '@/utils/tools'
	import {
		ref
	} from 'vue';

	const props = defineProps(['id'])

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

	let timer = null;
	const getData = () => {
		uni.$u.http.get('/c2cOrder/' + props.id).then(data => {
			console.log(data);
			item.value = data

			if (data.status == 0) {
				clearInterval(timer)
				uni.reLaunch({
					url: '/pages/market/buy/success?id=' + props.id
				})
			}

		})
	}
	getData()

	//检查放币
	timer = setInterval(() => {
		getData()
	}, 3000)
</script>

<style lang="less">
	.order-item {
		@apply flex items-center justify-between py-2;

		.left {
			@apply text-gray-600;
		}

		.right {
			@apply font-bold text-gray-800;
		}
	}
</style>