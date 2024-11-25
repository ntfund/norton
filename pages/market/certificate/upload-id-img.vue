<template>
	<view>
		<view class="id-view_content" @click="uploadImg">
			<view class="id-view_content_img">
				<image v-if="!imgSrc" :src="icon" mode="aspectFit" style="width: 326rpx; height: 220rpx;"></image>
				<image :src="imgSrc" mode="aspectFit" style="width: 302rpx; height: 191rpx;" v-else>
				</image>
			</view>
			<view class="pai">
				{{title}}
			</view>
		</view>		
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";
	// import { ref } from "vue";
	import project from '@/utils/project.js';
	const props = defineProps(['img', 'class', 'title', 'icon'])
	const emit = defineEmits(['update:img']);
	const imgSrc = ref(project.getFullURL(props.img));
	const classProps = ref(props.class);
	if (!props.class) {
		classProps.value = 'w-[151px] h-[96px]'
	}
	// const qrCode = ref('');

	const uploadImg = () => {
		uni.chooseImage({
			count: 1,
			sourceType: ['album'],
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			success: (res) => {
				console.log(res.tempFilePaths)
				//先上传到服务器，取得URL，再返回
				// emit('update:img', res.tempFilePaths[0]);

				let imageSrc = res.tempFilePaths[0]
				uni.showLoading({
					title: '上传中'
				})
				uni.uploadFile({
					url: uni.$u.http.config.baseURL + '/api/upload/uploadFile', //仅为示例，非真实的接口地址
					filePath: imageSrc,
					name: 'file',
					header: {
						'Accept': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Authorization': `Bearer ${uni.getStorageSync('token')}`
					},
					success: (uploadFileRes) => {
						uni.hideLoading();
						uni.showToast({
							title: '上传成功',
							icon: 'success',
							duration: 1000
						})
						const res = JSON.parse(uploadFileRes.data)
						// this.imageSrc = imageSrc
						emit('update:img', res.src);
						imgSrc.value = imageSrc;
					},
					fail: (err) => {
						console.log('uploadImage fail', err);
						uni.hideLoading();
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
					},
				});

				// formData.weixinQrcode = res.tempFilePaths[0];
				// console.log(formData.alipayQrcode)
				// for (let i = 0; i < res.tempFilePaths.length; i++) {
				// 	uni.getImageInfo({
				// 		src: res.tempFilePaths[i],
				// 		success: (image) => {
				// 			console.log(image.width);
				// 			console.log(image.height);
				// 			let msg = { url: res.tempFilePaths[i], w: image.width, h: image.height };
				// 			console.log(msg)
				// 		}
				// 	});
				// }
			}
		});
	}
</script>

<style lang="scss" scoped>
	.id-view_content {
		&_img {
			width: 326rpx;
			height: 220rpx;
			
			background: #F4F8FE;
			
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.pai {
			width: 326rpx;
			height: 62rpx;
			background: #4280F2;
			border-radius: 0px 0px 16rpx 16rpx;

			display: flex;
			justify-content: center;
			align-items: center;

			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 28rpx;
			color: #FFFFFF;
			
			
			text-align: center;
		}
	}
</style>