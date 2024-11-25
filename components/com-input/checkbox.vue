<template>
	<view>
		<checkbox-group :name="name" @change="change">
			<view>
				<label class="checkbox-view">
					<checkbox value="1" color="white" activeBackgroundColor="#7F17FE" activeBorderColor="#7F17FE"
						:value="1" :checked="checked" />
					<view class="label">{{label}}</view>
				</label>
			</view>
		</checkbox-group>
	</view>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue';
	import tools from '@/utils/tools';
	const props = defineProps(['label', 'modelValue', 'name'])
	const emit = defineEmits(['update:modelValue']);
	const checked = ref(props.modelValue)

	const change = (event) => {
		console.log('inputChange', event)		
		if (event.detail.value.length == 0) {
			emit('update:modelValue', false)
		} else {
			emit('update:modelValue', true)
		}		
	}
</script>

<style lang="scss" scoped>
	.checkbox-view {
		display: flex;
		align-items: center;

		.label {
			margin-left: 10rpx;

			font-family: Gilroy-Medium;
			font-weight: 500;
			font-size: 30rpx;
			color: #7F17FE;
		}
	}
</style>