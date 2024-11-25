<template>
	<com-nav-bar title="支付宝修改"></com-nav-bar>
	<view class="p-4">
		<com-input label="姓名" :disabled="true" v-model="formData.account"></com-input>
		<com-input label="支付宝账号" v-model="formData.number" placeholder="请输入支付宝账号"></com-input>
		<com-input-img label="二维码" v-model="formData.qrcode"></com-input-img>
		<!-- 		<view class="">
			<view>短信(188****9999)</view>
			<com-input-code v-model:code="formData.code"></com-input-code>
		</view> -->
	</view>
	<view class="btn-bottom">
		<button type="button" class="n-btn" @click="confirmed">保存</button>
	</view>
</template>

<script setup lang="ts">
	import { reactive } from "vue";
	const props = defineProps(['params']);
	const formData = JSON.parse(decodeURIComponent(props.params));
	// const formData = reactive({
	// 	id: 0,
	// 	bankAccount: '',
	// 	backName: '中国工商银行',
	// 	backNumber: '6220421545645655544',
	// 	code: '',
	// 	qrCode: '',
	// })

	const confirmed = () => {
		uni.$u.http.put('/userPayment/' + formData.id, formData).then(res => {
			uni.$u.toast('修改成功');
			uni.navigateBack({
				delta: 2
			})
		})
	}
</script>

<style lang="scss">
	.row {
		@apply flex justify-between items-center py-4;

		.left {
			@apply text-gray-500;
		}
	}

	.form-item {

		@apply rounded-lg my-2 py-2;

		input {
			border: 1px solid #ccc;
			border-radius: 4px;
			@apply my-1;
		}
	}
</style>