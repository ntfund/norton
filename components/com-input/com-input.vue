<template>
	<view>
		<view class="input_box">
			<view class="input_box_label" v-if="label">{{label}}</view>
			<view class="input_box_container">
				<input :type="type ? type : 'text'" class="input_box_input" :class="{'input_box_disabled': disabled}"
					:disabled="disabled" :value="modelValue" :placeholder="placeholder" @input="inputChange" cursor-spacing="50">
				<view class="input_box_container_right" v-if="right"> {{right}} </view>
			</view>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps(['label', 'modelValue', 'placeholder', 'disabled', 'right', 'type'])
	const emit = defineEmits(['update:modelValue']);

	const inputChange = (event) => {
		// console.log('inputChange', event)		
		emit('update:modelValue', event.detail.value)
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

		&_container {
			height: 100rpx;
			background: #FFFFFF;
			border-radius: 8rpx;
			border: 2rpx solid #EEEEEE;
						
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			&_right {
				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 32rpx;
				color: #8D8D8D;
				
				padding-right: 32rpx;
			}
		}
		&_input {
			height: 100rpx;
			
			padding-left: 34rpx;

		}

		&_disabled {
			background: #eee;

			color: #999;
		}

		margin-bottom: 76rpx;
	}
</style>