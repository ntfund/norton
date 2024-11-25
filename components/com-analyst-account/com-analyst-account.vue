<template>
	<view class="px-4 text-lg py-2 border-0 border-b border-solid border-gray-100">账户概况</view>
	<view class="flex flex-row justify-around items-center px-4 py-4">
		<view class="flex flex-col items-center">
			<view class="text-2xl font-medium leading-6 "
				:class="[accountInfo.balance >= 0 ? 'text-[#62b28b]' : 'text-[#e2545c]']">
				${{ tools.floorAmount(accountInfo.balance, 2) }}
			</view>
			<view class="text-gray-400">账户资金</view>
		</view>
		<view class="flex flex-col items-center">
			<view class="text-2xl font-medium leading-6 "
				:class="[accountInfo.total_rate >= 0 ? 'text-[#62b28b]' : 'text-[#e2545c]']">
				{{ tools.floorAmount(accountInfo.total_rate, 2) }}%
			</view>
			<view class="text-gray-400">总收益率</view>
		</view>
	</view>

	<view class="flex flex-row justify-around items-center w-80 py-1 mx-auto text-sm">
		<view class="flex flex-col w-1/3 items-center ">
			<view class=" font-medium  text-green-500 "
				:class="[accountInfo.total_profit >= 0 ? 'text-[#62b28b]' : 'text-[#e2545c]']">${{
          tools.floorAmount(accountInfo.total_profit, 2)
        }}
			</view>
			<view class="text-gray-400">累计收益</view>
		</view>
		<view class="flex flex-col w-1/3 items-center relative border-line ">
			<view class=" font-medium  text-green-500"
				:class="[accountInfo.total_month_rate >= 0 ? 'text-[#62b28b]' : 'text-[#e2545c]']">
				{{ tools.floorAmount(accountInfo.total_month_rate, 2) }}%
			</view>
			<view class="text-gray-400">月收益率</view>
		</view>
		<view class="flex flex-col w-1/3 items-center border-line relative">
			<view class=" font-medium">{{ tools.floorAmount(accountInfo.rate, 2) }}%</view>
			<view class="text-gray-400">历史胜率</view>
		</view>
	</view>

	<view class="flex flex-row justify-around items-center w-80 py-1 mx-auto text-sm">
		<view class="flex flex-col w-1/3 items-center ">
			<view class=" font-medium">{{ accountInfo.order_total }}</view>
			<view class="text-gray-400">成交订单</view>
		</view>
		<view class="flex flex-col w-1/3 items-center relative border-line ">
			<view class=" font-medium">{{ accountInfo.order_inc_num }}</view>
			<view class="text-gray-400">盈利订单</view>
		</view>
		<view class="flex flex-col w-1/3 items-center border-line relative">
			<view class=" font-medium">{{ accountInfo.order_dec_num }}</view>
			<view class="text-gray-400">亏损订单</view>
		</view>
	</view>
	<view class="w-100 border-bottom-gray-50 mt-2" />

	<u-tabs :list="tabList" class="pt-6 pb-2" lineWidth="40" lineHeight="4" @click="tabClick"></u-tabs>

	<view class="list py-2 pb-6 text-sm" v-if="activeKey == '1'">
		<com-analyst-account-current :data="nowList"></com-analyst-account-current>
	</view>

	<view class="list py-2 pb-6 text-sm " v-if="activeKey == '2'">
		<com-analyst-account-histroy :data="historyList"></com-analyst-account-histroy>
	</view>

</template>

<script setup lang="ts">
	import { onUnmounted, reactive, ref } from "vue";
	import { onShow, onHide } from '@dcloudio/uni-app'
	import tools from "@/utils/tools";
	import { useUserStore } from '@/stores/modules/user'

	const props = defineProps(['api', 'id']);
	const userStore = useUserStore()
	const http = uni.$u.http;

	const activeKey = ref('1');
	const tabList = ref([{ name: '当前持仓' }, { name: '历史持仓' }]);
	const tabClick = (item) => {
		activeKey.value = item.name == '当前持仓' ? '1' : '2';
	}

	const nowList = ref([]);
	const historyList = ref([]);
	let accountInfo = reactive({
		balance: 0,
		total_rate: 0,
		total_profit: 0,
		total_month_rate: 0,
		rate: 0,
		order_total: 0,
		order_inc_num: 0,
		order_dec_num: 0,
		b_init: false
	});


	const getNowList = async () => {
		let params = {
			user_id: userStore.user.id
		}
		if (props.api) {
			params['api'] = props.api.id
		}
		if (props.id) {
			params['good_id'] = props.id
		}

		let data = await http.get('/analog/getNowList', { params })
		if (data) {
			nowList.value = data;
		}
	}

	const getHistoryList = async () => {
		let params = {
			user_id: userStore.user.id
		}
		if (props.api) {
			params['api'] = props.api.id
		}
		if (props.id) {
			params['good_id'] = props.id
		}
		http.get('/analog/getAccountInfo', { params }).then(data2 => {
			console.log('getAccountInfo data')
			for (const key in data2.accountInfo) {
				accountInfo[key] = data2.accountInfo[key];
			}
			// accountInfo = data2.accountInfo;
			historyList.value = data2.historyList;

			//至少成功一次
			accountInfo.b_init = true
		}).catch(async data => {
			console.log('getAccountInfo catch')
			if (accountInfo.b_init == false) {
				//如果第一次获取失败，重试
				setTimeout(async () => {
					await getHistoryList()
				}, 500)
			}
		})
	}

	let timer1 = null;
	let timer2 = null;

	onShow(async () => {
		console.log('com-analyst-account onShow')

		await getHistoryList();
		setTimeout(async () => {
			await getNowList();
		}, 1500)

		timer1 = setInterval(async () => {
			await getHistoryList()
		}, 3000)

		timer2 = setInterval(async () => {
			await getNowList()
		}, 5000)
	})

	onUnmounted(() => {
		console.log('clearInterval')
		clearInterval(timer1)
		clearInterval(timer2)
	})

	onHide(() => {
		clearInterval(timer1)
		clearInterval(timer2)
	})
</script>

<style lang="less" scoped>
	.border-line::before {
		display: block;
		content: "";
		width: 1px;
		height: 20px;
		background: #eee;
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	.ant-tabs-nav-wrap {
		display: none !important;
	}

	.ant-radio-button-wrapper-checked {
		background-color: #97a2b8 !important;
		border-color: #97a2b8 !important;
	}

	.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover::before {
		background-color: #97a2b8 !important;
	}
</style>