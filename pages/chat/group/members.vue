<template>
	<view>
		<com-nav-bar title="选择成员" backgroundColor="#fff"></com-nav-bar>
		<div class="flex search">
			<image class="search_img" src="@/static/images/chat/search@2x.png" mode="aspectFit" @click="search"></image>
			<input type="text" class="search_input" v-model="keyword" @input="search()" placeholder="搜索 UID或者昵称">
		</div>

		<scroll-view class="scroll-view" scroll-y="true" upper-threshold="50">
			<view class="data-list">
				<view v-for="(item, index) in dataList" :key="index">
					<view class="data-list_item" @click="rowClick(item)"  v-if="item.id != room.admin_id">
						<view class="data-list_item_left flex items-center justify-center">
							<image :src="project.getFullURL(item.avatar)" mode="aspectFit"
								style="width: 100rpx; height: 100rpx;"></image>
						</view>
						<view class="data-list_item_right flex items-center justify-between">
							<view class="data-list_item_right_name">{{item.nickname}}</view>
							<view class="data-list_item_right_imgs" v-if="type == 'addManager'">
								<image src="@/static/images/chat/checked@2x.png" mode="aspectFit"
									style="width: 26rpx; height: 23rpx;" v-if="isAdminChecked(item)"></image>
								<image src="@/static/images/chat/check@2x.png" mode="aspectFit"
									style="width: 26rpx; height: 23rpx;" v-else-if="item.checked"></image>
							</view>
						</view>
					</view>
				</view>				
			</view>
		</scroll-view>
		<view class="bottom-fixed">
			<button type="button" class="n-btn" @click="confirmed">完成({{ids.length}})</button>
		</view>
		<com-modal-confirm :msg="msg" v-model:show="showAddAdmin" @confirm="transferAdmin()"></com-modal-confirm>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		useUserStore
	} from '@/stores/modules/user';
	import project from '/utils/project';
	import tools from '@/utils/tools';
	import {
		getChatRoom, updateChatRomAdmins, updateChatRom
	} from '@/config/api';
	const props = defineProps(["room", "type"])
	const room = ref(JSON.parse(decodeURIComponent(props.room)))
	const keyword = ref('')
	

	const dataList = ref([])
	let dataOrignal = []
	const ids = ref([]);
	const getDataList = () => {
		uni.$u.http.get('/chat/chatRoom/more/' + room.value.id).then(data => {
			dataList.value = data;
			dataOrignal = data;
		})
	}
	
	const isAdminChecked = (item) => {
		// let res = room.value.admins.includes(item.id);
		return room.value.admins.indexOf(item.id.toString()) > -1;
	}
	

	//搜索
	const search = () => {
		if (keyword.value == '')
		{
			dataList.value = dataOrignal;
		} else {
			dataList.value = dataOrignal.filter(item => item.nickname.search(keyword.value) != -1 || item.uid == keyword.value)
		}
	}
	
	//添加管理员
	const addManager = (item) => {
		if (isAdminChecked(item)){
			return;
		}
		if (!item.checked && (ids.value.length + room.value.admins.length) >= 3) {
			return;
		}
		item.checked = !item.checked;
		
		if (item.checked) {
			ids.value.push(item.id)
		} else {
			let index = ids.value.indexOf(item.id)
			if (index > -1) {
				ids.value.splice(index, 1);
			}			
		}
	}
	
	//showAddAdmin
	const showAddAdmin = ref(false)
	const msg = ref('')
	const selectedRow = ref(null);
	
	const rowClick = (item) => {
		if (props.type == "addManager") {
			//添加管理员
			return addManager(item)
		} else 
		if (props.type == "admin") {
			//设置群主
			msg.value = '确认选择 '+ item.nickname +' 为新群主吗？'
			showAddAdmin.value = true;
			selectedRow.value = item;
		}
	}

	//添加管理员，按钮确认
	const confirmed = () => {
		let admins = room.value.admins.concat(ids.value)
		updateChatRomAdmins(room.value.id, admins).then(res => {
			uni.navigateBack();
		})		
	}
	
	//转让群主，按钮确认
	const transferAdmin = () => {
		updateChatRom(room.value.id, {admin_id: selectedRow.value.id}).then(res => {
			tools.toast("已转让");
			uni.navigateBack({
				delta: 2
			});
		})	
	}

	onShow(() => {
		getChatRoom(room.value.id).then(data => {
			room.value = data;
		})
		getDataList();
	})
	
	
</script>

<style lang="scss" scoped>
	page {
		background: $uni-bg-color-grey;
	}

	.search {
		height: 80rpx;
		margin: 40rpx 28rpx;

		position: relative;
		background: #fff;

		background: #FFFFFF;
		border-radius: 40rpx;
		border: 2rpx solid #EEEEEE;

		display: flex;
		align-items: center;


		&_img {
			width: 30rpx;
			height: 30rpx;

			position: absolute;
			left: 32rpx;
		}

		&_input {

			background: #fff;

			padding-left: 77rpx;

			font-family: Gilroy-Medium;
			font-weight: 500;
			font-size: 28rpx;
			color: #0A0A0A;
			opacity: 0.6;

			display: flex;
			align-items: center;
		}

		&_btn {
			background: #7F17FE;
			height: 80rpx;

			position: absolute;
			right: 0;
			top: 0;

			border-top-right-radius: 40rpx;
			border-bottom-right-radius: 40rpx;

			display: flex;
			align-items: center;
			justify-content: center;

			text {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 24rpx;
				color: #FFFFFF;
			}
		}
	}

	.data-list {
		background: #FFFFFF;

		&_item {
			display: flex;
			justify-content: space-between;
			align-items: center;

			height: 140rpx;
			padding: 0 28rpx;
			
			cursor: pointer;

			&_left {}

			&_right {
				flex: 1;
				margin-left: 34rpx;

				&_name {
					font-family: SourceHanSansCN-Medium;
					font-weight: 500;
					font-size: 30rpx;
					color: #000000;
				}

				&_imgs {
					margin-right: 52rpx;
				}

			}
		}
	}
	
	.scroll-view {
		height: calc(100vh - 110rpx - 84rpx - 80rpx);
		background: #FFFFFF;
	}
	
	.bottom-fixed {
		background: #FFFFFF;
		position: fixed;
		z-index: 100;
		left: 0;
		bottom: 0;
		right: 0;
		
		padding: 71rpx 0;
	}
</style>