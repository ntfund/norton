<template>
	<view>
		<view :tempFilePath="tempFilePath" :change:tempFilePath="canvas.prevvideo">
		</view>
	</view>
</template>

<script>
	export default {
		
		onLoad(options) {
			console.log(options)
			this.tempFilePath = options.tempFilePath
		},
		data() {
			return {
				tempFilePath: ''
			}
		},
		methods: {
			
		}
	}
</script>

<script module="canvas" lang="renderjs">
	export default {
		methods: {
			prevvideo(nV, oV, ownerInstance) {
				if (nV) {
					const video = document.createElement('video')
					console.log('createElement video', nV)
					video.currentTime = 1
					video.crossOrigin = 'anonymous'
					video.preload = 'auto';
					video.autoplay = true;
					video.muted = false
					// vdo.src = vdoSrc
					// 设置播放源
					video.innerHTML = '<source src=' + nV + ' type="audio/mp4" />'
				}
			}
		}
	}
</script>

<style>

</style>
