<template>
	<div class="pb-4 rounded-xl mb-4 font-medium  ">
		<div class="rounded-xl " style=" padding: 20px 15px 30px;">
			<div class="flex flex-row justify-between justify-items-start w-100">
				<div class="flex flex-col w-1/2 justify-between">
					<div class="">
						<!--                全网申购总量-->
						<view class="font-semibold">{{ $t('home.platform.p1') }}</view>
						<div class=" font-bold mt-1">
							<span class="text-xl">${{ tools.getNumberStart(depositTotal) }}.</span>
							<span class=" ">{{ tools.getNumberEnd(depositTotal) }}</span>
						</div>
					</div>
					<div class="my-6">
						<div class="flex"><!--NRT价格-->
							<view class="font-semibold">{{ $t('home.platform.p2') }}</view>
							<div class="  ml-2 align-middle flex items-s"
								:class="[marketArr[0]['rate'] < 0 ? 'text-red-600' : 'text-green-600']">
								<view>
									{{ tools.getNumberUpOrDown(marketArr[0]['rate'], 2) }}%
								</view>

								<!-- <span> -->
								<!-- <span class="text-red-600" v-if="marketArr[0]['rate'] < 0">🠳</span>
									<span class="text-green-600" v-else>🠱</span> -->

								<!-- </span> -->
								<u-icon name="arrow-down-fill" color="#dc2626" v-if="marketArr[0]['rate'] < 0"></u-icon>
								<u-icon name="arrow-up-fill" color="#16a34a" v-else></u-icon>
							</div>
						</div>
						<div class=" flex items-center my-1">
							<div class="text-lg font-bold ">
								${{ marketArr[0]['price'] }}
							</div>

						</div>
						<div class="text-gray-600 ">≈¥{{ tools.USDT2CNY(marketArr[0]['price']) }}</div>
					</div>
					<div class="">
						<div class=""><!--活期APY-->{{ $t('home.platform.p3') }}
							<image src="/static/img/fire.png" class=" w-[20px]" alt="fire" mode="widthFix" />
						</div>
						<div class="flex items-center mt-1 font-bold">
							<div class="">
								<span class=" " style="color: #5d5ef7;">
									{{ tools.floorAmount(huoqiData.rate * 365) }}
								</span> <span class="">%</span>
							</div>
							<!--                  <img class="ml-1" src="/static/media/jsq.jpg" alt="jsq">-->
						</div>
					</div>
				</div>
				<div class="flex flex-col flex-1 w-1/2 justify-between chicang" style="padding-left: 16px">
					<div class="">
						<view class="font-semibold"><!--我的总持仓-->{{ $t('home.platform.p4') }}</view>
						<div class=" font-bold  mt-1">
							<span class="text-xl">${{ tools.getNumberStart(userStore.user.info ? userStore.user.info.deposit : 0) }}.</span>
							<span class=" ">{{ tools.getNumberEnd(userStore.user.info ? userStore.user.info.deposit : 0) }}</span>
						</div>
						<div class="text-gray-600 mt-2"><!--活期-->{{ $t('home.platform.p5') }} <span
								class="text-[#000]">${{ userStore.user.info ? userStore.user.info.current : 0  }}</span>
						</div>
						<div class="text-gray-600 mt-1"><!--定期-->{{ $t('home.platform.p6') }} <span
								class="text-[#000]">${{ userStore.user.info ? userStore.user.info.fixed : 0 }}</span>
						</div>
					</div>
					<div class=" mt-5">
						<div class=""><!--社区总持仓-->{{ $t('home.platform.p7') }}</div>
						<div class=" font-bold  mt-1">
							<span class="text-xl">${{ tools.getNumberStart(userStore.user.info.team_deposit) }}.</span>
							<span class=" ">{{ tools.getNumberEnd(userStore.user.info.team_deposit) }}</span>
						</div>
						<div class="mt-1 text-gray-600"><!--社区量-->{{ $t('home.platform.p8') }} <span
								class="text-[#000]">{{ userStore.user.team_total }}</span></div>
					</div>
				</div>
			</div>

			<div class="flex flex-row justify-between items-center">
				<div class="">
					<button type="button" class="btn bg-blue-600 rounded text-white px-8"
						@click="isHuoqiActive = true"><!--活期-->{{ $t('home.platform.p9') }}
					</button>
				</div>
				<image src="/static/img/huoqi.png" alt="" class="w-[376rpx]" mode="widthFix" />
			</div>
		</div>

		<com-modal-float v-if="isHuoqiActive" v-model:show="isHuoqiActive" :data="huoqiData"
			@ok="buy"></com-modal-float>

	</div>
</template>

<script setup lang="ts">
	import tools from '@/utils/tools'
	import { reactive, ref } from "vue";
	import { IHuoqiData } from '@/type/IHuoqiData'
	import { useUserStore } from '@/stores/modules/user'
	import { useI18n } from 'vue-i18n';
	import project from '../../utils/project';
	import { addOrder } from '../../config/api';


	let userStore = useUserStore()
	let { t } = useI18n()

	const isHuoqiActive = ref(false);
	const huoqiData : IHuoqiData = reactive({ rate: 0, min: 100, buyAmount: 100 })
	const depositTotal = ref(0)
	const marketArr = ref([
		{
			name: '',
			price: 1.0,
			symbol: 'NRT-USDT',
			digits: 4,
			up: true,
			dayUp: true,
			rate: 0
		}
	]);

	//获取活期商品信息
	const getGood = () => {
		uni.$u.http.get('/good/1').then(data => {
			for (let key in data) {
				huoqiData[key] = data[key]
			}
			console.log(huoqiData)
		})
	}
	getGood()

	//获取当前全网持仓总量
	const getTotalDeposit = () => {
		uni.$u.http.get('/deposit/total').then(total => {
			depositTotal.value = total
		})
	}
	getTotalDeposit();

	//活期申购
	const buy = async (record : IHuoqiData) => {
		addOrder({
			good_id: record.id,
			amount: record.buyAmount,
			pay_type: 2,
		}).then(res => {
			uni.$emit("newOrderCurrent")
			isHuoqiActive.value = false;
			project.getUser()
			tools.toastSuccess(t('message.buySuccess'))
		})
	}
</script>

<style lang="less" scoped>

</style>