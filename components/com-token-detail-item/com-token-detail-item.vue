<template>
	<view>
		<view class="swiper-item-item items-center justify-between text-sm">
			<view class="flex items-center">
				<!-- <view class="bg-green-500 flex items-center justify-center rounded-full" v-if="isMe()"
					style="width: 60rpx; height: 60rpx;">
					<view class="iconfont icon-upper-right-arrow text-white"></view>
				</view>
				<view class="bg-blue-500 flex items-center justify-center rounded-full" v-else
					style="width: 60rpx; height: 60rpx;">
					<view class="iconfont icon-lower-left-arrow text-white"></view>
				</view> -->
				<view class="flex items-center">
					<!-- <image src="@/static/images/wallet/in@2x(1).png" mode="aspectFit" style="width: 50rpx; height: 50rpx;"></image> -->
					<image src="@/static/images/wallet/out@2x.png" mode="aspectFit" style="width: 50rpx; height: 50rpx;" v-if="isMe()"></image>
					<image src="@/static/images/wallet/in@2x(1).png" mode="aspectFit" style="width: 50rpx; height: 50rpx;" v-else></image>
				</view>
				<view class="address flex flex-col items-start justify-center">
					<view class="address_account flex items-center">
						<view>
							{{tools.hideAccount(other(data), 12, 5)}}
						</view>
						<view class="flex items-center ml-[15rpx]">
							<image src="@/static/images/wallet/copy3@2x.png" mode="aspectFit" style="width: 22rpx; height: 22rpx;"
							@click.stop="tools.copyClick(other(data))"></image>
						</view>
					</view>
					<view class=" text-[22rpx] text-[#999]">
						{{tools.timestampToTime(data.time / 1000, 'Y-m-d  H:i:s')}}
					</view>
				</view>
			</view>
			<view :class="getIsMeColor()">
				<text>{{getIsMeAmount()}} {{data.symbol.toUpperCase()}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import tools from '@/utils/tools';
	const props = defineProps(['data', 'account'])
	/**
	 * 	block: transfer.block,
		amount: transfer.quant,
		from: transfer.from_address,
		to: transfer.to_address,
		result: transfer.confirmed,
		time: transfer.block_ts,
		hash: transfer.transaction_id,
		decimals: transfer.tokenInfo.tokenDecimal,
		symbol: transfer.tokenInfo.tokenName
	 */
	const other = () => {
		if (isMe()) {
			return props.data.to;
		}
		return props.data.from;
	}
	const isMe = () => {
		return props.account.toLowerCase() == props.data.from.toLowerCase()
	}
	const getIsMeAmount = () => {
		if (isMe()){
			return '-' + tools.fromWei(props.data.amount, props.data.decimals, props.data.symbol.toUpperCase() == 'USDT' ? 6 : 6)
		}
		return '+' + tools.fromWei(props.data.amount, props.data.decimals, props.data.symbol.toUpperCase() == 'USDT' ? 6 : 6)
	}
	const getIsMeColor = () => {
		if (isMe()){
			return 'isNotMe'
		}
		return 'isme'
	}
</script>

<style lang="scss" scoped>
	.swiper-item-item {
		display: flex;
		padding: 28rpx 0;
		border-bottom: 1rpx solid #EEEEEE;
	}
	
	.address {
		margin-left: 40rpx;
		
		&_account {
			font-family: Gilroy-Medium;
			font-weight: 500;
			font-size: 24rpx;
			color: #000000;
		}
	}
	
	.isme {		
		font-family: Gilroy-Medium;
		font-weight: 500;
		font-size: 30rpx;
		color: #00C688;
	}
	.isNotMe {
		font-family: Gilroy-Medium;
		font-weight: 500;
		font-size: 30rpx;
		color: #FC465C;
	}
</style>