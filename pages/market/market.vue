<template>
	<view>
		<!-- <uni-nav-bar left-icon="left" title="C2C交易" fixed	statusBar /> -->
		<!-- <uni-nav-bar fixed :border="false" left-icon="left" backgroundColor="#F8F8F8" @clickLeft="clickLeft" statusBar
			title="C2C交易">
		</uni-nav-bar> -->
		<com-nav-bar title="C2C" backgroundColor="#F8F8F8" @clickLeft="clickLeft" :border="true"></com-nav-bar>
		<view class="header p-2">
			<view class="flex ">
				<view class="text-2xl font-bold" :class="{'text-gray-400' : active != '购买'}"
					@click="switchActive('购买')">购买</view>
				<view class="text-2xl font-bold ml-4" :class="{'text-gray-400' : active != '出售'}"
					@click="switchActive('出售')">出售</view>
			</view>
			<view class=" my-2 flex justify-between sticky top-0">
				<view class="bg-white flex items-center p-2 rounded-full flex-1">
					<image src="../../static/img/usdt.png" mode="widthFix" style="width: 50rpx;"></image>
					<view class="ml-1">USDT</view>
					<input class="ml-2" type="digit" placeholder="￥10.00起" v-model="amount">
				</view>
				<view class="flex flex-col items-center justify-center ml-6 mr-2" @click="show=true">
					<uni-icons type="more-filled" size="28"></uni-icons>
					<view class="text-xs">筛选</view>
				</view>
			</view>
		</view>
		<com-market-buy-list :amount="amount" :payment="selectedPay.value" v-if="active == '购买'"></com-market-buy-list>
		<com-market-sell-list :amount="amount" :payment="selectedPay.value"
			v-if="active == '出售'"></com-market-sell-list>
	</view>
	<com-market-bottom :index="1"></com-market-bottom>
	<com-paytype v-model:show="show" :data="payList" :selectedItem="selectedPay" @change="change"></com-paytype>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { onShow } from '@dcloudio/uni-app'
	const active = ref('购买');

	const switchActive = (item : string) => {
		active.value = '';
		setTimeout(function () {
			active.value = item
		}, 100)
	}

	const amount = ref('');
	const orderCount = ref(0);

	const show = ref(false)
	const payList = ref([{ name: '全部', info: '', value: '' }, { name: '银行卡', info: '', value: 'bank' }, { name: '支付宝', info: '即时付款', value: 'alipay' }, { name: '微信支付', info: '即时付款', value: 'wechat_pay' }]);
	const selectedPay = ref(payList.value[0]);

	const change = (item, index) => {
		selectedPay.value = item;
	}


	const getOrderCount = () => {
		uni.$u.http.get('/c2cOrder', {
			params: {
				status: 1,
				page: 1,
				pageSize: 100,
			}
		}).then(res => {
			orderCount.value = res.total
		})
	}

	const clickLeft = () => {
		uni.switchTab({
			url: '/pages/index/index'
		})
	}
	onShow(() => {
		getOrderCount()
	})
</script>

<style lang="scss">
	.header {
		background-color: $uni-bg-color-grey;
	}

	.sub-text {
		color: $uni-color-subtitle;
	}
</style>