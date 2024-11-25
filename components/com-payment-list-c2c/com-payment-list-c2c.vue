<template>
	<u-popup :show="props.show" :round="10" mode="bottom" @close="close" closeable @open="open" style="z-index: 999999999;">
		<view class="">
			<view class="pt-3 px-4 py-2 font-bold text-base" style="border-bottom: 1px solid #eee;">卖家收款账号</view>
			<view class="px-4 pb-4">
				<view class="text-xs py-2 text-gray-500">您可以选择其他的收款账号或支付方式以继续完成交易</view>
				<view class="py-3 text-black flex justify-between items-center"
					:class="{'bb' : index != props.data.length -1}" v-for="(item, index) in props.data"
					@click="rowClick(item, index)">
					<view class="flex flex-col">
						<view class="flex items-center">
							<view class="w-[3px] h-[10px]" :class="getBgColor(item)"></view>
							<view class="ml-2">{{project.getPaymentName(item)}}</view>
						</view>
						<view class="text-gray-500 text-sm" v-if="item != 'bank'">扫码直接支付</view>
					</view>
					<view>
						<radio value="r1" class="scale-75" color="#000" v-if="selectedItem == item"
							:checked="selectedItem == item" />
					</view>
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
	import project from '@/utils/project';
	
	const props = defineProps(['show', 'data', 'selectedItem'])
	const emit = defineEmits(['update:show', "change"]);
	const open = () => {
		// console.log('open');
	}

	const getBgColor = (item) => {
		if (project.getPaymentName(item) == '银行卡') {
			return 'bg-orange-400';
		}
		if (project.getPaymentName(item) == '支付宝') {
			return 'bg-blue-500';
		}
		if (project.getPaymentName(item) == '微信支付') {
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