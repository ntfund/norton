<template>
	<view>
		<view class="img-view" @tap="previewVideo()">
			<image :src="frame" mode="aspectFill"
				:style="{'width': data.msg.content.w+'px','height': data.msg.content.h+'px'}">
			</image>
			<view class="upload" v-if="isUpload && percent < 100">
				<text>{{percent}}%</text>
			</view>			
			<div class="loader loader-video" v-if="isPlaying"></div>
			<view class="app_play" v-else>
				<image mode="aspectFit" style="width: 60rpx; height: 60rpx;" src="/static/images/play.png"
					></image>
			</view>			
		</view>

		<view v-if="tempVideoUrl" class="mask">
			<image @tap="closeVideo" class="_root" src="/static/images/close.png" mode="widthFix"></image>

			<view class="block" @tap.stop>
				<video v-if="tempVideoUrl" :id="'video' + props.data.msg.id" show-play-btn object-fit="cover"
					class="block_video" autoplay="true" :src="tempVideoUrl"></video>
			</view>
		</view>

		<!-- <com-video-thumb :data="props.data.msg" @res="frameRes"></com-video-thumb> -->

		<db-getTitlecover v-if="cover && isAndroid" :tempFilePath="project.getFullURL(props.data.msg.content.url)"
			@res="frameRes"></db-getTitlecover>
		<view :tempFilePath="tempFilePath" :change:tempFilePath="canvas.prevvideo">
		</view>
	</view>
</template>

<script setup>
	import {
		inject,
		nextTick,
		onUnmounted,
		ref,
		watch
	} from 'vue';
	import tools from '@/utils/tools';
	import project from '@/utils/project';
	import s3Helper from '@/utils/s3Helper';

	const http = uni.$u.http
	const show = ref(false);
	const props = defineProps(["data"])
	const percent = ref(0)
	const cover = ref(true)
	const isPlaying = ref(false)
	const isAndroid = ref(false)
	const isUpload = ref(props.data.msg.status && props.data.msg.status == "uploading");
	let platform = uni.getSystemInfoSync().platform; //首先判断app是安卓还是ios
	isAndroid.value = platform == "android"

	const tempVideoUrl = ref('');
	const tempFilePath = ref('');
	const frame = ref('');
	const frameRes = async (res) => {
		// await nextTick();
		cover.value = false;
		// await nextTick();
		frame.value = res.frame
		// await nextTick();
	}
	const room_id = inject('room_id');

	const previewVideo = () => {
		// uni.$emit('talk_big_full', true)
		// tempVideoUrl.value = project.getFullURL(props.data.msg.content.url);
		// let videoContext = uni.createVideoContext('video' + props.data.msg.id)
		// videoContext.requestFullScreen();
		// videoContext.showStatusBar();
		// videoContext.play();
		// return;

		if (isAndroid.value) {
			uni.$emit('talk_big_full', true)
			tempVideoUrl.value = project.getFullURL(props.data.msg.content.url);
		} else {
			tempFilePath.value = project.getFullURL(props.data.msg.content.url);
			isPlaying.value = true;
			setTimeout(() => {
				tempFilePath.value = ''
				isPlaying.value = false;
			}, 2500)
			// uni.navigateTo({
			// 	url: '/pages/chat/talk/prevvideo?tempFilePath=' + props.data.msg.content.url
			// })
		}

	}

	const closeVideo = () => {
		uni.$emit('talk_big_full', false)
		let videoContext = uni.createVideoContext('video' + props.data.msg.id)
		// videoContext.exitFullScreen();
		// videoContext.hideStatusBar();
		videoContext.pause();
		videoContext.stop();

		tempVideoUrl.value = '';
	}

	if (isUpload.value) {

		//此字段属性只有本地选择文件发送才生成， 服务器不记录。 如果是本地就就开始上传文件。
		let file = props.data.msg.file;

		s3Helper.upload({
			file: file,
			success: res => {
				const url = res.fullPath
				let msg = {
					url: url,
					w: file.width,
					h: file.height,
					duration: file.duration,
					size: file.size,
					name: file.name,
					uuid: props.data.msg.content.uuid
				};

				project.sendMsg(room_id, msg, 'video')
			},
			progress: (value) => {
				percent.value = value;
			}
		}, 'videos')
	}

	// let video_time_update_status = true;
	// const video_time_update = (e) => {
	// 	// e.detail.duration 为视频总长度，在没有加载到视频的时候总长度为 -0.0001
	// 	// 当获取到视频长度后进入if
	// 	if (video_time_update_status && e.detail.duration > 0) {
	// 		// 第一次进入if 关闭更新状态，防止循环暂停
	// 		video_time_update_status = false;
	// 		// 获取视频
	// 		let videoContext = uni.createVideoContext('myVideo');
	// 		// 暂停视频
	// 		videoContext.pause();
	// 	}
	// }

	onUnmounted(() => {
		tempVideoUrl.value = ''
	})
</script>

<script module="canvas" lang="renderjs">
	export default {
		data() {
			return {
				videoRender: null
			}
		},
		mounted() {
			
		},
		methods: {
			prevvideo(nV, oV, ownerInstance) {
				if (nV) {
					console.log('prevvideo', nV)
					// this.videoRender.src = vdoSrc
					// 设置播放源
					const video = document.createElement('video')
					console.log('createElement video mounted')
					video.currentTime = 0
					video.crossOrigin = 'anonymous'
					video.preload = 'auto';
					video.autoplay = true;
					video.muted = false

					video.innerHTML = '<source src=' + nV + ' type="audio/mp4" />'

				}
			}
		}
	}
</script>

<style lang="scss">
	.img-view {
		border-radius: 16rpx;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #373737;

		image {
			max-width: 350upx;
			max-height: 350upx;

			border-radius: 16rpx;
		}

		.upload {
			position: absolute;
			z-index: 2;

			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .35);

			border-radius: 16rpx;

			display: flex;
			justify-content: center;
			align-items: center;

			text {
				color: white;
			}
		}

		.app_play {
			position: absolute;
			z-index: 1;
			// top: 50%;
			// left: 50%;
			// transform: translate(-50%, -50%);
			width: 60rpx;
			height: 60rpx;
			background: rgba(0, 0, 0, .1);

			border-radius: 50%;

			display: flex;
			justify-content: center;
			align-items: center;
		}
		
		.loader-video {
			position: absolute;
			z-index: 2;
		}
	}

	.img-view:active {
		background: #eee;
	}

	.video {
		position: relative;
		background: green;

		// .video-view {
		// 	position: absolute;
		// 	left: 0;
		// 	top: 0;
		// 	right: 0;
		// }
	}

	._video {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}


	.remove {
		position: absolute;
		top: 0;
		right: 0;
		background-color: #373737;
		height: 50rpx;
		width: 50rpx;
		border-bottom-left-radius: 200rpx;
		z-index: 97;

		.image {
			width: 20rpx;
			height: 20rpx;
			position: absolute;
			right: 12rpx;
			top: 12rpx;
		}
	}

	.mask {
		background-color: #000;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 10000;

		.block {
			padding: 0 30rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 100%;

			.block_video {
				width: 100%;
				height: 78vh;
			}
		}

		._root {
			width: 60rpx;
			height: 60rpx;
			position: absolute;
			left: 40rpx;
			top: 5vh
		}
	}

	.loader {
		border: 5px solid #f3f3f3;
		border-top: 5px solid #555;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		display: inline-block;
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>