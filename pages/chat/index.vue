<!-- 这个文件非入口 -->
<template>
	<uni-nav-bar :fixed="true" :border="false" backgroundColor="#F8F8F8" :statusBar="true" left-icon="bars"
		right-icon="plusempty" title="消息" @clickLeft="clickLeft" @clickRight="addClick">
	</uni-nav-bar>

	<view>
		<uni-list>
			<uni-list :border="true">
				<!-- 头像显示角标 -->
				<uni-list-chat v-for=" in 10" title="uni-app"
					avatar="https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png" note="您收到一条新的消息" time="06/04"
					badge-positon="left" badge-text="4"></uni-list-chat>
				<uni-list-chat title="uni-app" avatar="https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png"
					note="您收到一条新的消息" time="2020-02-02 20:20" badge-positon="left" badge-text="1"></uni-list-chat>
				<!-- 显示多头像 -->
				<uni-list-chat title="uni-app" :avatar-list="avatarList" note="您收到一条新的消息" time="2020-02-02 20:20"
					badge-positon="left" badge-text="dot"></uni-list-chat>
			</uni-list>
		</uni-list>
		
	</view>

<!-- 	<van-popover v-model:show="showPopover" :actions="actions">
		<template #reference>
			<van-button type="primary">展示图标</van-button>
		</template>
	</van-popover> -->
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	const avatarList = [{
		url: 'https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png'
	}, {
		url: 'https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png'
	}, {
		url: 'https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png'
	}]

	// const showPopover = ref(false);
	// const actions = [
	// 	{ text: '选项一', icon: 'add-o' },
	// 	{ text: '选项二', icon: 'music-o' },
	// 	{ text: '选项三', icon: 'more-o' },
	// ];


	const clickLeft = () : void => {
		console.log("click left")
	}

	const addClick = () : void => {
		console.log("right left")
	}
</script>

<style lang="less">

</style>