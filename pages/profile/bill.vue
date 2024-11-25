<template>
	<view class="">
		<com-nav-bar title="历史记录" backgroundColor="#fff"></com-nav-bar>

		<view style="height: 72rpx;">
			<view class="filter">
				<view class="filter_item filter_symbol"
					@click="showType = false;showDate = false;showSymbol = !showSymbol">
					<view class="filter_item_title">{{symbolText}}</view>
					<image class="filter_item_img" src="@/static/images/wallet/arrow_down@2x.png" mode="aspectFit"
						style="width: 15rpx; height: 9rpx;"></image>
				</view>
				<view class="filter_item filter_symbol"
					@click="showSymbol = false;showDate = false;showType = !showType">
					<view class="filter_item_title"><!-- 全部类型 -->{{typeText}}</view>
					<image class="filter_item_img" src="@/static/images/wallet/arrow_down@2x.png" mode="aspectFit"
						style="width: 15rpx; height: 9rpx;"></image>
				</view>
				<view class="filter_item filter_symbol"
					@click="showType = false;showSymbol = false;showDate = !showDate">
					<view class="filter_item_title">{{dateText}}</view>
					<image class="filter_item_img" src="@/static/images/wallet/arrow_down@2x.png" mode="aspectFit"
						style="width: 15rpx; height: 9rpx;"></image>
				</view>
			</view>
		</view>
		<com-options :list="['全部币种', 'USDT', 'NRT']" v-model:show="showSymbol" @change="symbolChange"></com-options>
		<com-options :list="[t('record.type'), '聊天', 'C2C', '理财', '团队', '提币', '奖励', '内部转账', '社区持仓']"
			v-model:show="showType" @change="typeChange"></com-options>
		<up-datetime-picker
					format="YYYY-MM-DD"
		            :show="showDate"
		            v-model="defaultDateMultiple"
		            mode="date"
					:closeOnClickOverlay="true"
					@close="showDate = false"
					@confirm="confirm"
		        ></up-datetime-picker>

		<!-- 列表 -->
		<view class="data-list">
			<view class="data-list-item" v-for="(item, index) in dataList" :key="index">
				<view class="data-list-item_title">{{ item.info }} {{ item.symbol }}</view>
				<view class="flex justify-between items-center">
					<view class="w-1/3">
						<view class="data-list-item_subtitle">数量</view>
						<view class="data-list-item_value text-gray-600" v-if="item.type === 10">
							{{ tools.floorAmount(parseFloat(item.amount), 4) }}
						</view>
						<view class="data-list-item_value"
							:class="[item.amount > 0 ? 'data-list-item_red' : 'data-list-item_green']" v-else>
							{{item.amount}}
						</view>
					</view>
					<!-- <view class="w-1/3 text-center flex justify-center">
						<view class="data-list-item_middle">
							<view class="data-list-item_subtitle ml-[2rpx]">状态</view>
							<view class="data-list-item_value">{{getStatusText(item)}}</view>
						</view>
					</view> -->
					<view class="w-1/3 text-center flex justify-center">
						<view class="data-list-item_middle">
							<view class="data-list-item_subtitle ml-[2rpx]">余额</view>
							<view class="data-list-item_value">{{ tools.floorAmount(parseFloat(item.yue), 4) }}</view>
						</view>
					</view>
					<view class="w-1/3 text-right">
						<view class="data-list-item_subtitle">时间</view>
						<view class="data-list-item_value">{{ tools.dateFormat('mm-dd HH:MM', new Date(item.created_at)) 
						}}</view>
					</view>
				</view>
			</view>
		</view>

		<!--分页-->
		<u-loadmore class="py-6" :status="pagination.status" line />

	</view>



</template>

<script setup>
	import {
		useI18n
	} from 'vue-i18n';
	import {
		onReachBottom
	} from '@dcloudio/uni-app';
	import {
		reactive,
		ref
	} from "vue";
	import tools from "@/utils/tools";
	import {
		getBillList
	} from "../../config/api";
	let {
		t
	} = useI18n();

	const pagination = reactive({
		symbol: '',
		type: '',
		created_at: '',
		page: 1,
		pageSize: 20,
		status: ''
	})
	const dataList = ref([])


	const showSymbol = ref(false)
	const symbolText = ref('全部币种')
	const showType = ref(false)
	const typeText = ref(t('record.type'))

	const getBillData = () => {
		getBillList({
			symbol: pagination.symbol,
			type: pagination.type,
			created_at: pagination.created_at
		}, pagination.page, pagination.pageSize).then((res) => {
			dataList.value.push(...res.data)
			if (pagination.page < res.last_page) {
				pagination.page++
				pagination.status = 'loadmore'
			} else {
				pagination.status = 'nomore';
			}
		})
	}

	getBillData()

	const getFirstData = () => {
		pagination.page = 1;
		dataList.value = [];
		getBillData()
	}

	onReachBottom(() => {
		if (pagination.status == 'loadmore') {
			pagination.status = 'loading'
			getBillData()
		}
	})

	// useWeb3(account => {
	// 	$http.get('/api/caiwu/getList', { account }).then(res => {
	// 		pagination.total = res.total;
	// 		pagination.current = res.current_page;
	// 		dataList.value = res.data
	// 	})
	// })
	const getStatusText = (item) => {
		if (item.type == 10) {
			return "待入账"
		}

		return "已完成"
	}


	const symbolChange = (value) => {
		symbolText.value = value;
		if (value != '全部币种') {
			pagination.symbol = value;
		} else {
			pagination.symbol = '';
		}

		getFirstData()
	}

	const typeChange = (value) => {
		typeText.value = value;
		let _value;
		//'活期', '定期', '团队', '提币', '奖励', '内部转账', '社区持仓'
		switch (value) {
			case t("record.type"):
				_value = ''
				break;
			case '聊天':
				_value = '13,14'
				break;
			case 'C2C':
				_value = '11,12'
				break;
			case '理财':
				_value = '1,2'
				break;
			case '团队':
				_value = 3
				break;
			case '提币':
				_value = 4
				break;
			case '奖励':
				_value = 7
				break;
			case '内部转账':
				_value = 8
				break;
			case '社区持仓':
				_value = 10
				break;
			default:
				_value = ''
				break;
		}

		pagination.type = _value

		getFirstData()
	}

	//日期筛选
	const showDate = ref(false);
	const mode = ref('single');

	const d = new Date();
	const year = d.getFullYear();
	let month = d.getMonth() + 1;
	month = month < 10 ? `0${month}` : month;
	const date = d.getDate();
	const defaultDateMultiple = ref(`${year}-${month}-${date}`);
	const dateText = ref("日期")


	const confirm = (e) => {
		showDate.value = false;
		console.log(e, defaultDateMultiple.value);
		
		let dd = new Date(e.value)
		let month2 = dd.getMonth() + 1;
		month2 = month2 < 10 ? `0${month2}` : month2;		
		let _date = `${dd.getFullYear()}-${month2}-${dd.getDate()}`
		
		dateText.value = _date
		pagination.created_at = dateText.value
		
		getFirstData()
	};
</script>

<style lang="scss" scoped>
	.filter {

		display: flex;
		flex-direction: row;
		align-items: center;
		width: 720rpx;
		height: 72rpx;
		border-top: 2rpx solid #EEEEEE;
		border-bottom: 2rpx solid #EEEEEE;
		background: white;

		padding-left: 30rpx;

		position: fixed;
		left: 0;
		top: calc(var(--status-bar-height) + 110rpx);
		z-index: 100;

		&_item {
			display: flex;
			align-items: center;

			margin-right: 67rpx;

			&_title {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 28rpx;
				color: #999;
			}

			&_img {
				margin-left: 28rpx;
			}
		}

		&_item:active {
			background-color: #eee;
		}
	}

	.data-list {
		&-item {
			padding: 36rpx 29rpx 33rpx 28rpx;

			border-bottom: 2rpx solid #EEEEEE;

			&_title {
				font-family: Gilroy-Bold;
				font-weight: bold;
				font-size: 32rpx;
				color: #000000;

				margin-bottom: 24rpx;
			}

			&_subtitle {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 26rpx;
				color: #999;

				padding-left: 2rpx;
			}

			&_value {
				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 32rpx;

				padding-top: 16rpx;
			}

			&_green {
				color: #FC465C;
			}

			&_red {
				color: #00C688;
			}

			&_middle {
				width: 113rpx;
				// background: green;

				text-align: left;
			}
		}
	}
</style>