<template>
	<view>
		<com-nav-bar title="钱包同步" backgroundColor="#fff" border="true"></com-nav-bar>
		<view class="sync-content flex flex-col items-center ">
			<image src="@/static/images/wallet/sync2@2x.png" mode="aspectFit" style="width: 116rpx; height: 115rpx;">
			</image>
			<view class="title">钱包同步</view>
			<view class="info">一键同步功能，旨在帮助用户快速的将其他网络的钱包同步到本网络，钱包同步过程均在本地进行，不会对资产安全造成影响。同步后，钱包名称、密码，保持一致</view>
		</view>
		<view class="select">
			请选择钱包网络
		</view>
		<view class="wallet-list">
			<view class="wallet-list_item" v-for="(item, index) in chainList" :key="index">
				<view class="wallet-list_item_left">
					<view class="icon flex items-center">
						<image :src="item.icon" mode="aspectFit" style="width: 60rpx; height: 60rpx;"></image>
					</view>
					<view class="">
						<view class="name">{{item.name}}</view>
						<view class="tip">可同步钱包</view>
					</view>
				</view>
				<view class="wallet-list_item_right">
					<com-radio v-model="item.checked"></com-radio>
				</view>
			</view>
		</view>
		<view class="n-bottom-white">
			<button type="button" class="n-btn" @click="confirmed">开始同步</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import chainData from '@/data/chainData';
	import dbWallet from '@/utils/dbWallet';

	const props = defineProps(["chain_id"])
	const chainList = ref([]);

	for (let item of chainData) {
		if (item.type != "eth") {
			continue;
		}
		chainList.value.push({
			...item,
			checked: item.id == props.chain_id
		})
	}

	const getSelecteChains = () => {
		let arr = [];
		for (let item of chainList.value) {
			if (props.chain_id != item.id && item.checked) {
				arr.push(item.id)
			}
		}
		return arr;
	}

	const confirmed = async () => {
		let arr = getSelecteChains();
		for (var i = 0; i < arr.length; i++) {
			await dbWallet.syncWallet(arr[i], props.chain_id)
		}
		uni.navigateBack({
			delta: 2
		})
	}
</script>

<style lang="scss" scoped>
	.sync-content {
		background: #fff;
		padding-top: 61rpx;

		.title {
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 32rpx;
			color: #000000;

			padding-top: 49rpx;
		}

		.info {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 24rpx;
			color: #000000;
			line-height: 36rpx;
			opacity: 0.6;

			padding: 31rpx 63rpx 57rpx 64rpx;
		}
	}

	.select {
		height: 100rpx;
		background: #EEEEEE;
		display: flex;
		align-items: center;
		padding-left: 29rpx;

		font-family: SourceHanSansCN-Regular;
		font-weight: 400;
		font-size: 30rpx;
		color: #010101;
	}

	.wallet-list {
		&_item {
			height: 100rpx;
			margin-left: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			border-bottom: 2rpx solid #EEEEEE;

			&_left {
				display: flex;
				align-items: center;

				.icon {
					margin-right: 22rpx;
				}

				.name {
					font-family: SourceHanSansCN-Medium;
					font-weight: 500;
					font-size: 28rpx;
					color: #000000;
				}

				.tip {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 24rpx;
					color: #000000;
					opacity: 0.6;
				}
			}

			&_right {
				margin-right: 32rpx;
			}
		}
	}
</style>