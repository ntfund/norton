<template>
	<view class="list p-4">
		<view class="item py-2 flex justify-between items-center">
			<text class="">头像</text>
			<view class=" flex " @click="uploadAvatar">
				<image :src="userStore.getFullAvatar()" mode="widthFix" width="60" height="60" style="width: 120rpx; height: 120rpx;"
					class="rounded-full " />
				<u-icon name="arrow-right" class="ml-2"></u-icon>
			</view>
		</view>
		<view class="item py-6 flex justify-between items-center"
			@click="tools.navigateTo('/pages/chat/profile/changeName')">
			<text class="">名称</text>
			<view class=" flex right">
				<view>{{userStore.user.nickname}}</view>
				<u-icon name="arrow-right" class="ml-2"></u-icon>
			</view>
		</view>
		<view class="item py-6 flex justify-between items-center"
			@click="tools.navigateTo('/pages/chat/profile/qrcode')">
			<text class="">二维码名片</text>
			<view class=" flex right">
				<u-icon name="grid" size="22" class="ml-2"></u-icon>
				<u-icon name="arrow-right" class="ml-2"></u-icon>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import tools from '@/utils/tools'

	import { useUserStore } from '@/stores/modules/user'
	const userStore = useUserStore()
	
	
	//选照片 or 拍照
	const uploadAvatar = () => {
		uni.chooseImage({
			count: 1, //默认9
			sourceType: ['album', 'camera'],
			crop: {
				quality: 80,
				width: 100,
				height: 100
			}, //可以指定是原图还是压缩图，默认二者都有
			success: (res) => {
				for (let i = 0; i < res.tempFilePaths.length; i++) {
					uni.getImageInfo({
						src: res.tempFilePaths[i],
						success: (image) => {
							console.log(image.width);
							console.log(image.height);
							//上传到服务器，获取服务器地址
	
							uni.uploadFile({
								url: uni.$u.http.config.baseURL + '/api/upload/uploadChatImg', //仅为示例，非真实的接口地址
								filePath: res.tempFilePaths[i],
								name: 'image',
								header: {
									'Accept': 'application/json',
									'Access-Control-Allow-Origin': '*',
									'Authorization': `Bearer ${uni.getStorageSync('token')}`
								},
								success: (uploadFileRes) => {
									console.log('uploadFileRes', uploadFileRes.data);
									const res = JSON.parse(uploadFileRes.data)
									// let msg = { url: res.tempFilePaths[i], w: image.width, h: image.height };
									// let msg = { url: res.src, w: image.width, h: image.height };
									userStore.setUserValue('avatar', res.src)
									
									uni.$u.http.put('/chat/user/' + userStore.user.id, {avatar : res.src}).then(data => {
										uni.$u.toast("头像修改成功")
									})
								}
							});
	
						}
					});
				}
			}
		});
	}
	
</script>

<style lang="less" scoped>
	.item {
		border-bottom: 1px solid #efefef;

		.right {
			@apply text-gray-500;
		}
	}
</style>