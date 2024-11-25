<template>
	<view>
		<com-nav-bar title="修改群昵称" border="true" backgroundColor="#fff"></com-nav-bar>
		<view class="content">
			<view class="n-input" style="margin-top: 52rpx;">
				<view class="n-input_view">
					<input type="text" maxlength="12" v-model="name" class="n-input_input" placeholder="设置群昵称">
					<image class="n-input_close" src="@/static/images/input-close@2x.png" mode="aspectFit"
						style="width: 34rpx; height: 34rpx;" @click="name = ''" v-if="name != ''"></image>
				</view>
			</view>
			<view class="info-view">
				<view class="title">群昵称设置规范</view>
				<view class="title-info">
					1、昵称内容上限纯英数24字符或中文12字符，不支持特殊字符。
				</view>
				<view class="title-info">
					2、昵称内容必须符合所在国家或地区的法律规定。如有违规，平台有权对其修改或实施对账号禁言、封禁等。
				</view>
			</view>
			<view class="confirmed">
				<button type="button" class="n-btn" @click="confirmed">
					<text>完成</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, watchEffect } from "vue";
	import tools from "@/utils/tools";
	import { useUserStore } from '@/stores/modules/user'
	import { getChatRoom, updateGroupInfo } from "@/config/api";
	import roomHelper from "@/utils/chat/roomHelper";
	const userStore = useUserStore()
	const props = defineProps(['id', 'name'])

	const room = ref({
		id: 0,
		name: "群组",
		notice: null,
		admin_id: 0,
		userList: [],
		users: [],
		admins: [],
		mutes: [],
		admin: {},
		remarks: []
	})

	const name = ref();

	

	const getData = () => {
		getChatRoom(props.id).then(data => {
			console.log('getChatRoom', data)
			room.value = data
			
			name.value = roomHelper.getUserGroupNickname(data, userStore.user)
		})
	}

	getData()


	const confirmed = () : void => {
		console.log("confirmed", "update name")

		updateGroupInfo(room.value.id, 'nickname', name.value).then(res => {
			uni.showToast({
				title: '修改成功'
			});
			tools.navigateBack();
		})
	}
</script>

<style lang="scss" scoped>
	.n-input {
		margin: 0 28rpx;

		&-txt {

			&_label {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 28rpx;
				color: #999;

				padding-bottom: 23rpx;
			}
		}

		&_view {
			position: relative;
		}

		&_input {
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 30rpx;
			color: #000000;

			background: #FFFFFF;
			border-radius: 8rpx;
			border: 2rpx solid #7F17FE;

			height: 80rpx;

			padding-left: 34rpx;
		}


		&_close {
			position: absolute;

			right: 23rpx;
			top: 23rpx;
			bottom: 23rpx;
		}
	}

	.confirmed {
		margin-top: 105rpx;
	}

	.info-view {
		margin: 0 28rpx;
	}

	.title {
		font-family: SourceHanSansCN-Bold;
		font-weight: bold;
		font-size: 36rpx;
		color: #000000;

		margin-top: 86rpx;
		margin-bottom: 39rpx;
	}

	.title-info {
		font-family: SourceHanSansCN-Regular;
		font-weight: 400;
		font-size: 28rpx;
		color: #999;

		padding: 10rpx 0;
	}
</style>