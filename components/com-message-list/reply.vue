<template>
	<view class="msg-reply" :class="{'room': showRoom}">
		<view class="text title" v-if="data.msg.type == 'text'">
			{{data.msg.userinfo.nickname}}: {{data.msg.content.text}}
		</view>
		<view class="img" v-else-if="data.msg.type == 'img'">
			<view class="title">{{data.msg.userinfo.nickname}}:</view>
			<image :src="project.getFullURL(data.msg.content.url)" mode="heightFix" style="height: 150rpx;"></image>
		</view>
		<view class="img" v-else-if="data.msg.type == 'voice'">
			{{data.msg.userinfo.nickname}}: 语音
		</view>
		<view class="img" v-else-if="data.msg.type == 'video'">
			{{data.msg.userinfo.nickname}}: 视频
		</view>
	</view>
</template>

<script setup>
	import {
		inject,
		ref
	} from 'vue';
	import project from '@/utils/project';
	const props = defineProps(["id", "dataList"])
	let data = props.dataList.find(x => x.msg.id == props.id)
	// const room = inject('room')
	const room_id = inject('room_id')
	let roomType = project.getRoomType(room_id)
	const showRoom = ref(roomType == "group")
	
	// console.log('data,', data)
</script>

<style lang="scss" scoped>
	.title {
		font-family: SourceHanSansCN-Regular;
		font-weight: 400;
		font-size: 22rpx;
		color: #00000099;
	}
	
	.text {
		max-width: 590rpx;
		border-radius: 8rpx;

		// background: rgba(238,238,238,.5);
		background: #EEEEEE;
		padding: 12rpx 15rpx;		
	}
	
	.img {
		background: #EEEEEE;
		padding: 12rpx 15rpx;
		border-radius: 8rpx;
		
		display: flex;
		
		image {
			margin-left: 10rpx;
		}
	}
	
	.room {
		margin-left: 95upx;
	}
</style>