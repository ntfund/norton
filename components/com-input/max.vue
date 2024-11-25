<template>
	<view>
		<view class="input_box">
			<view class="input_box_label">{{label}}</view>
			<view class="input_box_container flex justify-between">
				<input type="digit" class="input_box_input" :class="{'input_box_disabled': disabled}"
					:disabled="disabled" :value="modelValue" :placeholder="placeholder" @input="inputChange">
				<view class="input_box_max" @click="updateAmount()">
					<text class="input_box_max_txt">Max</text>
				</view>
			</view>
			<view class="input_box_amount flex justify-end items-center">
				可用余额: {{tools.unitConverter(max, 2)}}
			</view>
		</view>
	</view>
</template>

<script setup>
	import tools from '@/utils/tools';
	const props = defineProps(['label', 'modelValue', 'placeholder', 'disabled', 'max'])
	const emit = defineEmits(['update:modelValue']);

	console.log('ee', props.max)

	const inputChange = (event) => {
		// console.log('inputChange', event)		
		emit('update:modelValue', event.detail.value)
	}
	
	const updateAmount = () => {
		emit('update:modelValue', tools.floorAmount(props.max, 2))
	}
	
</script>

<style lang="scss" scoped>
	.input_box {
		position: relative;

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

			align-items: center;
		}

		&_input {
			height: 100rpx;

			padding-left: 34rpx;

		}

		&_disabled {
			background: #eee;

			color: #999;
		}

		&_max {
			margin-right: 32rpx;

			width: 104rpx;
			height: 42rpx;
			background: #E5D1FF;
			border-radius: 8rpx;

			display: flex;
			justify-content: center;
			align-items: center;

			cursor: pointer;

			&_txt {
				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 22rpx;
				color: #7F17FE;
			}
		}

		&_max:active {
			background: #EEEEEE;
		}

		&_amount {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 24rpx;
			color: #000000;
			line-height: 36rpx;

			margin-top: 21rpx;
			padding-right: 30rpx;
		}


		margin-bottom: 76rpx;
	}
</style>