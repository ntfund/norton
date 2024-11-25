<template>
	<com-ethers-bsc ref="bsc"></com-ethers-bsc>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import project from '@/utils/project';
	const bsc = ref(null)

	const login = async (address, private_key) => {
		//登录
		const message = 'LOGIN:' + address + new Date().getTime();
		let signature = await bsc.value.signMessage(message, private_key);
		console.log('sign message', message)
		await project.login(address, message, signature)
	}
	defineExpose({
		login
	})
</script>

<style>
</style>