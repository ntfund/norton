<template>
	<view class="qrcode">
		<view class="qrcode_bg" @longtap="saveTo">
			<canvas id="qrcode" canvas-id="qrcode" class="text-center w-[200px] h-[200px]"></canvas>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	import UQRCode from 'uqrcodejs';

	const props = defineProps(['data'])

	onMounted(() => {
		// 获取uQRCode实例
		var qr = new UQRCode();
		// 设置二维码内容
		qr.data = props.data;
		// 设置二维码大小，必须与canvas设置的宽高一致
		qr.size = 200;
		// 调用制作二维码方法
		qr.make();
		// 获取canvas上下文
		var canvasContext = uni.createCanvasContext('qrcode', this); // 如果是组件，this必须传入
		// 设置uQRCode实例的canvas上下文
		qr.canvasContext = canvasContext;
		// 调用绘制方法将二维码图案绘制到canvas上
		qr.drawCanvas();
	})

	const saveTo = () => {
		uni.canvasToTempFilePath({
				canvasId: "qrcode",
				fileType: "png",
				width: 200,
				height: 200,
				success: res => {
					// console.log(res);
					// console.log(res.tempFilePath)
					const tempFilePath = res.tempFilePath
					uni.saveImageToPhotosAlbum({
						filePath: tempFilePath,
						success: res => {
							console.log(res);
							uni.showToast({
								title: '已保存至相册',
								icon: 'success'
							})
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
	}
	
	defineExpose({saveTo})
</script>

<style lang="scss" scoped>
	.qrcode {
		display: flex;
		justify-content: center;
		align-items: center;

		&_bg {
			padding: 10px;
			background: #fff;

			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>