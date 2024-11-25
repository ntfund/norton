<template>
	<view>
		<com-nav-bar title="导出助记词" :border="true"></com-nav-bar>
		<com-wallet-tab v-model:current="current" :list="['助记词', '二维码']" style="margin: 0 28rpx;"></com-wallet-tab>
		<view class="content">
			<view class="text-1">获取助记词等于拥有钱包资产所有权</view>
			<view v-if="current == 0">
				<view class="content_words">
					<view class="content_words_item" :class="'content_words_item' + (index + 1)"
						v-for="(item, index) in words">
						<view class="index">{{index + 1}}</view>
						<view class="word">{{item}}</view>
					</view>
				</view>
				<view class="flex justify-center">
					<view class="copy-btn">复制助记词</view>
				</view>
			</view>
			<view v-else class="pt-[38rpx]">
				<com-qrcode :data="wordStr"></com-qrcode>
			</view>
			<view class="row-item mt-[40rpx]">
				<view class="row-item_title">离线保存</view>
				<view class="row-item_info">切勿保存至邮箱、记事本、网盘、聊天工具等，非常危险</view>
			</view>
			<view class="row-item">
				<view class="row-item_title">切勿使用网络传输</view>
				<view class="row-item_info">请勿通过网络工具传输，一旦被黑客获取将造成不可挽回的资产损失。建议离线设备通过二维码方式传输。</view>
			</view>
			<view class="row-item">
				<view class="row-item_title">密码管理工具保存</view>
				<view class="row-item_info">建议使用密码管理工具管理</view>
			</view>
		</view>

		<view class="btn-bottom">
			<button type="button" class="n-btn " @click="ok">已确认备份</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import secret from '@/utils/secret';

	const props = defineProps(['params']);
	let wallet = JSON.parse(decodeURIComponent(props.params));

	const current = ref(0)
	// const wordStr = ref('divide  evolve  feel  into  say  hi  fuck  made  cao  go  fell  youck')
	const wordStr = secret.decrypt(wallet.mnemonic)
	const words = wordStr.split(' ')

	const ok = () => {
		uni.navigateBack({
			delta: 3
		})
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F8F8F8;
	}

	.content {
		.text-1 {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 28rpx;
			color: #000000;
			opacity: 0.8;

			margin: 53rpx 28rpx 0 29rpx;
		}

		&_words {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: repeat(4, 90rpx);

			margin: 44rpx 28rpx 42rpx 28rpx;
			border-radius: 16rpx;

			border: 1rpx solid #EEEEEE;

			// justify-items: stretch;
			// align-items: stretch;
			// place-content: stretch;

			&_item {
				// background: green;

				display: flex;
				align-items: center;
				justify-content: center;

				border: 1rpx solid #EEEEEE;


				.index {
					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 32rpx;
					color: #666666;
				}

				.word {
					font-family: Gilroy-Bold;
					font-weight: 500;
					font-size: 32rpx;
					color: #000000;
					margin-left: 10rpx;
				}
			}

			&_item1 {
				border-top-left-radius: 16rpx;
			}

			&_item3 {
				border-top-right-radius: 16rpx;
			}

			&_item10 {
				border-bottom-left-radius: 16rpx;
			}

			&_item12 {
				border-bottom-right-radius: 16rpx;
			}
		}

		.copy-btn {
			display: flex;
			justify-content: center;
			align-items: center;

			padding: 14rpx 26rpx;
			font-family: SourceHanSansCN-Medium;
			font-weight: 600;
			font-size: 26rpx;
			color: #7F17FE;

			border-radius: 8rpx;
			border: 2rpx solid #7F17FE;
			width: 180rpx;
		}

		.copy-btn:active {
			background: #cdcdcd;
		}

		.row-item {
			padding: 0 28rpx;
			margin-bottom: 49rpx;

			&_title {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 30rpx;
				color: #1D2637;
			}

			&_info {
				margin-top: 10rpx;

				font-family: Source Han Sans CN;
				font-weight: 400;
				font-size: 26rpx;
				color: #999999;
			}
		}
	}
</style>