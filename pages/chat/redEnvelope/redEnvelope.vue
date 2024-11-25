<template>
	<com-nav-bar title="发红包" backgroundColor="#cf3c35" color="white"></com-nav-bar>
	<view class="view-content">
		<view class="tabr">
			<view class="container">
				<view :class="{'on':formState.type=='luck'}" @tap="switchType('luck')">拼手气红包</view>
				<view :class="{'on':formState.type=='normal'}" @tap="switchType('normal')">普通红包</view>
				<view class="border" :class="formState.type"></view>
			</view>
		</view>
		<view class="content" :class="formState.type">
			<view class="container">
				<view class="luck px-[15px]">
					<view class="item flex justify-between items-center w-[100%] bg-white mt-4 px-2 py-3.5"
						@click="show = !show">
						<text class="ml-0.5">币种</text>
						<view class=" flex right items-center">
							<!-- <u-icon name="grid" size="22" class="ml-2"></u-icon> -->
							<image :src="selectedCoin.icon" mode="widthFix" style="width: 40rpx; height: 40rpx;"></image>
							<text class="ml-0.5">{{selectedCoin.name}}</text>
							<u-icon name="arrow-right" class="ml-2"></u-icon>
						</view>
					</view>
					<view class="yue flex justify-end w-[100%]">余额: {{tools.unitConverter(balance, 2)}}</view>
					<view class="row">
						<view class="term">
							红包个数
						</view>
						<view class="input">
							<input type="digit" v-model="formState.number" placeholder="输入红包个数" /> 个
						</view>
					</view>
					<text class="w-[100%] ml-2 mt-1 text-sm text-gray-400">本群共:{{groupCount}}人</text>
					<view class="row">
						<view class="term">
							总金额
						</view>
						<view class="input">
							<input type="digit" v-model="formState.luckMoney" placeholder="输入金额" @input="checkValue1" />
							{{selectedCoin.name}}
						</view>
					</view>
					<view class="tis">
						小伙伴领取的金额随机
					</view>
					<view class="blessing">
						<input type="text" maxlength="12" placeholder="恭喜发财" v-model="formState.blessing" />
					</view>
					<view class="m-4 mt-6 flex justify-center items-center text-center w-[100%]">
						<image :src="selectedCoin.icon" mode="widthFix" style="width: 60rpx; height: 60rpx;"></image>
						<text
							class="text-4xl ml-2">{{formState.luckMoney ? tools.floorAmountMinDigits(formState.luckMoney, 2) : '0.00'}}</text>
					</view>
					<view class="hand" :class="{'disabled' : loading}" @tap="hand('luck')">
						发红包
					</view>
				</view>
				<view class="normal px-[15px]">
					<view class="item flex justify-between items-center w-[100%] bg-white mt-4 px-2 py-3.5"
						@click="show = !show">
						<text class="ml-0.5">币种</text>
						<view class=" flex right items-center">
							<!-- <u-icon name="grid" size="22" class="ml-2"></u-icon> -->
							<image :src="selectedCoin.icon" mode="widthFix" style="width: 40rpx; height: 40rpx;"></image>
							<text class="ml-0.5">{{selectedCoin.name}}</text>
							<u-icon name="arrow-right" class="ml-2"></u-icon>
						</view>
					</view>
					<view class="yue flex justify-end w-[100%]">余额:{{tools.unitConverter(balance, 2)}}</view>
					<view class="row">
						<view class="term">
							红包个数
						</view>
						<view class="input">
							<input type="number" v-model="formState.number" placeholder="输入红包个数" /> 个
						</view>
					</view>
					<text class="w-[100%] ml-2 mt-1 text-sm text-gray-400">本群共:{{groupCount}}人</text>
					<view class="row">
						<view class="term">
							单个金额
						</view>
						<view class="input">
							<input type="digit" v-model="formState.amount" placeholder="输入金额" @input="checkValue2" />
							{{selectedCoin.name}}
						</view>
					</view>
					<view class="tis">
						小伙伴领取的金额相同
					</view>
					<view class="blessing">
						<input type="text" maxlength="12" placeholder="恭喜发财" v-model="formState.blessing" />
					</view>
					<view class="m-4 mt-6 flex justify-center items-center text-center w-[100%]">
						<image :src="selectedCoin.icon" mode="widthFix" style="width: 60rpx; height: 60rpx;"></image>
						<text class="text-4xl ml-2">{{normalTotal}}</text>
					</view>
					<view class="hand" :class="{'disabled' : loading}" @tap="hand('normal')">
						发红包
					</view>
				</view>
			</view>
		</view>
	</view>
	<com-choice-symbol-popup v-model:show="show" @change="change"></com-choice-symbol-popup>
	<com-verify-password v-model:show="showPassword" @success="success"></com-verify-password>
</template>

<script setup lanng="ts">
	import {
		nextTick,
		ref,
		reactive,
		computed
	} from "vue";
	import {
		useBalanceStore
	} from '@/stores/modules/userBalance'
	import {
		getRoomInfo
	} from "@/config/api";
	import project from "@/utils/project";
	import tools from "@/utils/tools";
	const props = defineProps(['room_id']);
	// const typeClass = ref('luck')
	// const number = ref('')
	// const money = ref('')
	// const luckMoney = ref('')
	// const blessing = ref('')
	const userBalanceStore = useBalanceStore()
	const groupCount = ref(0)
	const loading = ref(false)
	const showPassword = ref(false)

	const switchType = (type) => {
		// typeClass.value = type;
		formState.type = type
	}

	let formState = reactive({
		type: 'luck',
		amount: '',
		number: '',
		luckMoney: '',
		blessing: '',
		room_id: props.room_id,
		token_id: 7,
		total: 0
	})

	const normalTotal = computed(() => {
		if (formState.number && formState.amount) {
			return tools.floorAmountMinDigits(formState.number * formState.amount, 2);
		}
		return '0.00';
	})

	getRoomInfo(project.getToRoomIdByRoomId(props.room_id)).then(data => {
		groupCount.value = data.users.length;
	})


	let selectedCoin = ref({
		id: 7,
		name: 'USDT',
		icon: '/static/img/usdt.png'
	})
	const balance = ref(userBalanceStore.getBalance(selectedCoin.value.id))
	const show = ref(false);
	const change = (item) => {
		console.log('change', item)
		selectedCoin.value = item;
		balance.value = userBalanceStore.getBalance(selectedCoin.value.id)
		formState.token_id = selectedCoin.value.id
	}

	const hand = (type) => {
		if (formState.number != Math.abs(parseInt(formState.number))) {
			return uni.showToast({
				title: "数量填写大于0的整数",
				icon: 'none'
			});
		}
		if (type == 'luck') {
			formState.total = formState.luckMoney;
		}
		if (type == 'normal') {
			formState.total = formState.amount * formState.number;
		}
		if (formState.total == 0) {
			return uni.showToast({
				title: "金额不能为空",
				icon: 'none'
			});
		}

		if (formState.total / formState.number < 0.01) {
			return uni.showToast({
				title: "单个红包不能低于0.01",
				icon: 'none'
			});
		}

		formState.blessing = formState.blessing || '恭喜发财'; //没填写则默认恭喜发财

		showPassword.value = true;
	}
	
	const success =  () => {
		//此处实际应用时应该post到服务器，然后服务器广播长连接
		//模板借由本地缓存实现效果，实际应用中请不要使用此方法。 
		uni.showLoading({
			title: '提交中'
		});
		loading.value = true;
		uni.$u.http.post('/chat/chatRedEnvelope', formState).then(res => {
			userBalanceStore.decrement(formState.token_id, formState.total)
			loading.value = false;
			uni.hideLoading();
			uni.navigateBack();
		})
		// setTimeout(() => {
		// 	uni.setStorage({
		// 		key: 'redEnvelopeData',
		// 		data: redEnvelopeData,
		// 		success: function() {
		// 			uni.hideLoading();
		// 			uni.navigateBack();
		// 		}
		// 	});
		// }, 300)
	}

	const checkValue1 = async (e) => {
		console.log('checkValue', e)
		// amount.value = amount.value.replace(/^(\-)*(\d+)\.(\d{2}).*$/, '$1$2.$3'); // 清除“数字”和“.”以外的字符
		let price = '' + formState.luckMoney;
		price = price
			.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
			.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
			.replace('.', '$#$')
			.replace(/\./g, '')
			.replace('$#$', '.')
			.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
		if (price.indexOf('.') < 0 && price != '') {
			// 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
			price = parseFloat(price);
		}
		await nextTick();
		formState.luckMoney = price;
	}

	const checkValue2 = async (e) => {
		console.log('checkValue', e)
		// amount.value = amount.value.replace(/^(\-)*(\d+)\.(\d{2}).*$/, '$1$2.$3'); // 清除“数字”和“.”以外的字符
		let price = '' + formState.amount;
		price = price
			.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
			.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
			.replace('.', '$#$')
			.replace(/\./g, '')
			.replace('$#$', '.')
			.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
		if (price.indexOf('.') < 0 && price != '') {
			// 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
			price = parseFloat(price);
		}
		await nextTick();
		formState.amount = price;
	}
</script>

<style lang="scss">
	page {
		background-color: #FFF9E9;
	}

	.view-content {
		view {
			display: flex;
			flex-wrap: wrap;
		}
	}

	.tabr {
		// width: 94%;
		// height: 105upx;
		// padding: 0 3%;
		width: 750rpx;
		height: 105rpx;
		background-color: #cf3c35;
		
		.container {
			// padding: 38rpx 28rpx;
			border-radius: 24rpx 24rpx 0px 0px;			
			background: #FFF9E9;
			
			border-bottom: solid 1upx #dedede;
						
			
			.on {
				color: #cf3c35;
			}
			
			.border {
				height: 4upx;
				background-color: #cf3c35;
				transition: all .3s ease-out;
			
				&.normal {
					transform: translate3d(100%, 0, 0);
				}
			}
			
			
			
			view {
				width: 50%;
				height: 100rpx;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				color: #999;
			}
		}
		
		
	}
	.content {
		width: 100%;
		height: 80vh;
		overflow: hidden;
		
		&.normal {
			.luck {
				transform: translate3d(-100%, 0, 0);
			}

			.normal {
				transform: translate3d(0, -100%, 0);
			}
		}

		.luck,
		.normal {

			transition: all .3s ease-out;
		}

		.luck {}

		.normal {
			transform: translate3d(100%, -100%, 0);
		}

		.row,
		.tis,
		.blessing,
		.hand {
			width: 94%;
		}

		.row,
		.tis,
		.blessing {
			border-bottom: #dedede solid 1upx;
		}

		.row,
		.blessing {
			padding: 0 3%;
			background-color: #fff;
		}

		.row,
		.blessing,
		.hand {
			height: 100upx;
			align-items: center;
		}

		.row {
			justify-content: space-between;
			flex-wrap: nowrap;
			margin-top: 20px;

			.term,
			.input {
				width: 50%;
			}

			.input {
				flex-shrink: 0;
				flex-wrap: nowrap;
				justify-content: flex-end;
				align-items: center;

				input {
					height: 50upx;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					text-align: right;
					margin-right: 20upx;
					font-size: 30upx;
				}
			}
		}

		.tis {
			height: 60upx;
			padding: 20upx 3%;
			font-size: 30upx;
			color: #999;
		}

		.blessing {
			input {
				width: 100%;
				height: 50upx;
				font-size: 32upx;
			}
		}
		
		.yue {
			font-family: Gilroy-Regular;
			font-weight: 400;
			font-size: 24rpx;
			color: #000000;
			margin-top: 10rpx;
						
			margin-right: 32rpx;
		}

		.hand {
			margin: 30upx 3%;
			background-color: #cf3c35;
			color: #fff;
			font-size: 34upx;
			justify-content: center;
			border-radius: 10upx;
			height: 90upx;
		}
	}
</style>