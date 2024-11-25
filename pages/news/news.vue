<template>
	<view>
		<com-nav-bar title="历史记录" backgroundColor="#fff" leftWidth="200rpx" rightWidth="200rpx">
			<template #right>
				<view class="nav-right" @click="readAll">
					全部已读
				</view>
			</template>
		</com-nav-bar>
		<view class="list">
			<view class="list_item " v-for="item in dataList" @click="itemClick(item)">
				<view class="list_item_left">
					<view class="unread" v-if="!getIsRead(item)"></view>
				</view>
				<view class="list_item_right">
					<view class="title">{{item.title}}</view>
					<view class="time-row flex justify-between items-center">
						<text class="time">{{ item.created_at }}</text>
						<view class="iconfont icon-arrow-right-bold"></view>
					</view>
					<view class="detail" v-html="item.content"></view>
				</view>
			</view>
		</view>
	</view>

</template>

<script setup>
	import {
		ref
	} from "vue";
	import {
		getContentList
	} from "@/config/api";
	import tools from '@/utils/tools'
	import {
		useUserStore
	} from "@/stores/modules/user";
	const dataList = ref([]);
	const userStore = useUserStore()

	getContentList(5, 1, 15).then(res => {
		dataList.value = res.data
	})

	const getIsRead = (item) => {
		return item.reads.findIndex(x => x == userStore.user.id) > -1;
	}

	const itemClick = (item) => {
		read(item)
		tools.navigateToWithEncode('/pages/news/detail', item);
	}
	
	const read = (item) => {
		item.reads.push(userStore.user.id)
		uni.$u.http.put('/content/read/' + item.id)
	}
	
	const readAll = () => {
		for (let item of dataList.value) {
			read(item)			
		}
	}
	
</script>

<style lang="scss" scoped>
	page {
		background-color: $uni-bg-color-grey;
	}

	.nav-right {
		font-family: SourceHanSansCN-Medium;
		font-weight: 500;
		font-size: 30rpx;
		color: #7F17FE;

		display: flex;
		white-space: nowrap;
	}

	.list {
		padding: 30rpx;


		&_item {
			margin-bottom: 40rpx;

			width: 694rpx;
			height: 200rpx;

			background: #FFFFFF;
			box-shadow: 0px 8rpx 20rpx 0rpx rgba(202, 202, 202, 0.3), 0px -8rpx 20rpx 0rpx rgba(202, 202, 202, 0.3);
			border-radius: 8rpx;

			display: flex;

			&_left {
				width: 67rpx;
				// background: green;
				display: flex;
				justify-content: flex-end;
				padding-top: 46rpx;


				.unread {
					width: 14rpx;
					height: 14rpx;

					background: #FC465C;
					border-radius: 50%;

					margin-right: 10rpx;
				}
			}

			&_right {
				flex: 1;

				.title {
					font-family: SourceHanSansCN-Bold;
					font-weight: bold;
					font-size: 30rpx;
					color: #000000;

					margin-left: 2rpx;

					padding-top: 32rpx;
				}

				.time-row {
					padding-top: 10rpx;

					padding-right: 38rpx;

					.iconfont {
						font-weight: bold;
					}

					.time {
						font-family: Gilroy-Regular;
						font-weight: 400;
						font-size: 24rpx;
						color: #000000;
						opacity: 0.4;
					}

				}


				.detail {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 24rpx;
					color: #000000;

					margin-top: 20rpx;
				}
			}


		}


	}
</style>