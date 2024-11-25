<template>
	<u-popup :show="props.show" mode="left" @close="close" @open="open" :safeAreaInsetTop="false" :safeAreaInsetBottom="false" bgColor="#fff">
		<view class="content">
			<com-nav-bar title="关于我们" :border="true" backgroundColor="#fff" @clickLeft="close()"></com-nav-bar>
			<view class="content_logo">
				<image class="content_logo_img" src="./logo_app@2x.png" mode="aspectFit"
					style="width: 142rpx; height: 142rpx;">
				</image>
				<view class="content_logo_title">Norton-app</view>
				<view class="content_logo_version">当前版本 {{version}}</view>
			</view>

			<view class="list-item" style="margin-top: 69rpx;" @click="aboutUs">
				<view class="list-item_left">关于我们</view>
				<view class="list-item_right list-item_arrow">
					<view></view>
				</view>
			</view>
			<view class="heng"></view>
			<view class="list-item">
				<view class="list-item_left">隐私协议</view>
				<view class="list-item_right list-item_arrow">
					<view></view>
				</view>
			</view>
			<view class="list-item" @click="checkUpdate">
				<view class="list-item_left">检查更新</view>
				<view class="list-item_right list-item_arrow">
					<view class="text-red" v-if="hasNew">发现新版本</view>
				</view>
			</view>
			<view class="list-item" @click="clearCache()">
				<view class="list-item_left">清除缓存</view>
				<view class="list-item_right list-item_arrow">
					<view>{{cacheSize}}</view>
				</view>
			</view>
		</view>
	</u-popup>

</template>

<script setup>
	import tools from '@/utils/tools';
	import {
		useUserStore
	} from '@/stores/modules/user'
	import {
		onBackPress
	} from '@dcloudio/uni-app';
	import {
		ref
	} from 'vue';

	const userStore = useUserStore()
	const version = uni.getSystemInfoSync().appWgtVersion || uni.getSystemInfoSync().appVersion;
	const hasNew = ref(false);

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

	const cacheSize = ref('');
	// 获取缓存
	const getAppInfo = () => {
		// #ifdef APP-PLUS
		plus.cache.calculate(size => {
			if (size < 1024) {
				cacheSize.value = size + 'B';
			} else if (size / 1024 >= 1 && size / 1024 / 1024 < 1) {
				cacheSize.value = Math.floor((size / 1024) * 100) / 100 + 'KB';
			} else if (size / 1024 / 1024 >= 1) {
				cacheSize.value = Math.floor((size / 1024 / 1024) * 100) / 100 + 'M';
			}
		});
		// #endif
	}
	getAppInfo();

	//清除缓存
	const clearCache = () => {
		// #ifdef APP-PLUS
		let os = plus.os.name;
		if (os == 'Android') {
			let main = plus.android.runtimeMainActivity();
			let sdRoot = main.getCacheDir();
			let files = plus.android.invoke(sdRoot, "listFiles");
			let len = files.length;
			for (let i = 0; i < len; i++) {
				let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
				plus.io.resolveLocalFileSystemURL(filePath, entry => {
					if (entry.isDirectory) {
						entry.removeRecursively(entry => { //递归删除其下的所有文件及子目录  	
							getAppInfo(); // 重新计算缓存
						}, function(e) {
							console.log(e.message)
						});
					} else {
						entry.remove();
					}
				}, function(e) {
					console.log('文件路径读取失败')
				});
			}
			uni.showToast({
				title: '缓存清理完成',
				duration: 2000
			});

		} else { // ios  
			plus.cache.clear(() => {
				uni.showToast({
					title: '缓存清理完成',
					duration: 2000
				});
				getAppInfo();
			});
		} 
		// #endif
		// #ifndef APP-PLUS
		uni.showToast({
			title: '缓存清理完成',
			duration: 2000
		});
		// #endif
	}

	const checkUpdate = () => {
		uni.showLoading({
			
		})
		setTimeout(() => {
			uni.hideLoading()
			uni.showToast({
				title: '当前已是最新版本',
				duration: 2000
			});
		}, 500)		
	}
	
	const aboutUs = () => {
		close()
		tools.navigateTo('/pages/index/about')
	}


	onBackPress(options => {
		if (options.from === 'navigateBack') {
			return false;
		}
		close();
		return true;
	})
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		height: 100vh;

		&_logo {
			margin-top: 154rpx;

			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;

			&_title {
				font-family: Gilroy-Bold;
				font-weight: bold;
				font-size: 48rpx;
				color: #000000;

				margin-top: 22rpx;
			}

			&_version {
				font-family: Gilroy-Medium;
				font-weight: 400;
				font-size: 28rpx;
				color: #999;

				// margin-top: 5rpx;
			}
		}

		.heng {
			width: 694rpx;
			height: 2rpx;
			margin: 18rpx 28rpx;
			background: #eee;

			border-radius: 50%;
		}

		.list-item {
			display: flex;
			justify-content: space-between;
			align-items: center;

			// padding: 35rpx 33rpx 34rpx 31rpx;
			padding: 0 33rpx 0 31rpx;
			height: 100rpx;

			&_left {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 32rpx;
				color: #000000;
			}

			&_right {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 28rpx;
				color: #999;

				display: flex;
				justify-content: center;
				align-items: center;
			}

			&_arrow::after {
				content: '';
				background: url('/static/images/home/arrow-right@2x.png') no-repeat;
				background-size: 12rpx 20rpx;

				width: 12rpx;
				height: 20rpx;
				margin-left: 16rpx;

			}
		}
	}
</style>