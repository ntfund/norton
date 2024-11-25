<template>
	<com-nav-bar title="银行卡详情"></com-nav-bar>
	<view class="p-4">
		<view class="row">
			<view class="left">姓名</view>
			<view class="riht">{{formData.account}}</view>
		</view>
		<view class="row">
			<view class="left">银行账号</view>
			<view class="riht">{{formData.number}}</view>
		</view>
		<view class="row">
			<view class="left">开户银行</view>
			<view class="riht">{{formData.name}}</view>
		</view>
	</view>
	<view class="fixed w-[750rpx] left-0 bottom-0">
		<view class="px-4">
			<view class="rounded-button">
				<button type="button" @click="edit">更改</button>
			</view>
			<view class="rounded-button">
				<button type="button" @click="show=true">删除</button>
			</view>
		</view>
	</view>
	<u-modal :show="show" title="删除收款" content="将删除银行卡收款方式" confirmText="删除" showCancelButton confirmColor="#ff0000"
		@confirm="deleteClick" @cancel="show = false" closeOnClickOverlay @close="show = false"></u-modal>
</template>

<script setup lang="ts">
	import { reactive, ref } from "vue";
	import tools from '@/utils/tools'
	const props = defineProps(['params']);
	// const item = JSON.parse(decodeURIComponent(props.params));
	// const item = JSON.parse(decodeURIComponent(props.params));
	const formData = JSON.parse(decodeURIComponent(props.params));

	const show = ref(false)

	// const formData = reactive({
	// 	id: 0,
	// 	bankAccount: '',
	// 	backName: '中国工商银行',
	// 	backNumber: '6220421545645655544'
	// })

	const edit = () => {
		tools.navigateToWithEncode('/pages/market/payment/edit/bank?params=' + props.params)
	}

	const deleteClick = () => {
		uni.$u.http.delete('/userPayment/' + formData.id).then(res => {
			uni.$u.toast('删除成功')
			uni.navigateBack();
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
</style>