<template>
	<view>
		<com-nav-bar title="加群验证" backgroundColor="#fff"></com-nav-bar>
		<view class="data-list">
			<view class="data-list_item" v-for="(item, index) in dataList" :key="index" @click="showInfo(item)">
				<view class="data-list_item_img">
					<image class="data-list_item_img2" :src="project.getFullURL(item.user.avatar)" mode="aspectFit"
						style="width: 100rpx; height: 100rpx;"></image>
				</view>
				<view class="flex flex-col data-list_item_info">
					<view class="data-list_item_info_row1">
						{{item.user.nickname}}</view>
					<view class="data-list_item_info_row2">附加信息：{{item.remark ? item.remark : '无'}}</view>
				</view>
				<view class="data-list_item_options flex items-center">
					<view>
						<button type="button" class="data-list_item_options_agree flex items-center"
							v-if="item.status == 1" @click.stop="accept(item)">
							通过
						</button>
						<view class="data-list_item_options_txt" v-else>{{getStatusText(item)}}</view>
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
		onMounted,
		reactive,
		ref
	} from 'vue';
	import {
		onReachBottom
	} from '@dcloudio/uni-app';
	import {
		onShow
	} from '@dcloudio/uni-app'
	import tools from '@/utils/tools'
	import {
		getRoomVerifyList
	} from '@/config/api';
	import {
		useUserStore
	} from '@/stores/modules/user';
	import project from '@/utils/project';

	const props = defineProps(["id"])
	
	const dataList = ref([]);
	const userStore = useUserStore();

	const chatClick = (item) => {
		console.log('chat join')
		item.unread = 0;
		if (item.status == 2) {
			tools.navigateTo('/pages/chat/user/info?id=' + item.from_user.id)
		} else {
			tools.navigateToWithEncode('/pages/chat/user/friend', item)
		}
	}

	const getStatusText = (item) => {
		if (item.status == 2) {
			return '已通过'
		}
		if (item.status == 3) {
			return '已拒绝'
		}
		if (item.status == 4) {
			return '已过期'
		}
		return '待验证'
	}


	const pagination = reactive({
		page: 1,
		pageSize: 20,
		status: ''
	})

	const getDataList = () => {
		getRoomVerifyList(props.id, pagination.page, pagination.pageSize).then(res => {
			console.log(res, 'res')
			dataList.value.push(...res.data)
			if (pagination.page < res.last_page) {
				pagination.page++
				pagination.status = 'loadmore'
			} else {
				pagination.status = 'nomore';
			}
		})
	}

	//通过
	const accept = (item) => {
		item.status = 2;
		uni.$u.http.put('/chat/chatRoomVerify/' + item.id, {
			status: 2
		}).then(res => {
			
		})
	}
	
	onReachBottom(() => {
		if (pagination.status == 'loadmore') {
			pagination.status = 'loading'
			getDataList()
		}
	})

	onShow(() => {
		pagination.page = 1;
		dataList.value = [];
		getDataList();
	})

	const isMe = (item) => {
		return userStore.user.id == item.from_user.id;
	}
	
	const showInfo = (item) => {
		console.log('item', item)
		let to_user_id = item.to_user_id;
		if (!isMe(item)) {
			to_user_id = item.from_user_id;
		}
		tools.navigateToWithEncodeMultiply('/pages/chat/user/info', {id: to_user_id})
	}	

	onMounted(() => {
		console.log('talk onMounted')
	})
</script>

<style lang="scss" scoped>
	page {
		background: #F8F8F8;
	}

	.data-list {
		background: #ffffff;

		margin-top: 19rpx;

		&_item {
			display: flex;
			align-items: center;
			justify-content: space-between;

			padding: 20rpx 28rpx;

			&_img {
				display: flex;
				align-items: center;

				background: #F9F9F9;
				border-radius: 18rpx;
			}

			&_info {
				flex: 1;

				margin-left: 33rpx;

				&_row1 {
					font-family: SourceHanSansCN-Medium;
					font-weight: 500;
					font-size: 30rpx;
					color: #000000;
				}

				&_row2 {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 22rpx;
					color: #999;

					padding-top: 6rpx;
				}
			}

			&_options {
				display: flex;
				flex-direction: row;
				align-items: center;


				&_agree {
					padding: 0;
					border-radius: 8px;
					border: 2rpx solid #7F17FE;
					height: 40rpx;
					width: 80rpx;
					// line-height: 1;


					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;

					// font-family: SourceHanSansCN-Regular;
					font-weight: 500;
					font-size: 20rpx;
					color: #7F17FE;

					background: white;
				}

				&_agree::after {
					display: none;
				}
				
				&_txt {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 24rpx;
					color: #8C8C8C;
				}
			}
		}
	}
</style>