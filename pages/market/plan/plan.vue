<template>
	<view>
		<!-- <com-nav-bar title="C2C商家申请" backgroundColor="transparent" color="white"></com-nav-bar> -->
		<view class="text-center px-1 my-6">
			<text class="text-xl">商家权益</text>
			<view class="text-xs my-2 text-[#bbb]">除了C2C交易<text class="text-[#aaff7f]">0费率</text>,<text
					class="ml-2">我们还为商家提供了更多更多丰富多彩的权益</text></view>
			<view class="bg-[#111111] text-[#ccc] py-2 px-3 text-xl mx-auto w-[200px]">
				<view class="flex items-center rounded-md">
					你的法币区:
					<!-- <u-icon name="rmb-circle-fill" color="#ef4b00" labelColor="#ffffff" size="28"
						class="ml-4 mr-2"></u-icon> -->

					<view class="w-[50rpx] h-[50rpx] bg-[#ef4b00] rounded-full flex justify-center items-center mx-2">
						<view class="text-center text-base text-white">
							￥
						</view>
					</view>
					<text class="text-white text-base">CNY</text>
				</view>
			</view>
		</view>
		<swiper class="scroll-view-height text-[#eee] swiper" @change="swipeIndex" :current="current" :circular="false"
			:duration="300" :skip-hidden-item-layout="true" :indicator-dots="true"
			indicator-color="rgba(85, 85, 85, 1.0)" indicator-active-color="rgba(255, 255, 255, 1.0)">
			<swiper-item class="swiper-item">
				<view class="relative bg-[#101010] h-[1050rpx] m-6  rounded-xl ">
					<view class="p-4 py-6">
						<view class="">
							<view class="flex justify-between">
								<view class="text-2xl">认证商家</view>
								<view class="w-[40px] h-[40px] text-center bg-blue-600 rounded-full">
									<uni-icons type="star-filled" color="#fff" size="36"></uni-icons>
								</view>
							</view>
							<view class="py-2 text-[#ccc]">成为认证商家，享受更多权益</view>
						</view>
						<view class="my-list">
							<view class="my-list-row">
								<uni-icons type="checkmarkempty" color="#9e9e9e" size="22"></uni-icons>
								<text class="content">申请成功即可发布委托单</text>
							</view>
							<view class="my-list-row">
								<uni-icons type="checkmarkempty" color="#9e9e9e" size="22"></uni-icons>
								<text class="content">申请成功<text class="text-[#aaff7f]">30天</text>后免费提升限额</text>
							</view>
							<view class="my-list-row">
								<uni-icons type="checkmarkempty" color="#9e9e9e" size="22"></uni-icons>
								<text class="content">每个币种可发布购买/出售委托单各<text class="text-[#aaff7f]">2单</text></text>
							</view>
							<view class="my-list-row">
								<uni-icons type="checkmarkempty" color="#9e9e9e" size="22"></uni-icons>
								<text class="content">单笔委托单限额<text class="text-[#aaff7f] ml-1">2,000,000
										CNY</text></text>
							</view>
						</view>
					</view>
					<view class="absolute bottom-10 text-center w-[100%]">
						<view class="px-4 mx-auto">
							<view class="text-sm">需缴纳<text class="text-[#aaff7f] mx-1">10,000 USDT</text>保证金</view>
							<button type="button" class="rounded-full mt-2" :class="{'bg-gray-400' : level1}"
								@click="submit(1)"><text
									class="text-base font-medium text-black">{{level1_text}}</text></button>
							<button type="button" class="rounded-full mt-2" v-if="userStore.user.shop_level == 1 || userStore.user.shop_level == 3"
									@click="exit(1)"><text
										class="text-base font-medium text-black">退出认证商家</text></button>	
						</view>
					</view>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<view class="relative bg-[#101010] h-[1050rpx] m-6  rounded-xl ">
					<view class="p-4 py-6">
						<view class="">
							<view class="flex justify-between">
								<view class="text-2xl">钻石商家</view>
								<view class="w-[40px] h-[40px] text-center bg-fuchsia-600 rounded-full">
									<uni-icons type="vip-filled" color="#fff" size="36"></uni-icons>
								</view>
							</view>
							<view class="py-2 text-[#ccc]">成为钻石商家，享受更多权益</view>
						</view>
						<view class="my-list">
							<view class="my-list-row">
								<uni-icons type="checkmarkempty" color="#9e9e9e" size="22"></uni-icons>
								<text class="content">更尊贵的商家认证标识</text>
							</view>
							<view class="my-list-row">
								<uni-icons type="checkmarkempty" color="#9e9e9e" size="22"></uni-icons>
								<text class="content">申请成功即刻解锁全部权益</text>
							</view>
							<view class="my-list-row">
								<uni-icons type="checkmarkempty" color="#9e9e9e" size="22"></uni-icons>
								<text class="content">大宗交易不占用可发布委托数量限额</text>
							</view>
							<view class="my-list-row">
								<uni-icons type="checkmarkempty" color="#9e9e9e" size="22"></uni-icons>
								<view class="content">单笔委托单限额升至<text class="text-[#aaff7f] ml-1">40,000,000 CNY</text>
								</view>
							</view>
						</view>
					</view>
					<view class="absolute bottom-10 text-center w-[100%]">
						<view class="px-4 mx-auto">
							<view class="text-sm">需缴纳<text class="text-[#aaff7f] mx-1">100,000 USDT</text>保证金</view>
							<button type="button" class="rounded-full mt-2" :class="{'bg-gray-400' : level2}"
								@click="submit(2)"><text class="text-base font-medium">{{level2_text}}</text></button>
							<button type="button" class="rounded-full mt-2" v-if="userStore.user.shop_level == 2 || userStore.user.shop_level == 3"
										@click="exit(2)"><text
											class="text-base font-medium text-black">退出钻石商家</text></button>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="h-[100px]"></view>
	</view>
</template>

<script setup>
	import {
		computed,
		ref
	} from 'vue';
	import {
		useUserStore
	} from '@/stores/modules/user';
	import {
		onShow
	} from '@dcloudio/uni-app';
	import project from "@/utils/project";
	
	const current = ref(0)
	const swipeIndex = (index) => {
		console.log('index')
	}
	let userStore = useUserStore();

	const level1 = computed(() => {
		return userStore.user.shop_level == 1 || userStore.user.shop_level == 3;
	})

	const level2 = computed(() => {
		return userStore.user.shop_level == 2 || userStore.user.shop_level == 3;
	})

	const level1_text = computed(() => {
		return level1.value == true ? '已成为商家' : '立即申请'
	})

	const level2_text = computed(() => {
		return level2.value == true ? '已成为商家' : '立即申请'
	})

	const submit = (level_id) => {
		if (userStore.user.shop_level >= level_id) {
			return uni.$u.toast('您已经成为商家，无需重复申请');
		}
		uni.$u.http.post('/c2cShop', {
			shop_level: level_id
		}).then(user => {						
			// uni.navigateBack();
			uni.$u.toast("申请成功");
			// userStore.setUserValue("shop_level", user.shop_level)
			userStore.setUser(user)
		})
	}
	
	const exit = (level_id) => {
		uni.$u.http.post('/c2cShop/exit', {
			shop_level: level_id
		}).then(user => {						
			// uni.navigateBack();
			uni.$u.toast("退出成功");
			// userStore.setUserValue("shop_level", user.shop_level)
			userStore.setUser(user)
		})
	}
	
	// onShow(() => {
	// 	project.getUser();
	// })
</script>

<style lang="scss">
	page {
		background-color: #000;
		color: #fff;
	}

	.swiper {
		height: 1200rpx;
	}

	.swiper-item {
		width: 100%;
		height: 1200rpx;

	}

	.my-list {
		margin-top: 10px;
	}

	.my-list-row {
		padding: 15rpx 0;
		display: flex;
		align-items: center;

		.content {
			margin-left: 10px;
			font-size: 16px;
		}
	}
</style>