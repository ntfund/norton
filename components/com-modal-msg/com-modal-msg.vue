<template>
	<u-popup :show="props.show" @close="close" mode="center" :round="20" zIndex="9999999">
		<view>{{}}</view>
	</u-popup>
</template>

<script setup>
	
	const props = defineProps(['show', 'msg'])
	const emit = defineEmits(['update:show', "change"]);
	const close = () => {
		console.log('close')
		emit('update:show', false);
	}
	
</script>

<style>

</style>