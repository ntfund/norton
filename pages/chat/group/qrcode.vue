<template>
	<com-nav-bar title="" color="white" backgroundColor="#7F17FE"></com-nav-bar>
	<view class="qrcode">
		<view class="qrcode_container">
			<view class="qrcode_container_avatar_v">
				<view class="qrcode_container_avatar ">
					<com-avatar class="shadow shadow-md" :data="room.avatar_list" width="200" height="200"></com-avatar>
				</view>
			</view>
			<view class="nickname">群聊：{{room.name}}</view>
			<!-- <view class="uid flex items-center">
				<view>群主：</view>
				<view class="ml-[10px]">{{room.admin}}</view>
			</view> -->
			<!-- <qrcode-vue :value="address" :size="200" level="H" class="mt-4" /> -->
			<view class="qrcode_img">
				<canvas ref="uqrcode" id="qrcode" canvas-id="qrcode" class="text-center w-[212px] h-[212px] "></canvas>
			</view>
			<view class="info">该二维码7天内有效，重新进入将更新</view>
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

	const props = defineProps(["room"])
	const room = JSON.parse(decodeURIComponent(props.room))
	// console.log('room', room)

	const userStore = useUserStore()
	
	const address = ref('')
	watchEffect(() => {
		address.value = secret.encode(JSON.stringify({act: 'join_romm', id: room.id, from_user_id: userStore.user.id, 'expirated_at': new Date().getTime() + 7 * 86400 * 1000}))
	})

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

				// border-radius: 50%;
				
				border-radius: 10rpx;
			}

			.nickname {
				font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 48rpx;
				color: #000000;

				margin-top: 44rpx;
				
				white-space: nowrap;
				text-overflow: ellipsis;
				
				overflow: hidden;
				width: 600rpx;
				
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