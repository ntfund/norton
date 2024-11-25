<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			console.log('Blank onLoad')
			if (getApp().globalData.isLaunch) {
				console.log('App vue isLaunch is true')
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
			
			uni.$once('onLaunch', () => {
				uni.switchTab({
					url: '/pages/index/index'
				})
			})
			
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
