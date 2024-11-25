<template>
	<uni-nav-bar :fixed="true" :border="false" left-icon="left" left-width="30px" backgroundColor="#F8F8F8"
		:statusBar="true" title="消息" @clickLeft="tools.navigateBack()">
		<template #default>
			<view style="display: flex; flex-direction: row; justify-items: start; align-items: center;">
				<image src="@/static/img/usdt.png" mode="heightFix" style="height: 30px;"></image>
				<view class="ml-3">
					<view class="font-black text-base">出售 USDT</view>
					<view class="flex items-center">
						<view class="flex">
							<view class="text-gray-800">单价</view>
							<view class="font-black">￥{{itemData.price}}</view>
						</view>
						<view class="ml-2 text-gray-400 flex items-center">
							<u-count-down class="" ref="countDown" :time="45 * 1000" format="mm:ss" @change="onChange"
								@finish="finish">
								<view class="time flex text-xs">
									<view class="time__custom">
										<text
											class="time__custom__item">{{ tools.formatNumberLtTen(timeData.minutes) }}</text>
									</view>
									<text class="time__doc">:</text>
									<view class="time__custom">
										<text
											class="time__custom__item">{{ tools.formatNumberLtTen(timeData.seconds) }}</text>
									</view>
								</view>
							</u-count-down>
							<view class="ml-1">秒 刷新</view>
						</view>
					</view>
				</view>
			</view>
		</template>
	</uni-nav-bar>
	<view class="p-4 mt-4 text-sm">
		<view class=" py-4 bg-white rounded-xl">
			<u-tabs :list="tabList" lineWidth="60" lineHeight="3" lineColor="#000" @click="tabClick"></u-tabs>
			<view class="px-4" v-if="activeKey == 'CNY'">
				<view class="flex justify-between py-2 mt-2">
					<input type="digit" v-model="money" @input="checkMoney1" @focus="isFocus = true"
						@blur="isFocus = false" class="py-2 text-2xl font-black" placeholder="0.00">
					<view class="flex items-center justify-end font-medium w-1/2 text-right text-base">
						<view class="font-black">CNY</view>
						<view class="w-[1px] h-[10px] bg-gray-300 mx-2"></view>
						<view class="text-blue-500 font-black"
							@click="money = itemData.max_cny; volume1 = amountMinMax.max">最大</view>
					</view>
				</view>
				<u-line :class="{'bg-blue-500' : isFocus}"></u-line>
				<view class="text-xs py-2 " :class="[bool1 ? 'text-gray-500' : 'text-red-400']">
					限额￥{{tools.toThousands(itemData.min_cny)}}-￥{{tools.toThousands(itemData.max_cny)}}</view>
				<view class="text-base flex mt-2">
					<view class="text-black">可得</view>
					<view class="ml-4 font-semibold" :class="{'text-gray-400': !volume1}">
						{{volume1 == '' ? '0.00' : tools.toThousands(volume1)}}USDT
					</view>
				</view>
			</view>
			<view v-else class="px-4">
				<view class="flex justify-between py-2 mt-2">
					<input type="digit" v-model="amount" @input="checkMoney2" @focus="isFocus = true"
						@blur="isFocus = false" class="py-2 text-2xl font-black" placeholder="0.00">
					<view class="flex items-center justify-end font-medium w-1/2 text-right text-base">
						<view class="font-black">USDT</view>
						<view class="w-[1px] h-[10px] bg-gray-300 mx-2"></view>
						<view class="text-blue-500 font-black"
							@click="amount = amountMinMax.max; volume2 = itemData.max_cny">最大</view>
					</view>
				</view>
				<u-line :class="{'bg-blue-500' : isFocus}"></u-line>
				<view class="text-xs py-2 " :class="[bool2 ? 'text-gray-500' : 'text-red-400']">
					限额{{tools.toThousands(amountMinMax.min)}}-{{tools.toThousands(amountMinMax.max)}}</view>
				<view class="text-base flex mt-2">
					<view class="text-black">应付</view>
					<view class="ml-4 font-semibold" :class="{'text-gray-400' : !volume2}">
						{{volume2 == '' ? '￥0.00' : tools.toMoney(volume2)}}
					</view>
				</view>
			</view>
		</view>
		<view class="mt-4 p-4 bg-white rounded-xl ">
			<view class="font-black">收款方式</view>
			<view class="flex items-center justify-between py-2" @click="payTypeClick">
				<view class="flex items-center">
					<view class="font-black">
						{{selectedPay.name}}
					</view>
					<view class="ml-1 text-xs px-1 rounded-full bg-gray-200" v-if="selectedPay.info">
						{{selectedPay.info}}
					</view>
				</view>
				<view class="flex items-center" v-if="payList.length > 1">
					<view class="bg-black text-white text-center  min-w-[20px] min-h-[20px] rounded-full">
						<view class="text-xs font-semibold relative top-[2px]">{{payList.length}}</view>
					</view>
					<u-icon class=" scale-50" name="arrow-down-fill" color="#000" size="20"></u-icon>
				</view>
			</view>
		</view>

		<view class="p-4 mt-4">
			<view class="font-black text-base">
				商家信息
			</view>
			<view class="flex justify-between py-2">
				<view>支付时长</view>
				<view>30分钟</view>
			</view>
			<view class="flex justify-between py-2">
				<view>商家昵称</view>
				<view class="flex">
					<view class=" ml-1">{{itemData.shop.name}}</view>
					<view class="flex ml-1">
						<view class="w-[20px] h-[20px] text-center bg-blue-600 rounded-full"
							v-if="itemData.shop.shop_level == 1">
							<uni-icons type="star-filled" color="#fff" size="18"></uni-icons>
						</view>
						<view class="w-[20px] h-[20px] text-center bg-fuchsia-600 rounded-full" v-else>
							<uni-icons type="vip-filled" color="#fff" size="18"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

	<view class="boottom-container">
		<view class="px-4">
			<button type="button" class="rounded-full" @click="buy">0手续费卖出USDT</button>
		</view>
	</view>

	<com-paytype v-model:show="show" :data="payList" :selectedItem="selectedPay" @change="change"></com-paytype>
	<sell-confirm v-model:show="confirmShow" :data="data" @ok="confirm"></sell-confirm>
</template>

<script setup lang="ts">
	import { computed, ref, watch, nextTick, reactive } from "vue";
	import tools from '@/utils/tools'
	import project from "@/utils/project";
	import sellConfirm from './components/sell-confirm.vue'
	import { useUserStore } from "@/stores/modules/user";

	const props = defineProps(['params'])
	const itemData = ref(JSON.parse(decodeURIComponent(props.params)))
	let data = reactive({
		amount: 0,
		price: 0,
		money: 0,
		payment: ''
	})
	const userStore = useUserStore()
	const show = ref(false)
	const confirmShow = ref(false)
	const paymentArr = [{ name: '银行卡', info: '' }, { name: '支付宝', info: '即时付款' }, { name: '微信支付', info: '即时付款' }];
	const payList = ref([]);
	const selectedPay = ref({ name: 'NONE', 'info': '' });
	const change = (item, index) => {
		selectedPay.value = item;
	}
	const payTypeClick = () => {
		if (payList.value.length > 1) {
			show.value = true
		}
	}

	const getData = () => {
		uni.$u.http.get('/c2c/' + itemData.value.id).then(res => {
			console.log(res)
			itemData.value = res
			amountMinMax = reactive({
				min: tools.floorAmount(itemData.value.min_cny / itemData.value.price, 2),
				max: tools.floorAmount(itemData.value.max_cny / itemData.value.price, 2),
			})
			console.log(amountMinMax)

			payList.value = []
			console.log('res.payments', res.payments)
			for (let p of res.payments) {
				if (p == "bank") {
					payList.value.push(paymentArr[0])
				}
				if (p == "alipay") {
					payList.value.push(paymentArr[1])
				}
				if (p == "wechat_pay") {
					payList.value.push(paymentArr[2])
				}
				if (selectedPay.value.name == 'NONE') {
					selectedPay.value = payList.value[0]
				}
			}
		})
	}
	getData()

	const isFocus = ref(false);
	// const price = ref(7.25);
	const money = ref<any>('');
	const amount = ref<any>('');
	// const cnyMinMax = reactive({
	// 	min: 99999,
	// 	max: 215259.89
	// })

	let amountMinMax = reactive({
		min: tools.floorAmount(itemData.value.min_cny / itemData.value.price, 2),
		max: tools.floorAmount(itemData.value.max_cny / itemData.value.price, 2),
	})
	// const amountMinMax = computed(() => {
	// 	return {
	// 		min: tools.floorAmount(itemData.value.min_cny / itemData.value.price, 2),
	// 		max: tools.floorAmount(itemData.value.max_cny / itemData.value.price, 2)
	// 	}
	// })

	const volume1 = ref<any>('');
	const volume2 = ref<any>('');


	const bool1 = computed(() => {
		return !money.value || (parseFloat(money.value) >= parseFloat(itemData.value.min_cny) && parseFloat(money.value) <= parseFloat(itemData.value.max_cny));
	});

	const bool2 = computed(() => {
		return !amount.value || (parseFloat(amount.value) >= amountMinMax.min && parseFloat(amount.value) <= amountMinMax.max);
	});


	const tabList = ref([{ name: '按金额出售' }, { name: '按数量出售' }]);
	const activeKey = ref('CNY');
	const tabClick = async (item : any) => {
		if (activeKey.value == item.name || (activeKey.value == 'CNY' && item.index == 0)) {
			return;
		}
		if (item.name == '按金额出售') {
			activeKey.value = 'CNY'
			money.value = volume2.value;
			volume1.value = amount.value;
		} else {
			activeKey.value = 'USDT'
			amount.value = volume1.value;
			volume2.value = money.value;
		}
	}

	const countDown = ref(null);
	const timeData = ref<any>('');
	const onChange = (e) => {
		timeData.value = e
	}

	const finish = () => {
		console.log('finish')
		countDown.value.reset();
		getData()
	}

	const buy = () => {
		if (!userStore.user.identity) {
			tools.toast("您未进行实名认证，请先前往个人中心进行实名认证！")
			return;
		}
		
		let payment = project.getPaymentSymbol(selectedPay.value.name);
		let formData = {
			price: itemData.value.price,
			c2c_id: itemData.value.id,
			payment,
			amount: 0,
			money: 0,
			type: 2 //卖出
		};
		if (activeKey.value == 'CNY') {
			if (money.value == '') {
				return uni.showToast({
					icon: 'error',
					title: '请输入金额',
					duration: 2000
				});
			}
			if (parseFloat(money.value) < parseFloat(itemData.value.min_cny) || parseFloat(money.value) > parseFloat(itemData.value.max_cny)) {
				return uni.showToast({
					icon: 'error',
					title: '请输入正确的限额数量',
					duration: 2000
				});
			}
			formData.amount = volume1.value
			formData.money = money.value
		} else {
			if (amount.value == '' || amount.value == 0) {
				return uni.showToast({
					icon: 'error',
					title: '请输入要出售的USDT数量',
					duration: 2000
				});
			}
			if (parseFloat(amount.value) < Math.floor(itemData.value.min_cny / itemData.value.price) || parseFloat(amount.value) > Math.ceil(itemData.value.max_cny / itemData.value.price)) {
				return uni.showToast({
					icon: 'error',
					title: '请输入正确的限额数量',
					duration: 2000
				});
			}
			formData.amount = amount.value
			formData.money = volume2.value
		}
		console.log(formData)

		data = formData;
		confirmShow.value = true;
	}

	const confirm = () => {
		uni.$u.http.post('/c2cOrder', data).then(res => {
			// tools.navigateToWithEncode('/pages/market/sell/buying', data)
			tools.navigateTo('/pages/market/sell/pay?id=' + res.id)
		})
	}

	const checkMoney1 = async (e : any) => {
		//正则表达试
		e.detail.value = (e.detail.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
		await nextTick();
		money.value = e.detail.value;
		// console.log('money.value', money.value, price.value)
		volume1.value = tools.floorAmount(money.value / itemData.value.price, 2)
	}

	const checkMoney2 = async (e : any) => {
		//正则表达试
		e.detail.value = (e.detail.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
		await nextTick();
		amount.value = e.detail.value;
		volume2.value = tools.floorAmount(amount.value * itemData.value.price, 2)
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: $uni-bg-color-grey;
	}

	.boottom-container {
		@apply fixed w-[750rpx] bottom-0 left-0 py-4;
		background-color: $uni-bg-color-grey;
		// background-color: green;

		button {
			@apply rounded-full text-white bg-black font-semibold;
		}
	}

	.u-count-down__text {
		font-size: 10px !important;

		span {
			font-size: 10px !important;
		}
	}
</style>