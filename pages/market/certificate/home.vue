<template>
	<com-nav-bar title="实名认证" :border="true" backgroundColor="#fff"
		@clickLeft="tools.navigateTo('/pages/market/profile')"></com-nav-bar>
	<view class="content">
		<view class="title1">身份信息安全验证</view>
		<view class="title2">为保障您的资金安全，需要验证身份信息</view>

		<view class="title3">
			证件签发国家/地区
		</view>
		<view class="card flex items-center">
			<view class="left flex-shrink-0 flex items-center">
				<image src="@/static/images/c2c/certificate/zh_cn@2x.png" mode="aspectFit"
					style="width: 50rpx; height: 50rpx;"></image>
			</view>
			<view class="middle">中国</view>
			<view class="right flex items-center">
				<image src="@/static/images/c2c/certificate/arrow-down@2x.png" mode="aspectFit"
					style="width: 15rpx; height: 9rpx;"></image>
			</view>
		</view>

		<view class="card-list">
			<view class="sub-title">证件类型</view>
			<view class="card_id">
				<view class="left">
					<image src="@/static/images/c2c/certificate/password@2x.png" mode="aspectFit"
						style="width: 44rpx; height: 33rpx;"></image>
				</view>
				<view class="middle">
					<view class="row1">身份证照片</view>
					<view class="row2">仅用于核实身份</view>
				</view>
				<view class="right">
					<button type="button" class="btn" @click="submit()">去完成</button>
				</view>
			</view>

		</view>
	</view>
</template>

<script setup>
	import tools from '@/utils/tools';


	const submit = () => {
		uni.navigateTo({
			url: '/pages/market/certificate/identity'
		})
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 30rpx;

		.title1 {
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 60rpx;
			line-height: 106rpx;

			margin-top: 17rpx;
		}

		.title2 {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 26rpx;
			color: #999;
		}

		.title3 {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 26rpx;
			color: #999;

			margin-top: 85rpx;
		}

		.card {
			margin-top: 27rpx;

			display: flex;
			justify-content: space-between;
			align-items: center;

			width: 694rpx;
			height: 100rpx;
			background: #FFFFFF;
			box-shadow: 0px 8rpx 20rpx 0rpx rgba(202, 202, 202, 0.3), 0px -8rpx 20rpx 0px rgba(202, 202, 202, 0.3);
			border-radius: 8rpx;


			.left {
				margin-left: 32rpx;
			}

			.middle {
				flex: 1;

				margin-left: 22rpx;


				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 30rpx;
				color: #000000;
			}

			.right {
				margin-right: 63rpx;
			}
		}

		.card-list {
			margin-top: 76rpx;

			.card_id {
				display: flex;
				align-items: center;
				justify-content: space-between;

				width: 694rpx;
				height: 140rpx;


				background: #FFFFFF;
				box-shadow: 0px 8rpx 20rpx 0rpx rgba(202, 202, 202, 0.3), 0px -8rpx 20rpx 0px rgba(202, 202, 202, 0.3);
				border-radius: 8rpx;

				.left {
					margin-left: 68rpx;
				}

				.middle {
					flex: 1;

					margin-left: 30rpx;

					.row1 {
						font-family: SourceHanSansCN-Medium;
						font-weight: 500;
						font-size: 32rpx;
					}

					.row2 {
						font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 24rpx;

						color: #000000;
						opacity: 0.4;
					}
				}

				.right {

					margin-right: 63rpx;

					.btn {
						height: 52rpx;
						background: #7F17FE;
						border-radius: 26rpx;


						font-family: SourceHanSansCN-Bold;
						font-weight: bold;
						font-size: 24rpx;
						color: #FFFFFF;
					}
				}
			}

			.sub-title {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 26rpx;
				color: #000000;
				opacity: 0.6;

				margin-bottom: 30rpx;
			}
		}

	}
</style>