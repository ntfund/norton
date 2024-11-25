<template>
	<u-popup :show="props.show" :round="10" mode="bottom" @close="close" @open="open">
		<view class="coin-list p-6">
			<view class="py-1 text-gray-400">选择代币</view>
			<view class="flex items-center py-6 border-bb" v-for="(item, index) in coins" @click="rowClick(item)">
				<image :src="item.icon" mode="widthFix" style="width: 50rpx;"></image>
				<view class="ml-2  text-xl">{{ item.name }}</view>
			</view>
		</view>
	</u-popup>
</template>

<script setup lang="ts">
	import { reactive, ref } from "vue";
	const props = defineProps(['show', 'data'])
	const emit = defineEmits(['update:show', "change"]);

	const coins = ref([
		{
			id: 6,
			name: 'NRT',
			icon: '/static/img/chain/nrt-on.png'
		},
		{
			id: 7,
			name: 'USDT',
			icon: '/static/img/usdt.png'
		}
	])
	if (props.data) {
		coins.value = props.data
	}

	const open = () => {
		// console.log('open');
	}
	const close = () => {
		emit('update:show', !props.show);
	}

	const rowClick = (item) => {
		console.log(item)
		emit('change', item);
		close()
	}
</script>

<style lang="less" scoped>

</style>