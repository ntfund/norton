<template>
	<view>
		<com-nav-bar title="钱包详情" :border="true" backgroundColor="#fff"></com-nav-bar>
		<view class="wallet-row flex justify-between items-center" @click="editName">
			<view>
				<image src="/static/logo.png" class="rounded-full" style="width: 84rpx; height: 84rpx;" mode="widthFix">
				</image>
			</view>
			<view class="flex flex-col flex-1 middle">
				<view class="flex">
					<view class="name">{{wallet.name}}</view>
					<u-icon name="edit-pen" size="22" class="ml-1" @click.stop="editName"></u-icon>
				</view>
				<view class="flex items-end address">
					<view>{{tools.hideAccount(wallet.address, 8, 9)}}</view>
					<view class="ml-[24rpx]" @click.stop="tools.copyClick(wallet.address)">
						<image src="@/static/images/wallet/copy2@2x.png" mode="aspectFit"
							style="width: 23rpx; height: 23rpx;"></image>
					</view>
				</view>
			</view>
			<view class="right">
				<image src="@/static/images/chat/arrow-right@2x.png" style="width: 12rpx; height: 20rpx;"
					mode="aspectFit"></image>
			</view>
		</view>

		<view class="mt-[20rpx] bg-white">
			<view class="item-row flex justify-between item-row_bottom" v-if="wallet.mnemonic"
				@click="exportData('mnemonic')">
				<view>导出助记词</view>
				<view>
					<image src="@/static/images/chat/arrow-right@2x.png" style="width: 12rpx; height: 20rpx;"
						mode="aspectFit"></image>
				</view>
			</view>
			<view class="item-row flex justify-between item-row_bottom" v-if="wallet.private_key"
				@click="exportData('privateKey')">
				<view>导出私钥</view>
				<view>
					<image src="@/static/images/chat/arrow-right@2x.png" style="width: 12rpx; height: 20rpx;"
						mode="aspectFit"></image>
				</view>
			</view>
			<view class="item-row flex justify-between" v-if="wallet.keystore" @click="exportData('keystore')">
				<view>导出 Keystore</view>
				<view>
					<image src="@/static/images/chat/arrow-right@2x.png" style="width: 12rpx; height: 20rpx;"
						mode="aspectFit"></image>
				</view>
			</view>
		</view>

		<view class="mt-[80rpx] w-[100%]" v-if="canDelete">
			<view class="">
				<button type="button" class="delete_btn" @click="show=true">
					<text class="delete_btn_text">删除钱包</text>
				</button>
			</view>
		</view>

		<u-modal :show="show" title="" :content='content' confirmText="删除" showCancelButton confirmColor="#ff0000"
			@confirm="deleteClick" @cancel="show = false" closeOnClickOverlay @close="show = false"></u-modal>

		<!-- 输入框示例 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="更换钱包名" v-model:value="wallet.name"
				placeholder="请输入名称" @confirm="editNameConfirm"></uni-popup-dialog>
		</uni-popup>
		
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	import tools from '@/utils/tools';
	import dbWallet from '@/utils/dbWallet';
	const show = ref(false)
	const canDelete = ref(false);

	const inputDialog = ref(null)

	const props = defineProps(['wallet', 'chain_id']);
	let wallet = ref(JSON.parse(decodeURIComponent(props.wallet)));

	const content = ref('确定删除钱包吗？');
	const deleteClick = async () => {
		//删除本地钱包
		show.value = false;
		await dbWallet.deleteWallet(wallet.value.address, props.chain_id);
					
		uni.navigateBack({
			delta: 2
		});
	}

	//导出
	const exportData = (page) => {
		tools.navigateToWithEncode('/pages/wallet/export/' + page, wallet.value)
	}

	const editName = () => {
		inputDialog.value.open()
	}
	//修改钱包名称
	const editNameConfirm = async (val) => {
		console.log(val)
		console.log(wallet.value.name)
		wallet.value.name = val
		await dbWallet.updateWalletName(val, wallet.value.address, props.chain_id)
	}

	onMounted(async () => {
		let list = await dbWallet.getWallets(props.chain_id);
		canDelete.value = list && list.length > 1
	})
</script>

<style lang="scss" scoped>
	page {
		background-color: $uni-bg-color-grey;
	}

	.wallet-row {
		background: #FFFFFF;
		padding: 29rpx 28rpx;

		.middle {
			margin-left: 30rpx;

			.name {
				font-family: Gilroy-Bold;
				font-weight: bold;
				font-size: 32rpx;
				color: #000000;
			}

			.address {
				height: 40rpx;
				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 26rpx;
				color: #B2B2B2;

			}
		}
	}

	.item-row {
		background-color: #fff;
		padding: 35rpx 0;
		margin: 0 28rpx;

		font-family: SourceHanSansCN-Medium;
		font-weight: 500;
		font-size: 32rpx;
		color: #000000;

	}

	.item-row_bottom {
		border-bottom: 1rpx solid #EEEEEE;
	}

	.delete_btn {
		// padding: 18px 0;
		outline: none;
		border: none;
		background: #FFFFFF;
		box-shadow: none;

		width: 750rpx;
		height: 100rpx;
		background: #FFFFFF;

		&_text {
			width: 118rpx;
			height: 29rpx;
			font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 30rpx;
			color: #FC465C;
			// line-height: 33px;
		}
	}

	.delete_btn::after {
		border: none;
	}
</style>