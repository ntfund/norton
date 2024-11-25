<template>
	<u-popup :show="props.show" @close="close" mode="bottom" :round="10">
		<view class="text-[#131313] py-4 px-5 bg-[#fff] rounded-2xl relative">
			<view class="title flex justify-between items-center">
				<view class="w-1/5"></view>
				<view class="flex flex-col w-3/5 text-center">
					<h3 class="font-bold">{{ t('swap.name') }}</h3>
				</view>
				<view class="w-1/5 text-right" @click="close">
					<view class="iconfont icon-close"></view>
				</view>
			</view>
			<view class="body py-2 mt-2">
				<!--        <view class="flex justify-between items-center rounded-xl py-3 px-2 bg-[#f5f7fb]">-->
				<!--          <img src="/static/img/usdt.png" class="self-center" width="25">-->
				<!--          <view class="ml-2 flex-1">USDT</view>-->
				<!--          <view>-->
				<!--            <right-outlined :style="{color: '#929292'}" />-->
				<!--          </view>-->
				<!--        </view>-->

				<view class="flex flex-col ">
					<view class="flex justify-between items-center"><!--消耗-->
						<view class="font-semibold ml-2">{{ t('swap.consume') }}</view>
						<view class="text-left mt-1 mr-1 text-sm">
							<!--              可用-->{{ t('swap.balance') }}：{{ tools.floorAmount(from.balance, 4) }}
							{{ from.name }}
						</view>
					</view>
					<view
						class="text-[#929292] py-3 px-2 rounded-lg border border-solid border-[#929292] flex flex-nowrap justify-between items-center">
						<input type="digit" v-model="amountIn" placeholder="0.00" class="w-50 text-[#000]"
							ref="userAmountInput">
						<view class="flex-1 text-right text-[#d4ae3b] font-bold mr-2 flex-nowrap flex justify-end whitespace-nowrap"
							@click="amountIn = from.balance">
							<!--              最大-->{{ t('swap.max') }}
						</view>
						<view
							class="border-0 border-l border-solid border-[#cecece] text-[#5e5cfb] pl-2 flex items-center">
							<image :src="baseURL + from.icon" class="self-center" mode="aspectFit" style="width: 25px; height: 25px;" />
							<view class="ml-1 text-[#131313] font-semibold">{{ from.name }}</view>
						</view>
					</view>
					<view class="flex justify-end min-h-[25px]">

						<view class="text-left mt-1 mr-1 text-sm" v-if="from.max > -1">
							<!--              兑换额度-->{{ t('swap.volume') }}：{{ tools.floorAmount(from.max, 4) }}
						</view>
					</view>

				</view>

				<view class="text-center w-100 flex justify-center items-center my-2" @click="handExchange">
					<image src="@/static/images/financial/exchange@2x.png" class="self-center" mode="aspectFit" style="width: 60rpx; height: 60rpx;" />
				</view>

				<view class="flex flex-col relative -mt-2 ">
					<view class="font-semibold ml-2"><!--获得-->{{ t('swap.get') }}</view>
					<view
						class="text-[#929292] py-3 px-2 rounded-lg border border-solid border-[#929292] flex justify-between items-center">
						<input type="digit" class="w-50 text-[#000]" v-model="amountOut" readonly placeholder="0.00">
						<view class="flex-1 text-right text-[#d4ae3b] font-bold mt-2"></view>
						<view
							class="border-0 border-l border-solid border-[#cecece] text-[#5e5cfb] pl-2 flex items-center">
							<image :src="baseURL + to.icon" class="self-center" mode="aspectFit" style="width: 25px; height: 25px;" />
							<view class="ml-1 text-[#131313] font-semibold">{{ to.name }}</view>
						</view>
					</view>
					<view class="text-left mt-1 mr-1 text-sm text-[#929292]">
						<!--            预估值-->{{ t('swap.estimated') }} 1 {{ from.name }}≈{{ from.rate }} {{ to.name }}
					</view>
				</view>

			</view>
			<view class="footer mt-2 mb-1">
				<button type="button" :disabled="disabled" :class="{'disabled': disabled}"
					class="n-btn m-0"
					@click="handOK"><!--兑换-->{{ t('swap.action') }}
				</button>
			</view>
		</view>
	</u-popup>

</template>

<script setup>
	import {
		computed,
		onMounted,
		reactive,
		ref,
		toRaw
	} from "vue";
	import tools from "@/utils/tools";
	import {
		useI18n
	} from "vue-i18n";
	import {
		useUserStore
	} from "@/stores/modules/user";
	import {
		useBalanceStore
	} from "@/stores/modules/userBalance";
	import project from "@/utils/project";
	import {
		homeRequest
	} from '@/config/api.js'
	import { baseURL } from "@/config/http";

	const props = defineProps({
		show: Boolean
	})
	const emit = defineEmits(['update:show']);
	const {
		t
	} = useI18n();
	const userStore = useUserStore()
	const balanceStore = useBalanceStore()


	let options = ref([]);
	let from = ref({
		rate: 1,
		id: 0,
		balance: 0,
		max: -1
	});
	let to = ref({});

	let amountIn = ref('');
	const amountOut = computed(() => {
		if (amountIn.value) {
			return tools.floorAmount(amountIn.value * from.value.rate, 4);
		}
		return '0.00';
	})

	const handExchange = () => {
		const temp = from.value;
		from.value = to.value;
		to.value = temp;
	}
	const disabled = ref(false)
	const handOK = async () => {
		disabled.value = true;
		tools.clickedTimeOut(disabled);

		if (amountIn.value === '') {
			tools.toastError(t('form.noInput'))
			return false;
		}
		if (parseFloat(amountIn.value) > parseFloat(from.value.balance)) {
			tools.toastError(t('form.noBalance'))
			return false;
		}

		if (from.max > -1 && parseFloat(amountIn.value) < parseFloat(from.max)) {
			tools.toastError(t('form.noVolume'))
			return false;
		}

		uni.$u.http.post('/swap', {
			amount: amountIn.value,
			from_token_id: from.value.id,
			to_token_id: to.value.id
		}).then(res => {
			tools.toastSuccess(t('message.success'))
			project.getUser()
		})
	}

	const userAmountInput = ref(null);
	onMounted(async () => {
		// userAmountInput.value.focus();

		options.value = await uni.$u.http.get('/tokenPair/getSwapTokenList')
		console.log('options.value', options.value)

		from.value = options.value[0].from;
		to.value = options.value[0].to;
		from.value.max = await uni.$u.http.get('/swap/getUserUSDTSwapAmount')
		to.value.max = -1;
		console.log(from, to)
	})


	const close = () => {
		emit('update:show', !props.show);
	}
</script>

<style>
	input {
		border: none !important;
		box-shadow: none !important;
	}

	.ant-input-affix-wrapper .ant-input:focus {
		border: none !important;
		//border-bottom: 1px solid white !important; box-shadow: none !important;
	}
</style>