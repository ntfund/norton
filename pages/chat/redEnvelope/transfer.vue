<template>
	<com-nav-bar title="" backgroundColor="#eeeeee"></com-nav-bar>
	<view class="bg-[#eeeeee] p-6">
		<view class="flex justify-between items-center">
			<view class="font-semibold">转账给 {{to.nickname}}</view>
			<image :src="getFullPath(to.avatar)" class="rounded-md" width="50" height="50" mode="widthFix"
				style="width: 100rpx; height: 100rpx; background-color: #fff;"></image>
		</view>
	</view>
	<view class="p-6">
		<view class="text-sm">转账金额</view>
		<input type="digit" v-model="amount" class="mt-2 py-4 border-0 border-solid border-b border-gray-200"
			placeholder="请输入金额" cursor-spacing="30" @input="checkValue" />
	</view>
	<view class="px-2">
		<view class="selecticon" @click="show = !show">
			<view class="flex items-center">
				<image :src="selectedCoin.icon" mode="widthFix" style="width: 50rpx;"></image>
				<view class="ml-2 font-bold">{{ selectedCoin.name }}</view>
			</view>
			<view>
				<u-icon name="arrow-down-fill" color="#313131" size="14"></u-icon>
			</view>
		</view>
		<view class="px-4 mt-1 text-gray-400">
			余额：{{balance}} {{selectedCoin.name}}
		</view>
	</view>
	<view class="flex mt-10 justify-end text-right w-[750rpx]">
		<view>
			<button type="button" class="py-2 px-6 bg-green-500 text-white mr-6" :disabled="disabled"
				@click="transfer">转账</button>
		</view>
	</view>

	<com-choice-symbol-popup v-model:show="show" @change="change"></com-choice-symbol-popup>
	<com-verify-password v-model:show="showPassword" @success="success"></com-verify-password>
</template>

<script setup lang="ts">
	import { nextTick, reactive, ref } from "vue";
	import { useBalanceStore } from '@/stores/modules/userBalance'
	import { getFullPath, getUserBaseInfo } from "../../../config/api";
	import tools from "../../../utils/tools";

	const props = defineProps(['tid'])
	const amount = ref<any>('')
	const showPassword = ref(false)


	console.log(props.tid)

	const to = ref({
		id: 0,
		nickname: '大哥',
		avatar: ''
	})
	const userBalanceStore = useBalanceStore()

	let selectedCoin = ref({
		id: 7,
		name: 'USDT',
		icon: '/static/img/usdt.png'
	})
	const balance = ref(userBalanceStore.getBalance(selectedCoin.value.id))

	const show = ref(false);
	const change = (item) => {
		console.log('change', item)
		selectedCoin.value = item;
		balance.value = userBalanceStore.getBalance(selectedCoin.value.id)
	}

	const checkValue = async (e) => {
		console.log('checkValue', e)
		// amount.value = amount.value.replace(/^(\-)*(\d+)\.(\d{2}).*$/, '$1$2.$3'); // 清除“数字”和“.”以外的字符
		let price : any = '' + amount.value;
		price = price
			.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
			.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
			.replace('.', '$#$')
			.replace(/\./g, '')
			.replace('$#$', '.')
			.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
		if (price.indexOf('.') < 0 && price != '') {
			// 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
			price = parseFloat(price);
		}
		await nextTick();
		amount.value = price;
	}

	const disabled = ref(false)
	const transfer = () => {
		if (!amount.value) {
			uni.$u.toast('请填写转账金额');
			return;
		}
		if (parseFloat(amount.value) > parseFloat(balance.value)) {
			uni.$u.toast('可用余额不足');
			return;
		}
		
		showPassword.value = true;
	}
	
	const success = () => {
		disabled.value = true;
		
		uni.$u.http.post('/chat/transfer', {
			tid: props.tid,
			token_id: selectedCoin.value.id,
			amount: amount.value
		}).then(res => {
			userBalanceStore.setTokenValue(selectedCoin.value.id, balance.value - amount.value)
			tools.navigateBack()
		
		}).catch(err => {
			disabled.value = false;
		})
	}

	getUserBaseInfo(props.tid ? props.tid : 1).then(data => {
		to.value = data
	})
</script>

<style lang="less">
	.coin-list {
		.item {
			@apply mb-2 flex items-center py-2 border-0 border-solid border-b border-gray-200;
		}
	}

	.selecticon {
		@apply flex justify-between mt-2 items-center mx-4 p-2 py-4 border-0 border-b border-solid rounded-md border-gray-200;
	}
</style>