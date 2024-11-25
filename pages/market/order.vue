<template>
	<com-nav-bar title="订单" backgroundColor="#fff" :border="true" @clickLeft="clickLeft"></com-nav-bar>
	<com-tab-shop :list="['进行中', '已完成']" v-model:current="current" @change="tabClick"></com-tab-shop>
	
	<view class="list">
		<view v-if="current == 0">
			<com-c2c-order-item v-for="item in dataList" :data="item" @click="rowClick(item)"></com-c2c-order-item>
		</view>
		<view v-else >
			<com-c2c-order-item v-for="item in dataList" :data="item"></com-c2c-order-item>
		</view>
	</view>
	
	<u-empty mode="order" icon="/static/img/empty/order.png" v-if="dataList.length == 0">
	</u-empty>
	<com-market-bottom :index="2"></com-market-bottom>
</template>

<script setup>
	import {
		reactive,
		ref
	} from "vue";
	import {
		onReachBottom,
		onShow
	} from '@dcloudio/uni-app';
	import {
		C2CType
	} from "@/enums/C2CType";
	import {
		C2COrderType
	} from "@/enums/C2COrderType";
	
	import tools from "@/utils/tools";

	const tabList = ref([{
		name: '进行中'
	}, {
		name: '已结束'
	}]);
	const current = ref(0);
	const isLoading = ref(false);
	const props = defineProps(['current'])
	if (props.current) {
		current.value = props.current
	}

	const tabClick = async (index) => {
		console.log('index', index)
		current.value = index

		dataList.value = []
		pagination.page = 1;
		getDataList()
		console.log(current.value)
	}


	const pagination = reactive({
		page: 1,
		last_page: 999,
		pageSize: 20,
		total: 0,
		status: 'loading'
	})
	const dataList = ref([]);
	const getDataList = () => {
		if (isLoading.value) {
			return;
		}
		isLoading.value = true;
		
		uni.$u.http.get('/c2cOrder', {
			params: {
				status: current.value == 0 ? 1 : -1,
				page: pagination.page,
				pageSize: 10,
			}
		}).then(res => {
			dataList.value = [...dataList.value, ...res.data]

			pagination.page = res.current_page
			pagination.last_page = res.last_page
			pagination.total = res.total
			pagination.status = 'none'
			
			isLoading.value = false;
		})
	}


	const rowClick = (item) => {
		if (item.type == C2CType.Buy)
		{
			if (item.status == C2COrderType.New){
				tools.navigateToWithEncode('/pages/market/buy/buying', item)
			}
			if (item.status == C2COrderType.Paid){
				tools.navigateTo('/pages/market/buy/paid?id=' + item.id)
			}
		} else {
			if (item.status == C2COrderType.New){
				tools.navigateTo('/pages/market/sell/pay?id=' + item.id)
			}
			if (item.status == C2COrderType.Paid){
				tools.navigateTo('/pages/market/sell/paid?id=' + item.id)
			}
		}
	}

	onShow(() => {
		pagination.page = 1
		dataList.value = []
		getDataList()
	})

	onReachBottom(() => {
		if (pagination.status == 'loading' || pagination.page >= pagination.last_page) {
			return;
		}
		pagination.page++;
		pagination.status = "loading"
		getDataList()
	})

	const clickLeft = () => {
		uni.switchTab({
			url: '/pages/index/index'
		})
	}
</script>

<style lang="scss">

</style>

<style lang="less">
	.list {
		padding-top: 40rpx;
	}
</style>