<template>
	<view class="">
		<com-nav-bar title="我的持仓" backgroundColor="transparent" moveBg="#fff"></com-nav-bar>
		<view class="top-bg">
			<view class="img">
				<image src="@/static/images/profile/profile_bg1@2x.png" mode="aspectFit"
					style="width: 750rpx; height: 750rpx;"></image>
			</view>
		</view>

		<view class="profile">
			<view class="flex justify-between items-start profile_top">
				<view class="flex flex-col justify-between ">
					<view class="flex">
						<view class="flex items-center">
							<view class="profile_name flex items-center">{{ userStore.user.nickname }}</view>
							<view class="profile_level flex items-center">
								<image class="profile_level_img"
									:src="'/static/images/profile/vip/'+userStore.user.vip+'@2x.png'" mode="aspectFit"
									style="width: 120rpx; height: 30rpx;"></image>
								<view class="profile_level_level">1</view>
							</view>
						</view>
					</view>

					<view class="flex">
						<view class="flex items-center profile_uid">
							<view class="flex items-center">
								<span class="profile_uid_title">UID: </span>
								<span class="profile_uid_value">{{ userStore.user.uid }}</span>
							</view>
							<image src="@/static/images/profile/copy@2x.png" class="profile_uid_img" mode="aspectFit"
								style="width: 27rpx; height: 27rpx;" @click="tools.copyClick(userStore.user.uid)">
							</image>
						</view>

						<view class="flex items-center profile_uid ml-[42rpx]">
							<view class="flex items-center">
								<span class="profile_uid_title"><!--邀请码-->{{ t('profile.p2') }}:</span>
								<span class="profile_uid_value">{{ userStore.user.yqm }}</span>
							</view>
							<image src="@/static/images/profile/copy@2x.png" class="profile_uid_img" mode="aspectFit"
								style="width: 27rpx; height: 27rpx;" @click="tools.copyClick(userStore.user.yqm)">
							</image>
						</view>
					</view>
				</view>
				<image src="/static/img/avatar.png" mode="aspectFit" class="rounded-full"
					style="width: 120rpx; height: 120rpx;" />
			</view>

			<view class="detail">
				<view class="flex">
					<view class="w-1/2 card">
						<view class="card_title">我的总收益</view>
						<view class="card_amount">${{ tools.floorAmountMinDigits(userStore.user.info.total_profit, 2) }}
						</view>
					</view>
					<view class="w-1/2 card">
						<view class="card_title">待发放奖励</view>
						<view class="card_amount">
							${{ tools.floorAmountMinDigits(userStore.user.info.pending_profit, 2) }}</view>
					</view>
				</view>
				<view class="detail_options">
					<view class="options_item options_item_border" @click="gridClick(0)">
						<image class="options_item_img" src="@/static/images/wallet/i-transfer(8)@2x.png"
							mode="aspectFit" style="width: 26rpx; height: 26rpx;"></image>
						<view class="options_item_txt"><!-- 内转 -->{{ t('profile.p9') }}</view>
					</view>
					<view class="options_item options_item_border" @click="gridClick(1)">
						<image class="options_item_img" src="@/static/images/financial/withdraw@2x.png" mode="aspectFit"
							style="width: 26rpx; height: 26rpx;"></image>
						<view class="options_item_txt"><!-- 提现 -->{{ t('profile.p7') }}</view>
					</view>
					<view class="options_item options_item_border" @click="gridClick(2)">
						<image class="options_item_img" src="@/static/images/wallet/i-shan@2x.png" mode="aspectFit"
							style="width: 26rpx; height: 26rpx;"></image>
						<view class="options_item_txt"><!-- 闪兑 -->{{ t('profile.p8') }}</view>
					</view>
					<view class="options_item" @click="gridClick(3)">
						<image class="options_item_img" src="@/static/images/financial/bill@2x.png" mode="aspectFit"
							style="width: 26rpx; height: 26rpx;"></image>
						<view class="options_item_txt"><!-- 账单 -->{{ t('profile.p10') }}</view>
					</view>
				</view>
			</view>

			<view class="profile-data">
				<view class="profile-data_list">
					<view class="profile-data_item  profile-data_item_border">
						<view class="profile-data_item_left">我的总持仓</view>
						<view class="profile-data_item_right profile-data_item_bold">
							${{ tools.floorAmountMinDigits(userStore.user.info.deposit, 4) }}</view>
					</view>
					<view class="profile-data_item  profile-data_item_border">
						<view class="profile-data_item_left">活期</view>
						<view class="profile-data_item_right">
							${{ tools.floorAmountMinDigits(userStore.user.info.current, 4) }}
						</view>
					</view>
					<view class="profile-data_item ">
						<view class="profile-data_item_left">定期</view>
						<view class="profile-data_item_right">
							${{ tools.floorAmountMinDigits(userStore.user.info.fixed, 4) }}</view>
					</view>
				</view>
			</view>

			<view class="profile-data profile-data2">
				<view class="profile-data_list">
					<view class="profile-data_item  profile-data_item_border">
						<view class="profile-data_item_left">社区总持仓</view>
						<view class="profile-data_item_right">
							${{ tools.floorAmountMinDigits(userStore.user.info.team_deposit, 4) }}</view>
					</view>
					<view class="profile-data_item  profile-data_item_border">
						<view class="profile-data_item_left">社区量</view>
						<view class="profile-data_item_right">{{ userStore.user.team_total }}</view>
					</view>
					<view class="profile-data_item  profile-data_item_border">
						<view class="profile-data_item_left">社区持仓总收益</view>
						<view class="profile-data_item_right profile-data_item_bold">
							${{ tools.floorAmountMinDigits(userStore.user.info.team_total_profit, 4) }}</view>
					</view>
					<view class="profile-data_item">
						<view class="profile-data_item_left">当月社区持仓收益</view>
						<view class="profile-data_item_right profile-data_item_bold">
							${{ tools.floorAmountMinDigits(userStore.user.info.team_month_profit, 4) }}</view>
					</view>
				</view>
			</view>

		</view>

		<view class="my-team">
			<view class="my-team_header sticky flex justify-between items-center h-[60rpx] bg-[#F2E7FF]">
				<view class="w-2/5 my-team_header_title "><!--用户-->{{ t('profile.p17') }}</view>
				<view class="w-1/5 my-team_header_title text-center "><!--等级-->{{ t('profile.p11') }}</view>
				<view class="w-2/5 my-team_header_title text-right "><!--持仓-->{{ t('profile.p12') }}</view>
			</view>

			<view class="my-team-list">
				<view class="my-team-list_item" v-for="(item, index) in dataList" :key="index">
					<view
						class="flex justify-between w-100 py-3.5 items-center text-sm text-gray-800 border-0 border-b border-solid border-[#f2f3f8]"
						@click="handItemClick(item)">
						<view class="my-team-list_item_t1 w-2/5">{{ tools.hideNumber(item.uid) }}</view>
						<view class="my-team-list_item_t2 w-1/5 text-center">VIP{{ item.vip > 0 ? item.vip : '' }}
						</view>
						<view class="my-team-list_item_t3 w-2/5 text-right">{{ item.info.fixed }}</view>
					</view>
					<view class="grid grid-cols-2 gap-4 py-4 border-0 border-b border-solid border-[#f2f3f8]"
						v-if="item.show">
						<view class="flex flex-col items-start">
							<view class="my-team-list_item_title text-[#b1b1b1]"><!--社区量-->{{ t('profile.p13') }}</view>
							<view class="my-team-list_item_value">{{ item.team_total }}</view>
						</view>
						<view class="flex flex-col items-start">
							<view class="my-team-list_item_title text-[#b1b1b1]"><!--社区累计持仓总收益-->{{ t('profile.p14') }}
							</view>
							<view class="my-team-list_item_value">
								{{ tools.floorAmount(item.info.team_total_profit, 4) }}</view>
						</view>
						<view class="flex flex-col items-start">
							<view class="my-team-list_item_title text-[#b1b1b1]"><!--当前社区总持仓-->{{ t('profile.p15') }}
							</view>
							<view class="my-team-list_item_value">{{ tools.floorAmount(item.info.team_deposit, 4) }}
							</view>
						</view>
						<view class="flex flex-col items-start">
							<view class="my-team-list_item_title text-[#b1b1b1]"><!--当月社区持仓总收益-->{{ t('profile.p16') }}
							</view>
							<view class="my-team-list_item_value">
								{{ tools.floorAmount(item.info.team_month_profit, 4) }}</view>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" class="py-4" line />
			</view>

			<!-- <view class="flex justify-center rounded-b-2xl py-4 bg-[#f2f3f8]">
				<a-pagination size="small" v-model:current="pagination.current" v-model:page-size="pagination.pageSize"
					:total="pagination.total" @change="pageChange" />
			</view> -->

		</view>

	</view>

	<com-withdraw v-if="isWithdrawActive" v-model:show="isWithdrawActive"></com-withdraw>
	<TransferModal v-if="isTransferActive" v-model:show="isTransferActive"></TransferModal>
	<SwapModal v-if="isSwapActive" v-model:show="isSwapActive"></SwapModal>

</template>
<script setup lang="ts">
	import {
		onShow,
		onReachBottom
	} from '@dcloudio/uni-app';
	import { useI18n } from "vue-i18n";
	import { computed, ref } from "vue";
	import tools from "@/utils/tools";
	import project from "@/utils/project";
	import { useUserStore } from '@/stores/modules/user'
	import { getUserTeam } from '@/config/api.js'

	import SwapModal from './components/SwapModal';
	import TransferModal from './components/TransferModal';

	const userStore = useUserStore()

	const { t } = useI18n();

	const status = ref('loadmore')
	// const nomoreText = ref('没有更多了')
	const page = ref(1)
	let isWithdrawActive = ref(false);
	let isTransferActive = ref(false);
	let isSwapActive = ref(false);

	//account, vip, fixed  sonsTotal, sonsTotalFixed, sonsTotalProfile, sonsTotalProfileNow
	const dataList = ref([]);

	const getUserTeamData = () => {
		if (status.value == 'nomore') {
			return;
		}
		status.value = 'loading'
		console.log('getUserTeamData', page.value)
		getUserTeam(page.value).then((res : any) => {
			dataList.value.push(...res.data)
			// dataList.value = dataList.value.concat(res.data)
			// dataList.value = [...dataList.value, ...res.data];

			if (dataList.value.length > 0) {
				dataList.value[0].show = true
			}

			if (page.value < res.last_page) {
				page.value++
				status.value = 'loadmore'
			} else {
				status.value = 'nomore';
			}
		})
	}


	const vipText = computed(() => {
		if (userStore.user.svip > userStore.user.vip) {
			return userStore.user.svip;
		}
		return userStore.user.vip > 0 ? userStore.user.vip : '';
	})


	const handItemClick = (record) => {
		if (record.show) {
			record.show = false;
			return;
		}
		for (let item of dataList.value) {
			item.show = false;
		}
		record.show = true;
	}

	const gridClick = (index : number) : void => {
		if (index == 0) {
			// isTransferActive.value = true;		
			tools.navigateTo('/pages/profile/transfer')
		} else if (index == 1) {
			tools.navigateTo('/pages/profile/withdraw')
			// isWithdrawActive.value = true
		} else if (index == 2) {
			// tools.navigateTo('/pages/wallect/transfer')
			isSwapActive.value = true;
		} else if (index == 3) {
			tools.navigateTo('/pages/profile/bill')
		}
	}

	getUserTeamData()
	onReachBottom(() => {
		console.log('onReachBottom')
		if (status.value == 'loading') {
			return;
		}
		getUserTeamData()
	})

	onShow(() => {
		project.getUser()
	})
</script>

<style lang="less" scoped>
	.portal-wrap {
		background: none !important;
	}


	.top-bg {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		z-index: 0;
		height: 408rpx;
		width: 750rpx;
	}


	.profile {

		&_top {
			padding: 28rpx;
		}

		&_name {
			font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 48rpx;
			color: #000000;
		}

		&_level {
			margin-left: 19rpx;

			position: relative;


			&_img {}

			&_title {}

			&_level {
				position: absolute;
				left: 0;
				right: 0;
				text-align: right;
				margin-right: 15rpx;
				margin-top: 2rpx;

				font-family: Gilroy-Bold;
				font-weight: bold;
				font-size: 22rpx;

				color: #fff;
			}
		}


		&_uid {
			height: 27rpx;

			font-weight: 400;
			font-size: 22rpx;
			color: #999;

			margin-top: 13rpx;

			&_img {
				margin-left: 19rpx;
			}

			&_title {
				font-family: SourceHanSansCN-Regular;
				padding-left: 4rpx;
			}

			&_value {
				font-family: Gilroy-Regular;
				margin-left: 10rpx;
			}
		}

		&-data2 {
			border-radius: 8rpx !important;
		}

		&-data {
			width: 694rpx;
			// height: 320rpx;
			margin: 0 28rpx;
			margin-bottom: 30rpx;

			background: #FFFFFF;
			box-shadow: 0px 8rpx 20rpx 0px rgba(202, 202, 202, 0.3), 0px -8rpx 20rpx 0px rgba(202, 202, 202, 0.3);
			border-radius: 0px 0px 8rpx 8rpx;

			&_list {
				padding: 0 28rpx;
			}

			&_item {
				display: flex;
				justify-content: space-between;
				align-items: center;

				height: 80rpx;

				&_left {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 22rpx;
					color: #999;
				}

				&_right {
					font-family: Gilroy-Regular;
					font-weight: 400;
					font-size: 30rpx;
					color: #000000;
				}

				&_border {
					border-bottom: 1rpx solid #EEEEEE;
				}

				&_bold {
					font-family: Gilroy-Bold;
					font-weight: bold;
					font-size: 30rpx;
					color: #7F17FE;
				}
			}
		}
	}

	.my-deposit {
		width: 730rpx;
		height: 242rpx;
		margin: 0 10rpx;

		background: url('/static/images/profile/profile_bg_2@2x.png') no-repeat;
		background-size: 100% 100%;

		&_content {
			padding-top: 78rpx;
			padding-left: 51rpx;
		}

		&_title {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 30rpx;
			color: #999;
		}

		&_amount {
			font-family: Gilroy-Bold;
			font-weight: bold;
			font-size: 60rpx;
			color: #000000;

			margin-top: 12rpx;
		}

	}

	.my-team {
		background: #fff;
		box-shadow: 0px 8rpx 20rpx 0px rgba(202, 202, 202, 0.3), 0px -8rpx 20rpx 0px rgba(202, 202, 202, 0.3);
		border-radius: 8rpx;
		margin: 0 28rpx;
		margin-top: 44rpx;

		&_header {
			padding: 0 28rpx;

			top: 110rpx;

			&_title {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 22rpx;
				color: #999;
			}
		}

		&-list {
			margin: 0 28rpx;
			min-height: 40vh;

			&_item {

				&_t1,
				&_t2,
				&_t3 {
					font-family: Gilroy-Regular;
					font-weight: 400;
					font-size: 30rpx;
					color: #000000;
				}

				&_title {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 22rpx;
					color: #999;
				}

				&_value {
					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 24rpx;
					color: #000000;

					margin-top: 20rpx;
				}
			}
		}
	}

	.left-border {
		position: relative;

		::after {
			display: block;
			content: "";
			width: 1px;
			height: 45px;
			background: rgba(255, 255, 255, .2);
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
		}
	}


	.rounded-full {
		.ant-upload {
			border-radius: 999999px;
			background: transparent;
			border: 0;
			padding: 0;
			margin: 0;
		}
	}

	.grid-item {
		width: 50px;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;

		color: white;
	}

	.card {
		padding-top: 32rpx;
		padding-left: 52rpx;

		&_title {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 24rpx;
			color: #FFFFFF;
		}

		&_amount {
			font-family: DIN-Bold;
			font-weight: 400;
			font-size: 48rpx;
			color: #FFFFFF;


			margin-top: 22rpx;
		}
	}

	.detail {
		width: 694rpx;
		height: 268rpx;
		position: relative;

		margin: 0 auto;
		margin-bottom: 40rpx;

		background: url('/static/images/wallet/asset-bg@2x.png');
		background-size: 100% 100%;

		border-radius: 16rpx;

		color: #fff;

		&_row1 {
			padding: 38rpx 24rpx;
			display: flex;
			align-items: center;

			font-size: 24rpx;
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;

			&_more {
				font-size: 20rpx;
			}
		}

		&_row2 {
			position: relative;

			&_dollar {
				font-family: DIN-Bold;
				font-weight: 400;
				font-size: 30rpx;
			}

			&_amount {
				font-family: DIN-Bold;
				font-weight: 400;
				font-size: 60rpx;

				position: relative;
				top: -27rpx;
			}

			&_hide_amount {
				font-family: DIN-Bold;
				font-weight: 400;
				font-size: 60rpx;

				height: 24rpx;
				position: relative;
				top: -27rpx;
			}
		}

		&_options {

			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;

			background: #8E55DC;
			height: 80rpx;

			display: grid;
			grid-template-columns: repeat(4, 1fr);

			border-radius: 0px 0px 16rpx 16rpx;



			.options_item {
				display: flex;
				align-items: center;
				justify-content: center;


				&_txt {
					margin-left: 18rpx;

					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 24rpx;
				}
			}

			.options_item_border {
				position: relative;
			}

			.options_item_border::after {
				content: '';
				width: 2rpx;
				height: 30rpx;
				position: absolute;
				right: 0;
				background: #fff;
				opacity: 0.2;
			}
		}
	}
</style>