<template>
	<u-popup :show="props.show" :round="10" mode="bottom" @close="close" @open="open">
		<view class="px-4">
			<view class="py-4 text-blue-600 text-center" :class="{'bb' : index != props.data.length -1}"
				v-for="(item, index) in props.data" @click="rowClick(item, index)">{{item}}</view>
		</view>
		<view class="h-[20rpx] bg-gray-200"></view>
		<view class="py-4 text-gray-500 text-center" @click="close">
			取消
		</view>
	</u-popup>
</template>

<script setup lang="ts">
	const props = defineProps(['show', 'data'])
	const emit = defineEmits(['update:show', "change"]);
	const open = () => {
		// console.log('open');
	}
	const close = () => {
		emit('update:show', !props.show);
	}

	const rowClick = (item : string, index : number) => {
		emit('change', item, index);
		close()
	}
</script>

<style lang="less" scoped>
	.bb {
		border-bottom: 1px solid #efefef;
	}
</style>