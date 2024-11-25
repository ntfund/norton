<template>
	<view class="py-1">
		<view :class="classProps" class=" flex items-center justify-center" style="border-radius: 8rpx; border: 2rpx solid #EEEEEE;" @click="uploadImg">
			<!-- <uni-icons type="plusempty" color="#aaa" size="30" v-if="!imgSrc"></uni-icons> -->
			<image src="@/static/images/plus@2x.png" mode="aspectFit" style="width: 52rpx; height: 52rpx;" v-if="!imgSrc"></image>
			<image :src="imgSrc" mode="heightFix" :class="classProps" v-else>
			</image>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	// import { ref } from "vue";
	import project from '@/utils/project.js';
	const props = defineProps(['img', 'class'])
	const emit = defineEmits(['update:img']);
	const imgSrc = ref(project.getFullURL(props.img));
	const classProps = ref(props.class);
	if (!props.class) {
		classProps.value = 'w-[125px] h-[125px]'
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
						if (uploadFileRes.statusCode != 200) {
							uni.showToast({
								title: '当前网络异常，请退出APP再尝试',
								icon: 'error',
								duration: 5000
							})
							return;
						}
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

<style lang="less" scoped>

</style>