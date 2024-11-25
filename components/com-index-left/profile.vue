<template>
	<u-popup :show="props.show" mode="left" @close="close" @open="open" :safeAreaInsetTop="false"
		:safeAreaInsetBottom="false" bgColor="#fff">
		<view class="content">
			<com-nav-bar title="" backgroundColor="#fff" @clickLeft="close()">
			</com-nav-bar>
			<scroll-view class="content_scroll-view" scroll-y="true" upper-threshold="50">
				<view class="flex avatar  items-center justify-between">
					<view class="img_border" @click="uploadAvatar">
						<image class="img rounded-full" :src="project.getFullURL(userStore.user.avatar)"
							mode="aspectFill" style="width: 120rpx; height: 120rpx;">
						</image>
					</view>
					<view class="flex justify-start items-start flex-col ml-4 flex-1">
						<view class="name flex items-center ">
							<view>{{userStore.user.nickname}}</view>
							<image :src="'/static/images/profile/vip/'+userStore.user.real_vip+'@2x.png'"
								mode="aspectFit" style="width: 120rpx; height: 30rpx; margin-left: 18rpx;"></image>
						</view>
						<view class="uid flex items-center">
							<view>账户UID:{{userStore.user.uid}}</view>
							<image src="@/static/images/left/copy6@2x.png" mode="aspectFit"
								style="width: 22rpx; height: 22rpx; margin-left: 15rpx;"
								@click.stop="tools.copyClick(userStore.user.uid)"></image>
						</view>
						<view class="uid flex items-center" style="padding-top: 0;">
							<view>邀请码：{{userStore.user.yqm}}</view>
							<image src="@/static/images/left/copy6@2x.png" mode="aspectFit"
								style="width: 22rpx; height: 22rpx; margin-left: 15rpx;"
								@click.stop="tools.copyClick(userStore.user.uid)"></image>
						</view>
					</view>
				</view>

				<com-index-left-tab v-model:current="current" :list="list" @change="swtichSwiper"></com-index-left-tab>

				<com-index-left-tab1 v-if="current == 0"></com-index-left-tab1>
				<com-index-left-tab2 v-if="current == 1"></com-index-left-tab2>
				<com-index-left-tab3 ref="tab3" v-if="current == 2"></com-index-left-tab3>

			</scroll-view>
		</view>
	</u-popup>

</template>

<script setup lang="ts">
	import project from '@/utils/project';
	import tools from '@/utils/tools';
	import { useUserStore } from '@/stores/modules/user'
	import {
		onBackPress
	} from '@dcloudio/uni-app';
	import { ref } from 'vue';

	const userStore = useUserStore()
	const tab3 = ref(null)


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

									uni.$u.http.put('/chat/user/' + userStore.user.id, { avatar: res.src }).then(data => {
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

	const props = defineProps(['show'])
	const emit = defineEmits(['update:show', "change"]);
	const current = ref(0)
	const list = ['个人资料', '安全中心', '偏好设置']

	const open = () => {
		// console.log('open');
	}
	const close = () => {
		console.log('close')
		emit('update:show', false);
	}

	const swtichSwiper = (index) => {

	}

	onBackPress(options => {
		if (options.from === 'navigateBack') {
			return false;
		}
		if (!tab3.value.showUnit && !tab3.value.showLang) {
			close();
		}
		
		return true;
	})
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		height: 100vh;

		&_scroll-view {
			height: calc(100vh - 110rpx - var(--status-bar-height))
		}

		.my-list {
			margin: 0 29rpx;
			padding: 54rpx 0;


			&_border {
				border-bottom: 2px solid #EEEEEE;
				outline: #7F17FE 2px;
			}

			.title {
				font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 32rpx;
				color: #000000;

			}

			.icons {

				padding-top: 50rpx;
				padding-left: 50rpx;
				padding-right: 50rpx;

				.icon-item {
					// @apply py-4 text-center;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.iconfont {
						font-size: 30px;
					}

					.sub-title {
						font-family: SourceHanSansCN-Medium;
						font-weight: 500;
						font-size: 26rpx;
						color: #000000;

						margin-top: 10rpx;
					}
				}

			}
		}

		.abount {
			margin-top: 302rpx;

			height: 139rpx;

			padding: 0 29rpx;

			border-top: 2rpx solid #EEEEEE;

			&_title {
				font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 32rpx;
				color: #000000;
			}

			&_version {
				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 30rpx;
				color: #999;

				.iconfont {
					margin-left: 20rpx;
					font-weight: bold;
					color: #999;
				}
			}
		}
	}


	.avatar {
		padding: 25rpx 29rpx 31rpx 29rpx;

		// border-bottom: 1px solid #eaeaea;

		.img_border {}

		.img {
			// width: 120rpx;
			// height: 120rpx;			

			border: 2rpx solid #7F17FE;
			border-radius: 50%;
		}

		.name {
			@apply text-xl font-bold;
		}

		.uid {
			font-family: Gilroy-Medium;
			font-weight: 500;
			font-size: 24rpx;
			color: #000000;
			opacity: 0.6;

			padding: 10rpx 0 15rpx 0;
		}

		.card {
			padding: 5rpx 5rpx 4rpx 6rpx;

			border-radius: 4rpx;

			display: flex;
			align-items: center;
			justify-content: center;
		}

		.yes {
			color: $uni-color-success;
		}

		.no {
			// color: $uni-color-warning;
			background: #000000;
			border-radius: 4rpx;
			opacity: 0.4;

			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 22rpx;
			color: #FFFFFF;


		}

		.setting {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 22rpx;
			color: #000000;
			opacity: 0.6;

			margin-left: 16rpx;
		}
	}
</style>