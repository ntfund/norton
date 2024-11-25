<template>
	<com-nav-bar title="实名认证" :border="true" backgroundColor="#fff"></com-nav-bar>
	<view class="content">
		<view class="title1">上传身份信息</view>
		<view class="title2">为保障您的资金安全，需要验证身份信息</view>

		<view class="ids">
			<view class="title-3">
				请拍摄或上传您的身份证照片
			</view>
			<view class="id-view">
				<upload-id-img v-model:img="formData.card_img_front" icon="/static/images/c2c/certificate/back@2x.png"
					title="拍摄正面"></upload-id-img>
				<upload-id-img v-model:img="formData.card_img_back" icon="/static/images/c2c/certificate/front@2x.png"
					title="拍摄反面"></upload-id-img>
			</view>
		</view>

		<view class="infos">
			<view class="row1">拍摄身份证要求</view>
			<view class="row2">大陆公民持有的本人有效二代身份证;</view>
			<view class="row2">拍摄时确保身份证边框完整，字体清晰，亮度均匀;</view>
		</view>

		<view class="info-imgs">
			<view class="info-imgs_item">
				<view class="info-imgs_item_img">
					<image src="@/static/images/c2c/certificate/1@2x.png" mode="aspectFit"
						style="width: 160rpx; height: 92rpx;"></image>
					<image class="info-imgs_item_img_info" src="@/static/images/c2c/certificate/right@2x.png"
						mode="aspectFit" style="width: 30rpx; height: 30rpx;"></image>
				</view>
				<view class="info-imgs_item_title">标准</view>
			</view>
			<view class="info-imgs_item">
				<view class="info-imgs_item_img">
					<image src="@/static/images/c2c/certificate/2@2x.png" mode="aspectFit"
						style="width: 160rpx; height: 92rpx;"></image>
					<image class="info-imgs_item_img_info" src="@/static/images/c2c/certificate/error@2x.png"
						mode="aspectFit" style="width: 30rpx; height: 30rpx;"></image>
				</view>
				<view class="info-imgs_item_title">边框缺失</view>
			</view>
			<view class="info-imgs_item">
				<view class="info-imgs_item_img">
					<image src="@/static/images/c2c/certificate/3@2x.png" mode="aspectFit"
						style="width: 160rpx; height: 92rpx;"></image>
					<image class="info-imgs_item_img_info" src="@/static/images/c2c/certificate/error@2x.png"
						mode="aspectFit" style="width: 30rpx; height: 30rpx;"></image>
				</view>
				<view class="info-imgs_item_title">照片模糊</view>
			</view>
			<view class="info-imgs_item">
				<view class="info-imgs_item_img">
					<image src="@/static/images/c2c/certificate/4@2x.png" mode="aspectFit"
						style="width: 160rpx; height: 92rpx;"></image>
					<image class="info-imgs_item_img_info" src="@/static/images/c2c/certificate/error@2x.png"
						mode="aspectFit" style="width: 30rpx; height: 30rpx;"></image>
				</view>
				<view class="info-imgs_item_title">闪光强烈</view>
			</view>
		</view>

		<view class="n-bottom-white">
			<button type="button" class="n-btn" @click="next()">下一步</button>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive, toRaw
	} from 'vue';
	import uploadIdImg from './upload-id-img.vue';
	import tools from '../../../utils/tools';

	let formData = reactive({
		card_img_front: '',
		card_img_back: '',
	})

	const next = () => {
		if (formData.card_img_front == '') {
			tools.toast('请上传身份证正面');
			return;
		}
		if (formData.card_img_back == '') {
			tools.toast('请上传身份证反面');
			return;
		}
		
		tools.navigateToWithEncodeMultiply('/pages/market/certificate/certificate', {identity: toRaw(formData)})
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


		.ids {
			margin-top: 85rpx;

			.title-3 {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 26rpx;
			}

			.id-view {
				display: flex;
				justify-content: space-between;

				padding-top: 33rpx;
			}
		}

		.infos {
			margin-top: 77rpx;

			.row1 {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 30rpx;

				padding-bottom: 16rpx;
			}

			.row2 {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 24rpx;
				color: #000000;
				line-height: 36rpx;
				opacity: 0.6;

			}

			.row3 {}
		}


		.info-imgs {
			margin-top: 52rpx;

			display: flex;
			justify-content: space-between;

			&_item {

				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				&_img {
					position: relative;

					display: flex;
					justify-content: center;



					&_info {
						position: absolute;
						bottom: -15rpx;
						z-index: 2;
					}
				}

				&_img::after {
					content: '';
					width: 156rpx;
					height: 88rpx;

					border: 2rpx dashed #eee;
					border-radius: 4rpx;

					position: absolute;
					left: 0;
					top: 0;
					z-index: 1;
				}

				&_title {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 26rpx;
					color: #000000;
					line-height: 36rpx;
					opacity: 0.4;

					margin-top: 30rpx;
				}
			}
		}
	}
</style>