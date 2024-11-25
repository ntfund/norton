<template>
	<view class="data-list" v-if="dataList.length > 0">
		<view v-for="(item, index) in dataList" :key="index" class="data-list_item  cur-dep"
			style="background: #ffffff; padding: 20px 15px 5px;">

			<div class="flex flex-row  justify-between desc">
				<image src="/static/img/usdt.png" class="self-center" mode="aspectFit"
					style="width: 64rpx; height: 64rpx;" />
				<div class="flex flex-col desc_lh">
					<div class="flex flex-row items-center ">
						<view class="desc_lh_symbol">USDT</view>
						<span class="desc_lh_linghuo"
							style="background: #7F17FE; color: #fff;"><!--30天-->{{ item.cycle }}{{ t('timer.day') }}</span>
					</div>
					<div class="desc_lh_zhuan" style="color: #929292"><!--定期赚币-->{{t('deposit.fixed.p1')}}</div>
				</div>
				<div class="flex  flex-1 flex-col justify-between items-end">
					<view class=" desc_amount" :class="[item.status == 1 ? 'text-[#7F17FE]' : 'text-black']">
						{{ tools.unitConverter(item.amount) }}
					</view>
					<span class="desc_status"
						:class="[item.status == 1 ? 'text-[#7F17FE]' : 'text-gray-600']"><!--申购中-->{{statusText(item)}}</span>
				</div>
			</div>
			<div class="content mt-[40rpx] mb-[20rpx]">
				<div class="flex justify-between row-item">
					<div class="text-left"><!--订单编号-->{{ t('deposit.fixed.p4') }}</div>
					<div class="text-right">{{ item.order.order_number }}</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left"><!--申购时间-->{{ t('deposit.fixed.p5') }}</div>
					<div class="text-right">{{ item.created_at }}</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left"><!--计息周期-->{{ t('deposit.fixed.p6') }}</div>
					<div class="text-right"><!--每天-->{{ t('deposit.fixed.p7') }}</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left"><!--收益发放-->{{ t('deposit.fixed.p8') }}</div>
					<div class="text-right"><!--次日 08:00-->{{ t('deposit.fixed.p9') }}</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left"><!--结束时间-->{{ t('deposit.fixed.p10') }}</div>
					<div class="text-right">{{ item.end_time }}</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left"><!--参考月化-->{{ t('deposit.fixed.p11') }}</div>
					<div class="text-right">{{ tools.floorAmount(item.rate * 30) }}%</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left"><!--每日收益-->{{ t('deposit.fixed.p12') }}</div>
					<div class="text-right">{{ tools.floorAmount(item.amount * item.rate / 100, 4) }} USDT</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left"><!--到期收益-->{{ t('deposit.fixed.p13') }}</div>
					<div class="text-right">{{ tools.floorAmount(item.amount * item.rate * item.cycle / 100, 4) }} USDT
					</div>
				</div>
				<div class="flex justify-between row-item">
					<div class="text-left" style="color: #5e61fe"><!--已获收益-->{{ t('deposit.fixed.p14') }}</div>
					<div class="text-right" style="color: #5e61fe">
						{{ item.status === 1 ? item.profit : tools.floorAmount(item.amount * item.rate * item.cycle / 100, 4) }}
						USDT
					</div>
				</div>
			</div>
			<div class="flex justify-between row-info  items-end" style="color: #929292">
				<div class="text-left text-xs"><!--*开启时， 到期后将自动进行申购-->{{ t('deposit.fixed.p15') }}</div>
				<div class="text-right flex items-end">
					<div class=" mr-1 " :class="[item.status == 1 ? 'text-[#7F17FE]' : 'text-[#999]']">
						<!--自动申购-->{{ t('deposit.fixed.p16') }}
					</div>
					<u-switch activeColor="#7F17FE" inactiveColor="#dadada" size="20" :disabled="item.status == 2"
						v-model="item.subscribe" :activeValue="1" :inactiveValue="0" :loading="loading"
						@change="change($event, item)"></u-switch>
					<!-- <a-switch v-model:checked="checked" @change="handChange" :disabled="item.status === 2" /> -->
				</div>
			</div>
		</view>
	</view>

</template>

<script lang="ts" setup>
	import { useI18n } from 'vue-i18n';
	import { ref, computed, watch } from "vue";
	import tools from '../../utils/tools.js'
	import { IFixed } from "../../type/IFixed";
	import { onShow } from "@dcloudio/uni-app";
	import { useUserStore } from '@/stores/modules/user';

	const props = defineProps(['status'])
	const { t } = useI18n();
	const loading = ref(false)
	const dataList = ref<IFixed[]>([]);
	const userStore = useUserStore();

	const statusText = computed(() => {
		// return item.status === 1 ? '申购中' : '已完成';
		return (item : IFixed) : string => {
			return item.status === 1 ? t('deposit.status') : t('deposit.done');
		}
	})
	const change = (newVal : number, item : IFixed) => {
		// console.log('change', item, newVal);
		uni.$u.http.put('/deposit/subscribe/' + item.id, { subscribe: newVal }).then(res => {
			tools.toastSuccess("设置成功");
		})
	}

	const getDataList = () => {
		console.log('getDataList')
		let params = {}
		if (props.status) {
			params = { status: props.status }
		}
		uni.$u.http.get('/deposit/fixed', {
			params
		}).then((data : IFixed[]) => {
			console.log('data', data)
			dataList.value = data
		})
	}
	
	watch(() => userStore.user.account, (newVal, oldVal) => {
		getDataList();
	})

	onShow(() => {
		getDataList();
	})

	// uni.$on('newOrderFixed', function () {
	// 	getDataList();
	// });

	
	defineExpose({ getDataList, dataList });
</script>

<style lang="less" scoped>
	.text-left {
		@apply text-[#999];
	}

	.text-right {
		@apply text-[#000];
	}

	.data-list {
		&_item {
			margin-bottom: 20rpx;
			border-radius: 8rpx 8rpx 16rpx 16rpx;

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
				}

				&_status {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 22rpx;
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

				// display: flex;
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

				}
			}
		}
	}
</style>