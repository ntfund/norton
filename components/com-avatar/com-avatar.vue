<template>
	<view>
		<view class="avatars" :style="getAvatarsStyle()">
			<image v-for="(itemImg, i) in props.data" :src="project.getFullURL(itemImg)" mode="aspectFit"
				class="avatarItem" :class="'avatarItem--' + props.data.length" ></image>
		</view>
	</view>
</template>

<script setup>
	import project from "@/utils/project"
	const props = defineProps(["data", 'width', 'height'])

	const getAvatarsStyle = () => {
		return 'width:' + (props.width ? props.width : 80) + 'rpx; height: ' + (props.height ? props.height : 80) +
		'rpx';
	}
	
	//未使用
	const getAatarItemStyle = () => {
		return 'width:' + (props.width ? props.width : 80) + 'rpx; height: ' + (props.height ? props.height : 80) +
		'rpx';
	}
	
</script>

<style lang="scss" scoped>
	//走微信九宫格样式
	.avatars {
		// width: 80rpx;
		// height: 80rpx;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		align-content: center;
		flex-wrap: wrap-reverse;
		// border: #c5c5c5 2rpx solid;
		// margin: 50rpx;
		background: #F9F9F9;
		border-radius: 18rpx;

		.avatarImg {
			// width: 80rpx;
			// height: 80rpx;
			width: 100%;
			height: 100%;
		}

		.avatarItem--1 {
			width: 98%;
			height: 98%;
		}

		.avatarItem--2,
		.avatarItem--3 {
			width: 47%;
			height: 47%;
			margin: 1%;
		}

		.avatarItem--4,
		.avatarItem--5,
		.avatarItem--6,
		.avatarItem--7,
		.avatarItem--8,
		.avatarItem--9 {
			width: 30%;
			height: 30%;
			margin: 1%;
		}

	}
</style>