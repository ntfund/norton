<template>
	<view>
		<u-popup :show="show" @close="close" mode="bottom" :round="20">
			<view class="title">
				<view class="left">订单确认</view>
				<view class="right" @click="close()">
					<image src="@/static/images/wallet/close@2x.png" mode="aspectFill"
						style="width: 28rpx; height: 28rpx;"></image>
				</view>
			</view>

			<view class="content">
				<view class="item-row">
					<view class="left">认购类型</view>
					<view class="right">{{data.cycle == 0 ? '活期' : '定期'}}</view>
				</view>
				<view class="item-row">
					<view class="left">认购天数</view>
					<view class="right">{{data.cycle == 0 ? '灵活存取' : data.cycle + ' DAY'}}</view>
				</view>
				<view class="item-row">
					<view class="left">支付方式</view>
					<view class="right highlight" @click="swtich">{{data.payType == 1 ? '钱包支付' : '余额支付'}}</view>
				</view>
				<view class="item-row">
					<view class="left">认购金额</view>
					<view class="right">
						<view class="amount">{{data.buyAmount}} USDT</view>
					</view>
				</view>
				<view class="n-btn-full mt-4" @click="confirm">
					确认
				</view>
			</view>
		</u-popup>

		<com-order-confirm-pay :data="props.data" v-model:show="showPay" @success="success"></com-order-confirm-pay>
		<com-verify-password v-if="showPassword" v-model:show="showPassword" @success="success"></com-verify-password>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		useUserStore
	} from '@/stores/modules/user';
	import {
		addOrder
	} from '@/config/api';
	import project from '@/utils/project';
	import tools from '@/utils/tools';
	import i18n from '@/lang/';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';
import dbHelper from '../../utils/dbHelper';
import dbToken from '../../utils/dbToken';
	
	const {
		locale,
		t
	} = i18n.global

	const props = defineProps(["data", "show"])
	const emit = defineEmits("update:show", "update:data")
	const showPay = ref(false)
	const showPassword = ref(false)
	const walletStore = useWalletStore();
	console.log('props.data', props.data)


	const close = () => {
		emit('update:show', false)
	}

	const swtich = () => {
		let newData = props.data;
		if (props.data.payType == 1) {
			newData.payType = 2;
		} else {
			newData.payType = 1;
		}
		emit("update:data", newData)
	}

	const confirm = () => {
		if (props.data.payType == 1) {
			showPay.value = true;
		} else {
			showPassword.value = true;
		}
	}

	//身份验证成功后
	const success = async (hash = null) => {
		console.log('身份验证成功')
		let usdtToken = await dbToken.getTokenBy({chain_id: walletStore.chain.id, symbol: 'USDT'})
		//向服务器提交订单申购
		let formData = {
			good_id: props.data.id,
			amount: props.data.buyAmount,
			pay_type: props.data.payType,
			chain_id: walletStore.chain.id,
			token_id: usdtToken.id
		}
		if (hash) {
			formData.hash = hash;
		}
		addOrder(formData).then(res => {
			console.log('addOrder res', res)
			// project.getUser()
			tools.toastSuccess(t('message.buySuccess'));
			close();

			uni.switchTab({
				url: '/pages/financial/index'
			})
		})
	}
</script>

<style lang="scss" scoped>
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.left {
			font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 38rpx;
			color: #0A0A0A;
			line-height: 46rpx;
		}

		margin: 40rpx 30.33rpx;
	}

	.content {
		padding: 33.33rpx;
		padding-top: 0;

		.title {
			display: flex;
			justify-content: space-between;
			font-weight: 500;
			font-size: 33.33rpx;
		}

		.amount {
			font-family: Gilroy-Bold;
			font-weight: bold;
			font-size: 36rpx;
			color: #7F17FE;
		}

		.item-row {
			width: 100%;

			// align-items: flex-start;
			// width: calc(750rpx - 66.66rpx);
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			font-size: 27.2rpx;

			.left {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 22rpx;
				color: #000000;
				opacity: 0.6;
			}

			.right {
				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 24rpx;
				color: #000000;
			}

			padding: 15px 0;
			border-bottom: 1px solid #efefef;
		}

		.btn-primary {
			background: #2880fe;
			padding: 10px;
			color: white;
			justify-content: center;
			display: flex;
			border-radius: 10px;

			margin: 30px 0 10px 0;
			font-size: 33rpx;
		}

		.highlight:active {
			color: #7F17FE;
		}

	}
</style>