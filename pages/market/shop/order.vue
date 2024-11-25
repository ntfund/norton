<template>
	<!-- <uni-nav-bar fixed :border="false" left-icon="left" backgroundColor="#F8F8F8" @clickLeft="clickLeft" statusBar
		title="订单">
	</uni-nav-bar> -->
	<com-nav-bar title="商家订单" backgroundColor="#fff" :border="true" @clickLeft="tools.navigateTo('/pages/market/profile')"></com-nav-bar>
	<com-tab-shop :list="['进行中', '已完成']" v-model:current="current" @change="tabClick"></com-tab-shop>
	<view class="">		

		<view class="list">
			<view v-if="current == 0">
				<com-c2c-shop-order-item v-for="item in dataList" :data="item"
					@click="rowClick(item)"></com-c2c-shop-order-item>
			</view>
			<view v-else class="">
				<com-c2c-order-item v-for="item in dataList" :data="item"></com-c2c-order-item>
			</view>
		</view>
	</view>

	<u-empty mode="order" icon="/static/img/empty/order.png" v-if="dataList.length == 0">
	</u-empty>
	<!-- <com-market-bottom :index="2"></com-market-bottom> -->
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
	import tools from "@/utils/tools";
	import {
		C2CType
	} from "@/enums/C2CType";
	import {
		C2COrderType
	} from "@/enums/C2COrderType";

	const tabList = ref([{
		name: '进行中'
	}, {
		name: '已结束'
	}]);
	const current = ref(0);
	const props = defineProps(['current'])
	if (props.current) {
		current.value = props.current
	}

	const tabClick = async (index) => {
		current.value = index

		dataList.value = []
		pagination.page = 1;
		getDataList()
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
		uni.$u.http.get('/c2cShop/orderList', {
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
		})
	}


	const rowClick = (item) => {
		if (item.type == C2CType.Buy)
		{
			if (item.status == C2COrderType.Paid) {
				tools.navigateTo('/pages/market/shop/buy/paid?id=' + item.id)
			}
		} else {			
			if (item.status == C2COrderType.New) {
				tools.navigateTo('pages/market/shop/sell/pay?id=' + item.id)
			}			
			if (item.status == C2COrderType.Paid) {
				tools.navigateTo('/pages/market/shop/sell/paid?id=' + item.id)
			}
		}			
		
	}

	onShow(() => {
		dataList.value = []
		pagination.page = 1
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
</script>

<style lang="scss">

</style>

<style lang="less">
	.list {
		padding-top: 40rpx;
	}
</style>