<template>
	<view>
		<u-popup :show="props.show" :round="10" mode="bottom" @close="close" closeable @open="open"
			style="z-index: 999999999;">
			<view class="">
				<view class="pt-3 px-4 py-2 font-bold text-xl">已完成转账？</view>
				<view class="px-4 pb-4">
					<view class="text-base pt-1 text-gray-700">上传支付凭证以确认您已完成转账<span class="text-red-600">*</span></view>
					<view class="text-base pb-1 text-gray-500">仅支仓不超过8MB的JPG、JPEG或PNG图片</view>
					<com-upload-img v-model:img="img"></com-upload-img>
				</view>
			</view>
			<view class="h-[20rpx] bg-gray-200"></view>
			<view class="py-4 text-center" :class="img ? 'text-black' : 'text-gray-400'" @click="confirmed">
				确认
			</view>
		</u-popup>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	const props = defineProps(['show'])
	const emit = defineEmits(['update:show', "ok"]);

	const img = ref('')

	const open = () => {
		// console.log('open');
	}

	const close = () => {
		emit('update:show', !props.show);
	}

	const confirmed = () => {
		if (!img.value)
		{
			uni.$u.toast('请选择图片');
			return;
		}
		emit('update:show', !props.show);
		emit('ok', img.value);
	}
</script>

<style>

</style>