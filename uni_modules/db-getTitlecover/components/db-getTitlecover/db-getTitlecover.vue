<template>
	<view :tempFilePath="tempFilePath" :change:tempFilePath="canvas.getVideoCanvas">
	</view>
</template>
<script>
	export default {
		props: {
			tempFilePath: '',
			s: 1
		},
		methods: {
			getVideoPoster(path) {
				this.$emit('res', path)
			}
		}
	}
</script>
<script module="canvas" lang="renderjs">
	var s = 1
	export default {
		methods: {
			getS(nv) {
				s = nv || 1
			},
			async getVideoCanvas(nV, oV, ownerInstance) {
				if (nV) {
					// console.log("ssss", this.s);
					const frame = await this.captureFrame(nV, 1)
					this.$ownerInstance.callMethod('getVideoPoster', {
						frame,
					})

				}
			},
			captureFrame(vdoSrc, time = 0) {
				return new Promise((resolve) => {
					const video = document.createElement('video')
					console.log('createElement video', vdoSrc)
					video.currentTime = time
					video.crossOrigin = 'anonymous'
					// 设置为自动播放和静音
					video.setAttribute('preload', 'auto')
					video.setAttribute('autoplay', true)
					video.setAttribute('muted', true)

					video.muted = true
					// vdo.setAttribute('preload', 'auto');
					// vdo.setAttribute('autoplay', true);
					// vdo.setAttribute('show-progress', false);
					// vdo.setAttribute('style', 'width:0;height:0; display:none;');
					// video.autoplay = true;
					// vdo.src = vdoSrc
					// 设置播放源
					video.innerHTML = '<source src=' + vdoSrc + ' type="audio/mp4" />'

					// vdo.oncanplay = async () => {
					// 	const frame = await this.drawVideo(vdo)
					// 	vdo.pause();
					// 	vdo.style = 'display:none;'
					// 	vdo.remove();
					// 	resolve(frame)
					// }

					// video.loadeddata = async () => {
					// 	const frame = await this.drawVideo(video)

					// 	resolve(frame)
					// }

					video.addEventListener('loadeddata', function() {
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
							video.innerHTML = ""
							video.pause()
							video.remove();
						})

						//下面代码可以用来将b64转图片存本地用于文件上传
						//bitmap.loadBase64Data(poster, () => {
						//	const url = '_doc/poster.png'
						//	bitmap.save(url, {
						//		overwrite: true
						//	}, e => {
						//		const {
						//			target
						//		} = e
						//		console.log(target, 'target');
						//		ownerInstance.callMethod('selectedImage', target)
						//	})
						//})
					});
					
					
				})
			},

			drawVideo(vdo) {
				return new Promise((resolve) => {
					const cvs = document.createElement('canvas')
					const ctx = cvs.getContext('2d')
					cvs.width = vdo.videoWidth
					cvs.height = vdo.videoHeight
					ctx.drawImage(vdo, 0, 0, cvs.width, cvs.height)

					// 创建blob对象
					cvs.toBlob((blob) => {
						resolve(URL.createObjectURL(blob))
					})
				})
			}

		}
	}
</script>
<style>
</style>