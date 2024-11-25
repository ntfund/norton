<template>

	<view class="root">
		<licai-home-top @clickLeft="clickLeft"></licai-home-top>
		<licai-home-good @buy="showBuy"></licai-home-good>
		<view class="pending" v-if="pendingCount">
			您有{{pendingCount}}笔订单正在确认中...
		</view>
		<view class="p-[28rpx] order-list">
			<view class="p-[2rpx] flex justify-between items-center">
				<view class="list-title">申购信息</view>
				<view class="list-more flex items-center" @click="tools.navigateTo('/pages/financial/orders/orders')">
					<view class="mr-[8rpx]">
						查看更多记录
					</view>
					<image src="@/static/images/chat/arrow-right@2x.png" mode="aspectFit"
						style="width: 12rpx; height: 20rpx;"></image>
				</view>
			</view>
			<view class="mt-4">
				<com-float-deposit ref="current"></com-float-deposit>
				<com-fixed-deposit ref="fixed" :status="1"></com-fixed-deposit>
			</view>
		</view>
		<!-- 定期申购弹窗 -->
		<!-- <com-modal-deposit v-if="show" v-model:show="show" :data="fixedData" @pay="pay"></com-modal-deposit> -->
		<!-- <com-finance-left v-model:show="leftShow" @change="change"></com-finance-left> -->
		<com-index-left v-model:show="leftShow"></com-index-left>

		<com-tab-bar></com-tab-bar>
	</view>
</template>

<script setup>
	import { useI18n } from 'vue-i18n';
	import {
		reactive,
		ref,
		watch
	} from "vue";
	import {
		onShow,
		onHide
	} from '@dcloudio/uni-app'
	import tools from '../../utils/tools.js'
	import {
		useUserStore
	} from '@/stores/modules/user';
	import LicaiHomeTop from './index/home-top.vue'
	import LicaiHomeGood from './index/home-good.vue'
	import {
		getPendingCount
	} from "@/config/api";
	let { t } = useI18n();


	const show = ref(false)
	const showWalletPay = ref(false)
	const wallet = ref({})
	const pendingCount = ref(0)

	// const getWallet = async () => {
	// 	//获取钱包。 先从缓存获取。
	// 	let result = await uni.$u.http.get('/userWallet/?chain_id=3')
	// 	console.log('http wallet', result)
	// 	wallet.value = result[0];
	// }

	// getWallet();

	let fixedData = reactive({
		id: 0,
		name: '',
		level: '',
		cycle: 0,
		rate: 0,
		img: '',
		total: 0,
		number: 0,
		amount: 0,
		min: 0,
		address: '',
		auto_rate: 0,
		status: 0,
		end_time: '',
		min_buy_level: 0,
		platform: 0,
		buyAmount: '',
		payType: 1
	})

	const current = ref(null)
	const fixed = ref(null)
	const showBuy = (item) => {
		// fixed.value.getDataList();
		console.log('show buy')
		if (item) {
			// fixedData = item
			for (let key in item) {
				fixedData[key] = item[key]
			}
			// show.value = true;

			tools.navigateToWithEncode('/pages/financial/dingqi/dingqi', fixedData)
		}
	}

	const leftShow = ref(false)
	const clickLeft = () => {
		console.log("click left")
		leftShow.value = true
	}

	//顶部导航，左侧弹窗选择项
	const change = (item) => {
		console.log('change', item)
		if (item == '首页') {
			uni.switchTab({
				url: '/pages/index/index'
			});
		} else if (item == 'API') {
			tools.navigateTo('/pages/api/api')
		} else if (item == '分析师') {
			tools.navigateTo('/pages/analyst/analyst')
		} else if (item == '我的') {
			tools.navigateTo('/pages/profile/profile')
		}
	}

	const pay = (data, walletIn) => {
		console.log(fixedData)
		wallet.value = walletIn
		showWalletPay.value = true;
	}

	//订阅订单完成 socket 事件
	let userStore = useUserStore()

	const subscribe = (act, data) => {
		switch (act) {
			case 'order':
				current.value.getData();
				fixed.value.getDataList();
				tools.toast("订单处理成功")
				pendingCount.value--;
				break;
			case 'redeem':
				current.value.getData();
				tools.toast("赎回处理成功")
				break;
			default:
				break;
		}
	}

	const getPending = () => {
		getPendingCount().then(res => {
			pendingCount.value = res.data;
		})
	}

	uni.$on('order', subscribe);

	onShow(async () => {
		getPending();

		console.log('finanical onShow')
		// uni.$emit('onShow', 1);
		
	})

	watch(() => userStore.user.account, (newVal, oldVal) => {
		getPending();
	})
</script>

<style lang="less">
	page {
		background: #F8F8F8;
		padding-bottom: 112rpx;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}


	.list-title {
		// width: 116rpx;
		height: 29rpx;
		font-family: SourceHanSansCN-Medium;
		font-weight: 500;
		font-size: 30rpx;
		color: #000000;
	}

	.list-more {
		// width: 116rpx;
		font-family: Source Han Sans CN;
		font-weight: 500;
		font-size: 24rpx;
		color: #000000;

		opacity: 0.6;
	}

	.order-list {
		min-height: 1000rpx;
		padding-bottom: 150rpx;
	}

	.pending {
		width: 690rpx;
		padding: 0 30rpx;
		height: 50rpx;
		background: rgba(249, 132, 52, 0.3);

		display: flex;
		align-items: center;

		font-family: SourceHanSansCN-Regular;
		font-weight: 400;
		font-size: 24rpx;
		color: rgba(249, 132, 52, 0.8);

	}
</style>