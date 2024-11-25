<template>
	<view class="talk-container">
		<view style="nav-container">
			<com-nav-bar height="140rpx" @clickRight="rightClick" leftWidth="60rpx" rightWidth="60rpx"
				backgroundColor="#fff" :border="true" @clickLeft="clickLeft">
				<template #default>
					<view class="flex justify-start items-center">
						<com-avatar :data="target.avatar_list"></com-avatar>
						<view>
							<view class="nav-custom-title">{{target.title}}</view>
							<view class="status" v-if="props.room_id.startsWith('user')">
								<view class="flex items-center status_item" v-if="isOnine === true">
									<view class="status_circle status_online"></view>
									<view class="status_txt">正在线上</view>
								</view>
								<view class="flex items-center status_item" v-else-if="isOnine === false">
									<view class="status_circle status_off"></view>
									<view class="status_txt">离线中</view>
								</view>
								<view class="flex items-center status_item" v-else-if="isOnine == -1">
									<view class="status_circle status_off"></view>
									<view class="status_txt">状态错误</view>
								</view>
								<view class="flex items-center status_item" v-else>
									<view class="status_circle status_off"></view>
									<view class="status_txt"></view>
								</view>
							</view>
						</view>
					</view>
				</template>
				<template #right>
					<view>
						<image src="@/static/images/chat/more@2x.png" mode="aspectFit"
							style="width: 26rpx; height: 25rpx;">
						</image>
					</view>
				</template>
			</com-nav-bar>
		</view>

		<view class="content" @touchstart="hideDrawer">
			<scroll-view ref="scroll" class="msg-list" :class="{'msg-list-full': showFull, 'msg-list-big-full': showBigFull}" scroll-y="true" :scroll-with-animation="scrollAnimation"
				:scroll-into-view="scrollToView" @scrolltoupper="loadHistory" upper-threshold="50">
				<!-- <view class="scroll-height" v-if="show"></view> -->
				<!-- 加载历史数据waitingUI -->
				<view class="loading" v-if="pagination.status != 'nomore' && show">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<view class="notice" v-if="room.notice"
					@click="tools.navigateToWithEncodeMultiply('/pages/chat/group/notice', {room:room})">
					<view class="notice_content">
						<view class="notice_content_txt">
							{{room.notice}}
						</view>
					</view>
				</view>
				<com-message-list v-if="show" :data="msgList" :msgImgList="msgImgList" :room="room"
					@sendSystemMsg="sendSystemMsg" @screenMsg="screenMsg"></com-message-list>
				<!-- <view v-if="popupLayerClass" style="width: 750rpx; height: 400px;"></view> -->
				<view id="scroll-bottom" v-if="bottonShow" style="width: 750rpx; height: 100px;"></view>
				<view id="scroll-bottom_always" cursor-spacing="5" style="height: 1rpx; width: 750rpx;"></view>
			</scroll-view>
		</view>
		<view>
			<!-- 抽屉栏 -->
			<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
				<!-- 表情 -->
				<swiper class="emoji-swiper" :class="{hidden:hideEmoji}" indicator-dots="true" duration="150">
					<swiper-item v-for="(page,pid) in emojiList" :key="pid">
						<view v-for="(em,eid) in page" :key="eid" @tap="addEmoji(em)">
							<image mode="aspectFill" :src="getEmojiSrc(em.url)"></image>
						</view>
					</swiper-item>
				</swiper>
				<!-- 更多功能 相册-拍照-红包 -->
				<view class="more-layer" :class="{hidden:hideMore}">
					<view class="list">
						<view class="item">
							<view class="box" @tap="chooseImage">
								<!-- <view class="icon tupian2"></view> -->
								<image class="img" src="@/static/images/chat/picture@2x.png" mode="aspectFit"></image>
							</view>
							<view class="name">图片</view>
						</view>
						<!-- 视频 -->
						<com-choose-video @click="hideDrawer()" @selected="chooseVideo"></com-choose-video>
						<view class="item">
							<view class="box" @tap="camera">
								<!-- <view class="icon paizhao"></view> -->
								<image class="img" src="@/static/images/chat/canera@2x.png" mode="aspectFit"></image>
							</view>
							<view class="name">拍摄</view>
						</view>
						<view class="item">
							<view class="box" @tap="handRedEnvelopes">
								<!-- <view class="icon hongbao"></view> -->
								<image class="img" src="@/static/images/chat/redpack@2x.png" mode="aspectFit"></image>
							</view>
							<view class="name">红包</view>
						</view>
						<view class="item" v-if="props.room_id.startsWith('user')">
							<view class="box" @tap="handTransfer">
								<image class="img" src="@/static/images/chat/transfer@2x.png" mode="aspectFit"></image>
							</view>
							<view class="name">转账</view>
						</view>
						<!-- <view class="item">
							<view class="box" @tap="chooseFile">
								<image class="img" src="@/static/images/chat/picture@2x.png" mode="aspectFit"></image>
							</view>
							<view class="name">文件</view>
						</view> -->
						<com-choose-file @click="hideDrawer()" @selected="chooseFiled"></com-choose-file>
					</view>
				</view>
			</view>
			<view class="bottom" :class="popupLayerClass" @touchmove.stop.prevent="discard">
				<view class="reply" v-if="talkStore.msg">
					<view class="container">
						<view class="left">
							<image src="@/static/images/chat/talk/reply@2x.png" mode="aspectFill"
								style="width: 41rpx; height: 33rpx;"></image>
						</view>
						<view class="middle">
							<view class="title">{{talkStore.msg.msg.userinfo.nickname}}</view>
							<view class="info" v-if="talkStore.msg.msg.type =='text'">{{talkStore.msg.msg.content.text}}
							</view>
							<view class="img" v-if="talkStore.msg.msg.type =='img'">
								<image class="rounded-md" :src="project.getFullURL(talkStore.msg.msg.content.url)"
									mode="heightFix" style="height: 100rpx;"></image>
							</view>
						</view>
						<view class="right" @click="talkStore.setMsg(null)">
							<image src="@/static/images/chat/talk/close@2x.png" mode="aspectFill"
								style="width: 36rpx; height: 36rpx;"></image>
						</view>
					</view>
				</view>
				<!-- 底部输入栏 -->
				<view class="input-box">
					<view class="mute-layer" v-if="isMute || isMuteMe"></view>
					<!-- H5下不能录音，输入栏布局改动一下 -->
					<!-- #ifndef H5 -->
					<view class="voice" @tap="switchVoice">
						<!-- <view class="icon" :class="isVoice?'jianpan':'yuyin'"></view> -->
						<image class="img" src="@/static/images/chat/voice@2x.png" mode="aspectFit"
							style="width: 34rpx; height: 48rpx;"></image>
					</view>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<view class="more" @tap="showMore">
						<!-- <view class="icon add"></view> -->
						<image class="img" src="@/static/images/chat/plus2@2x.png" mode="aspectFit"
							style="width: 46rpx; height: 46rpx;"></image>
					</view>
					<!-- #endif -->
					<view class="textbox">
						<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']"
							@touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd"
							@touchcancel="voiceCancel">{{voiceTis}}</view>
						<view class="text-mode" :class="isVoice?'hidden':''">
							<view class="mute-mode" v-if="isMute">全员禁言中...</view>
							<view class="mute-mode" v-if="isMuteMe">你已被管理员禁言...</view>
							<view class="box">
								<textarea confirm-type="send" auto-height="true" cursor-spacing="5" v-model="textMsg"
									@focus="textareaFocus" @confirm="sendTextMsg" :placeholder="placeholder" />
							</view>
							<view class="em" @tap="chooseEmoji">
								<!-- <view class="icon biaoqing"></view> -->
								<image class="img" src="@/static/images/chat/biaoqing@2x.png" mode="aspectFit"
									style="width: 46rpx; height: 46rpx;"></image>
							</view>
						</view>
					</view>
					<!-- #ifndef H5 -->
					<view class="more" @tap="showMore" :class="{'hidden': textMsg}">
						<!-- <view class="icon add"></view> -->
						<image class="img" src="@/static/images/chat/plus2@2x.png" mode="aspectFit"
							style="width: 46rpx; height: 46rpx;"></image>
					</view>
					<!-- #endif -->
					<view class="send" :class="{'hidden': isVoice || !textMsg}" @tap="sendText">
						<!-- <view class="btn">发送</view> -->
						<image class="img" src="@/static/images/chat/send@2x.png" mode="aspectFit"
							style="width: 38rpx; height: 34rpx;"></image>
					</view>
				</view>
			</view>

			<!-- 录音UI效果 -->
			<view class="record" :class="recording ? '' : 'hidden'">
				<view class="ing" :class="willStop ? 'hidden' : ''">
					<view class="icon luyin2"></view>
				</view>
				<view class="cancel" :class="willStop ? '' : 'hidden'">
					<view class="icon chehui"></view>
				</view>
				<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
			</view>
		</view>

	</view>
</template>

<script setup>
	import {
		onMounted,
		ref,
		nextTick,
		onUnmounted,
		reactive,
		provide,
		watchEffect,
		watch,
		getCurrentInstance
	} from "vue";
	import {
		onShow,
		onHide
	} from '@dcloudio/uni-app'
	import {
		useUserStore
	} from '@/stores/modules/user'
	import {
		getChatMessageList
	} from "@/config/api";
	import project from "@/utils/project";
	import tools from "@/utils/tools";
	import {
		useAppStore
	} from "@/stores/modules/app";
	import {
		useTalkStore
	} from "@/stores/modules/talk";
	import emojiList from "@/data/emojiList";
	import {
		useChatStore
	} from "@/stores/modules/chatStore";
	import socketHelper from "@/utils/socketHelper";

	const userStore = useUserStore()
	const talkStore = useTalkStore()
	const chatStore = useChatStore();
	const props = defineProps(['room_id', 'target']);
	// const target = ref(JSON.parse(decodeURIComponent(props.target)))
	const target = ref({
		title: '',
		avatar_list: []
	})
	const isOnine = ref(null)
	const isMute = ref(false)
	const isMuteMe = ref(false)
	const placeholder = ref('');
	const scroll = ref(null)
	const showFull = ref(false)
	const showBigFull = ref(false)

	const room_id = props.room_id;
	provide('room_id', room_id)
	let room = reactive({
		name: '',
		notice: '',
		mute: 0,
		mutes: [], //单独禁言列表
		infos: [],
		admins: [],
		avatar_list: []
	})
	provide('room', room)

	// watch(() => room.mute, (newVal, oldVal) => {

	// }, {deep: true})

	watchEffect(() => {
		const isAdmin = project.isRoomAdminByRoomAndMe(room);
		if (room.mute == 1) {
			placeholder.value = "全员禁言中，仅管理员发言..."
		} else {
			placeholder.value = ""
		}
		//全体禁言
		isMute.value = room.mute == 1 && !isAdmin;

		//单个禁言
		isMuteMe.value = room.mutes.findIndex(item => item == userStore.user.id) > -1;

	})


	const pagination = reactive({
		page: 1,
		pageSize: 20,
		status: ''
	})

	const show = ref(false);
	const loading = ref(false);
	const bottonShow = ref(true);
	//文字消息
	let textMsg = ref('')
	//消息列表
	let isHistoryLoading = false
	let scrollAnimation = ref(false)
	let scrollTop = ref(0)
	let scrollToView = ref('scroll-bottom')
	let msgList = ref([])
	let msgImgList = []
	let myuid = userStore.user.id

	//录音相关参数
	// #ifndef H5
	//H5不能录音
	let RECORDER = uni.getRecorderManager()
	// #endif
	let isVoice = ref(false)
	let voiceTis = ref('按住 说话')
	let recordTis = ref("手指上滑 取消发送")
	let recording = ref(false)
	let willStop = ref(false)
	let initPoint = {
		identifier: 0,
		Y: 0
	}
	let recordTimer = null
	let recordLength = 0


	// 抽屉参数
	let popupLayerClass = ref('')
	// more参数
	let hideMore = ref(true)
	//表情定义
	let hideEmoji = ref(true)

	const getEmojiSrc = (url) => {
		let name = url.split(".")[0];
		return '/static/img/emoji/thumb/' + name + '.png'
	}

	// 接受消息(筛选处理)
	const screenMsg = async (msg) => {
		console.log('screenMsg', msg)
		//从长连接处转发给这个方法，进行筛选处理
		if (msg.type == 'system') {
			// 系统消息
			switch (msg.msg.type) {
				case 'redEnvelope':
					addSystemRedEnvelopeMsg(msg);
					break;
				case 'no-friend':
				case 'invite':
				case 'text':
				case 'rename':
					addSystemTextMsg(msg);
					break;
				default:
					addSystemTextMsg(msg);
					break;
			}
		} else if (msg.type == 'user' || msg.type == 'c2c' || msg.type == 'group') {
			// 用户消息
			switch (msg.msg.type) {
				case 'text':
					addTextMsg(msg);
					break;
				case 'voice':
					addVoiceMsg(msg);
					break;
				case 'img':
					addImgMsg(msg);
					break;
				case 'redEnvelope':
					addRedEnvelopeMsg(msg);
					break;
				case 'transfer':
					addTransferMsg(msg);
					break;
				case 'card':
					addMsg(msg);
					break;
				default:
					addMsg(msg);
					break;
			}
			console.log('用户消息');
			//非自己的消息震动
			// #ifdef APP-PLUS
			if (msg.msg.userinfo.id != myuid && msg.type != "system") {
				console.log('振动', msg.msg.userinfo.id, myuid);
				uni.vibrateShort();
			}
			// #endif			
		}
		// $nextTick(function () {
		// 	// 滚动到底
		// 	scrollToView = 'msg' + msg.msg.id
		// });
		await nextTick();
		scrollAnimation.value = false; //关闭滑动动画
		scrollToView.value = 'msg' + msg.msg.id
		console.log('msg' + msg.msg.id);
		// scrollTop.value = scrollTop.value + 100;
		await nextTick();
		scrollToView.value = 'scroll-bottom_always'
		await nextTick();
		scrollAnimation.value = true;
	}

	watch(() => popupLayerClass.value, async (newVal, oldVal) => {
		// if (msgList.value.length >= 1) {
		// 	await nextTick();
		// 	scrollAnimation.value = false; //关闭滑动动画
		// 	let msg = msgList.value[msgList.value.length - 1];
		// 	scrollToView.value = 'msg' + msg.msg.id
		// 	await nextTick();
		// 	scrollAnimation.value = true;
		// }
	})

	//触发滑动到顶部(加载历史信息记录)
	const loadHistory = (e) => {
		console.log('loadHistory....#############')
		if (isHistoryLoading) {
			return;
		}
		loading.value = true;
		isHistoryLoading = true; //参数作为进入请求标识，防止重复请求

		let Viewid = msgList.value[0].msg.id; //记住第一个信息ID
		console.log('记住第一个信息ID', Viewid);

		//本地模拟请求历史记录效果
		setTimeout(async () => {
			// 消息列表
			// let list = [
			// 	{ type: "user", msg: { id: 1, type: "text", time: "12:56", userinfo: { user_id: 55784154, username: "大黑哥", face: "/static/faces/01.jpg" }, content: { text: "为什么温度会相差那么大？" + Math.floor(Math.random() * 1000 + 1) } } },
			// 	{ type: "user", msg: { id: 2, type: "text", time: "12:57", userinfo: { user_id: 1, username: "售后客服008", face: "/static/faces/02.jpg" }, content: { text: "这个是有偏差的，两个温度相差十几二十度是很正常的，如果相差五十度，那即是质量问题了。" + Math.floor(Math.random() * 1000 + 1) } } },
			// 	{ type: "user", msg: { id: 3, type: "voice", time: "12:59", userinfo: { user_id: 1, username: "售后客服008", face: "/static/faces/03.jpg" }, content: { url: "/static/voice/1.mp3", length: "00:06" } } },
			// 	{ type: "user", msg: { id: 4, type: "voice", time: "13:05", userinfo: { user_id: 55784154, username: "大黑哥", face: "/static/faces/04.jpg" }, content: { url: "/static/voice/2.mp3", length: "00:06" } } },
			// ]
			// // 获取消息中的图片,并处理显示尺寸
			// for (let i = 0; i < list.length; i++) {
			// 	if (list[i].type == 'user' && list[i].msg.type == "img") {
			// 		list[i].msg.content = setPicSize(list[i].msg.content);
			// 		msgImgList.unshift(uni.$u.http.config.baseURL + list[i].msg.content.url);
			// 	}
			// 	list[i].msg.id = Math.floor(Math.random() * 1000 + 1);
			// 	msgList.value.unshift(list[i]);
			// }

			await getList();

			//这段代码很重要，不然每次加载历史数据都会跳到顶部
			// $nextTick(function () {
			// 	scrollToView = 'msg' + Viewid;//跳转上次的第一行信息位置
			// 	$nextTick(function () {
			// 		scrollAnimation = true;//恢复滚动动画
			// 	});
			// });
			await nextTick();
			scrollAnimation.value = false; //关闭滑动动画
			scrollToView.value = 'msg' + Viewid; //跳转上次的第一行信息位置
			console.log('跳转上次的第一行信息位置', Viewid)
			await nextTick();
			scrollAnimation.value = true; //恢复滚动动画

			isHistoryLoading = false;
			loading.value = false;
		}, 1000)
	}

	const addMsgImgList = (url) => {
		if (!url || Array.isArray(url)) {
			return;
		}
		url = project.getFullURL(url)
		msgImgList.push(url);
	}

	const getRoomData = () => {
		if (project.getRoomType(room_id) == "group") {
			let to_id = project.getToRoomIdByRoomId(room_id);
			uni.$u.http.get('/chat/chatRoom/' + to_id).then(result => {
				for (let key in result) {
					room[key] = result[key]
				}

				if (!target.value.title) {
					target.value.title = room.name;
				}
				if (target.value.avatar_list.length == 0) {
					target.value.avatar_list = room.avatar_list;
				}
			})
		} else {
			let to_id = project.getToUserIdByRoomId(room_id);
			uni.$u.http.get('/chat/user/' + to_id).then(result => {
				console.log('result', result)
				if (result.friend && result.friend.remark) {
					target.value.title = result.friend.remark
				} else {
					target.value.title = result.nickname;
				}
				target.value.avatar_list = [result.avatar];
			})
		}
	}

	const getList = async () => {

		if (pagination.status == 'nomore') {
			return;
		}

		let result = await getChatMessageList(room_id, pagination.page, pagination.pageSize);

		let data = result.data;
		console.log('getChatMessageList', data);
		if (pagination.page < result.last_page) {
			pagination.page++;
		} else {
			pagination.status = 'nomore';
		}

		if (data) {
			for (var i = 0; i < data.length; i++) {
				let row = data[i].data;
				if (row.type == 'user' && row.msg.type == 'img') {
					row.msg.content = setPicSize(row.msg.content)
					addMsgImgList(row.msg.content.url);
				}
				msgList.value.unshift(row);
			}
		}

		// if (pagination.status == 'nomore') {
		// 	msgList.value.unshift({ type: "system", msg: { id: 0, type: "text", content: { text: "没有其他消息了" } } })
		// }
	}

	// 加载初始页面消息
	const getMsgList = async () => {
		// 消息列表
		// let list = [
		// 	{ type: "system", msg: { id: 0, type: "text", content: { text: "欢迎进入NRT-chat聊天室" } } },
		// 	{ type: "user", msg: { id: 1, type: "text", time: "12:56", userinfo: { user_id: 55784154, username: "大黑哥", face: "/static/faces/11.jpg" }, content: { text: "为什么温度会相差那么大？" } } },
		// 	{ type: "user", msg: { id: 2, type: "text", time: "12:57", userinfo: { user_id: 1, username: "售后客服008", face: "/static/faces/12.jpg" }, content: { text: "这个是有偏差的，两个温度相差十几二十度是很正常的，如果相差五十度，那即是质量问题了。" } } },
		// 	{ type: "user", msg: { id: 3, type: "voice", time: "12:59", userinfo: { user_id: 1, username: "售后客服008", face: "/static/faces/13.jpg" }, content: { url: "/static/voice/1.mp3", length: "00:06" } } },
		// 	{ type: "user", msg: { id: 4, type: "voice", time: "13:05", userinfo: { user_id: 55784154, username: "大黑哥", face: "/static/faces/16.jpg" }, content: { url: "/static/voice/2.mp3", length: "00:06" } } },
		// 	{ type: "user", msg: { id: 5, type: "img", time: "13:05", userinfo: { user_id: 55784154, username: "大黑哥", face: "/static/faces/15.jpg" }, content: { url: "/static/img/p10.jpg", w: 200, h: 200 } } },
		// 	{ type: "user", msg: { id: 6, type: "img", time: "12:59", userinfo: { user_id: 1, username: "售后客服008", face: "/static/faces/14.jpg" }, content: { url: "/static/img/q.jpg", w: 1920, h: 1080 } } },
		// 	{ type: "system", msg: { id: 7, type: "text", content: { text: "欢迎进入NRT-chat聊天室" } } },

		// 	{ type: "system", msg: { id: 9, type: "redEnvelope", content: { text: "售后客服008领取了你的红包" } } },
		// 	{ type: "user", msg: { id: 10, type: "redEnvelope", time: "12:56", userinfo: { user_id: 55784154, username: "大黑哥", face: "/static/img/face.jpg" }, content: { blessing: "恭喜发财，大吉大利，万事如意", rid: 0, isReceived: false } } },
		// 	{ type: "user", msg: { id: 11, type: "redEnvelope", time: "12:56", userinfo: { user_id: 1, username: "售后客服008", face: "/static/faces/14.jpg" }, content: { blessing: "恭喜发财", rid: 1, isReceived: false } } },

		// 	{ type: "user", msg: { id: 12, type: "transfer", time: "12:56", userinfo: { user_id: 55784154, username: "大黑哥", face: "/static/img/face.jpg" }, content: { blessing: "恭喜发财", rid: 0, type: 'transfer', isReceived: true, amount: 0.01, name: 'NRT', status: 2, timestamp: 1692285612, receive_time: 1692285612 } } },
		// 	{ type: "user", msg: { id: 13, type: "transfer", time: "12:58", userinfo: { user_id: 1, username: "售后客服008", face: "/static/faces/14.jpg" }, content: { blessing: "恭喜发财", rid: 1, type: 'receiver', isReceived: true, amount: 0.01, name: 'NRT', status: 2, timestamp: 1692285612, receive_time: 1692285612 } } },
		// 	{ type: "user", msg: { id: 14, type: "transfer", time: "12:58", userinfo: { user_id: 1, username: "售后客服008", face: "/static/faces/14.jpg" }, content: { blessing: "恭喜发财", rid: 1, type: 'transfer', isReceived: true, amount: 0.88, name: 'USDT', status: 1, timestamp: 1692285612, receive_time: 1692285612 } } },
		// 	// { type: "user", msg: { id: 15, type: "red", time: "12:56", userinfo: { user_id: 55784154, username: "大黑哥", face: "/static/img/face.jpg" }, content: { blessing: "恭喜发财", rid: 0, type: 'receiver', isReceived: true, amount: 0.88, name: 'USDT', status: 2 } } },
		// ]


		// 获取消息中的图片,并处理显示尺寸
		// for (let i = 0; i < list.length; i++) {
		// 	if (list[i].type == 'user' && list[i].msg.type == "img") {
		// 		list[i].msg.content = setPicSize(list[i].msg.content);
		// 		msgImgList.push(list[i].msg.content.url);
		// 	}
		// }
		await getList();

		// msgList.value = list;
		show.value = true;
		// 滚动到底部
		// $nextTick(function () {
		// 	//进入页面滚动到底部
		// 	scrollTop = 9999;
		// 	$nextTick(function () {
		// 		scrollAnimation = true;
		// 	});

		// });
		await nextTick()
		// scrollTop.value = 9999;
		scrollToView.value = 'scroll-bottom_always'
		await nextTick()
		scrollAnimation.value = true;
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

	//更多功能(点击+弹出) 
	const showMore = () => {
		isVoice.value = false;
		hideEmoji.value = true;
		if (hideMore.value) {
			hideMore.value = false;
			openDrawer();
		} else {
			hideDrawer();
		}
	}
	// 打开抽屉
	const openDrawer = () => {
		popupLayerClass.value = 'showLayer';
	}
	// 隐藏抽屉
	const hideDrawer = () => {
		popupLayerClass.value = '';
		setTimeout(() => {
			hideMore.value = true;
			hideEmoji.value = true;
		}, 150);
	}
	// 选择图片发送
	const chooseImage = () => {
		getImage('album');
	}
	// 选择视频发送
	const chooseVideo = (file) => {
		console.log('chooseVideo', file);
		screenMsgFile(file, "video")
	}
	//拍照发送
	const camera = () => {
		getImage('camera');
	}
	//发红包
	const handRedEnvelopes = () => {
		if (props.room_id.startsWith('user')) {
			uni.navigateTo({
				url: '/pages/chat/redEnvelope/red_packet?room_id=' + room_id
			});
		} else {
			uni.navigateTo({
				url: '/pages/chat/redEnvelope/redEnvelope?room_id=' + room_id
			});
		}

		hideDrawer();
	}
	const handTransfer = () => {
		let tid = '';
		let arr = room_id.split('-')
		if (userStore.user.id == arr[1]) {
			tid = arr[2]
		} else {
			tid = arr[1]
		}
		console.log('handTransfer', tid)
		uni.navigateTo({
			url: '/pages/chat/redEnvelope/transfer?tid=' + tid
		});
		hideDrawer();
	}
	//选照片 or 拍照
	const getImage = (type) => {
		hideDrawer();
		uni.chooseImage({
			sourceType: [type],
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			success: (res) => {
				for (let i = 0; i < res.tempFilePaths.length; i++) {
					uni.getImageInfo({
						src: res.tempFilePaths[i],
						success: (image) => {
							// console.log(image.width);
							// console.log(image.height);
							// console.log(res.tempFiles[i]);
							// console.log(res.tempFiles[i], res.tempFilePaths[i]);
							// let msg = { url: res.tempFilePaths[i], w: image.width, h: image.height, file:res.tempFiles[i], 'status': 'uploading' };
							// sendMsg(msg, 'img');
							let file = {
								width: image.width,
								height: image.height,
								...res.tempFiles[i]
							}
							console.log('chooseImage', file)
							screenMsgFile(file, "img")
							//上传到服务器，获取服务器地址

							// uni.uploadFile({
							// 	url: uni.$u.http.config.baseURL + '/api/upload/uploadChatImg', //仅为示例，非真实的接口地址
							// 	filePath: res.tempFilePaths[i],
							// 	name: 'image',
							// 	header: {
							// 		'Accept': 'application/json',
							// 		'Access-Control-Allow-Origin': '*',
							// 		'Authorization': `Bearer ${uni.getStorageSync('token')}`
							// 	},
							// 	success: (uploadFileRes) => {
							// 		console.log('uploadFileRes', uploadFileRes.data);
							// 		const res = JSON.parse(uploadFileRes.data)
							// 		// let msg = { url: res.tempFilePaths[i], w: image.width, h: image.height };
							// 		let msg = { url: res.src, w: image.width, h: image.height };
							// 		sendMsg(msg, 'img');
							// 	}
							// });

						}
					});
				}
			}
		});
	}
	const screenMsgFile = (file, type = "file") => {
		var nowDate = new Date();
		let lastid = 1;
		if (msgList.value.length > 0) {
			lastid = msgList.value[msgList.value.length - 1].msg.id;
			lastid++;
		}

		const userStore = useUserStore();
		let content = {
			name: file.name,
			size: file.size,
			url: file.path,
			uuid: tools.randomString(16)
		}
		if (file.width) {
			content.w = file.width
		}
		if (file.height) {
			content.h = file.height
		}
		if (file.duration) {
			content.duration = file.duration
		}
		if (file.length) {
			content.length = file.length
		}

		let msg = {
			type: 'user',
			msg: {
				id: lastid,
				time: nowDate.getHours() + ":" + nowDate.getMinutes(),
				type: type,
				userinfo: {
					id: userStore.user.id,
					nickname: userStore.user.nickname,
					avatar: userStore.user.avatar,
				},
				content: content,
				file: file,
				status: 'uploading'
			},
			temp: true
		}

		screenMsg(msg)
	}
	const chooseFiled = (file) => {
		console.log('chooseFiled', file)
		if (!file.readyStatus || !!file.h5) {
			//添加文件消息
			screenMsgFile(file) //第一次读取文件
		} else {
			//修改文件消息。 拷贝完成到系统目录。
			for (var i = 0; i < msgList.value.length; i++) {
				let msg = msgList.value[i]
				if (msg.msg.file && msg.msg.file.path == file.path) {
					msgList.value[i].msg.file.readyStatus = true;
					break;
				}
			}
		}
	}

	// 选择表情
	const chooseEmoji = () => {
		hideMore.value = true;
		if (hideEmoji.value) {
			hideEmoji.value = false;
			openDrawer();
		} else {
			hideDrawer();
		}
	}
	//添加表情
	const addEmoji = (em) => {
		textMsg.value += em.alt;
	}

	//获取焦点，如果不是选表情ing,则关闭抽屉
	const textareaFocus = () => {
		if (popupLayerClass.value == 'showLayer' && hideMore.value == false) {
			hideDrawer();
		}
	}

	const sendTextMsg = () => {
		if (!textMsg.value) {
			return;
		}
		// let content = replaceEmoji(textMsg.value);
		// let msg = { text: content }
		let msg = {
			text: textMsg.value,
			uuid: tools.randomString(16)
		}
		// console.log(msg)
		sendMsg(msg, 'text');
		textMsg.value = ''; //清空输入框
	}

	// 发送文字消息
	const sendText = async () => {
		hideDrawer(); //隐藏抽屉
		sendTextMsg()
	}

	// #ifdef H5
	document.onkeydown = function(event) {
		var e = event || window.event || arguments.callee.caller.arguments[0];
		if (e && e.keyCode == 13) {
			sendText();
		}
	};
	// #endif


	// 发送消息
	const sendMsg = (content, type) => {
		//实际应用中，此处应该提交长连接，模板仅做本地处理。
		var nowDate = new Date();
		let lastid = 1;
		if (msgList.value.length > 0) {
			lastid = msgList.value[msgList.value.length - 1].msg.id;
			lastid++;
		}
		let msg = {
			type: 'user',
			msg: {
				id: lastid,
				time: nowDate.getHours() + ":" + nowDate.getMinutes(),
				type: type,
				userinfo: {
					id: userStore.user.id,
					nickname: userStore.user.nickname,
					avatar: userStore.user.avatar
				},
				content: content
			},
			temp: true
		}
		// 发送消息
		screenMsg(msg);
		// // 定时器模拟对方回复,三秒
		// setTimeout(() => {
		// 	lastid = msgList.value[msgList.value.length - 1].msg.id;
		// 	lastid++;
		// 	msg = { type: 'user', msg: { id: lastid, time: nowDate.getHours() + ":" + nowDate.getMinutes(), type: type, userinfo: { user_id: 1, username: "售后客服008", face: "/static/faces/15.jpg" }, content: content } }
		// 	// 本地模拟发送消息
		// screenMsg(msg);
		// }, 1000)

		//实际情况
		// console.log('sendMsg', content)
		// const http = uni.$u.http;
		// http.post('/chat/message', {
		// 	room_id,
		// 	content,
		// 	type: 'user',
		// 	contentType: type
		// })

		project.sendMsg(room_id, content, type)
	}

	//添加消息
	const addMsg = (msg) => {
		msgList.value.push(msg);
	}
	// 添加文字消息到列表
	const addTextMsg = (msg) => {
		msgList.value.push(msg);
	}
	// 添加语音消息到列表
	const addVoiceMsg = (msg) => {
		msgList.value.push(msg);
	}
	// 添加图片消息到列表
	const addImgMsg = (msg) => {
		msg.msg.content = setPicSize(msg.msg.content);
		msgImgList.unshift(project.getFullURL(msg.msg.content.url));
		msgList.value.push(msg);
	}
	const addRedEnvelopeMsg = (msg) => {
		msgList.value.push(msg);
	}

	const addTransferMsg = (msg) => {
		msgList.value.push(msg);
	}
	// 添加系统文字消息到列表
	const addSystemTextMsg = (msg) => {
		console.log('addSystemTextMsg', msg)
		msgList.value.push(msg);
	}
	// 添加系统红包消息到列表
	const addSystemRedEnvelopeMsg = (msg) => {
		msgList.value.push(msg);
	}

	// 由本地用户，添加系统消息。暂为用到实际。
	const sendSystemMsg = (content, type) => {
		let lastid = 1;
		if (msgList.value.length > 0) {
			lastid = msgList.value[msgList.value.length - 1].msg.id;
			lastid++;
		}
		let row = {
			type: "system",
			msg: {
				id: lastid,
				type: type,
				content: content
			}
		};
		screenMsg(row)
	}

	// 删除消息
	const deleteMsg = (data) => {
		let index = msgList.value.findIndex(x => x.msg.id == data.id)
		if (index > -1) {
			msgList.value.splice(index, 1);
		} else {
			console.log('deleteMsg can not foud index :', data)
		}
	}

	// 更新消息 ['text', 'img', 'video', 'voice', 'file']
	const updateMsg = (data) => {
		let index = msgList.value.findIndex(x => x.temp && x.msg.content.uuid && x.msg.content.uuid == data.msg.content
			.uuid)
		console.log('updateMsg', data)
		if (index > -1) {
			console.log('updateMsg index', index)
			msgList.value[index].temp = false;
			msgList.value[index].msg.id = data.msg.id;
		}
	}

	// 录音开始
	const voiceBegin = (e) => {
		if (e.touches.length > 1) {
			return;
		}
		initPoint.Y = e.touches[0].clientY;
		initPoint.identifier = e.touches[0].identifier;
		RECORDER.start({
			format: "mp3"
		}); //录音开始,
	}
	//录音开始UI效果
	const recordBegin = (e) => {
		recording.value = true;
		voiceTis.value = '松开 结束';
		recordLength = 0;
		recordTimer = setInterval(() => {
			recordLength++;
		}, 1000)
	}
	// 录音被打断
	const voiceCancel = () => {
		recording.value = false;
		voiceTis.value = '按住 说话';
		recordTis.value = '手指上滑 取消发送'
		willStop.value = true; //不发送录音
		RECORDER.stop(); //录音结束
	}
	// 录音中(判断是否触发上滑取消发送)
	const voiceIng = (e) => {
		if (!recording.value) {
			return;
		}
		let touche = e.touches[0];
		//上滑一个导航栏的高度触发上滑取消发送
		if (initPoint.Y - touche.clientY >= uni.upx2px(100)) {
			willStop.value = true;
			recordTis.value = '松开手指 取消发送'
		} else {
			willStop.value = false;
			recordTis.value = '手指上滑 取消发送'
		}
	}
	// 结束录音
	const voiceEnd = (e) => {
		if (!recording.value) {
			return;
		}
		recording.value = false;
		voiceTis.value = '按住 说话';
		recordTis.value = '手指上滑 取消发送'
		RECORDER.stop(); //录音结束
	}
	//录音结束(回调文件)
	const recordEnd = (e) => {
		clearInterval(recordTimer);
		if (!willStop.value && recordLength > 0) {
			console.log("recordEnd: ", e);
			let msg = {
				path: e.tempFilePath,
				url: e.tempFilePath,
				length: '',
			};
			let min = recordLength / 60;
			let sec = recordLength % 60;
			let minStr = min < 10 ? '0' + min.toFixed(0) : min.toString();
			let secStr = sec < 10 ? '0' + sec.toFixed(0) : sec.toString();
			msg.length = minStr + ':' + secStr;

			screenMsgFile(msg, "voice")

			// let msg = {
			// 	length: '',
			// 	url: e.tempFilePath
			// }

			//上传音频文件
			// uni.uploadFile({
			// 	url: uni.$u.http.config.baseURL + '/api/upload/uploadVoice', //仅为示例，非真实的接口地址
			// 	filePath: e.tempFilePath,
			// 	name: 'voice',
			// 	header: {
			// 		'Accept': 'application/json',
			// 		'Access-Control-Allow-Origin': '*',
			// 		'Authorization': `Bearer ${uni.getStorageSync('token')}`
			// 	},
			// 	success: (uploadFileRes) => {
			// 		console.log('uploadFileRes', uploadFileRes.data);
			// 		const res = JSON.parse(uploadFileRes.data)
			// 		// let msg = { url: res.tempFilePaths[i], w: image.width, h: image.height };

			// 		sendMsg(msg, 'voice');
			// 	}
			// });

		} else {
			console.log('取消发送录音');
		}
		willStop.value = false;
	}
	// 切换语音/文字输入
	const switchVoice = () => {
		hideDrawer();
		isVoice.value = !isVoice.value;
	}
	const discard = () => {
		return;
	}

	const clickLeft = () => {
		console.log("click left")
		uni.switchTab({
			url: "/pages/chat/index/index"
		})
	}

	const rightClick = async () => {
		// await nextTick();
		// console.log("rightClick", "update name")
		if (props.room_id.startsWith('user')) {
			const to_user_id = project.getToUserIdByRoomId(props.room_id);
			// console.log('rightClick2', props.room_id, to_user_id)	
			tools.navigateTo('/pages/chat/user/info?id=' + to_user_id)
		} else {
			const to_id = project.getToRoomIdByRoomId(props.room_id);
			tools.navigateTo('/pages/chat/group/info?id=' + to_id)
		}
	}

	const otherFun = (data) => {
		console.log('otherFun', data)
	}

	const webConnect = (act, data) => {
		console.log('talk onMessage: ', act, data)
		if (act == 'system' && data.msg.type == "unverified") {
			tools.navigateBack();
			return;
		}
		if (act == "data" && ['system', 'c2c', 'user', 'group'].indexOf(data.type) > -1) {
			// if (act == 'system' || act == 'user' || act == 'c2c' || act == 'group') {
			if (data.msg.userinfo.id == myuid) {
				// console.log('声音播放 - 气泡');
				// let AUDIO = uni.createInnerAudioContext()
				// AUDIO.src = "/static/voice/qipao.mp3";
				// AUDIO.play()
			}
			if (['text', 'img', 'video', 'voice', 'file'].indexOf(data.msg.type) > -1 && data.msg.userinfo.id ==
				myuid) {
				//更新本地消息ID
				updateMsg(data);
				return;
			}
			screenMsg(data)

			return;
		}
		if (act == 'delete' || act == 'revoke') {
			deleteMsg(data)
			return;
		}
		if (act == 'mute') {
			console.log('mute', data)
			if (data.type == "one") {
				//单个禁言
				if (data.mute == 1) {
					console.log('mutes push', data.uid)
					room.mutes.push(data.uid);
				} else {
					let index = room.mutes.findIndex(item => item == data.uid);
					console.log('mutes remove', index)
					if (index > -1) {
						room.mutes.splice(index, 1)
					}
				}
			} else {
				//全体禁言
				room.mute = data.mute
			}
			return;
		}
		if (act == 'online') {
			let online = data.online;
			let target_uid = data.uid;
			let to_user_id = project.getToUserIdByRoomId(props.room_id)
			if (target_uid == to_user_id) {
				isOnine.value = online == 1
			} else {
				isOnine.value = -1
			}
			// console.log('data', data, isOnine.value, target_uid, to_user_id)
			return;
		}
	}

	onMounted(() => {
		socketHelper.join(props.room_id)
		uni.$on('talk', webConnect)
		getMsgList();

		// #ifndef H5
		//录音开始事件
		RECORDER.onStart((e) => {
			recordBegin(e);
		})
		//录音结束事件
		RECORDER.onStop((e) => {
			recordEnd(e);
		})
		// #endif


		const instance = getCurrentInstance().proxy;
		let eventChannel = instance.getOpenerEventChannel();
		eventChannel.on('search_over', async data => {
			console.log('search_over', data)
			await nextTick()
			scrollToView.value = 'msg' + data.id
			console.log('scrollToView ', 'msg' + data.id)
		})


	})

	onUnmounted(() => {
		// eventChannel.off('search_over')
		console.log('talk onUnmounted')
		chatStore.setRoomId("")

		socketHelper.leave(props.room_id)
		uni.$off('talk')
	})

	const appStore = useAppStore();
	onShow(async () => {
		console.log('talk on show')
		if (appStore.isClean) {
			msgList.value = [];
			appStore.setClean(false)
		}


		getRoomData();

		await nextTick()
		// scrollTop.value = 9999999;

		await nextTick()
		bottonShow.value = false;

		//当前房间ID， 用于通知判断
		chatStore.setRoomId(room_id)
	})

	onHide(() => {
		console.log("talk onhide")
		//清空当前房间ID， 用于通知判断
		chatStore.setRoomId("")
	})
	
	uni.$on('talk_full', (value) => {
		console.log('talk_full', value)
		showFull.value = value;
	})
	uni.$on('talk_big_full', (value) => {
		console.log('talk_big_full', value)
		showBigFull.value = value;
	})
</script>

<style lang="scss">
	@import "@/static/HM-chat/css/style.scss";

	.scroll-height {
		/* #ifndef  APP-PLUS */
		height: 44px;
		/* #endif */
		/* #ifdef  APP-PLUS */
		// height: 44px;
		/* #endif */

		// height: calc(140rpx + var(--status-bar-height));

	}

	.talk-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.nav-container {
		width: 750rpx;
		height: calc(140rpx + var(--status-bar-height));
	}

	.content {
		flex: 1;

		.msg-list {
			// background: green;


			.notice {
				width: 750rpx;
				height: 80rpx;

				&_content {
					width: 750rpx;
					height: 80rpx;

					position: fixed;
					left: 0;
					top: calc(140rpx + var(--status-bar-height));
					z-index: 999;
					background: #EEEEEE;
					border-radius: 1rpx;

					&_txt {

						font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 28rpx;
						color: #515151;

						// width: 100%;
						padding: 26rpx 29rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
			}
		}


	}

	.nav-custom-title {
		font-family: SourceHanSansCN-Heavy;
		font-weight: 800;
		font-size: 30rpx;
		color: #000000;

		margin-left: 30rpx;
	}

	.status {
		margin-left: 30rpx;

		&_item {
			display: flex;
			align-items: center;
			height: 21rpx;

			margin-top: 11rpx;
		}


		&_circle {
			width: 20rpx;
			height: 20rpx;
			border-radius: 50%;
			flex-shrink: 0;
		}

		&_online {
			background: #00C688;
		}

		&_off {
			background: #B2B2B2;
		}

		&_txt {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 22rpx;
			color: #000000;
			margin-left: 10rpx;
		}
	}
</style>