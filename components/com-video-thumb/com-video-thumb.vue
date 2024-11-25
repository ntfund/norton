<template>
	<view v-if="isShow">
		<video class="block_video video" :id="'myVideo' + data.id" :src="project.getFullURL(data.content.url)"
			autoplay></video>
		<view :videoContext="videoContext" :change:videoContext="canvas.getVideoCanvas">
		</view>
	</view>
</template>

<script setup>
	import project from '@/utils/project';
</script>

<script>
	export default {
		props: {
			data: {
				default: Object
			}
		},
		data() {
			return {
				videoContext: null,
				isShow: true
			}
		},
		mounted() {
			console.log('com-video-thumb mounted')
			this.videoContext = uni.createVideoContext('myVideo' + this.data.id)
		},
		methods: {
			getVideoPoster(path) {
				this.$emit('res', path)
				this.isShow = false
			}
		}
	}
</script>

<script module="canvas" lang="renderjs">
	export default {
		methods: {
			async getVideoCanvas(nV, oV, ownerInstance) {
				if (nV) {
					// console.log("ssss", this.s);
					const frame = await this.captureFrame(nV, 1)
					this.$ownerInstance.callMethod('getVideoPoster', {
						frame,
					})

				}
			},
			captureFrame(video, time = 0) {
				return new Promise((resolve) => {
					let canvas = document.createElement("canvas"),
						width = video.videoWidth, //canvas的尺寸和图片一样
						height = video.videoHeight;
					canvas.width = width;
					canvas.height = height;
					canvas.getContext("2d").drawImage(video, 0, 0, width, height); //绘制canvas

					// let poster = canvas.toDataURL('image/jpeg'); //转换为base64
					// ownerInstance.callMethod('getPoster', poster)
					// const bitmap = new plus.nativeObj.Bitmap('test');

					// 创建blob对象
					canvas.toBlob((blob) => {
						resolve(URL.createObjectURL(blob))

						// 暂停并销毁 video 元素
						console.log('暂停并销毁 video 元素')
						// video.innerHTML = ""
						video.pause()
						video.stop()
						// video.remove();
					})
				})
			}
		}
	}
</script>

<style>

</style>