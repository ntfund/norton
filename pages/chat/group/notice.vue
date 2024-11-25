<template>
	<view>
		<com-nav-bar title="群公告" backgroundColor="#fff" @clickRight="clickRight">
			<template #right>
				<view class="nav-right" v-if="project.isRoomAdminByRoomAndMe(roomData)">完成</view>
			</template>
		</com-nav-bar>
		<textarea :disabled="!project.isRoomAdminByRoomAndMe(roomData)" class="input-box_textarea bg-white notice" v-model="newNotice" placeholder="暂无公告内容"
			cursor-spacing="20" style="margin-top: 20rpx;" />
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import project from '/utils/project';

	const props = defineProps(["room"])
	const roomData = JSON.parse(decodeURIComponent(props.room))

	const newNotice = ref(roomData.notice)


	const clickRight = () => {
		uni.$u.http.put('/chat/chatRoom/' + roomData.id, {
			notice: newNotice.value
		}).then(res => {
			uni.navigateBack()
		})
	}
</script>

<style lang="scss" scoped>
	page {
		background: $uni-bg-color-grey;
	}

	.notice {
		width: 750rpx;
		height: calc(100vh - 20rpx - 110rpx - 60rpx - var(--status-bar-height));

		padding: 30rpx;
	}

	.nav-right {
		font-family: SourceHanSansCN-Medium;
		font-weight: 500;
		font-size: 36rpx;
		color: #000000;
	}
</style>