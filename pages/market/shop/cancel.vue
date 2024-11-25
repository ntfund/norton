<template>
	<com-nav-bar title="异常处理"></com-nav-bar>
	<view class="text-sm px-4 py-6">
		<view class="text-2xl font-black">请选择异常原因</view>
		<view class="text-gray-400 py-2">买家已打款，请勿非法取消订单，否则平台将会限制您的C2C交易。取消后订单将进入争议状态，等待平台接入</view>
		<u-line></u-line>

		<view class="uni-list mt-4">
			<radio-group @change="radioChange">
				<label class="uni-list-cell uni-list-cell-pd flex py-2.5 items-center" v-for="(item, index) in items"
					:key="item.value">
					<view>
						<radio :value="item.value" :checked="index === current" />
					</view>
					<view class="text-base ml-1 font-semibold text-gray-700">{{item.name}}</view>
				</label>
			</radio-group>
		</view>
	</view>
	<view class="fixed bottom-0 left-0 w-[750rpx]">
		<view class="px-4 py-4">
			<button type="button" class="my-button  font-bold  " @click="submit">提交</button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	const items = ref([
		{
			value: '4',
			name: '买家没有使用真实的付款账号'
		},
		{
			value: '7',
			name: '与买家协议取消'
		},
		{
			value: '9',
			name: '其他原因'
		},
	])
	const current = ref(0)
	const props = defineProps(['id'])

	const radioChange = (evt) => {
		for (let i = 0; i < items.value.length; i++) {
			if (items.value[i].value === evt.detail.value) {
				current.value = i;
				break;
			}
		}
	}

	const submit = () => {
		let remark = items.value[current.value].name
		uni.$u.http.post('/c2cOrder/dissent/' + props.id, { remark }).then(res => {			
			uni.reLaunch({
				url: '/pages/market/shop/order?current=1',
				complete: () => {
					uni.showToast({
						title: '提交成功',
						icon: 'success'
					})
				}
			});
			
		})
	}
</script>

<style lang="scss">
	.my-button {
		@apply rounded-full text-white bg-black font-semibold;
	}
</style>