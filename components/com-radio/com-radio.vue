<template>
	<view >
		<image v-if="props.modelValue" @click="check()" src="@/static/images/wallet/radio_checked.png" mode="aspectFit" style="width: 38rpx; height: 38rpx;"></image>
		<image class="shadow rounded-full" v-else @click="check()" src="@/static/images/wallet/radio_unchecked.png" mode="aspectFit" style="width: 38rpx; height: 38rpx;"></image>
	</view>
</template>

<script setup>
	const props = defineProps(["modelValue"])
	const emit = defineEmits("update:modelValue")
	const check = () => {
		emit("update:modelValue", !props.modelValue)
	}
</script>

<style>

</style>