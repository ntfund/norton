<template>
	<view class="">
		<com-nav-bar title="交易详情" :border="true" backgroundColor="#fff"></com-nav-bar>
		<view class="amount">
			{{isMe(data.from) ? '- ' : '+ '}}{{tools.fromWei(data.amount, data.decimals)}} {{data.symbol}}
		</view>
		<view class="status">
			<image src="@/static/images/wallet/success-icon@2x.png" mode="aspectFit"
				style="width: 27rpx; height: 28rpx;" v-if="data.result"></image>
			<image src="@/static/images/wallet/error@2x.png" mode="aspectFit" style="width: 28rpx; height: 28rpx;"
				v-else>
			</image>
			<view class="status_txt" :class="[data.result ? 'status_success' : 'status_fail']">完成</view>
		</view>
		<view class="row-list">
			<view class="row-row">
				<view class="title flex items-center">主网络</view>
				<view class="row-row-row">
					<view class="row-content flex items-center">
						<view class="bg-black py-[10rpx] px-[15rpx] text-white" style="border-radius: 8rpx;">{{walletStore.chain.tag}}
						</view>
					</view>
				</view>
			</view>
			<view class="row-row">
				<view class="title">发起方</view>
				<view class="row-row-row">
					<view class="row-content">
						<view class="row-content_address">{{data.from}}</view>
					</view>
					<view class="copy" @click="tools.copyClick(data.from)">
						<image src="@/static/images/wallet/copy-fill@2x.png" mode="aspectFit"
							style="width: 26rpx; height: 26rpx;"></image>
					</view>
				</view>
			</view>
			<view class="row-row">
				<view class="title">地址</view>
				<view class="row-row-row">
					<view class="row-content">
						<view class="row-content_address">{{data.to}}</view>
					</view>
					<view class="copy" @click="tools.copyClick(data.to)">
						<image src="@/static/images/wallet/copy-fill@2x.png" mode="aspectFit"
							style="width: 26rpx; height: 26rpx;"></image>
					</view>
				</view>
			</view>
			<!-- 			<view class="row-row">
				<view class="title">网络费</view>
				<view class="row-content">0.01TRX</view>
			</view> -->
			<view class="row-row">
				<view class="title">哈希值</view>
				<view class="row-row-row">
					<view class="row-content">
						<view class="row-content_address row-content_dashed">{{data.hash}}</view>
					</view>
					<view class="copy" @click="tools.copyClick(data.hash)">
						<image src="@/static/images/wallet/copy-fill@2x.png" mode="aspectFit"
							style="width: 26rpx; height: 26rpx;"></image>
					</view>
				</view>
			</view>
			<view class="row-row">
				<view class="title">区块哈希</view>
				<view class="row-content">
					<view class="row-content_address">
						{{data.block}}
					</view>
				</view>
			</view>
			<view class="row-row" v-if="[2].includes(walletStore.chain.id)">
				<view class="title">网络手续费</view>
				<view class="row-content break-words">{{tools.fromWei(data.fee, walletStore.chain.decimals)}} {{walletStore.chain.symbol}}</view>
			</view>
			<view class="row-row">
				<view class="title">交易时间</view>
				<view class="row-content">{{tools.timestampToTime(data.time / 1000, 'Y-m-d H:i:s')}}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import tools from '../../utils/tools';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
	const props = defineProps(['tx', 'account']);
	const data = ref({
		block: '',
		amount: '',
		from: '',
		to: '',
		result: '',
		time: '',
		hash: '',
		decimals: '',
		symbol: ''
	})
	if (props.tx) {
		console.log('props.tx', props.tx)
		data.value = JSON.parse(decodeURIComponent(props.tx))
	}

	const walletStore = useWalletStore();

	const isMe = (from) => {
		return from.toLowerCase() == props.account.toLowerCase()
	}
</script>

<style lang="scss" scoped>
	.amount {
		text-align: center;
		margin-top: 86rpx;

		font-family: DIN-Bold;
		font-weight: 400;
		font-size: 60rpx;
		color: #2B2D3C;
	}

	.status {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;

		margin-top: 22rpx;

		&_txt {
			margin-left: 17rpx;
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 30rpx;
		}

		&_success {
			color: #00C688;
		}

		&_fail {
			color: #FC465C;
		}
	}

	.row-list {
		padding: 28rpx;
		margin-top: 50rpx;

		.row-row {
			display: flex;
			// flex-direction: column;
			justify-content: space-between;

			margin: 59rpx 5px;

			.title {
				color: #999;
			}

			.row-row-row {
				display: flex;

				.copy {
					margin-left: 17rpx;
					display: flex;
					align-items: center;
				}
			}

			.row-content {

				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 30rpx;
				color: #000000;

				&_address {
					// flex-wrap: wrap;

					max-width: 422rpx;
					// white-space: pre-wrap;
					word-break: break-all;

				}

				&_dashed {
					text-decoration: underline;
					// text-decoration: overline red;
					// text-decoration: none;
					text-decoration-color: #999
				}

			}
		}
	}
</style>