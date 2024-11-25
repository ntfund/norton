<template>
	<view>
		<com-nav-bar title="分析师" color="white" backgroundColor="transparent"></com-nav-bar>
		<view class="top">
			<view class="top-content">
				<view class="asset">
					<view class="amount ">${{ tools.formatNumber2(balance) }}</view>
					<view class="title ">资产总额</view>
				</view>
			</view>
		</view>

		<view class="mt-[20px] mb-[10px] com-tabs flex justify-between mr-[29rpx]">
			<com-tab-list :list="['进行中', '已下架']" v-model:current="current" @change="switchTab"></com-tab-list>
			<view @click="tools.navigateTo('/pages/api/api')">管理</view>
		</view>

		<view class="list p-[28rpx] pb-10 relative z-10">
			<view class="analyst-list">
				<view class="analyst-list_item" v-for="item in dataList" @click="itemClick(item)">
					<view class="flex flex-row justify-between items-center analyst-list_item_avatar_box">
						<!-- 分析师头像 -->
						<image :src="item.img" class="self-start rounded-full" alt="fxs" mode="aspectFit"
							style="width: 64rpx; height: 64rpx;" />
						<view class="flex flex-col justify-center ml-[20rpx]">
							<!-- 分析师名称 -->
							<view class="analyst-list_item_level_name">{{ item.name }}</view>
							<view class="analyst-list_item_level_level">{{ item.level }}</view>
						</view>
						<view class="flex  flex-1 flex-row items-end justify-end">
							<view class="text-right analyst-list_item_level_name_platform" v-if="item.platform === 1">
								欧易OKX</view>
							<view class="text-right analyst-list_item_level_name_platform"
								v-else-if="item.platform === 2">火必</view>
						</view>
					</view>

					<view class="flex flex-row justify-between items-center analyst-list_item_info">
						<view class="flex flex-col w-2/5">
							<view class="analyst-list_item_info_title">账户资金</view>
							<view class="analyst-list_item_info_amount leading-4 text-green">
								{{ tools.formatNumber2(item.balance, 2) }}
							</view>
						</view>
						<view class="flex flex-col text-center w-1/5">
							<view class="analyst-list_item_info_title">总收益率</view>
							<view class="analyst-list_item_info_amount leading-4 "
								:class="[item.total_rate >=0 ? 'text-green' : 'text-red']">
								{{ item.total_rate }}%
							</view>

						</view>
						<view class="flex flex-col text-right w-2/5">
							<view class="analyst-list_item_info_title">总收益额</view>
							<view class="analyst-list_item_info_amount leading-4 "
								:class="[item.total_profit >=0 ? 'text-green' : 'text-red']">
								{{ tools.formatNumber2(item.total_profit, 2) }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script setup lang="ts">
	import { onMounted, onUnmounted, ref } from "vue";
	import { onShow, onHide } from '@dcloudio/uni-app'
	import tools from '@/utils/tools.js'
	import socketHelper from "../../utils/socketHelper";
	import { useUserStore } from "@/stores/modules/user";


	const current = ref(0)
	const dataList = ref([]);
	const balance = ref<String | number>('')
	const userStore = useUserStore()
	const http = uni.$u.http;

	const sumTotal = (dataList) => {
		let total = 0;
		for (let i = 0; i < dataList.length; i++) {
			let item = dataList[i];
			total += Math.floor(item.balance * 100);
		}
		return total / 100;
	}

	const getDataList = () => {
		http.get('/analog/getAnalystList', {
			params: {
				status: current.value == 0 ? 1 : 0
			}
		}).then((data : []) => {
			dataList.value = data

			balance.value = sumTotal(data)
		})
	}

	const switchTab = (index) => {
		current.value = index;
		getDataList();
	}

	const itemClick = (item) => {
		//router.push({name: 'analystDetail', query:{cycle: item.cycle, apiCount: 0}})
		tools.navigateToWithEncode('/pages/analyst/detail', item)
	}

	let timer = null;
	onShow(() => {
		console.log('onShow getDataList')
		getDataList()

		timer = setInterval(() => {
			getDataList()
		}, 3000)

		socketHelper.send({type: 'session', data: {visibility: 1}});
		socketHelper.send({type: 'update', data: {room_id: 'good_0', good_id: 0, uid: userStore.user.id, user: userStore.user, visibility: 1}});
	})


	onHide(() => {
		console.log('onHide clearInterval')
		clearInterval(timer)
		
		socketHelper.send({type: 'session', data: {visibility: 0}});
		socketHelper.send({type: 'update', data: {room_id: 'good_0', good_id: 0, uid: userStore.user.id, user: userStore.user, visibility: 0}});
	})

	onMounted(() => {
		socketHelper.send({ type: 'good_join', data: { room_id: 'good_0', good_id: 0, uid: userStore.user.id, user: userStore.user, visibility: 1 } });
	})

	onUnmounted(() => {
		clearInterval(timer)
		
		console.log('leave_good')
		socketHelper.send({ type: 'leave_good', data: { room_id: 'good_0', good_id: 0, uid: userStore.user.id } });
	})
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}

	.top {
		height: calc(408rpx - 110rpx - var(--status-bar-height));
		width: 750rpx;

		&-content {
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			z-index: 100;
			height: 408rpx;
			width: 750rpx;
			// height: 0;

			background: url('/static/images/financial/analyst_top_bg@2x.png') no-repeat;
			background-size: 750rpx 408rpx;
			// background: green;

			display: flex;
			flex-direction: column;
			justify-content: flex-end;
		}

		.asset {
			//background: linear-gradient(to bottom right, #c056ff, #d107cc, rgba(158, 0, 193, 0.87));

			// height: 408rpx;
			// width: 750rpx;

			// background: green;
			margin-bottom: 89rpx;

			color: white;

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			// padding: 20px 0;

			.title {
				// font-size: 14px;

				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 22rpx;
			}

			.amount {
				font-family: Gilroy-Bold;
				font-weight: bold;
				font-size: 60rpx;
				color: #FFFFFF;

			}
		}
	}

	.analyst-list {
		// margin-top: 44rpx;

		&_item {
			background: #fff;
			margin-bottom: 20rpx;
			box-shadow: 0px 8rpx 20rpx 0rpx rgba(202, 202, 202, 0.3), 0px -8rpx 20rpx 0rpx rgba(202, 202, 202, 0.3);
			border-radius: 8rpx;

			&_avatar_box {
				padding: 28rpx 0;
				margin: 0 32rpx;
				border-bottom: 2rpx dashed #EEEEEE;
			}

			&_level {
				&_name {
					font-family: Gilroy-Bold;
					font-weight: bold;
					font-size: 32rpx;
					color: #000000
				}

				&_level {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 20rpx;
					color: #999;
				}

				&_name_platform {
					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 24rpx;
					color: #000000;
				}
			}

			&_info {

				padding: 28rpx 32rpx;

				&_title {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 22rpx;
					color: #999;
				}

				&_amount {
					font-family: Gilroy-Bold;
					font-weight: bold;
					font-size: 30rpx;
					margin-top: 10rpx;
				}

				.text-green {
					color: #00C688;
				}

				.text-red {
					color: #FC465C;
				}
			}
		}
	}

	.text-gradient {
		position: relative;
	}

	.text-gradient[data-text]::after {
		content: attr(data-text);
		color: cyan;
		position: absolute;
		top: 0;
		left: 0;
		mask-image: linear-gradient(to left, red, rgba(0, 0, 0, .5));
		//-webkit-mask-image: linear-gradient(to left, red, rgba(0, 0, 0, .5));
	}

	.rainbow {
		background: linear-gradient(to bottom right, #2fefff, #2bd82d, #2de3f1, #00ff4b, fuchsia) 0 / 90%;
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: hue 3s infinite;
	}

	@keyframes hue {
		from {
			filter: hue-rotate(0deg);
		}

		to {
			filter: hue-rotate(360deg);
		}
	}
</style>