<template>
	<view>
		<com-nav-bar title="备份助记词"></com-nav-bar>
		<view class="content">
			<view class="content_tip">
				<image src="@/static/images/wallet/fengxian@2x.png" mode="aspectFit"
					style="width: 168rpx; height: 180rpx; margin-top: 136rpx;"></image>
			</view>
			<view class="content_tips">
				<view class="content_tips_title">备份助记词，保障钱包安全</view>
				<view class="content_tips_li">获取助记词等于拥有钱包资产所有权</view>
				<view class="content_tips_li">如果我弄丢了助记词，我的资产将永远丢失！</view>
				<view class="content_tips_li">如果我向任何人透露或分享我的助记词，我的资产可能会被盗！</view>
				<view class="content_tips_li">保护好助记词的安全的责任全部在于我！</view>
			</view>
		</view>

		<view class="btn-bottom">
			<button type="button" class="n-btn " @click="ok">生成助记词</button>
		</view>

		<com-wallet-create v-model:wallet.sync="walletNew" :chain_id="props.chain_id"></com-wallet-create>
	</view>
</template>

<script setup>
	import {
		computed,
		onMounted,
		reactive,
		ref
	} from 'vue';
	import tools from '@/utils/tools';

	const props = defineProps(['chain_id'])
	console.log('tip chain_id', props.chain_id)

	const walletNew = reactive({
		address: '',
		privateKey: '',
		mnemonic: '',
	})

	const ok = () => {
		if (!walletNew.address) {
			tools.toastError('生成助记词出错');
			return;
		}
		tools.navigateToWithEncode('/pages/wallet/backup/backup', walletNew)
	}
</script>

<style lang="scss" scoped>
	.content {
		&_tip {
			display: flex;
			justify-content: center;
		}

		&_tips {
			margin-top: 82rpx;
			padding: 0 33rpx;

			&_title {
				font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 40rpx;

				display: flex;
				justify-content: center;

				margin-bottom: 69rpx;
			}

			&_li {
				font-family: Source Han Sans CN;
				font-weight: 400;
				font-size: 28rpx;

				color: #000000;
				opacity: 0.8;

				margin-bottom: 53rpx;

				padding-left: 30rpx;
				padding-right: 30rpx;

				position: relative;
			}

			&_li:before {
				content: "";
				width: 6px;
				height: 6px;
				display: inline-block;
				border-radius: 50%;
				background: #FC465C; //这里不是color
				vertical-align: middle;
				margin-right: 17rpx;
			}

		}
	}
</style>