<template>
	<u-popup :show="props.show" :round="10" mode="bottom" @close="close" @open="open" style="z-index: 999999999;">
		<view class="px-4">
			<view class="text-xs pt-4 text-gray-400">某些支付方式可能会又支付服务提供商设定的手续费和每日限额，请联系支付宝服务提供商了解详情。</view>
			<view class="py-4 text-black flex justify-between items-center"
				:class="{'bb' : index != props.data.length -1}" v-for="(item, index) in props.data"
				@click="rowClick(item, index)">
				<view class="flex items-center">
					<view class="w-[2px] h-[10px]" :class="getBgColor(item)"></view>
					<view class="ml-2">{{item.name}}</view>
				</view>
				<view>
					<radio value="r1" class="scale-75" color="#000" v-if="selectedItem == item"
						:checked="selectedItem.name == item.name" />
				</view>
			</view>
		</view>
		<view class="h-[20rpx] bg-gray-200"></view>
		<view class="py-4 text-gray-500 text-center" @click="close">
			取消
		</view>
	</u-popup>
</template>

<script setup lang="ts">
	const props = defineProps(['show', 'data', 'selectedItem'])
	const emit = defineEmits(['update:show', "change"]);
	const open = () => {
		// console.log('open');
	}

	const getBgColor = (item) => {
		if (item.name == '银行卡') {
			return 'bg-orange-400';
		}
		if (item.name == '支付宝') {
			return 'bg-blue-500';
		}
		if (item.name == '微信支付') {
			return 'bg-green-500';
		}
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

</style>