<template>
	<view class="img-view">
		<image :src="project.getFullURL(data.msg.content.url)"
			:style="{'width': data.msg.content.w+'px','height': data.msg.content.h+'px'}">
		</image>
		<view class="upload" v-if="isUpload && percent < 100">
			<text>{{percent}}%</text>
		</view>
	</view>
</template>

<script setup>
	import {
		inject,
		ref
	} from 'vue';
	import project from '@/utils/project';
	import s3Helper from '@/utils/s3Helper';
	const props = defineProps(["data"])
	const isUpload = ref(props.data.msg.status && props.data.msg.status == "uploading");
	const percent = ref(0)
	const room_id = inject('room_id')

	if (isUpload.value) {

		let file = props.data.msg.file;

		s3Helper.upload({
			file: file,
			success: res => {
				const url = res.fullPath
				let msg = {
					url: url,
					w: file.width,
					h: file.height,
					size: file.size,
					name: file.name,
					uuid: props.data.msg.content.uuid
				};

				project.sendMsg(room_id, msg, 'img')
			},
			progress: (value) => {
				percent.value = value;
			}
		}, 'images')
	}
</script>


<style lang="scss">
	.img-view {
		border-radius: 16rpx;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			max-width: 350upx;
			max-height: 350upx;

			border-radius: 16rpx;
		}

		.upload {
			position: absolute;

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
	}
</style>