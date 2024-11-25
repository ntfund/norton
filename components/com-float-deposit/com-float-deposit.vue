<template>
	<view v-if="data.amount > 0">
		<div class="rounded-xl mb-[20rpx] cur-dep" style="background: #ffffff; padding: 30rpx;">
			<div class="flex flex-row  justify-between desc">
				<image src="/static/img/usdt.png" class="self-center" mode="aspectFit"
					style="width: 64rpx; height: 64rpx;" />
				<div class="flex flex-col desc_lh">
					<div class="flex flex-row items-center ">
						<view class="desc_lh_symbol">USDT</view>
						<span class="desc_lh_linghuo"
							style="background: #7F17FE; color: #fff;"><!--灵活存取-->{{t('deposit.float.p1')}}</span>
					</div>
					<div class="desc_lh_zhuan" style="color: #929292"><!--活期赚币-->{{t('deposit.float.p2')}}</div>
				</div>
				<div class="flex  flex-1 flex-col justify-between items-end">
					<view class="text-[#7F17FE] desc_amount">{{ tools.unitConverter(data.amount) }}</view>
					<span class="desc_status"
						style="color: #7F17FE !important;"><!--申购中-->{{t('deposit.status')}}</span>
				</div>
			</div>
			<div class="content mt-[40rpx] mb-[20rpx]">
				<div class="flex justify-between row-item">
					<div class="text-left"><!--订单编号-->{{t('deposit.float.p4')}}</div>
					<div class="text-right">{{ data.order.order_number }}</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left"><!--申购时间-->{{t('deposit.float.p5')}}</div>
					<div class="text-right">{{ data.created_at }}</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left"><!--计息周期-->{{t('deposit.float.p6')}}</div>
					<div class="text-right"><!--每天-->{{t('deposit.float.p7')}}</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left"><!--收益发放-->{{t('deposit.float.p8')}}</div>
					<div class="text-right"><!--次日 08:00-->{{t('deposit.fixed.p9')}}</div>
				</div>
				<div class="flex justify-between row-item row-item">
					<div class="text-left"><!--结束时间-->{{t('deposit.float.p9')}}</div>
					<div class="text-right"><!--随存随取-->{{t('deposit.float.p10')}}</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left"><!--参考月化-->{{t('deposit.float.p11')}}</div>
					<div class="text-right">{{ tools.floorAmount(data.rate * 30) }}%</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left"><!--日收益率-->{{t('deposit.float.p12')}}</div>
					<div class="text-right">{{ data.rate }}%</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left"><!--昨日收益-->{{t('deposit.float.p13')}}</div>
					<div class="text-right">{{ data.last_profit }} USDT</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left" style=""><!--已获收益-->{{t('deposit.float.p14')}}</div>
					<div class="text-right" style="color: #7F17FE">{{ data.profit }} USDT</div>
				</div>
			</div>
			<div class="flex justify-between items-center row-info items-end">
				<div class="text-left"><!--*活期灵活存取， 可随时取出-->{{t('deposit.float.p15')}}</div>
				<view class="flex items-center">
					<div class="text-right" @click="isRedeemActive = !isRedeemActive">
						<!--赎回-->{{t('deposit.float.p16')}}
					</div>
					<image src="@/static/images/financial/arrow-right-purple@2x.png" mode="aspectFit"
						style="width: 12rpx; height: 20rpx; margin-left: 10rpx;"></image>
				</view>
			</div>
		</div>
		<com-float-redeem v-if="isRedeemActive" v-model:show="isRedeemActive"></com-float-redeem>
	</view>
</template>

<script lang="ts" setup>
	import { onShow } from '@dcloudio/uni-app'
	import { useI18n } from 'vue-i18n';
	import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
	import tools from '@/utils/tools.js'
	import { useUserStore } from '../../stores/modules/user';
	let { t } = useI18n();
	const isRedeemActive = ref(false)
	const userStore = useUserStore();

	let data = reactive({
		amount: 0,
		order: {
			order_number: '',
		},
		// time: '07/09 10:11',
		rate: 0,
		last_profit: 0,
		profit: 0,
		created_at: ''
	})

	const getData = () => {
		uni.$u.http.get('/deposit/current').then(res => {
			for (let key in res) {
				data[key] = res[key]
			}
			// console.log('data', data)
		})
	}


	// uni.$on('newOrderCurrent', function () {
	// 	getData();
	// });


	
	onMounted(() => {
		uni.$on('newOrderRedeem', amount => {
			data.amount -= amount
		});
	})

	// onUnmounted(() => {
	// 	uni.$off('newOrderRedeem');
	// })

	watch(() => userStore.user.account, (newVal, oldVal) => {
		getData();
	})
		
	onShow(() => {
		getData()
	})	

	defineExpose({ getData, data });
</script>

<style lang="less" scoped>
	.text-left {
		@apply text-[#999];
	}

	.text-right {
		@apply text-[#000];
	}

	.desc {
		&_lh {
			margin-left: 21rpx;

			&_symbol {
				font-family: Gilroy-Bold;
				font-weight: bold;
				font-size: 32rpx;
				color: #000000;
			}

			&_linghuo {

				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 22rpx;
				color: #FFFFFF;

				padding: 3rpx 6rpx;

				margin-left: 11rpx;

				border-radius: 4rpx;
			}

			&_zhuan {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 20rpx;
				color: #999;

				padding-top: 12rpx;
			}
		}

		&_amount {
			font-family: Gilroy-Bold;
			font-weight: bold;
			font-size: 30rpx;
			color: #7F17FE;
		}

		&_status {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 22rpx;
			color: #7F17FE;
		}
	}

	.row-item {
		// @apply text-base;
		padding: 9.5rpx 0;

		.text-left {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 22rpx;
			color: #999;

			margin-left: 4rpx;
		}

		.text-right {
			margin-right: 2rpx;

			font-family: Gilroy-Regular;
			font-weight: 400;
			font-size: 26rpx;
			color: #000000;
		}
	}

	.row-info {

		// background: green;

		border-top: 1rpx solid #EEEEEE;
		;
		padding-top: 20rpx;

		// align-items: center;

		.text-left {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 22rpx;
			color: #999;

			padding-left: 4rpx;
		}

		.text-right {
			padding-right: 2rpx;

			font-family: AdobeHeitiStdR;
			font-weight: normal;
			font-size: 26rpx;
			color: #7F17FE;
		}
	}
</style>