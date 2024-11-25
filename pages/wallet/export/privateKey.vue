<template>
	<view>
		<com-nav-bar title="导出钱包" :border="true"></com-nav-bar>
		<com-wallet-tab v-model:current="current" :list="['私钥', '二维码']" style="margin: 0 28rpx;"></com-wallet-tab>
		<view class="content">
			<view class="text-1">获取私钥等于拥有钱包资产所有权</view>
			<view v-if="current == 0">
				<view class="input-box">
					<textarea class="input-box_textarea" :value="privateKey" placeholder="明文私钥或扫码二维码" disabled
						cursor-spacing="20" />
				</view>
			</view>
			<view v-else class="pt-[38rpx]">
				<com-qrcode :data="privateKey"></com-qrcode>
			</view>
			<view class="row-item mt-[93rpx]">
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
			<button type="button" class="n-btn " @click="ok">拷贝 Private Key</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import secret from '@/utils/secret';
	import tools from '@/utils/tools';

	const props = defineProps(['params']);
	let wallet = JSON.parse(decodeURIComponent(props.params));

	const current = ref(0)
	const privateKey = secret.decrypt(wallet.private_key)

	const ok = () => {
		tools.copyClick(privateKey)
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

		.input-box {
			// width: 694rpx;
			height: 150rpx;
			background: #FFFFFF;
			box-shadow: 0px 4rpx 10rpx 0rpx rgba(11, 16, 29, 0.2);
			border-radius: 8rpx;

			margin: 42rpx 28rpx 42rpx 28rpx;

			position: relative;

			&_textarea {
				padding: 33rpx;
				height: 110rpx;

				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 24rpx;
				color: #666;
			}

			&_zhantie {
				position: absolute;
				z-index: 1;
				right: 29rpx;
				bottom: 19rpx;

				color: #7F17FE;
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