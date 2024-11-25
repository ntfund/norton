<template>
	<u-popup :show="props.show" @close="close" mode="bottom" :round="20">
		<view class=" py-4 px-5  text-sm leading-6">
			<view class="title flex justify-between items-center border-0 border-b border-solid border-[#f0f2f3]">
				<view class="flex flex-col">
					<view class="flex flex-row items-center">
						<h2 class="font-bold"><!--活期-->{{ t('deposit.float.name') }}</h2>
						<span class="rounded px-1 ml-2"
							style="background: #f0f0f0"><!--灵活存取-->{{ t('deposit.float.p1') }}</span>
					</view>
					<view class="flex items-center mt-1">
						<view class="text-sm text-[#929292]"><!--剩余可投-->{{ t('deposit.float.p17') }}</view>
						<!--            <span class=" ml-1 pb-0.5">{{ data.total - data.number }} USDT</span>-->
						<span class=" ml-1 ">{{ t('deposit.float.p18') }} USDT</span>
					</view>
				</view>
				<u-icon name="close" @click="close"></u-icon>

			</view>
			<view class="body py-2">
				<view class="flex justify-between">
					<view class="text-[#929292]"><!--申购数量-->{{ t('deposit.p6') }}</view>
					<view class="">{{ balanceStore.usdt }} USDT {{ t('balance') }}
					</view>
				</view>
				<view class="flex justify-between my-1 items-center border border-solid border-[#333] rounded">
					<input type="digit" v-model="data.buyAmount" step="1" class="outline-0 p-4 pl-2 text-[#000] w-50"
						:class="{'font-bold' : data.buyAmount > 0}" autofocus :placeholder="t('deposit.min') + data.min"
						ref="userAmountInput" cursor-spacing="50" />
					<view class="text-sm pr-2">USDT</view>
				</view>
				<view class="flex justify-between">
					<view class="text-[#929292]"><!--申购时间-->{{ t('deposit.float.p5') }}</view>
					<view class="">{{ tools.getNowTime("YYYY/mm/dd HH:MM") }}</view>
				</view>
				<view class="flex justify-between">
					<view class="text-[#929292]"><!--计息周期-->{{ t('deposit.float.p6') }}</view>
					<view class=""><!--每天-->{{ t('deposit.float.p7') }}</view>
				</view>
				<view class="flex justify-between">
					<view class="text-[#929292]"><!--收益发放-->{{ t('deposit.float.p8') }}</view>
					<view class=""><!--次日 08:00-->{{ t('deposit.fixed.p9') }}</view>
				</view>
				<view class="flex justify-between">
					<view class="text-[#929292]"><!--参考月化-->{{ t('deposit.float.p11') }}</view>
					<view class="">{{ tools.floorAmount(data.rate * 30) }}%</view>
				</view>
				<view class="flex justify-between">
					<view class="text-[#929292]"><!--日收益率-->{{ t('deposit.float.p12') }}</view>
					<view class="">{{ data.rate }}%</view>
				</view>
			</view>
			<view class="footer mt-2 mb-1">
				<button type="button" class="w-100 rounded-xl py-3 border-0 text-white text-lg" :disabled="disable"
					:class="{'bg-gray-600': disable, 'bg-blue-600': !disable}" @click="HandClicked">{{ t('Ido.buy') }}
				</button>
			</view>
		</view>
	</u-popup>
</template>

<script setup lang="ts">
	import { computed, ref } from "vue";
	import tools from '@/utils/tools';
	import { useI18n } from "vue-i18n";
	import { IHuoqiData } from '@/type/IHuoqiData'
	import { useBalanceStore } from '@/stores/modules/userBalance';

	let balanceStore = useBalanceStore()
	const { t } = useI18n();
	const props = defineProps<{
		show : boolean,
		data : IHuoqiData
	}>()
	const emit = defineEmits(['update:show', "ok"]);
	let data = props.data
	let disable = ref(false)

	const HandClicked = async () => {
		disable.value = true;
		tools.clickedTimeOut(disable)
		
		const isOpen = await uni.$u.http.get('/setting/getIsOpenTime');
		console.log('isOpen', isOpen)
		if (!!!isOpen) {
			console.log('not open')
			tools.toastError(t('buy.noOpen'));
			return false;
		}

		//活期不验证总量
		// if (data.buyAmount > data.total - data.number) {
		// 	tools.toastError(t('buy.noAmount'))
		// 	return false;
		// }

		if (!data.buyAmount || data.buyAmount < data.min) {
			tools.toastError(t('buy.min') + data.min)
			return false;
		}

		//如果余额支付
		if (parseFloat(data.buyAmount) > balanceStore.getUsdtToken().balance) {
			tools.toastError(t('message.noBalance') + data.min)
			return false;
		}
		
		emit('ok', data);
		
	}

	const close = () => {
		emit('update:show', !props.show);
	}
</script>

<style lang="less" scoped>

</style>