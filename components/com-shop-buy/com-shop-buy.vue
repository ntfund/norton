<template>
	<view>
		<com-input-max label="求购数量" v-model="formData.amount" :max="usdtToken.balance" placeholder="请输入数量"></com-input-max>
		
		<com-input type="digit" label="购买价格" v-model="formData.price" right="CNY" placeholder="请输入价格"></com-input>

		<view class="flex justify-between items-center">
			<com-input type="digit" label="单笔限额" v-model="formData.min_cny" right="CNY" placeholder="最小数"></com-input>
			<view class="gang"></view>
			<com-input class="self-end" type="digit" v-model="formData.max_cny" right="CNY" placeholder="最大数"></com-input>
		</view>

		<view class="mb-[30rpx]">支付方式</view>
		<view class="">
			<u-checkbox-group v-model="formData.payments" placement="row" @change="checkboxChange">
				<u-checkbox :customStyle="{marginRight: '15px'}" v-for="(item, index) in checkboxList1" :key="index"
					:label="item.label" :name="item.name">
				</u-checkbox>
			</u-checkbox-group>
		</view>

		<view class="btn-bottom" v-if="formData.id > 0">
			<button type="button" class="n-btn" @click="add">修改委托</button>
			<button type="button" class="n-btn-delete" @click="show=true">删除</button>
		</view>
		<view class="btn-bottom" v-else>			
			<button type="button" class="n-btn" @click="add">发布委托</button>
		</view>
		<u-modal :show="show" title="删除委托" content='确认删除吗' confirmText="删除" showCancelButton confirmColor="#ff0000"
			@confirm="deleteConfirm" @cancel="show = false" closeOnClickOverlay @close="show = false"></u-modal>
	</view>
</template>

<script>
	import {
		useBalanceStore
	} from '@/stores/modules/userBalance'
	export default {
		name: "com-shop-buy",
		props: ['data'],
		data() {
			return {
				show: false,
				formData: {
					id: 0,
					type: 1, //1：购买，2：出售。
					amount: '',
					min_cny: '',
					max_cny: '',
					price: '',
					payments: ['bank', 'wechat_pay', 'alipay'],
				},
				checkboxList1: [{
						label: '银行卡',
						name: 'bank',
						disabled: false,
					},
					{
						label: '支付宝',
						name: 'alipay',
						disabled: false,
					},
					{
						label: '微信',
						name: 'wechat_pay',
						disabled: false,
					},
				],
				usdtToken: {}
			};
		},
		mounted() {
			if (this.data && this.data.type == 1) {
				this.formData = this.data;
			}
			const userBalanceStore = useBalanceStore()
			this.usdtToken = userBalanceStore.getUsdtToken()
		},
		methods: {
			checkboxChange(n) {
				console.log('change', n);
			},
			add() {
				if (!this.formData.amount) {
					return uni.$u.toast("请输入数量");
				}
				if (this.formData.id == 0) {
					if (parseFloat(this.formData.amount) > parseFloat(this.usdtToken.balance))
					{
						return uni.$u.toast("可用余额不足，请先转入资产");
					}
				}
				
				if (!this.formData.min_cny) {
					return uni.$u.toast("请输入最小数量");
				}
				if (parseFloat(this.formData.min_cny) < 1) {
					return uni.$u.toast("最小数量不得小于1");
				}
				if (!this.formData.max_cny) {
					return uni.$u.toast("请输入最大数量");
				}
				if (parseFloat(this.formData.max_cny) < parseFloat(this.formData.min_cny) || parseFloat(this.formData
						.max_cny) <= 1) {
					return uni.$u.toast("区间范围不正确");
				}
				if (!this.formData.price) {
					return uni.$u.toast("请输入价格");
				}
				if (this.formData.max_cny > this.cny) {
					return uni.$u.toast("您的单笔CNY上限为：" + this.cny);
				}
				if (this.formData.payments.length == 0) {
					return uni.$u.toast("请最少选择一种支付方式");
				}
				
				if (!this.formData.id || this.formData.id == 0) {
					//新增
					uni.$u.http.post('/c2c', this.formData).then(balances => {
						const userBalanceStore = useBalanceStore()
						userBalanceStore.setValue(balances)
						
						uni.navigateBack();
						uni.$u.toast("发布成功");
					})
				} else {
					uni.$u.http.put('/c2c/' + this.formData.id, this.formData).then(balances => {						
						const userBalanceStore = useBalanceStore()
						userBalanceStore.setValue(balances)
						
						uni.navigateBack();
						uni.$u.toast("更新成功");
					})
				}
			},
			deleteConfirm() {
				uni.$u.http.delete('/c2c/' + this.formData.id).then(res => {
					uni.navigateBack();
					uni.$u.toast("删除成功");
				})
			}
		},
		computed: {
			cny() {
				if (this.formData.amount && this.formData.price) {
					return this.formData.amount * this.formData.price;
				}
				return 0;
			}
		}
	}
</script>

<style lang="scss" scoped>	
	.gang {
		width: 20rpx;
		height: 2rpx;
		background: #000000;
		border-radius: 1rpx;
		opacity: 0.2;
		
		margin: auto 12rpx;
	}
</style>