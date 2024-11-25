<template>
	<u-popup :show="props.show" @close="close" mode="bottom" :round="10">
		<view class="text-[#131313]">
			<view class="py-4 px-5 bg-[#fff] rounded-2xl relative">
				<view class="title flex justify-between items-center">
					<view class="w-1/5"></view>
					<view class="flex flex-col w-3/5 text-center">
						<h3 class="font-bold">{{ $t('transfer.name') }}</h3>
					</view>
					<view class="w-1/5 text-right" @click="close">
						<view class="iconfont icon-close"></view>
					</view>
				</view>
				<view class="body py-2 mt-2">

					<view class="relative">
						<view class="flex flex-row justify-between bg-gray-100 p-3 items-center mt-4 rounded-md" @click="showSelect = !showSelect">
							<view class="flex items-center">
								<image :src="selected.icon" mode="aspectFit"
									style="width: 50rpx; height: 50rpx;"></image>
								<text class="font-bold ml-1">{{selected.name}}</text>
							</view>
							<view class="iconfont icon-down"></view>
						</view>
						<view class="absolute w-[100%] bg-white z-10 shadow-md" v-if="showSelect">
							<view class="flex flex-row justify-between py-3 px-2 my-1 items-center"
								:class="{'bg-cyan-50' : selected.id == item.id}"
								v-for="(item, index) in options" :key="index" @click="selected = item; showSelect = false;">
								<view class="flex items-center">
									<image :src="item.icon" mode="aspectFit" style="width: 50rpx; height: 50rpx;">
									</image>
									<text class="font-bold ml-1">{{item.name}}</text>
								</view>
							</view>
						</view>
					</view>


					<view class="flex flex-col mt-4">
						<view class=" ml-2"><!--收款账户-->{{ $t('transfer.account') }}</view>
						<view
							class="text-[#929292] mt-1 rounded-md border border-solid border-[#929292] flex justify-between items-center">
							<input type="digit" class="text-[#000] m-0.5 p-2" v-model="recipient"
								:placeholder="$t('transfer.uid')">
						</view>
					</view>

					<view class="flex flex-col mt-4 ">
						<view class=" ml-2"><!--数量-->{{ $t('transfer.amount') }}</view>
						<view
							class="text-[#929292] mt-1 rounded-md border border-solid border-[#929292] flex justify-between items-center">
							<input type="digit" cursor-spacing="50" class="w-50 text-[#000] m-0.5 p-2" v-model="amount"
								:placeholder="placeholder">
							<view class="flex-1 text-right text-[#131313] font-bold mr-2">{{ selected.name }}</view>
							<view
								class="border-0 border-l border-solid border-[#cecece] text-[#5e5cfb] px-2 flex flex-nowrap text-nowrap whitespace-nowrap"
								@click="amount = tools.floorAmount(userBalance.getBalance(selected.id), 2)">
								{{ $t('transfer.all') }}</view>
						</view>
						<view class="text-right mt-1 mr-1 text-sm">
							<!--            可用-->{{ $t('transfer.balance') }}：{{ tools.floorAmount(userBalance.getBalance(selected.id), 4) }}
							{{ selected.name }}
						</view>
					</view>

				</view>
				<view class="footer mt-2 mb-1">
					<button type="button" :disabled="disabled" :class="[disabled ? 'bg-gray-600' : 'bg-blue-600']"
						class="w-100 rounded-xl  py-3 border-0 text-white text-lg"
						@click="confirm"><!--转账-->{{ $t('transfer.active') }}
					</button>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script setup lang="ts">
	import {
		computed,
		ref
	} from "vue";
	import tools from "@/utils/tools";
	import project from "@/utils/project";
	import { useI18n } from "vue-i18n";
	import { useUserStore } from "@/stores/modules/user";
	import { useBalanceStore } from "@/stores/modules/userBalance";
	import { tokens } from '@/data/tokens.js'

	const props = defineProps(["show"])
	const { t } = useI18n();
	const http = uni.$u.http;
	const emit = defineEmits(['update:show']);
	const userStore = useUserStore()
	const userBalance = useBalanceStore()

	const placeholder = computed(() => {
		return t('form.minMoney') + selected.value.min_transfer + selected.value.name;
	})
	const disabled = ref(false);
	const recipient = ref<string | number>('');
	const amount = ref('');
	let options = ref(tokens);

	const showSelect = ref(false)
	let selected = ref(tokens[1]);

	const confirm = () => {
		if (recipient.value === userStore.user.uid) {
			tools.toastError(t('transfer.me'))
			return false;
		}
		if (!amount.value) {
			tools.toastError(t('form.noInput'))
			return false;
		}
		if (parseFloat(amount.value) > userBalance.getBalance(selected.value.id)) {
			tools.toastError(t('form.noBalance'));
			return false;
		}
		if (parseFloat(amount.value) < selected.value.min_transfer) {
			tools.toastError(t('form.minAmount') + selected.value.min_transfer);
			return false;
		}
		disabled.value = true;

		uni.$u.http.post('/transfer', {
			token_id: selected.value.id,
			tid: recipient.value,
			amount: amount.value
		}).then(res => {
			project.getUser()
			close()
			tools.toastSuccess(t('form.success'))
		})

		tools.clickedTimeOut(disabled);
	}

	const close = () => {
		emit('update:show', !props.show);
	}
</script>

<style>
	input {
		border: none !important;
		box-shadow: none !important;
	}
</style>