<template>
	<view class="text-sm px-4 py-6">
		<view class="text-2xl font-black">请选择取消原因</view>
		<view class="text-gray-400 py-2">如您已经向卖家转账，请不要取消订单，避免造成财产损失。若您已达取消上限，平台会限制您的当日购买功能</view>
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
			value: '1',
			name: '我不想买了',
			checked: 'true'
		},
		{
			value: '2',
			name: '联系不到卖家'
		},
		{
			value: '3',
			name: '我的新手，不知道如何转账'
		},
		{
			value: '4',
			name: '卖家没有留真实的收款账号'
		},
		{
			value: '5',
			name: '卖家收款账户被封控，无法付款'
		},
		{
			value: '6',
			name: '实际单价/金额与我看到的不符'
		},
		{
			value: '7',
			name: '与卖家协议取消'
		},
		{
			value: '8',
			name: '卖家服务态度不好'
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
		uni.$u.http.post('/c2cOrder/cancel/' + props.id, { remark }).then(res => {			
			uni.reLaunch({
				url: '/pages/market/order?current=1',
				complete: () => {
					uni.showToast({
						title: '取消成功',
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