<template>
	<view>
		<view class="input_box">
			<view class="input_box_label">{{label}}</view>
			<com-upload-img v-model:img="img"></com-upload-img>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue';
	const props = defineProps(['label', 'modelValue', 'disabled'])
	const emit = defineEmits(['update:modelValue']);

	const img = ref(props.modelValue)

	watch(() => img.value, (newVal, oldVal) => {
		emit('update:modelValue', newVal)
	})

	const inputChange = (event) => {
		console.log('inputChange', event)
	}
</script>

<style lang="scss" scoped>
	.input_box {
		&_label {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 26rpx;
			color: #000000;

			padding-bottom: 30rpx;
		}

		&_input {
			height: 100rpx;
			background: #FFFFFF;
			border-radius: 8rpx;
			border: 2rpx solid #EEEEEE;

			padding-left: 34rpx;

		}

		&_disabled {
			background: #eee;

			color: #999;
		}

		margin-bottom: 76rpx;
	}
</style>