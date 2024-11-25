<template>
	<!-- <uni-nav-bar :fixed="true" :border="false" backgroundColor="#F8F8F8" :statusBar="true" left-icon="left"
		:rightText="rightText" right-width="200px" title="" @clickLeft="clickLeft" @clickRight="rightClick">
	</uni-nav-bar> -->
	<com-nav-bar title="收款方式" backgroundColor="#fff" :border="true" @clickLeft="clickLeft" @clickRight="rightClick"></com-nav-bar>
	<view class="content" v-if="userStore.user.identity">
		<view class="data-list" v-if="dataList.length > 0">
			<view class="" v-for="(item, index) in dataList" :key="index" @click="rowClick(item)">
				<view v-if="item.type == 'bank'">
					<bank :data="item"></bank>					
				</view>
				<view v-else-if="item.type == 'alipay'">
					<alipay :data="item"></alipay>					
				</view>
				<view v-else-if="item.type == 'wechat_pay'">
					<weixin :data="item"></weixin>				
				</view>				
			</view>
		</view>
		
		<view class="payment-add flex items-center justify-center" @click="rightClick">
			<view class="flex flex-col items-center justify-center">
				<image src="@/static/images/c2c/payments/plus@2x.png" mode="aspectFit" style="width: 52rpx; height: 52rpx;"></image>
				<view class="payment-add_info">添加新的支付账户</view>
			</view>
		</view>


		<view class="infos">
			<view class=" py-2">
				* <span class="text-red-500">请确保您设置的账户为本人实名账户</span>，非本人实名账户收款会导致订单失效且账号被冻结
			</view>
			<view class=" py-2">
				* 向买家仅展示已开启的收款账号
			</view>
			<view class=" py-2">
				* 平台不会自动扣款，需要您通过对应的收款服务平台APP转账给对方，对方才能收到款项。
			</view>
		</view>
		
	</view>
	<view v-else class="flex flex-col justify-center text-center">
		<uni-icons type="info-filled" size="60" color="#e14b00"></uni-icons>
		<view class="text-xl">您未进行实名认证，请先进行实名</view>
		<view class="text-xl text-blue-500" @click="tools.navigateTo('/pages/market/certificate/home')">点击认证
		</view>
	</view>
</template>

<script setup lang="ts">
	import tools from '@/utils/tools'
	import { onShow } from '@dcloudio/uni-app'
	import { computed, ref } from "vue";
	import { getPaymentList } from '../../../config/api';
	import { useUserStore } from '../../../stores/modules/user';
	import alipay from './components/alipay';
	import weixin from './components/weixin';
	import bank from './components/bank';
	

	let userStore = useUserStore();
	const rightText = computed(() => {
		return userStore.user.identity ? '添加收款账号' : ''
	})

	const dataList = ref([
		// {
		// 	id: 1,
		// 	payType: '银行卡',
		// 	account: '',
		// 	number: '62220240000066883344',
		// 	name: '中国工商银行',
		// 	remark: ''
		// },
		// {
		// 	id: 2,
		// 	payType: '支付宝',
		// 	account: '',
		// 	number: '13512345678',
		// 	name: '',
		// 	remark: '即时付款'
		// },
		// {
		// 	id: 3,
		// 	payType: '微信',
		// 	account: '',
		// 	number: '18823457888',
		// 	name: '',
		// 	remark: '即时付款'
		// }
	])

	const clickLeft = () => {
		// tools.navigateBack();
		tools.navigateTo('/pages/market/profile')
	}

	const rightClick = () => {
		tools.navigateTo('/pages/market/payment/add')
	}

	const rowClick = (item) => {
		if (item.type == 'bank') {
			tools.navigateToWithEncode('/pages/market/payment/detail/bank', item)
		} else if (item.type == 'alipay') {
			tools.navigateToWithEncode('/pages/market/payment/detail/alipay', item)
		} else if (item.type == 'wechat_pay') {
			tools.navigateToWithEncode('/pages/market/payment/detail/weixin', item)
		}
	}

	const getPayList = () => {
		getPaymentList().then(data => {
			dataList.value = data
		})
	}

	onShow(() => {
		getPayList();
	})
</script>

<style lang="scss" scoped>
	.content {
		margin-top: 46rpx;
	}
	.payment-add {
		width: 694rpx;
		height: 224rpx;
		margin: 0 auto;
		
		background: #FFFFFF;
		border-radius: 8rpx;
		border: 3rpx solid #EEEEEE;
		
		&_info {
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 24rpx;
			color: #000000;
			opacity: 0.4;
			
			padding-top: 23rpx;
		}
	}
	
	.infos {
		padding: 0 28rpx;
		margin-top: 50rpx;
		
		font-family: SourceHanSansCN-Medium;
		font-weight: 500;
		font-size: 24rpx;
		
		color: #999;
	}

</style>