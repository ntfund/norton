<template>
	<!-- <uni-nav-bar fixed :border="false" left-icon="left" backgroundColor="#F8F8F8" @clickLeft="clickLeft" statusBar
		title="我的">
	</uni-nav-bar> -->
	<com-nav-bar title="我的" backgroundColor="transparent" @clickLeft="clickLeft"></com-nav-bar>
	<view class="bg">
		<view>
			<image src="@/static/images/c2c/bg@2x.png" mode="aspectFit" style="width: 750rpx; height: 750rpx;"></image>
		</view>
	</view>
	<view class="content">
		<view class="content_profile">
			<view class="content_profile_left">
				<view class="nickname">
					{{userStore.user.identity ? project.getHideNickname(userStore.user.identity.nickname) : userStore.user.nickname}}
				</view>
				<view class="content_profile_left_auth">
					<view class="yes" v-if="userStore.user.identity && userStore.user.identity.status == 2">已认证</view>
					<view class="no" v-else>未认证</view>
					<view class="time">
						注册时间： {{tools.dateFormat('YYYY-mm-dd', new Date(userStore.user.created_at))}}
					</view>
				</view>
			</view>
			<view class="content_profile_right">
				<view class="avatar">
					<image :src="project.getFullURL(userStore.user.avatar)" class="rounded-full" mode="aspectFit" style="width: 120rpx; height: 120rpx;">
					</image>
				</view>
			</view>
		</view>
		<view class="content_c2c_info flex justify-between">
			<view class="content_c2c_info_item content_c2c_info_item1">
				<view class="view">
					<view class="content_c2c_info_item_title">成交单数</view>
					<view class="content_c2c_info_item_value">{{c2cInfo.success_order_count}}</view>
				</view>
			</view>
			<view class="content_c2c_info_item content_c2c_info_item2">
				<view class="view">
					<view class="content_c2c_info_item_title">成交率</view>
					<view class="content_c2c_info_item_value">{{tools.unitConverter(c2cInfo.rate)}}%</view>
				</view>
			</view>
			<view class="content_c2c_info_item content_c2c_info_item3">
				<view class="view">
					<view class="content_c2c_info_item_title">平均付款时间</view>
					<view class="content_c2c_info_item_value">{{parseInt(c2cInfo.pay_seconds / 60)}}m
					{{parseInt(c2cInfo.pay_seconds % 60)}}s</view>
				</view>
			</view>
			<view class="content_c2c_info_item content_c2c_info_item4">
				<view class="view">
					<view class="content_c2c_info_item_title">平均放币时间</view>
					<view class="content_c2c_info_item_value">{{parseInt(c2cInfo.confirm_seconds / 60)}}m
					{{parseInt(c2cInfo.confirm_seconds % 60)}}s</view>
				</view>
			</view>
		</view>
		
		<view class="content_adva flex flex-col justify-end">
			<view class="content_adva_view flex justify-between items-center">
				<view>
					<image src="@/static/images/c2c/shop@2x.png" mode="aspectFit" style="width: 40rpx; height: 36rpx;"></image>
				</view>
				<view class="flex-1 middle">
					<view class="title">认证商家</view>
					<view class="sub-info">申请成为认证商家享受更多权益</view>
				</view>
				<view v-if="!userStore.isShoper()">
					<button type="button" class="btn" @click="tools.navigateTo('/pages/market/plan/plan')">
						申请
					</button>
				</view>
			</view>
		</view>
		
		<view class="content_list mt-[33px]">
			<view class="item flex items-center justify-between" @click="certificate">
				<view class="flex items-center font-bold">
					<image class="icon relative top-[1px]" src="@/static/images/c2c/idc@2x.png" mode="aspectFit" style="width: 32rpx; height: 36rpx;"></image>
					<view class="title">
						实名认证
					</view>
				</view>
				<view>
					<image src="@/static/images/c2c/arrow-right@2x.png" mode="aspectFit" style="width: 12rpx; height: 20rpx;"></image>
				</view>
			</view>
		
			<view class="item flex items-center justify-between "
				@click="tools.navigateTo('/pages/market/payment/payment')">
				<view class="flex items-center font-bold">
					<image class="icon" src="@/static/images/c2c/receiver@2x.png" mode="aspectFit" style="width: 32rpx; height: 36rpx;"></image>
					<view class="title">
						收款账号管理
					</view>
				</view>
				<view>
					<image src="@/static/images/c2c/arrow-right@2x.png" mode="aspectFit" style="width: 12rpx; height: 20rpx;"></image>
				</view>
			</view>
			
			<view class="item flex items-center justify-between "
				>
				<view class="flex items-center font-bold">
					<image class="icon" src="@/static/images/c2c/flag@2x.png" mode="aspectFit" style="width: 32rpx; height: 36rpx;"></image>
					<view class="title">
						C2C 帮助中心
					</view>
				</view>
				<view>
					<image src="@/static/images/c2c/arrow-right@2x.png" mode="aspectFit" style="width: 12rpx; height: 20rpx;"></image>
				</view>
			</view>
			
		</view>
		
		<view class="content_list mt-[20px]" v-if="isShoper">
			<view class="item  flex items-center justify-between"
				@click="tools.navigateTo('/pages/market/shop/manager')">
				<view class="flex items-center font-bold items-center">
					<image class="icon" src="@/static/images/c2c/shop_manager@2x.png" mode="aspectFit" style="width: 32rpx; height: 36rpx;"></image>
					<view class="title">
						商家后台管理
					</view>
				</view>
				<view>
					<image src="@/static/images/c2c/arrow-right@2x.png" mode="aspectFit" style="width: 12rpx; height: 20rpx;"></image>
				</view>
			</view>
			<view class="item  flex items-center justify-between" @click="tools.navigateTo('/pages/market/shop/order')">
				<view class="flex items-center font-bold items-center">
					<image class="icon" src="@/static/images/c2c/shop_order@2x.png" mode="aspectFit" style="width: 32rpx; height: 36rpx;"></image>
					<view class="title">
						商家C2C订单
					</view>
				</view>
				<view>
					<image src="@/static/images/c2c/arrow-right@2x.png" mode="aspectFit" style="width: 12rpx; height: 20rpx;"></image>
				</view>
			</view>
			<view class="item  flex items-center justify-between" @click="tools.navigateTo('/pages/market/shop/name')">
				<view class="flex items-center font-bold items-center">
					<!-- <image class="icon" src="@/static/images/c2c/shop_order@2x.png" mode="aspectFit" style="width: 32rpx; height: 36rpx;"></image> -->
					<uni-icons type="tune-filled" size="18"></uni-icons>
					<view class="title">
						店铺名称管理
					</view>
				</view>
				<view>
					<image src="@/static/images/c2c/arrow-right@2x.png" mode="aspectFit" style="width: 12rpx; height: 20rpx;"></image>
				</view>
			</view>
		</view>
		
	</view>
	
	
	<com-market-bottom :index="3"></com-market-bottom>
</template>

<script setup>
	import {
		computed,
		reactive,
		ref
	} from "vue";
	import tools from '@/utils/tools'
	import {
		useUserStore
	} from "@/stores/modules/user";
	import project from "@/utils/project";
	import {
		getC2cOrderInfo
	} from "@/config/api";

	let userStore = useUserStore();
	let c2cInfo = reactive({
		success_order_count: 0,
		rate: 100,
		pay_seconds: 0,
		confirm_seconds: 0,
	})

	const isShoper = computed(() => {
		return userStore.user.shop_level > 0;
	})

	const certificate = () => {
		if (userStore.user.identity) {
			if (userStore.user.identity.status == 1) {
				tools.navigateTo('/pages/market/certificate/pending')
			}
			if (userStore.user.identity.status == 2) {
				tools.navigateTo('/pages/market/certificate/success')
			}
		} else {
			tools.navigateTo('/pages/market/certificate/home')
		}
	}

	const clickLeft = () => {
		uni.switchTab({
			url: '/pages/index/index'
		})
	}

	getC2cOrderInfo().then(data => {
		// c2cInfo = data
		for (let key in c2cInfo) {
			c2cInfo[key] = data[key]
		}
	})
</script>

<style lang="scss">
	.bg {
		position: fixed;
		left: 0;
		top: 0;
		height: 0;
		z-index: -1;
	}

	.content {
		&_profile {
			padding: 28rpx;

			display: flex;
			justify-content: space-between;


			&_left {
				display: flex;
				flex-direction: column;



				// align-content: center;

				.nickname {
					font-family: SourceHanSansCN-Bold;
					font-weight: bold;
					font-size: 48rpx;
					color: #000000;
				}


				&_auth {
					display: flex;
					align-content: center;

					margin-top: 10rpx;

					.yes {
						width: 76rpx;
						height: 30rpx;
						background: #7F17FE;
						border-radius: 4rpx;

						font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 22rpx;
						color: #FFFFFF;

						text-align: center;
					}

					.no {
						width: 76rpx;
						height: 30rpx;
						background: #000000;
						border-radius: 4rpx;
						opacity: 0.4;

						font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 22rpx;
						color: #FFFFFF;

						text-align: center;
					}

					.time {
						font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 22rpx;
						color: #000000;
						opacity: 0.6;

						padding-left: 16rpx;
					}
				}

			}

			&_right {			
				
				.avatar {
					width: 120rpx;
					height: 120rpx;
					background: #EEEEEE;
					border-radius: 50%;
					border: 2rpx solid #7F17FE;
					
					flex-shrink: 0;
				}
			}
		}

		&_c2c_info {
			padding: 64rpx 29rpx;
			padding-bottom: 0;

			&_item {
				&_title {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 22rpx;
					color: #000000;
					opacity: 0.6;
				}

				&_value {
					font-family: Gilroy-Bold;
					font-weight: bold;
					font-size: 30rpx;
					color: #000000;
					
					padding-top: 15rpx;
				}

				.view {
					display: flex;
					flex-direction:column;
					align-items: center;
				}
			}

			&_item1 {
				display: flex;
			}
			&_item4 {
				display: flex;
				justify-content: flex-end;
			}
		}
		
		&_adva {
			width: 694rpx;
			height: 125rpx;
			
			margin: 0 auto;
			
			margin-top: 64rpx;
			
			color: #FFFFFF;
			
			background: url('/static/images/c2c/poly@2x.png');
			background-size: 694rpx 125rpx;
			
			
			
			
			&_view {
				padding: 32rpx;
				padding-bottom: 16rpx;
				
				.middle {
					padding-left: 30rpx;
					
					.title {
						font-family: SourceHanSansCN-Bold;
						font-weight: bold;
						font-size: 36rpx;
						color: #FFFFFF;
						// line-height: 70rpx;
					}
					
					.sub-info {
						font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 22rpx;
						color: #FFFFFF;
					}
				}
				
				.btn {
					width: 122rpx;
					height: 58rpx;
					background: linear-gradient(90deg, #FFEAB0, #FFD171);
					border-radius: 16rpx;
					
					font-family: SourceHanSansCN-Bold;
					font-weight: bold;
					font-size: 30rpx;
					color: #000000;
					line-height: 70rpx;
				}
			}
		}
		
		&_list {
			padding:0 28rpx;		
			
			background: #FFFFFF;
			box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(202,202,202,0.3);
			
			.item {
				height: 100rpx;
				align-items: center;
				background: #FFFFFF;
				
				
				
				.icon {
					display: flex;
					align-items: center;
					justify-content: center;			
					
				}
				
				.title {
					// font-family: Gilroy-Bold;
					font-weight: bold;
					font-size: 30rpx;
					color: #000000;
					
					margin-left: 30rpx;
				}
			}
		}
	}
</style>