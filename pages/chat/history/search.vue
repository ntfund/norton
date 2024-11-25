<template>
	<com-nav-bar title="查找聊天记录" :border="true" backgroundColor="#fff"></com-nav-bar>
	<com-input-search v-model="keyword" @search="search" placeholder="请输入要查找的内容"></com-input-search>
	<view class="msg-list mt-[48rpx]">
		<view class="row">
			<view class="other " @click="selecItem(row)" v-for="(row, index) in msgList" :key="index">
				<!-- 左-头像 -->
				<view class="left">
					<image :src="getAvatarPath(row.msg.userinfo.avatar)" mode="aspectFit"
						style="background-color: #fff; width: 50px; height: 50px; border-radius: 10rpx;">
					</image>

				</view>
				<!-- 右-用户名称-时间-消息 -->
				<view class="right">
					<view class="username">
						<view class="name">{{row.msg.userinfo.nickname}}</view>
						<view class="time">{{row.msg.time}}</view>
					</view>
					<!-- 文字消息 -->
					<view v-if="row.msg.type=='text'" class="bubble">
						<rich-text :nodes="replaceEmoji(row.msg.content.text)"></rich-text>
					</view>
					<!-- 语音消息 -->
					<view v-if="row.msg.type=='voice'" class="bubble voice" @tap="playVoice(row.msg)"
						:class="playMsgid == row.msg.id?'play':''">
						<view class="icon other-voice"></view>
						<view class="length">{{row.msg.content.length}}</view>
					</view>
					<!-- 图片消息 -->
					<view v-if="row.msg.type=='img'" class="bubble img" @tap="showPic(row.msg)">
						<image :src="http.config.baseURL + row.msg.content.url" mode="widthFix"
							style="max-width: 200px;">
						</image>
					</view>
					<!-- 名片消息 -->
					<view v-if="row.msg.type=='card'"
						@tap="tools.navigateTo('/pages/chat/user/info?id='+row.msg.content.user.id)">
						<view class="bg-white px-2 flex flex-col text-base rounded-md min-w-[200px]">
							<view class="flex items-center py-2">
								<image :src="http.config.baseURL + row.msg.content.user.avatar"
									style="width: 50px; height: 50px;">
								</image>
								<text class="ml-2 max-w-[140px]">{{row.msg.content.user.nickname}}</text>
							</view>
							<u-line></u-line>
							<view class="text-xs my-1 text-gray-500">个人名片</view>
						</view>
					</view>
					<!-- 聊天记录 -->
					<view v-if="row.msg.type=='multiple'"
						@tap="tools.navigateTo('/pages/chat/history/history?id='+row.msg.id)">
						<view class="bg-white px-2 flex flex-col text-base rounded-md min-w-[240px]">
							<text class="ml-2 max-w-[230px] text-sm mt-2 font-bold">{{row.msg.content.title}}</text>
							<view class="flex items-center py-2">
								<text class="ml-2 max-w-[140px] text-sm">{{row.msg.content.text}}</text>
							</view>
							<u-line></u-line>
							<view class="text-xs my-1 text-gray-500">聊天记录</view>
						</view>
					</view>
					<!-- 红包 -->
					<view v-if="row.msg.type=='redEnvelope'" class="bubble red-envelope">
						<image src="/static/img/red-envelope.png" mode="aspectFit" style="max-width: 200px;"></image>
						<view class="tis">
							<text v-if="row.msg.content.status == 4">已过期</text>
							<block v-else>
								<text v-if="row.msg.content.received_users.includes(myuid)">已领取</text>
								<text v-else-if="row.msg.content.status == 2">已领完</text>
								<text v-else-if="!(row.msg.content.received_users.includes(myuid))">点击开红包</text>
							</block>
						</view>
						<view class="blessing">
							{{row.msg.content.blessing}}
						</view>
					</view>
					<!-- 转账 -->
					<view v-if="row.msg.type == 'transfer'" class="flex min-w-[150px]" @tap="showRed(row)"
						:class="{'opacity-60': row.msg.content.status > 1}">
						<!-- <view class="relative mt-[10px]">
							<u-icon name="play-left-fill" color="#fb923c" size="14"></u-icon>
						</view> -->
						<view class="transfer ">
							<view class="flex border-bb border-b-orange-300 pt-1 pb-2">
								<view class="w-[30px] flex items-center">
									<u-icon name="red-packet" color="#fff" size="30"></u-icon>
								</view>
								<view class="ml-2 text-sm">
									<view class="font-semibold">{{row.msg.content.amount}}</view>
									<view v-if="row.msg.content.type == 'transfer'">
										<view v-if="row.msg.content.status == 1">请收款</view>
										<view v-if="row.msg.content.status == 2">已被接收</view>
										<view v-if="row.msg.content.status == 3">已退回</view>
										<view v-if="row.msg.content.status == 4">已过期</view>
									</view>
									<view v-if="row.msg.content.type == 'receiver'">已收款</view>
								</view>
							</view>
							<view class="text-xs mt-1 text-gray-100">{{row.msg.content.name}}转账</view>
						</view>
					</view>
				</view>
			</view>

		</view>

	</view>
</template>

<script setup>
	import {
		getCurrentInstance,
		onMounted,
		ref
	} from 'vue';
	import {
		useUserStore
	} from '@/stores/modules/user'
	import tools from '@/utils/tools';
	const props = defineProps(["room_id"]);
	
	const keyword = ref('')
	const msgList = ref([]);
	const msgImgList = ref([]);


	const userStore = useUserStore()
	const myuid = userStore.user.id;
	const http = uni.$u.http


	//替换表情符号为图片
	const replaceEmoji = (str) => {
		// console.log('replaceEmoji', str)
		let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
			// console.log("item: " + item);
			for (let i = 0; i < emojiList.length; i++) {
				let row = emojiList[i];
				for (let j = 0; j < row.length; j++) {
					let EM = row[j];
					if (EM.alt == item) {
						//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径 
						//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
						// let onlinePath = 'https://s2.ax1x.com/2019/04/12/'						
						// let imgstr = '<img src="' + onlinePath + onlineEmoji[EM.url] + '">';
						let onlinePath = '/static/img/emoji/'
						let imgstr = '<img src="' + onlinePath + EM.url + '">';
						// console.log("imgstr: " + imgstr);
						return imgstr;
					}
				}
			}
		});
		return '<div style="display: flex;align-items: center;word-wrap:break-word;">' + replacedStr + '</div>';
	}

	// 播放语音
	const playVoice = (msg) => {
		playMsgid.value = msg.id;
		AUDIO.src = uni.$u.http.config.baseURL + msg.content.url;
		// $nextTick(function () {
		// 	AUDIO.play();
		// });
		AUDIO.play();
	}

	const getAvatarPath = (avatar) => {
		// console.log('getAvatarPath', String);
		return http.config.baseURL + avatar;
	}

	// 预览图片
	const showPic = (msg) => {
		uni.previewImage({
			indicator: "none",
			current: msg.content.url,
			urls: msgImgList.value
		});
	}

	const addMsgImgList = (url) => {
		if (!url.startsWith("http")) {
			url = uni.$u.http.config.baseURL + url;
		}
		msgImgList.value.push(url);
	}

	//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
	const setPicSize = (content) => {
		// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
		let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
		let maxH = uni.upx2px(350); //350是定义消息图片最大高度
		if (content.w > maxW || content.h > maxH) {
			let scale = content.w / content.h;
			content.w = scale > 1 ? maxW : maxH * scale;
			content.h = scale > 1 ? maxW / scale : maxH;
		}
		return content;
	}

	const search = () => {
		uni.$u.http.get('/chat/message', {
			params: {
				room_id: 'room-' + props.room_id,
				search: keyword.value
			}
		}).then(res => {
			console.log(res)
			msgList.value = [];
			// msgList.value = res.data;
			for (let item of res.data) {
				msgList.value.push(item.data)

				let row = item.data;
				if (row.type == 'user' && row.msg.type == 'img') {
					row.msg.content = setPicSize(row.msg.content)
					addMsgImgList(row.msg.content.url);
				}
			}

			// console.log(res.messages)
		})
	}

	// let eventChannel;
	// onMounted(() => {
	// 	const instance = getCurrentInstance().proxy
	// 	eventChannel = instance.getOpenerEventChannel();

	// })
	const selecItem = (item) => {
		console.log('selecItem', item)
		// uni.navigateBack({
		// 	delta: 2,
		// 	success: res=> {
		// 		// console.log('selecItem navigateBack success', res)
		// 		// eventChannel.emit('searchCompleted', '123')
		// 		uni.$emit('search_over', {
		// 			data: item.id
		// 		})
		// 	}
		// })
		tools.navigateToWithEncodeMultiply('/pages/chat/talk/talk', {
			room_id: 'room-' + props.room_id
		}, res => {
			console.log(res, 'res')
			res.eventChannel.emit('search_over', {
				id: item.msg.id
			})
		})
	}
</script>

<style lang="scss">
	.other {
		display: flex;
		padding: 10px;

		border-bottom: 1px solid #ececec;
	}

	.other {
		width: 100%;
		display: flex;

		.left {
			margin-right: 15upx;
		}

		.right {
			flex-wrap: wrap;

			.username {
				width: 100%;
				height: 45upx;
				font-size: 24upx;
				color: #999;
				display: flex;

				.name {
					margin-right: 50upx;
				}
			}

			.bubble {
				background-color: #fff;
				color: #333;

				&.voice {
					.icon {
						color: #333;

					}

					.length {
						margin-left: 20upx;
					}
				}

				&.play {
					@keyframes other-play {
						0% {
							transform: translateX(-80%);
						}

						100% {
							transform: translateX(0%);
						}
					}

					.icon:after {
						border-right: solid 10upx rgba(255, 255, 255, .8);

						animation: other-play 1s linear infinite;
					}
				}
			}
		}
	}
</style>