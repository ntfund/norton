<template>
	<view>
		<button type="button" @click="upload">上传</button>
	</view>
</template>
<script setup>
	import CryptoJS from 'crypto-js';
	import Base64 from 'base-64'
	import {
		encodeBase64
	} from 'ethers';
	import {
		onMounted
	} from 'vue';
	import s3Helper from '@/utils/s3Helper';

	const upload = () => {
		uni.chooseImage({
			sourceType: ["album"],
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			success: (res) => {
				console.log('res', res)
				for (let i = 0; i < res.tempFilePaths.length; i++) {
					uni.getImageInfo({
						src: res.tempFilePaths[i],
						success: (image) => {
							console.log(image.width);
							console.log(image.height);
							//上传到服务器，获取服务器地址
							

							s3Helper.upload({
								file: {
									path: res.tempFilePaths[i],
									name: res.tempFiles[i].name,
									type: res.tempFiles[i].type,
									size: res.tempFiles[i].size
								},
								success: res => {
									console.log(res)
								}
							}, 'images')
							
						}
					});
				}
			}
		});
	}
</script>

<style lang="scss">

</style>