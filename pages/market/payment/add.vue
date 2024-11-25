<template>
	<view>
		<com-nav-bar title="新增收款方式" :border="true" backgroundColor="#fff"></com-nav-bar>
		<view class="add-info">
			<view class="add-info_content">请确保使用与实名认证相同用户名的支付信息</view>
		</view>
		<view class="content">
			<view class="payment">
				<view class="payment_tip">请选择一种收款方式</view>
				<view class="payment_box">
					<view class="payment_item" :class="{'payment_active': selectedPay == '银行卡'}" @click="selectedPay = '银行卡'">
						<view class="payment_item_name">银行卡</view>
					</view>
					<view class="payment_item" :class="{'payment_active': selectedPay == '支付宝'}" @click="selectedPay = '支付宝'">
						<view class="payment_item_name">支付宝</view>
					</view>
					<view class="payment_item" :class="{'payment_active': selectedPay == '微信'}" @click="selectedPay = '微信'">
						<view class="payment_item_name">微信</view>
					</view>
				</view>
			</view>
			<view class="payment_pay-tip">某些支付方式可能会有支付服务提供商设定的手续费和每日限额，请联系支付服务提供商了解详情。</view>
			
			<view class="form-list">
				
				<com-input label="姓名" :value="userStore.user.identity ? userStore.user.identity.nickname : ''" :disabled="true" placeholder="请输入姓名"></com-input>
				<view v-if="selectedPay == '银行卡'">
					<com-input label="银行账号" v-model="formData.bankNumber" placeholder="请输入银行账号"></com-input>
					<com-input label="开户银行" v-model="formData.bankName" placeholder="请输入开户银行"></com-input>
				</view>
				<template v-if="selectedPay == '支付宝'">
					<com-input label="支付宝账号" v-model="formData.alipay" placeholder="请填写支付宝账号"></com-input>
					<com-input-img label="收款二维码" v-model="formData.alipayQrcode"></com-input-img>
				</template>
				<template v-if="selectedPay == '微信'">
					<com-input label="微信账号" v-model="formData.weixin" placeholder="请填写微信账号"></com-input>
					<com-input-img label="收款二维码" v-model="formData.weixinQrcode"></com-input-img>
				</template>
			</view>
			
			<!-- <view class="">
				<view>短信(188****9999)</view>
				<com-input-code v-model:code="formData.code"></com-input-code>
			</view> -->
		</view>
		
		<view class="n-bottom-white">
			<button type="button" class="n-btn" @click="onsubmit">完成添加</button>
		</view>		
	</view>
	
</template>

<script setup lang="ts">
	import { reactive, ref } from "vue";
	import { useUserStore } from "@/stores/modules/user";

	let userStore = useUserStore();

	const selectedPay = ref("银行卡")

	const formData = reactive({
		bankAccount: '',
		bankNumber: '',
		bankName: '',
		alipay: '',
		weixin: '',
		code: '',
		payType: selectedPay.value,
		alipayQrcode: '',
		weixinQrcode: '',
	})


	const show = ref(false);
	const select = (item : any) => {
		selectedPay.value = item;
		show.value = false;
	}
	const close = () => {
		show.value = false;
	}


	//提交
	const onsubmit = () => {
		let data = {}
		if (selectedPay.value == "银行卡") {
			if (formData.bankName == '') {
				uni.$u.toast('请输入开户银行');
				return false;
			}
			if (formData.bankNumber == '') {
				uni.$u.toast('请输入银行卡号');
				return false;
			}
			data = {
				type: 'bank',
				name: formData.bankName,
				number: formData.bankNumber
			}
		}
		else if (selectedPay.value == "支付宝") {
			if (formData.alipay == '') {
				uni.$u.toast('请填写支付宝账号');
				return false;
			}
			if (formData.alipayQrcode == '') {
				uni.$u.toast('请上传支付宝收款码');
				return false;
			}
			data = {
				type: 'alipay',
				qrcode: formData.alipayQrcode,
				number: formData.alipay
			}
		}
		else if (selectedPay.value == "微信") {
			if (formData.weixin == '') {
				uni.$u.toast('请填写微信账号');
				return false;
			}
			if (formData.weixinQrcode == '') {
				uni.$u.toast('请上传微信收款码');
				return false;
			}
			data = {
				type: 'wechat_pay',
				qrcode: formData.weixinQrcode,
				number: formData.weixin
			}
		}
		
		uni.$u.http.post('/userPayment', data).then(res => {
			uni.$u.toast('添加成功');
			uni.navigateBack()
		})
	}
</script>

<style lang="scss" scoped>
	.add-info {
		width: 750rpx;
		height: 50rpx;
		background: #F8E6E8;
		
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		
		&_content {
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 24rpx;
			color: #FC465C;
		}
	}
	
	.content {
		padding: 0 28rpx;
		
		
		
		.payment {
			padding-top: 49rpx;
			
			&_tip {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 28rpx;
				color: #000000;
				opacity: 0.6;
			}
			
			&_box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				padding-top: 30rpx;
			}
						
			&_item {
				width: 200rpx;
				height: 66rpx;
				background: #F2EDF8;
				border-radius: 8rpx;
				
				display: flex;
				justify-content: center;
				align-items: center;
				
				&_name{
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 28rpx;
					color: #666;
				}
			}
			
			&_active {
				background: #FFFFFF !important;
				
				border: 1rpx solid #7F17FE;
				
				.payment_item_name {
					color: #7F17FE;
				}
			}
			
			&_pay-tip {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 22rpx;
				color: #000000;
				opacity: 0.4;
				
				padding-top: 42rpx;
			}
		}
		
		.form-list {
			padding-top: 90rpx;
		}
	}

	
</style>