<template>
	<!-- 	<uni-nav-bar :fixed="true" :border="false" left-icon="left" @clickLeft="clickLeft" backgroundColor="#F8F8F8"
		:statusBar="true" title="修改群聊名称">
		<template #right>
			<view>
				<u-button type="primary" color="#00aa00" text="保存" size="small"
					@click="rightClick"></u-button>
			</view>
		</template>
	</uni-nav-bar>
	<view class="p-4">
		<u--input placeholder="请输入名称" maxlength="12" border="bottom" clearable v-model="name"></u--input>
		<view class="m-2 text-sm text-gray-300">修改群聊名称后，将在群内通知其他成员</view>
	</view> -->

	<view>
		<com-nav-bar title="修改备注" border="true" backgroundColor="#fff"></com-nav-bar>
		<view class="content">
			<view class="n-input" style="margin-top: 52rpx;">
				<view class="n-input_view">
					<input type="text" v-model="name" maxlength="12" class="n-input_input" placeholder="设置备注">
					<image class="n-input_close" src="@/static/images/input-close@2x.png" mode="aspectFit"
						style="width: 34rpx; height: 34rpx;" @click="name = ''" v-if="name != ''"></image>
				</view>
			</view>
			<view class="info-view">
				<view class="title">群聊名称设置规范</view>
				<view class="title-info">
					1、昵称内容上限纯英数24字符或中文12字符，不支持特殊字符。
				</view>
				<view class="title-info">
					2、昵称内容必须符合所在国家或地区的法律规定。如有违规，平台有权对其修改或实施对账号禁言、封禁等。
				</view>
			</view>
			<view class="confirmed">
				<button type="button" class="n-btn" 
					@click="confirmed">
					<text>完成</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import tools from "@/utils/tools";
	import { useUserStore } from '@/stores/modules/user'
	const userStore = useUserStore()
	const props = defineProps(['id', 'name'])

	const name = ref(props.name);


	const confirmed = () : void => {
		console.log("confirmed", "update name")

		uni.$u.http.put('/chat/chatRoom/' + props.id, { name: name.value }).then(data => {
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