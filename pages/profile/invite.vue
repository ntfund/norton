<template>
	<view>
		<com-nav-bar title="邀请好友" backgroundColor="#fff"></com-nav-bar>
		<image src="@/static/images/invite/yq@2x.png" mode="aspectFill"
			style="width: 750rpx; height: 606rpx; margin-top: 40rpx;"></image>
		<view class="yq-view">
			<view class="title">通过链接邀请</view>
			<view class="yq-box">
				<view class="yq-box-container">
					<view class="row border-bottom">
						<view class="left">链接</view>
						<view class="right">
							<view>{{Http.webURL}}?yqm={{userStore.user.yqm}}</view>
							<view class="shu"></view>
							<image src="@/static/images/invite/copy@2x.png" mode="aspectFit"
								style="width: 27rpx; height: 27rpx;" @click="tools.copyClick(Http.webURL + '?yqm=' + userStore.user.yqm)"></image>
						</view>
					</view>
					<view class="row">
						<view class="left">邀请码</view>
						<view class="right">
							<view>{{userStore.user.yqm}}</view>
							<view class="shu"></view>
							<image src="@/static/images/invite/copy@2x.png" mode="aspectFit"
								style="width: 27rpx; height: 27rpx;" @click="tools.copyClick(userStore.user.yqm)"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view>
			<view>更多邀请方式</view>
		</view> -->
	</view>
</template>

<script setup>
	import tools from '@/utils/tools';
	import {
		useUserStore
	} from '@/stores/modules/user';
	import * as Http from '@/config/http.js'

	const userStore = useUserStore();
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.yq-view {
		padding: 30rpx;
		margin-top: 40rpx;

		.title {
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 30rpx;

			margin-bottom: 40rpx;
		}
	}

	.yq-box {
		// width: 694rpx;
		// height: 180rpx;
		border-radius: 14rpx;
		border: 2rpx solid #EEEEEE;

		margin: 0 auto;

		.yq-box-container {
			padding: 0 30rpx;
		}

		.row,
		.right {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.row {
			padding: 30rpx 0;

			.left {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 30rpx;
				color: #000000;
			}

			.right {
				font-family: Gilroy-Regular;
				font-weight: 400;
				font-size: 30rpx;
				color: #000000;
			}

			.shu {
				width: 2rpx;
				height: 32rpx;
				background: #EEEEEE;

				margin: 0 30rpx;
			}
		}

		.border-bottom {
			border-bottom: 1rpx solid #eee;
		}
	}
</style>