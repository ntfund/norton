<template>
	<com-nav-bar title="银行卡修改"></com-nav-bar>
	<view class="p-4">
		<com-input label="姓名" :disabled="true" v-model="formData.account"></com-input>
		<com-input label="银行账号" v-model="formData.number" placeholder="请输入银行账号"></com-input>
		<com-input label="开户银行" v-model="formData.name" placeholder="请输入开户银行"></com-input>		
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
	// const formData = reactive({
	// 	id: 0,
	// 	bankAccount: '',
	// 	backName: '中国工商银行',
	// 	backNumber: '6220421545645655544',
	// 	code: ''
	// })
	const props = defineProps(['params']);
	const formData = JSON.parse(decodeURIComponent(props.params));

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