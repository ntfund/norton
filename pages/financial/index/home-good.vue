<template>
	<view>
		<view class="flex justify-between good-view items-center">
			<view class="good-title">定期赚币</view>
			<view class="good-tabs flex items-center">
				<view class="good-tabs_item" :class="{'good-tabs_item_active': current == 0}" @click="tabClick(0)">进行中
				</view>
				<view class="good-tabs_item" :class="{'good-tabs_item_active': current == 1}" @click="tabClick(1)">已下架
				</view>
			</view>
		</view>
		<view class="good_list flex flex-col">
			<view class="good_list_item" v-for="item in goodList">
				<view class="flex flex-row justify-between items-center">
					<image :src="baseURL + item.img" mode="aspectFit"
						style="width: 64rpx; height: 64rpx; border-radius: 50%;"></image>
					<view class="flex flex-1 flex-col justify-center" style="margin-left: 20rpx;">
						<view class="good_list_item_name">{{item.name}}</view>
						<view class="good_list_item_level">{{item.level}}</view>
					</view>
					<view class="flex   flex-col items-end justify-end">
						<button type="button" class="good_list_item_btn" @click="showBuy(item)">
							<!-- 申购 -->{{$t('deposit.p5')}}
						</button>
					</view>

				</view>
				<view class="good_list_item_line"></view>
				<view class="flex flex-row items-center justify-between good_list_item_info">
					<view class="flex flex-col justify-start items-start w-1/3">
						<view class="good_list_item_info_t1"><!-- 参考年化 -->{{$t('deposit.p2')}}</view>
						<view class="good_list_item_info_t2">
							{{ tools.floorAmount(item.rate * 365) }}%
						</view>
					</view>
					<view class="flex flex-col justify-start items-center w-1/3">
						<view class="good_list_item_info_t1"><!-- 日收益率 -->{{$t('deposit.p3')}}</view>
						<view class="good_list_item_info_t2" style="margin-top: 12rpx;">{{item.rate}}%</view>
					</view>
					<view class="flex flex-col justify-start items-end w-1/3">
						<view class="good_list_item_info_t1"><!-- 期限 -->{{$t('deposit.p4')}}</view>
						<view class="good_list_item_info_t2">{{item.cycle}}<!-- {{ $t('timer.day') }} --> Day</view>
					</view>
				</view>
				<u-line-progress :percentage="tools.floorAmount((item.number / item.total) * 100)" activeColor="#7F17FE"
					inactiveColor="#EEEEEE" style="margin-top: 25rpx;" height="10px"></u-line-progress>
				<view class="good_list_item_volume whitespace-nowrap">
					<!-- 申购数量 --><span class="good_list_item_volume_t1">{{$t('deposit.p6')}}：</span><span
						class="good_list_item_volume_t2">{{item.number}}/{{item.total}}</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import tools from '@/utils/tools.js'
	import {
		getGoodList
	} from "@/config/api";
	import {
		baseURL
	} from "@/config/http.js";

	const current = ref(0);
	const emits = defineEmits(['buy'])

	const goodList = ref([]);
	const getGoodDataList = (status) => {
		goodList.value = [];
		getGoodList({
			status
		}).then(res => {
			goodList.value = res
		})
	}
	getGoodDataList(1);

	const showBuy = item => {
		emits('buy', item)
		console.log(item)
	}

	const tabClick = (index) => {
		current.value = index;

		if (index == 0) {
			getGoodDataList(1); //进行中
		} else
		if (index == 1) {
			getGoodDataList(0); //已下降
		}
	}
</script>

<style lang="scss" scoped>
	.good-view {
		margin: 47rpx 0 40rpx 0;
		padding: 0 25rpx;

		.good-title {

			font-family: SourceHanSansCN-Regular;
			font-weight: 500;
			font-size: 30rpx;
			color: #999;

		}

		.good-tabs {

			// font-family: SourceHanSansCN-Regular;
			// font-weight: 400;
			// font-size: 30rpx;

			&_item {
				margin-left: 40rpx;
				color: #999;

				&_active {
					position: relative;
					// background: green;
					color: #2d2d2d;

					display: flex;
					align-items: end;
					justify-content: center;
				}

				&_active::after {
					content: '';
					position: absolute;
					width: 60rpx;
					height: 6rpx;
					bottom: -15rpx;

					background: #7F17FE;
					border-radius: 3rpx;
				}
			}
		}
	}


	.good_list {
		margin: 23rpx 28rpx;

		&_item {
			box-shadow: 0px 8rpx 20rpx 0rpx rgba(202, 202, 202, 0.3), 0px -8rpx 20rpx 0rpx rgba(202, 202, 202, 0.3);
			border-radius: 8rpx;
			padding: 25rpx 32rpx 18rpx 31rpx;

			margin-bottom: 40rpx;

			&_name {
				font-family: Gilroy-Bold;
				font-weight: bold;
				font-size: 32rpx;
				margin-left: 1rpx;
			}

			&_level {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 20rpx;
				opacity: 0.6;
			}

			&_btn {
				width: 146rpx;
				height: 56rpx;
				background: #7F17FE;
				border-radius: 8rpx;

				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 28rpx;
				color: #FFFFFF;
				// line-height: 70px;

				&:active {
					background: #E0E0E0;
				}
			}

			&_line {
				width: 100%;
				height: 2rpx;
				border-bottom: 2rpx dashed #EEEEEE;

				margin-top: 28rpx;
			}

			&_info {
				margin-top: 33rpx;

				&_t1 {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 22rpx;
					color: #000000;
					opacity: 0.6;
				}

				&_t2 {
					font-family: Gilroy-Bold;
					font-weight: bold;
					font-size: 30rpx;
					color: #00C688;

					margin-top: 17rpx;
				}
			}

			&_volume {
				margin-top: 19rpx;
				font-weight: 400;
				font-size: 20rpx;
				color: #000000;
				opacity: 0.6;

				&_t1 {
					font-family: SourceHanSansCN-Regular;
				}

				&_t2 {
					font-family: Gilroy-Medium;
				}
			}
		}
	}
</style>