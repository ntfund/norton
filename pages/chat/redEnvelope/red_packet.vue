<template>
	<com-nav-bar title="发红包" backgroundColor="#cf3c35" color="white"></com-nav-bar>
	<view>
		<view class="content">
			<view class="content_container">
				<view class="form-item">
					<view class="form-item_view item flex justify-between items-center bg-white"
						@click="show = !show">
						<view class="left">币种</view>
						<view class="right flex  items-center">
							<!-- <u-icon name="grid" size="22" class="ml-2"></u-icon> -->
							<image :src="selectedCoin.icon" mode="widthFix" style="width: 40rpx; height: 40rpx;"></image>
							<view class="symbol">{{selectedCoin.name}}</view>
							<!-- <u-icon name="arrow-right" class="ml-2"></u-icon> -->
							<image src="@/static/images/wallet/arrow_down@2x.png" mode="aspectFit" style="width: 15rpx; height: 9rpx; margin-left: 43rpx;"></image>
						</view>
					</view>
					<view class="yue flex justify-end">余额: {{tools.unitConverter(balance, 2)}}</view>
				</view>
				
				<view class="form-item mt-[25px]">
					<view class="form-item_view">
						<view class="term left">
							单个金额
						</view>
						<view class="right">
							<input type="digit" class="input" v-model="formState.amount" placeholder="0.00" @input="checkValue" />
						</view>
					</view>
				</view>
				<view class="form-item mt-[10px]">
					<view class="form-item_view">
						
						<view class="left">
							<input type="text" class="input" maxlength="12" placeholder="恭喜发财" v-model="formState.blessing" />
						</view>
					</view>
				</view>
				<view class="flex justify-center items-center text-center mt-[52px]">
					<image :src="selectedCoin.icon" mode="widthFix" style="width: 60rpx; height: 60rpx;"></image>
					<text class="amount">{{tools.floorAmountMinDigits(formState.amount, 2)}}</text>
				</view>
				<view class="tip">
					24小时内未被领取，红包将退回钱包余额
				</view>
				<view class="btn-bottom">
					<view class="hand" @tap="hand" :class="{'disabled' : loading}">
						发红包
					</view>
				</view>
			</view>
		</view>
	</view>
	<com-choice-symbol-popup v-model:show="show" @change="change"></com-choice-symbol-popup>
	<com-verify-password v-model:show="showPassword" @success="success"></com-verify-password>
</template>

<script setup lanng="ts">
	import {
		nextTick,
		reactive,
		ref
	} from "vue";
	import {
		useBalanceStore
	} from '@/stores/modules/userBalance'
	import tools from '@/utils/tools'
	import project from "../../../utils/project";
	import {
		useUserStore
	} from "@/stores/modules/user";

	const props = defineProps(['room_id'])
	const typeClass = ref('luck')
	const number = ref('')
	const money = ref('')
	const luckMoney = ref('')
	const blessing = ref('')
	const loading = ref(false)
	const showPassword = ref(false)

	let formState = reactive({
		amount: '',
		blessing: '',
		token_id: 7,
		number: 1,
		type: 'normal'
	})

	const userBalanceStore = useBalanceStore()

	let selectedCoin = ref({
		id: 7,
		name: 'USDT',
		icon: '/static/img/usdt.png'
	})

	const balance = ref(userBalanceStore.getBalance(selectedCoin.value.id))
	const show = ref(false);
	const change = (item) => {
		console.log('change', item)
		selectedCoin.value = item;
		balance.value = userBalanceStore.getBalance(selectedCoin.value.id)
		formState.token_id = selectedCoin.value.id
	}
	
	let redEnvelopeData = reactive({
		room_id: props.room_id,
		blessing: formState.blessing,
		token_id: formState.token_id,
		total: formState.amount,
		number: 1,
		type: 'normal'
	})
	const hand = () => {
		redEnvelopeData = {
			room_id: props.room_id,
			blessing: formState.blessing,
			token_id: formState.token_id,
			total: formState.amount,
			number: 1,
			type: 'normal'
		}
		//判断数据有效性
		if ((!redEnvelopeData.total) || redEnvelopeData.total <= 0) {
			return uni.showToast({
				title: "金额不能为空",
				icon: 'none'
			});
		}
		if (redEnvelopeData.total > balance.value) {
			return uni.showToast({
				title: "可用余额不足",
				icon: 'none'
			});
		}
		redEnvelopeData.blessing = redEnvelopeData.blessing || '恭喜发财'; //没填写则默认恭喜发财
		
		showPassword.value = true

	}
	
	const success = () => {
		//此处实际应用时应该post到服务器，然后服务器广播长连接
		//模板借由本地缓存实现效果，实际应用中请不要使用此方法。 
		uni.showLoading({
			title: '提交中'
		});
		
		uni.$u.http.post('/chat/chatRedEnvelope', redEnvelopeData).then(res => {
			loading.value = false;
			userBalanceStore.decrement(redEnvelopeData.token_id, redEnvelopeData.total);
			uni.hideLoading();
			uni.navigateBack();
		})
	}

	const checkValue = async (e) => {
		console.log('checkValue', e)
		// amount.value = amount.value.replace(/^(\-)*(\d+)\.(\d{2}).*$/, '$1$2.$3'); // 清除“数字”和“.”以外的字符
		let price = '' + formState.amount;
		price = price
			.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
			.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
			.replace('.', '$#$')
			.replace(/\./g, '')
			.replace('$#$', '.')
			.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
		if (price.indexOf('.') < 0 && price != '') {
			// 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
			price = parseFloat(price);
		}
		await nextTick();
		formState.amount = price;
	}
</script>

<style lang="scss">
	
	page {
		background-color: #FFF9E9;
	}
	
	.content {
		background: #cf3c35;
		
		&_container {
			padding: 38rpx 28rpx;			
			border-radius: 24rpx 24rpx 0px 0px;			
			background: #FFF9E9;
			
			
			.form-item {				
				
				&_view {
					background-color: #fff;
					height: 100rpx;
					
					display: flex;
					justify-content: space-between;
					align-items: center;
					
					.left {
						padding-left: 35rpx;
						
						font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 32rpx;
						color: #000000;
						
						.input {
							text-align: left;
						}
					}
					
					.right {
						margin-right: 32rpx;
						
						
						.input {
							text-align: right;
						}
					}
					
					.input {
						// font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 28rpx;
					}
				}
				
				.yue {
					font-family: Gilroy-Regular;
					font-weight: 400;
					font-size: 24rpx;
					color: #000000;
					margin-top: 10rpx;
					
					margin-right: 32rpx;
				}
				
				.symbol {
					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 30rpx;
					color: #010101;
					
					margin-left: 20rpx;
				}
			}
			
			.amount {
				font-family: Gilroy-Bold;
				font-weight: bold;
				font-size: 60rpx;
				color: #000000;
				
				margin-left: 20rpx;
				
			}
			
			
			.tip {
				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 24rpx;
				color: #000000;
				opacity: 0.4;
				
				text-align: center;
				
				margin-top: 80rpx;
			}
		}
		
		.hand {
			width: 630rpx;
			height: 100rpx;
			background: #cf3c35;
			border-radius: 8rpx;
			
			margin: 0 auto;

			display: flex;
			align-items: center;
			justify-content: center;
			
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 34rpx;
			color: #FFFFFF;
		}
	}
	
</style>