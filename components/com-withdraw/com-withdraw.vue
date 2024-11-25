<template>
	<u-popup :show="props.show" @close="close" mode="bottom" :round="10">
		<view class="text-[#131313]">
			<view class="py-4 px-5 bg-[#fff] rounded-2xl relative">
				<view class="title flex justify-between items-center">
					<view class="w-1/5"></view>
					<view class="flex flex-col w-3/5 text-center">
						<h3 class="font-bold">{{ t('withdraw.name') }}</h3>
					</view>
					<view class="w-1/5 text-right" @click="close">
						<view class="iconfont icon-close"></view>
					</view>
				</view>
				<view class="body py-2 mt-2">

					<view class="relative">
						<view class="flex flex-row justify-between bg-gray-100 p-3 items-center mt-4 rounded-md"
							@click="showSelect = !showSelect">
							<view class="flex items-center">
								<image :src="selected.icon" mode="aspectFit" style="width: 50rpx; height: 50rpx;">
								</image>
								<text class="font-bold ml-1">{{selected.name}}</text>
							</view>
							<view class="iconfont icon-down"></view>
						</view>
						<view class="absolute w-[100%] bg-white z-10 shadow-md" v-if="showSelect">
							<view class="flex flex-row justify-between py-3 px-2 my-1 items-center"
								:class="{'bg-cyan-50' : selected.id == item.id}" v-for="(item, index) in options"
								:key="index" @click="selected = item; showSelect = false;">
								<view class="flex items-center">
									<image :src="item.icon" mode="aspectFit" style="width: 50rpx; height: 50rpx;">
									</image>
									<text class="font-bold ml-1">{{item.name}}</text>
								</view>
							</view>
						</view>
					</view>


					<view class="flex flex-col mt-4">
						<view class="flex justify-between items-center ">
							<view class=" ml-2"><!--地址-->{{ t('withdraw.address') }}</view>
							<view class="text-cyan-500" @click="choiceWallet"><!-- 选择钱包 -->{{ t('withdraw.choice') }}
							</view>
						</view>
						<view
							class="text-[#929292] mt-1 rounded-md border border-solid border-[#929292] flex justify-between items-center">
							<input type="text" inputmode="text" cursor-spacing="20"
								class="text-[#000] text-xs m-0.5 p-2 py-3 flex-1" v-model="recipient"
								:placeholder="$t('withdraw.placeholder')">
						</view>
					</view>

					<view class="flex flex-col mt-4 ">
						<view class=" ml-2"><!--数量-->{{ $t('withdraw.amount') }}</view>
						<view
							class="text-[#929292] mt-1 rounded-md border border-solid border-[#929292] flex justify-between items-center">
							<input type="digit" inputmode="decimal" cursor-spacing="50"
								class="w-50 text-[#000] m-0.5 p-2" v-model="amount" @input="replaceInput"
								:placeholder="placeholder">
							<view class="flex-1 text-right text-[#131313] font-bold mr-2">{{ selected.name }}</view>
							<view
								class="border-0 border-l border-solid border-[#cecece] text-[#5e5cfb] px-2 flex-1 flex flex-nowrap text-nowrap whitespace-nowrap"
								@click="amount = tools.floorAmount(userBalance.getBalance(selected.id), 2)">
								<!-- 全部提取 -->{{ $t('withdraw.all') }}
							</view>
						</view>
						<view class="flex justify-between items-center text-sm text-gray-500">
							<view>
								<!-- 手续费 -->
								{{ $t('withdraw.fee') }}: {{fee > 0 ? tools.floorAmount(fee, 2) : fee}}
							</view>
							<view class="text-right mt-1 mr-1 ">
								<!--            可用-->{{ $t('withdraw.balance') }}：{{ tools.floorAmount(userBalance.getBalance(selected.id), 4) }}
								{{ selected.symbol }}
							</view>
						</view>
					</view>

				</view>
				<view class="footer mt-2 mb-1">
					<button type="button" :disabled="disabled" :class="[disabled ? 'bg-gray-600' : 'bg-blue-600']"
						class="w-100 rounded-xl  py-3 border-0 text-white text-lg"
						@click="confirm"><!--提币-->{{ $t('withdraw.action') }}
					</button>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script setup lang="ts">
	import {
		computed,
		nextTick,
		ref
	} from "vue";
	import tools from "@/utils/tools";
	import project from "@/utils/project";
	import { useI18n } from "vue-i18n";
	import { useUserStore } from "@/stores/modules/user";
	import { useBalanceStore } from "@/stores/modules/userBalance";
	import { tokens } from '@/data/tokens.js'
	import ChainId from "../../data/ChainId";
	import { onShow } from '@dcloudio/uni-app'
	import { getWithdrawTokens } from '@/config/api.js'

	const props = defineProps(["show"])
	const { t } = useI18n();
	const emit = defineEmits(['update:show']);
	const userStore = useUserStore()
	const userBalance = useBalanceStore()

	const placeholder = computed(() => {
		return t('withdraw.min') + selected.value.min_withdraw;
	})
	const disabled = ref(false);
	const recipient = ref<string>(userStore.user.account);
	const amount = ref<string>('');
	let options = ref(tokens);

	const showSelect = ref(false)
	let selected = ref(tokens[1]);

	//获取提币代币列表，和默认选择项
	(async () => {
		options.value = await getWithdrawTokens()
		selected.value = options.value[0];
	})()
	
	
	const fee = computed(() => {
		if (!amount.value) {
			return selected.value.fee + '%';
		}
		return parseFloat(amount.value) * (selected.value.fee / 100)
	})

	const replaceInput = async (event) => {
		await nextTick()
		amount.value = event.detail.value.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/, '$1')
	}

	const confirm = () => {
		if (!recipient.value) {
			tools.toastError(t('withdraw.placeholder'))
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
		if (parseFloat(amount.value) < selected.value.min_withdraw) {
			tools.toastError(t('withdraw.minWithdraw') + selected.value.min_withdraw);
			return false;
		}
		disabled.value = true;
		tools.clickedTimeOut(disabled);

		uni.$u.http.post('/withdraw', {
			token_id: selected.value.id,
			_to: recipient.value,
			amount: amount.value
		}).then(res => {
			tools.toastSuccess(t('withdraw.success'))
			project.getUser()
			close()
		})

	}

	const close = () => {
		emit('update:show', !props.show);
	}


	const choiceWallet = () => {
		tools.navigateToWithEncode('/pages/wallet/walletManager', {
			type: 3, //1.选择钱包（钱包列表），2钱包管理，3选择钱包（转账认购）
			chain_id: ChainId.BNB,
			account: userStore.user.account,
			ids: [ChainId.BNB]
		})
	}


	const getWallet = async () => {
		//获取钱包。 先从缓存获取。
		const walletStr = uni.getStorageSync('walletSelected')
		let wallet : any;
		if (walletStr) {
			try {
				wallet = JSON.parse(walletStr);
			} catch (e) {
				//TODO handle the exception
			}
		} else {
			//从用户账户获得默认钱包
			let result = await uni.$u.http.get('/userWallet/?chain_id=' + ChainId.BNB)
			wallet = result[0]
		}
		recipient.value = wallet.account;
	}
	onShow(() => {
		getWallet()
	})
</script>

<style>
	input {
		border: none !important;
		box-shadow: none !important;
	}
</style>