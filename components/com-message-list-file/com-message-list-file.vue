<template>
	<view class="file-container" @click="openDoc">
		<view class="file">
			<view class="left">
				<image src="@/static/images/chat/talk/file@2x.png" mode="aspectFill" style="width: 68rpx; height: 68rpx;">
				</image>
			</view>
			<view class="right">
				<view class="name">{{data.msg.content.name}}</view>
				<view class="size">{{tools.humanFileSize(data.msg.content.size, true, 0)}}</view>
				<div class="progress-bar-container" v-if="percent < 100 && props.data.msg.file">
					<div class="progress-bar-indicator" :style="'width:'+percent+'%'"></div>
				</div>
			</view>
		</view>
		<view class="tip" v-if="tip">
			{{tip}}
		</view>
	</view>
</template>

<script setup>
	import {
		inject,
		nextTick,
		ref,
		watch
	} from 'vue';
	import tools from '@/utils/tools';
	import project from '@/utils/project';
	import s3Helper from '@/utils/s3Helper';

	const props = defineProps(["data"])
	const room_id = inject('room_id');
	let file = props.data.msg.file; //此字段属性只有本地选择文件发送才生成， 服务器不记录。 如果是本地就就开始上传文件。
	const percent = ref(1)
	const tip = ref('');
	
	
	
	const getFileInfo = (filePath) => {
		return new Promise((resolve) => {
			uni.getFileInfo({
				filePath: filePath,
				success: (res) => {
					console.log("getFileExist success: ", res);
					resolve(true)
				},
				fail: res => {
					console.log("getFileExist fail: ", res);
					resolve(false);
				}
			})
		})
	}
	
	const getFileExist = (filePath) => {
		return new Promise((resolve) => {
			let timerCount = 0;
			let timer = setInterval(async() => {
				let exist = await getFileInfo(filePath);
				if (exist) {
					clearInterval(timer);
					resolve(true);
				} else {
					timerCount++;
					if (timerCount > 60) {
						clearInterval(timer);
						resolve(false);
					}
				}
				
			}, 500);
		})
	}
	
	const uploadFile = async () => {
		// file.path = "file://" + file.path
		
		let exist = await getFileExist(file.path)
		if (!exist) {
			tip.value = "文件上传失败";
			return;
		}
		
		console.log('uploadFile', file)
		s3Helper.upload({
			file: file,
			success: res => {
				console.log('success', res)
				tip.value = ""
				const url = res.fullPath
				let msg = {
					url: url,
					filepath: file.filePath,
					name: file.name,
					size: file.size,
					type: file.type,
					uuid: props.data.content.uuid
				}
				project.sendMsg(room_id, msg, 'file')
			},
			progress: (value) => {
				percent.value = value
			},
			fail: res => {
				tip.value = "文件上传失败"
			}
			
		}, "files")
	}

	if (!!file) {

		watch(() => props.data.msg.file.readyStatus, async (newVal, oldVal) => {
			if (true == newVal) {
				console.log('readyStatus true')
				await nextTick();
				uploadFile()
			}
		}, {
			immediate: true
		})
	}
	
	const openDoc = () => {		
		let url = props.data.msg.content.url;
		if (!url.startsWith('http')) {
			url = "file://" + url;
		}
		console.log('openDocument ...', url)
		uni.downloadFile({
		  url: url,
		  success: function (res) {
		    var filePath = res.tempFilePath;
		    uni.openDocument({
		      filePath: filePath,
		      showMenu: true,
		      success: function (res) {
		        console.log('打开文档成功');
		      }
		    });
		  }
		});
	}
</script>

<style lang="scss" scoped>
	.file {
		padding: 20rpx 25rpx;
		// width: 240px;
		background: #FFFFFF;
		border-radius: 16rpx;
		border: 4rpx solid #EEEEEE;

		display: flex;
		align-items: center;

		justify-content: space-between;

		.left {
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			justify-content: start;
			text-align: left;

			word-break: break-all;
			white-space: pre-wrap;


		}

		.right {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			text-align: left;
			position: relative;

			flex-wrap: wrap;
			flex: 1;

			margin-left: 20rpx;

			.name {
				width: 320rpx;
				white-space: pre-wrap;
				word-break: break-all;
				overflow: hidden;

				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 28rpx;
				color: #010101;

				text-overflow: ellipsis;
			}

			.size {
				font-family: Gilroy-Medium;
				font-weight: 500;
				font-size: 24rpx;
				color: #8C8C8C;

				margin-top: 5rpx;
			}
		}
	}
	
	.file-container {
		position: relative;
		
		.tip {
			position: absolute;
			z-index: 2;
			right: 20rpx;
			bottom: 20rpx;		
				
			
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 28rpx;
			color: $uni-bg-red;
		}
	}

	.progress-bar-container {
		margin-top: 10rpx;
		width: 100%;
		height: 4rpx;
		background: #EEEEEE;
		border-radius: 25px;
		position: relative;
		/* relative here */
	}

	.progress-bar-indicator {
		height: 100%;
		border-radius: 25px;
		/* this will do the magic */
		-webkit-mask: linear-gradient(#fff 0 0);
		mask: linear-gradient(#fff 0 0);
	}

	.progress-bar-indicator::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		/* your gradient here */
		background-image: linear-gradient(to right, #7F17FE, #7F17FE);		
	}
</style>