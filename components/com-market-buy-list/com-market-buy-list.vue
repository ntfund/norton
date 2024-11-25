<template>
	<view class="list">
		<view class="item" v-for="(item, index) in dataList" :key="index" @click="itemClick(item)">
			<view class="item_container">
				<view class="flex justify-between items-center">
					<view class="flex items-center">
						<uni-badge size="small" :is-dot="true" :text="1" :offset="[4, 4]" absolute="rightBottom"
							style="z-index: 1;" type="success">
							<view class="rounded-full text-white flex items-center justify-center item_shop_circle">
								<text>{{item.shop.first_name}}</text>
							</view>
						</uni-badge>
						<view class="item_shop_name">{{item.shop.name}}</view>
						<view class="flex ml-1">
							<view class="w-[20px] h-[20px] text-center bg-blue-600 rounded-full"
								v-if="item.shop.shop_level == 1">
								<uni-icons type="star-filled" color="#fff" size="18"></uni-icons>
							</view>
							<view class="w-[20px] h-[20px] text-center bg-fuchsia-600 rounded-full" v-else>
								<uni-icons type="vip-filled" color="#fff" size="18"></uni-icons>
							</view>
						</view>
					</view>
					<view class="item_info">
						{{ item.shop ? tools.formatNumber(item.shop.total_order, 0) : 0}} 订单 <span
							class="item_info_shu">|</span> 成单率 {{item.shop.rate}}%
					</view>
				</view>

				<view class="item_row mt-[20px]">
					<view class="item_row_left">
						<view class="title">数量 </view>
						<view class="sub-title">{{tools.formatNumber(item.amount, 2)}} USDT</view>
					</view>

					<view class="item_row_right">
						<view class="title">单价</view>
					</view>
				</view>
				<view class="item_row mt-[2px]">
					<view class="item_row_left">
						<view class="title">限额 </view>
						<view class="sub-title">
							{{tools.formatNumber(item.min_cny, 2)}}-{{tools.formatNumber(item.max_cny, 2)}} CNY
						</view>
					</view>
					<view class="item_row_right">
						<view class="item_price">
							￥{{item.price}}
						</view>
					</view>
				</view>
				<view class="item_row mt-[20px]">
					<!-- <com-payment-list :list="item.payments"></com-payment-list> -->
					<view class="item_row_left">
						<com-c2c-payments :list="item.payments"></com-c2c-payments>
					</view>
					<view class="item_row_right">
						<button type="button" class="item_btn item_btn_buy">购买</button>
					</view>
				</view>
			</view>
		</view>
		<u-empty mode="data" icon="/static/img/empty/data.png" v-if="dataList.length == 0">
		</u-empty>
	</view>
</template>

<script setup lang="ts">
	import tools from '@/utils/tools'
	import { onMounted, reactive, ref, watch } from 'vue';
	import {
		onReachBottom
	} from '@dcloudio/uni-app';

	const props = defineProps(['amount', 'payment']);

	const itemClick = (item) => {
		tools.navigateToWithEncode('/pages/market/buy/buy', item);
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
		uni.$u.http.get('/c2c/list/', {
			params: {
				page: pagination.page,
				type: 2,
				pageSize: 10,
				amount: props.amount,
				payment: props.payment
			}
		}).then(res => {
			console.log('getDataList', res)
			dataList.value = [...dataList.value, ...res.data]

			pagination.page = res.current_page
			pagination.last_page = res.last_page
			pagination.total = res.total
			pagination.status = 'none'
		})
	}

	onMounted(() => {
		getDataList()
	})

	watch(() => props.amount, (newVal, oldVal) => {
		console.log(newVal, oldVal)
		if (newVal === '' || newVal >= 10) {
			pagination.page = 1;
			dataList.value = [];
			getDataList()
		}
	})

	watch(() => props.payment, (newVal, oldVal) => {
		console.log(newVal, oldVal)
		pagination.page = 1;
		dataList.value = [];
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

	setInterval(() => {
		pagination.page = 1;
		dataList.value = [];
		getDataList()
	}, 150000)
</script>

<style lang="scss" scoped>
	.list {
		margin-top: 40rpx;
		padding-bottom: 100px;
	}

	.item {
		width: 694rpx;
		height: 320rpx;
		background: #FFFFFF;
		box-shadow: 0px 8rpx 20rpx 0rpx rgba(202, 202, 202, 0.3), 0px -8rpx 20rpx 0px rgba(202, 202, 202, 0.3);
		border-radius: 8rpx;
		margin: 0 auto;

		margin-bottom: 40rpx;

		&_container {
			padding: 20rpx 32rpx;
		}

		&_shop_circle {
			width: 64rpx;
			height: 64rpx;
			background: #7F17FE;
			border-radius: 50%;

			// font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 38rpx;
			color: #FFFFFF;
		}

		&_shop_name {
			// font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 32rpx;
			color: #000000;
			// line-height: 70px;

			margin-left: 21rpx;
		}

		&_info {
			font-family: Gilroy-Medium;
			font-weight: 500;
			font-size: 22rpx;
			color: #000000;
			opacity: 0.6;

			&_shu {
				margin: 0 17rpx;
			}
		}

		&_price {
			font-family: Gilroy-Bold;
			font-weight: bold;
			color: #00C688;
		}

		&_amount {
			&_label {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 22rpx;
				color: #000000;
				opacity: 0.6;
			}

			&_value {
				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 24rpx;
				color: #000000;
			}
		}

		&_row {
			display: flex;
			align-items: center;
			justify-content: space-between;

			&_left,
			&_right {
				display: flex;
				align-items: center;
			}


			.title {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 22rpx;
				color: #000000;
				opacity: 0.6;
			}

			.sub-title {
				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 24rpx;
				color: #000000;
				
				margin-left: 22rpx;
			}
		}

		&_btn {
			width: 146rpx;
			height: 56rpx;
			border-radius: 8rpx;

			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 28rpx;
			color: #FFFFFF;
			// line-height: 70rpx;

			&_buy {
				background: #00C688;
			}

			&_sell {
				background: #FC465C;
			}
		}
	}
</style>