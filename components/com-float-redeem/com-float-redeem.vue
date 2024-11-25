<template>
	<u-popup :show="props.show" @close="close" @open="open" mode="bottom" :round="10" duration="200">
		<view class="text-[#131313]">
			<view class="py-4 px-5 bg-[#fff] rounded-2xl relative">
				<view class="title flex justify-between items-center">
					<view class="w-1/5"></view>
					<view class="flex flex-col w-3/5 text-center">
						<view class="title-h1"><!--赎回-->{{ t('redeem.name') }}</view>
					</view>
					<view class="w-1/5 text-right" @click="close">
						<view class="iconfont icon-close"></view>
					</view>
				</view>
				<view class="body py-2 mt-2">

					<view class="relative">
						<view class="flex flex-row justify-between bg-gray-100 p-3 items-center mt-4 rounded-md">
							<view class="flex items-center">
								<image src="@/static/images/token/usdt.png" mode="aspectFit"
									style="width: 50rpx; height: 50rpx;">
								</image>
								<text class="font-bold ml-1">USDT</text>
							</view>
							<view class="">{{ data.amount }}</view>
						</view>
					</view>

					<view class="flex flex-col mt-4 ">
						<view class=" ml-2"><!--数量-->{{ t('redeem.amount') }}</view>
						<view
							class="text-[#929292] mt-1 rounded-md border border-solid border-[#929292] flex justify-between items-center">
							<input type="digit" inputmode="decimal" cursor-spacing="50" class="w-50 amount m-0.5 p-2"
								v-model="amount" placeholder="0.00">
							<view class="flex-1 text-right text-[#131313] font-bold mr-2">USDT</view>
							<view
								class="border-0 border-l border-solid border-[#cecece] text-[#7F17FE] px-2 flex-1 flex flex-nowrap text-nowrap whitespace-nowrap"
								@click="amount = data.amount">
								<!--赎回全部-->{{ t('redeem.all') }}
							</view>
						</view>
					</view>

				</view>
				<view class="footer mt-2 mb-1">
					<button type="button" :disabled="disabled" :class="{'disabled': disabled}"
						class="n-btn mx-auto mt-4" @click="confirm">{{ t('redeem.ok') }}
					</button>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script setup lang="ts">
	import {
		reactive,
		ref
	} from "vue";
	import tools from "@/utils/tools";
	import { useI18n } from "vue-i18n";

	const props = defineProps(["show"])
	const emit = defineEmits(['update:show']);
	const { t } = useI18n();

	const disabled = ref(false)
	const amount = ref<string>()
	let data = reactive({
		id: 0,
		amount: 0,
		order: {
			order_number: '',
		},
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

	const confirm = () => {
		disabled.value = true;
		tools.clickedTimeOut(disabled);

		if (!amount.value) {
			tools.toastError(t('form.noInput'));
			return false;
		}
		if (parseFloat(amount.value) > data.amount) {
			tools.toastError(t('redeem.noAMount'));
			return false;
		}

		uni.$u.http.put('/deposit/redeem/' + data.id, {
			amount: amount.value
		}).then(res => {
			data.amount -= parseFloat(amount.value)
			tools.toastSuccess(t('message.success'))
			// uni.$emit("newOrderCurrent")
			uni.$emit("newOrderRedeem", amount.value)
			close()
		})
	}

	const open = () => {
		getData()
	}

	const close = () => {
		emit('update:show', !props.show);
	}
</script>

<style lang="scss" scoped>
	input {
		border: none !important;
		box-shadow: none !important;
	}

	.title-h1 {
		font-family: SourceHanSansCN-Bold;
		font-weight: bold;
		font-size: 38rpx;
		color: #0A0A0A;
	}

	.amount {
		// font-family: SourceHanSansCN-Regular;
		font-weight: 400;
		font-size: 30rpx;
		color: #000000;
		// opacity: 0.4;
	}
</style>