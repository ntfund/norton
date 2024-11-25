<template>
	<!-- <uni-nav-bar :fixed="true" :border="false" backgroundColor="#7061ff" color="#fefefe" :statusBar="true"
		left-icon="left" title="" @clickLeft="clickLeft">
	</uni-nav-bar> -->
	<com-nav-bar title="" color="white" backgroundColor="#7F17FE"></com-nav-bar>
	<view class="qrcode">
		<view class="qrcode_container">
			<view class="qrcode_container_avatar_v">
				<view class="qrcode_container_avatar">
					<image :src="userStore.getFullAvatar()" mode="aspectFit" style="width: 180rpx; height: 180rpx;"
						class="rounded-full " />
				</view>
			</view>
			<view class="nickname">{{userStore.user.nickname}}</view>
			<view class="uid flex items-center">
				<view>UID</view>
				<view class="ml-[10px]">{{userStore.user.nickname}}</view>
			</view>
			<!-- <qrcode-vue :value="address" :size="200" level="H" class="mt-4" /> -->
			<view class="qrcode_img">
				<canvas ref="uqrcode" id="qrcode" canvas-id="qrcode" class="text-center w-[212px] h-[212px] "></canvas>
			</view>
			<view class="info">扫一扫二维码，加我为朋友</view>
			<!-- <u-button text="复制地址" type="primary" class="my-2" @click="tools.copyClick(address)"></u-button> -->
		</view>
	</view>
	<view class="footer">
		<view class="footer_container flex justify-around items-center">
			<view class="qrcode_item flex flex-col items-center">
				<image src="@/static/images/profile/share@2x.png" mode="aspectFit" style="width: 37rpx; height: 37rpx;">
				</image>
				<view class="qrcode_item_txt">分享</view>
			</view>
			<view class="qrcode_item flex flex-col items-center" @click="save">
				<image src="@/static/images/profile/save@2x.png" mode="aspectFit" style="width: 37rpx; height: 39rpx;">
				</image>
				<view class="qrcode_item_txt">保存</view>
			</view>
			<view class="qrcode_item flex flex-col items-center" @click="scan">
				<image src="@/static/images/profile/scan@2x.png" mode="aspectFit" style="width: 36rpx; height: 36rpx;">
				</image>
				<view class="qrcode_item_txt">扫一扫</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import tools from '@/utils/tools'
	import UQRCode from 'uqrcodejs';

	import { onMounted, ref, watchEffect } from "vue";

	import { useUserStore } from '@/stores/modules/user'
	import secret from '@/utils/secret';
	
	const userStore = useUserStore()
	const uqrcode = ref(null)

	const address = ref('')
	watchEffect(() => {
		address.value = secret.encode(JSON.stringify({act: 'add_friend', id: userStore.user.uid}))
	})

	const clickLeft = () : void => {
		tools.navigateBack()
	}
	onMounted(() => {
		// 获取uQRCode实例
		var qr = new UQRCode();
		// 设置二维码内容
		qr.data = address.value;
		// 设置二维码大小，必须与canvas设置的宽高一致
		qr.size = 212;
		// 调用制作二维码方法
		qr.make();
		// 获取canvas上下文
		var canvasContext = uni.createCanvasContext('qrcode', this); // 如果是组件，this必须传入
		// 设置uQRCode实例的canvas上下文
		qr.canvasContext = canvasContext;
		// 调用绘制方法将二维码图案绘制到canvas上
		qr.drawCanvas();
	})

	//保存
	const save = () => {
		// uqrcode为组件的ref名称
		// uqrcode.value.save({
		// 	success: () => {
		// 		uni.showToast({
		// 			icon: 'success',
		// 			title: '保存成功'
		// 		});
		// 	}
		// });

		setTimeout(() => {
			uni.canvasToTempFilePath(
				{
					canvasId: "qrcode",
					fileType: "png",
					width: 212,
					height: 212,
					success: res => {
						console.log(res);
						console.log(res.tempFilePath)

						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: res => {
								console.log(res);
								uni.showToast({
									icon: 'success',
									title: '保存成功'
								});
							},
							fail: err => {
								console.log(err);
							}
						});
					},
					fail: err => {
						console.log(err);
					}
				},
				// this // 组件内使用必传当前实例
			);
		}, 300);
	}

	const scan = async () => {
		let res = await tools.scanCode();
		console.log(res)
	}
</script>

<style lang="scss">
	page {
		background-color: #7F17FE;
	}

	.qrcode {
		width: 694rpx;
		// height: 826rpx;
		background: #FFFFFF;
		border-radius: 24rpx;

		margin: 0 auto;
		margin-top: 200rpx;

		&_container {
			padding: 30rpx;
			
			display: flex;
			flex-direction: column;
			// justify-content: center;
			align-items: center;


			&_avatar_v {
				height: 100rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				position: relative;
			}

			&_avatar {
				position: absolute;
				top: -80rpx;

				background-color: white;

				border-radius: 50%;
			}

			.nickname {
				font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 48rpx;
				color: #000000;

				margin-top: 44rpx;
			}

			.uid {
				font-family: Gilroy-Regular;
				font-weight: 400;
				font-size: 30rpx;
				color: #000000;
				opacity: 0.6;

				margin-top: 10rpx;
			}

			.info {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 30rpx;
				color: #000000;
				opacity: 0.6;

				margin-top: 20rpx;
			}

			.qrcode_img {
				margin-top: 55rpx;
			}
		}
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;

		&_container {
			width: 750rpx;
			padding-bottom: 82rpx;
		}
	}

	.qrcode_item {
		&_txt {
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;

			margin-top: 25rpx;
		}
	}
</style>