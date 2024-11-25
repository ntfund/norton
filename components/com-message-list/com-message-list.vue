<template>
	<u-checkbox-group placement="column" v-model="checkList" @change="checkboxChange">
		<view class="row" :class="{'hidden': row.hide}" v-for="(row,index) in props.data" :key="index" :id="'msg'+row.msg.id">
			<!-- 系统消息 -->
			<block v-if="row.type=='system'">
				<view class="system">
					<!-- 文字消息 -->
					<view v-if="row.msg.type=='text'" class="text">
						{{row.msg.content.text}}
					</view>
					<!-- 撤回消息 -->
					<view v-if="row.msg.type=='revoke'" class="text">
						{{row.msg.userinfo.nickname}}{{row.msg.content.text}}
					</view>
					<!-- 黑名单消息 -->
					<view v-else-if="row.msg.type=='block' && row.msg.userinfo.id == myuid" class="text">
						{{row.msg.content.text}}
					</view>
					<!-- 领取红包消息 -->
					<view v-else-if="row.msg.type=='redEnvelope'" class="red-envelope"
						v-if="row.msg.userinfo.id == myuid || row.msg.content.receiver.id == myuid">
						<image src="/static/img/red-envelope-chat.png"></image>
						<text v-if="row.msg.userinfo.id == myuid">{{row.msg.content.text}}
							<text class="text-orange-500" @click="toDetails(row.msg.content.rid)">红包</text>
						</text>
						<text
							v-else-if="row.msg.content.receiver.id == myuid">你领取了{{row.msg.userinfo.nickname}}的{{row.msg.content.symbol}}
							<text class="text-orange-500" @click="toDetails(row.msg.content.rid)">红包</text>
						</text>
					</view>
					<!-- 添加好友的消息 -->
					<view v-else-if="row.msg.type=='friend' && row.msg.userinfo.id != myuid" class="text">
						{{row.msg.content.text}}
					</view>
					<!-- 未添加好友的消息 -->
					<view v-else-if="row.msg.type=='no-friend' && row.msg.userinfo.id == myuid" class="text">
						<text>
							{{row.msg.content.text}}
						</text>
						<text class="text-blue-500 ml-2" @click="addFriend(row.msg.content.to_user_id)">添加好友</text>
					</view>
					<!-- 添加好友的消息 -->
					<!-- 群邀请好友的消息 -->
					<!-- 修改群聊名称 -->
					<view v-else-if="row.msg.type=='new-group' || row.msg.type=='invite' || row.msg.type=='rename'"
						class="text">
						{{row.msg.content.text}}
					</view>
				</view>
			</block>
			<!-- 用户消息 -->
			<block v-else>

				<view class="flex">
					<label class="radio mt-1" v-if="showMultiple">
						<u-checkbox :name="row.msg.id" shape="circle" label="" size="24"></u-checkbox>
					</label>
					<!-- 自己发出的消息 -->
					<view class="my mb-2" v-if="row.msg.userinfo.id==myuid">
						<view class="msg">
							<!-- 左-消息 -->
							<view class="left">
								<!-- 文字消息 -->
								<view v-if="row.msg.type=='text'" class="bubble" @longpress.stop="longpress($event, row)">
									<rich-text :nodes="replaceEmoji(row.msg.content.text)"></rich-text>
								</view>
								<!-- 语言消息 -->
								<view v-if="row.msg.type=='voice'" class="bubble voice" @tap="playVoice(row.msg)"
									@longpress.stop="longpress($event, row)" :class="playMsgid == row.msg.id?'play':''">
									<view class="length">{{row.msg.content.length}}</view>
									<view class="icon my-voice"></view>
									<!-- 消息上传到S3 -->
									<com-message-list-voice :data="row"></com-message-list-voice>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.msg.type=='img'" class="bubble img" @tap="showPic(row.msg)"
									@longpress.stop="longpress($event, row)">
									<com-message-list-image :data="row"></com-message-list-image>
								</view>
								<!-- 视频消息 -->
								<view v-if="row.msg.type=='video'">
									<com-message-list-video :data="row"
										@longpress.stop="longpress($event, row)"></com-message-list-video>
								</view>
								<!-- 文件消息 -->
								<view v-if="row.msg.type=='file'">
									<com-message-list-file :data="row"
										@longpress.stop="longpress($event, row)"></com-message-list-file>
								</view>
								<!-- 名片消息 -->
								<view v-if="row.msg.type=='card'"
									@tap="tools.navigateTo('/pages/chat/user/info?id='+row.msg.content.user.id)"
									@longpress.stop="longpress($event, row)">
									<com-chat-card :data="row.msg.content.user"></com-chat-card>
								</view>
								<!-- 聊天记录 -->
								<view v-if="row.msg.type=='multiple'"
									@tap="tools.navigateTo('/pages/chat/history/history?id='+row.msg.id)"
									@longpress.stop="longpress($event, row)">
									<view class="multiple px-2 flex flex-col text-base rounded-md min-w-[240px]">
										<text
											class="ml-2 max-w-[230px] text-sm mt-2 font-bold">{{row.msg.content.title}}</text>
										<view class="flex items-center py-2">
											<text class="ml-2 max-w-[140px] text-sm">{{row.msg.content.text}}</text>
										</view>
										<u-line></u-line>
										<view class="text-xs my-1 sub-title">聊天记录</view>
									</view>
								</view>
								<!-- 红包 -->
								<view v-if="row.msg.type=='redEnvelope'" class="bubble red-envelope"
									:class="{'opacity-70': row.msg.content.status > 1}" @tap="openRedEnvelope(row,index)"
									@longpress.stop="longpress($event, row)">
									<image src="/static/img/red-envelope.png"></image>
									<view class="tis">
										<!-- 点击开红包 -->
										<!-- 点击开红包 -->
										<text v-if="row.msg.content.status == 2">已被领取</text>
									</view>
									<view class="blessing">
										{{row.msg.content.blessing}}
									</view>
								</view>
								<!-- 转账 -->
								<view v-if="row.msg.type=='transfer'" class="flex min-w-[150px]" @tap="showRed(row)"
									@longpress.stop="longpress($event, row)"
									:class="{'opacity-60': row.msg.content.status > 1}">
									<view class="transfer">
										<view class="flex border-bb border-b-orange-300 pt-1 pb-2">
											<view class="w-[30px] flex items-center">
												<u-icon name="red-packet" color="#fff" size="30"></u-icon>
											</view>
											<view class="ml-2 text-sm">
												<view class="font-semibold">{{row.msg.content.amount}}</view>
												<view v-if="row.msg.content.type == 'transfer'">
													<view v-if="row.msg.content.status == 1">你发起了一笔转账</view>
													<view v-if="row.msg.content.status == 2">已被接收</view>
													<view v-if="row.msg.content.status == 3">已退回</view>
													<view v-if="row.msg.content.status == 4">已过期</view>
												</view>
												<view v-if="row.msg.content.type == 'receiver'">已收款</view>
											</view>
										</view>
										<view class="text-xs mt-1 text-gray-100">{{row.msg.content.name}}转账</view>
									</view>
									<!-- <view class="-ml-[5px] mt-[10px]">
									<u-icon name="play-right-fill" color="#fb923c" size="14"></u-icon>
								</view> -->
								</view>
								
							</view>
							<!-- 右-头像 -->
							<view class="right" v-if="false">
								<image :src="project.getFullURL(row.msg.userinfo.avatar)" style="background-color: #fff;">
								</image>
							</view>
						</view>
						<view class="reply-msg" v-if="row.msg.content.reply_id">													
							<com-message-list-reply :id="row.msg.content.reply_id" :dataList="props.data"></com-message-list-reply>
						</view>
					</view>
					<!-- 别人发出的消息 -->
					<view class="other " v-else>
						<view class="msg">
							<!-- 左-头像 -->
							<view class="left" v-if="room_type == 'group'"
								@click="tools.navigateTo('/pages/chat/user/info?room_id='+ (room ? room.id : '') +'&id=' + row.msg.userinfo.id)">
								<image :src="project.getFullURL(row.msg.userinfo.avatar)" style="background-color: #fff;">
								</image>
							</view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<view class="username" v-if="room_type == 'group'">
									<view class="name" v-if="show_nickname">
										{{roomHelper.getUserGroupNickname(room, row.msg.userinfo)}}
									</view>
									<view class="time">{{row.msg.time}}</view>
								</view>
								<!-- 文字消息 -->
								<view v-if="row.msg.type=='text'" class="bubble" @longpress="longpress($event, row)">
									<rich-text :nodes="replaceEmoji(row.msg.content.text)"></rich-text>
								</view>
								<!-- 文件消息 -->
								<view v-if="row.msg.type=='file'">
									<com-message-list-file :data="row"
										@longpress.stop="longpress($event, row)"></com-message-list-file>
								</view>								
								<!-- 语音消息 -->
								<view v-if="row.msg.type=='voice'" class="bubble voice" @tap="playVoice(row.msg)"
									:class="playMsgid == row.msg.id?'play':''" @longpress.stop="longpress($event, row)">
									<view class="icon other-voice"></view>
									<view class="length">{{row.msg.content.length}}</view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.msg.type=='img'" class="bubble img" @tap="showPic(row.msg)"
									@longpress.stop="longpress($event, row)">
									<com-message-list-image :data="row"></com-message-list-image>
								</view>
								<!-- 视频消息 -->
								<view v-if="row.msg.type=='video'" @longpress.stop="longpress($event, row)">
									<com-message-list-video :data="row"></com-message-list-video>
								</view>
								<!-- 名片消息 -->
								<view v-if="row.msg.type=='card'"
									@tap="tools.navigateTo('/pages/chat/user/info?id='+row.msg.content.user.id)"
									@longpress.stop="longpress($event, row)">
									<com-chat-card :data="row.msg.content.user"></com-chat-card>
								</view>
								<!-- 聊天记录 -->
								<view v-if="row.msg.type=='multiple'"
									@tap="tools.navigateTo('/pages/chat/history/history?id='+row.msg.id)"
									@longpress.stop="longpress($event, row)">
									<view class="multiple px-2 flex flex-col text-base rounded-md min-w-[240px]">
										<text
											class="ml-2 max-w-[230px] text-sm mt-2 font-bold">{{row.msg.content.title}}</text>
										<view class="flex items-center py-2">
											<text class="ml-2 max-w-[140px] text-sm">{{row.msg.content.text}}</text>
										</view>
										<u-line></u-line>
										<view class="text-xs my-1 sub-title">聊天记录</view>
									</view>
								</view>
								<!-- 红包 -->
								<view v-if="row.msg.type=='redEnvelope'" class="bubble red-envelope"
									:class="{'opacity-70': row.msg.content.received_users.includes(myuid) || row.msg.content.status > 1}"
									@tap="openRedEnvelope(row,index)" @longpress.stop="longpress($event, row)">
									<image src="/static/img/red-envelope.png"></image>
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
									@longpress.stop="longpress($event, row)"
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
						<view class="reply-msg" v-if="row.msg.content.reply_id">
							<com-message-list-reply :id="row.msg.content.reply_id" :dataList="props.data"></com-message-list-reply>
						</view>
					</view>
				</view>

			</block>
		</view>
	</u-checkbox-group>

	<!-- 多选消息底部栏 -->
	<com-talk-multiple-options v-model:data="checkList" v-model:show="showMultiple"
		v-if="showMultiple"></com-talk-multiple-options>
	<!-- 红包弹窗 -->
	<view class="windows" :class="windowsState" v-else>
		<!-- 遮罩层 -->
		<view class="mask" @touchmove.stop.prevent="discard" @tap="closeRedEnvelope"></view>
		<view class="layer" @touchmove.stop.prevent="discard">
			<view class="open-redenvelope">
				<view class="top">
					<view class="close-btn">
						<view class="icon close" @tap="closeRedEnvelope"></view>
					</view>
					<image :src="redenvelopeData.face"></image>
				</view>
				<view class="from">来自{{redenvelopeData.from}}</view>
				<view class="blessing">{{redenvelopeData.blessing}}</view>
				<view class="money" v-if="redenvelopeData.isReceived">{{redenvelopeData.money}}</view>
				<view class="w-[100%] text-center" :class="{'rotate': rotate}" v-else>
					<view class="open" @click="openRedPacket(redenvelopeData)"><span>开</span></view>
				</view>
				<!-- <view class="showDetails" @tap="toDetails(redenvelopeData.rid)">
					查看领取详情 <view class="icon to"></view>
				</view> -->
			</view>
		</view>
	</view>

	<!-- 操作选择弹窗 -->
	<com-message-options-pop v-if="showOptions" v-model:show="showOptions" :event="selectedEvent" v-model:data="selectedOption"
		:top="selectedTop" @change="optionChange"></com-message-options-pop>


</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, inject, watchEffect, watch, nextTick } from "vue";
	import { onShow } from '@dcloudio/uni-app'
	import project from '@/utils/project'
	import tools from '@/utils/tools'
	import { useUserStore } from '@/stores/modules/user'
	import roomHelper from "@/utils/chat/roomHelper";
	import emojiList from "@/data/emojiList";
	import s3Helper from '@/utils/s3Helper.js'

	const userStore = useUserStore()
	const props = defineProps(['data', 'msgImgList', 'type', 'room'])
	const emit = defineEmits(['sendSystemMsg', 'screenMsg'])
	const http = uni.$u.http

	const myuid = userStore.user.id;
	console.log('myUid', myuid);
	const room_id = inject('room_id');
	const room_type = project.getRoomType(room_id);
	const show_nickname = ref()
	if (room_type == "group") {
		watch(() => props.room, async () => {
			let infos = roomHelper.getUserGroupInfos(props.room);
			// console.log('watchEffect', props.room, infos)
			if (typeof infos.show_nickname != "undefined") {
				show_nickname.value = infos.show_nickname != 0
				// console.log('watchEffect', show_nickname.value)
			} else {
				show_nickname.value = true
			}
		}, { deep: true, immediate: true })
	}
	// let room = inject('room');
	// console.log('room inject', room)


	//播放语音相关参数
	let AUDIO = uni.createInnerAudioContext()
	let VoiceTimer = null
	const playMsgid = ref(0);

	//红包相关参数
	const windowsState = ref('')
	let redenvelopeData = reactive({
		rid: null,	//红包ID
		from: null,
		face: null,
		blessing: null,
		money: null,
		isReceived: false,
		row_index: -1
	})


	// 播放语音
	const playVoice = (msg) => {
		playMsgid.value = msg.id;
		AUDIO.src = project.getFullURL(msg.content.url);
		// $nextTick(function () {
		// 	AUDIO.play();
		// });
		AUDIO.play();
	}


	// 预览图片
	const showPic = (msg) => {
		uni.previewImage({
			indicator: "none",
			current: msg.content.url,
			urls: props.msgImgList
		});
	}

	const rotate = ref(false);
	// 打开红包
	const openRedEnvelope = (row, index) => {
		console.log('openRedEnvelope', row)
		let msg = row.msg

		if (msg.content.room_id.startsWith('user') && msg.userinfo.id == myuid) {
			toDetails(msg.content.rid)
		}
		if (msg.content.status == 2 || msg.content.received_users.includes(myuid)) {
			toDetails(msg.content.rid)
		}

		uni.showLoading({
			title: '加载中...'
		});
		console.log("index: " + index);
		rotate.value = false;

		redenvelopeData = {
			rid: msg.content.rid,	//红包ID
			from: msg.userinfo.nickname,
			face: tools.getAvatar(msg.userinfo.avatar),
			blessing: msg.content.blessing,
			money: tools.floorAmountMinDigits(msg.content.amount, 2),
			isReceived: msg.content.status == 2,
			row_index: index
		}
		uni.hideLoading();
		windowsState.value = 'show';

		//模拟请求服务器效果
		// setTimeout(() => {
		// 	//加载数据
		// 	if (rid == 0) {
		// 		redenvelopeData = {
		// 			rid: 0,	//红包ID
		// 			from: "大黑哥",
		// 			face: "/static/img/im/face/face.jpg",
		// 			blessing: "恭喜发财，大吉大利",
		// 			money: "已领完"
		// 		}
		// 	} else {
		// 		redenvelopeData = {
		// 			rid: 1,	//红包ID
		// 			from: "售后客服008",
		// 			face: "/static/img/im/face/face_2.jpg",
		// 			blessing: "恭喜发财",
		// 			money: "0.01"
		// 		}
		// 		if (!msg.content.isReceived) {
		// 			// {type:"system",msg:{id:8,type:"redEnvelope",content:{text:"你领取了售后客服008的红包"}}},
		// 			// sendSystemMsg({ text: "你领取了" + (msg.userinfo.uid == myuid ? "自己" : msg.userinfo.username) + "的红包" }, 'redEnvelope');
		// 			// console.log("msgList[index]: " + JSON.stringify(msgList.value[index]));
		// 			// msgList.value[index].msg.content.isReceived = true;

		// 			// emit('sendSystemMsg', { text: "你领取了" + (msg.userinfo.uid == myuid ? "自己" : msg.userinfo.username) + "的红包" }, 'redEnvelope')
		// 			// row.msg.content.isReceived = true;
		// 		}
		// 	}
		// 	uni.hideLoading();
		// 	windowsState.value = 'show';

		// }, 200)

	}

	//开红包
	const openRedPacket = (data) => {
		rotate.value = true;

		setTimeout(() => {
			uni.$u.http.put('/chat/chatRedEnvelope/' + data.rid).then(res => {
				project.incrementBalanceChat(res.token_id, res.amount) //增加用户余额
				props.data[data.row_index].msg.content.received_users.push(myuid);
				toDetails(data.rid)
			}).catch(err => {
				windowsState.value = ''
				props.data[data.row_index].msg.content.status = 2;
			});
		}, 1000)
	}

	const showRed = (item) => {
		if (item.msg.content.type == 'transfer') {
			if (item.msg.content.status == 1) {
				tools.navigateToWithEncode('/pages/chat/redEnvelope/red_transfer', item)
			}
			if (item.msg.content.status == 2) {
				tools.navigateToWithEncode('/pages/chat/redEnvelope/red_received', item)
			}
		}

		if (item.msg.content.type == 'receiver') {
			tools.navigateToWithEncode('/pages/chat/redEnvelope/red_received', item)
		}
	}

	// 关闭红包弹窗
	const closeRedEnvelope = () => {
		windowsState.value = 'hide';
		setTimeout(() => {
			windowsState.value = '';
		}, 200)
	}

	//领取详情
	const toDetails = (rid) => {
		uni.navigateTo({
			url: '/pages/chat/redEnvelope/detail?rid=' + rid
		})
		closeRedEnvelope();
	}

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
						// let onlinePath = '/static/img/emoji/' + EM.url
						let onlinePath = s3Helper.getEmoji(EM.url)
						let imgstr = '<img src="' + onlinePath  + '" mode="aspectFit" widht="50" height="50" style="width:100rpx;height:100rpx" />';
						// console.log("imgstr: " + imgstr);
						return imgstr;
					}
				}
			}
		});
		return '<div style="display: flex;align-items: center;word-wrap:break-word;">' + replacedStr + '</div>';
	}


	const discard = () => {
		return;
	}

	const addFriend = (id) => {
		uni.$u.http.post('/chat/newFriend', {
			to_user_id: id
		}).then(data => {
			uni.showToast({
				title: "已向对方发送好友申请",
				icon: 'none'
			});
		})
	}

	const showOptions = ref(false);
	const selectedOption = ref({});
	const selectedEvent = ref({});
	const selectedTop = ref(0);
	const longpress = async (event : any, row : any) => {
		// console.log('props.parent.offsetHeight', event.parent)
		uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
			success(res) { //成功回调函数			
				console.log('getSystemInfo res', res)
				let titleH = uni.createSelectorQuery().select("#msg" + row.msg.id); //想要获取高度的元素名（class/id）
				titleH.boundingClientRect(data => {
					// selectedBottom.value = data.height - event.currentTarget.offsetTop;
					selectedTop.value = data.top
				}).exec()
				// const query = uni.createSelectorQuery()
				// query.select('.msg-list').boundingClientRect()
				// query.exec(function (res) {
				// 	console.log('打印页面的剩余高度', res);
				// })
			}
		})

		console.log(event, row)
		showOptions.value = true;
		selectedEvent.value = event;
		selectedOption.value = row
	}

	//多选
	const showMultiple = ref(false)
	// const checkList = reactive([]);
	const checkList = ref([]);
	const checkboxChange = (e) => {
		console.log(e, checkList)
	}
	const optionChange = (value) => {
		if ("multiple" == value) {
			showMultiple.value = true;
			checkList.value.push(selectedOption.value.msg.id)
			
			uni.$emit('talk_full', true)
		}
	}

	onMounted(() => {
		//语音自然播放结束
		AUDIO.onEnded((res) => {
			playMsgid.value = 0;
		});

	})

	onShow(() => {
		console.log('talk list on  show')
		//模板借由本地缓存实现发红包效果，实际应用中请不要使用此方法。
		//
		uni.getStorage({
			key: 'redEnvelopeData',
			success: (res) => {
				console.log(res.data);
				let nowDate = new Date();
				console.log('props.data.value', props.data)
				let lastid = props.data[props.data.length - 1].msg.id;
				lastid++;
				let row = { type: "user", msg: { id: lastid, type: "redEnvelope", time: nowDate.getHours() + ":" + nowDate.getMinutes(), userinfo: { uid: 0, username: "大黑哥", face: "/static/img/face.jpg" }, content: { blessing: res.data.blessing, rid: Math.floor(Math.random() * 1000 + 1), isReceived: false } } };
				// screenMsg(row);
				emit('screenMsg', row)
				uni.removeStorage({ key: 'redEnvelopeData' });
			}
		});
	})
</script>

<style lang="scss">
	@import "@/static/HM-chat/css/style.scss";

	.transfer {
		@apply rounded-md bg-orange-400 px-3 py-1 text-white ;
		
		min-width: 400rpx
	}

	.open {
		width: 100px;
		height: 100px;
		border: 1px solid #e7a63c;
		background-color: #e7a63c;
		border-radius: 50%;
		color: #fff;
		font-size: 20px;
		display: inline-block;
		margin-top: 50px;
		box-shadow: 0px 4px 0px 0px rgba(0, 0, 0, 0.2);
		font-size: 35px;
	}

	.open span {
		margin-top: 25px;
		display: inline-block;
	}

	.rotate {
		-webkit-animation: anim .6s infinite alternate;
		-ms-animation: anim .6s infinite alternate;
		animation: anim .6s infinite alternate;
	}

	@-webkit-keyframes anim {
		from {
			-webkit-transform: rotateY(180deg);
		}

		to {
			-webkit-transform: rotateY(360deg);
		}
	}

	@-ms-keyframes anim {
		from {
			-ms-transform: rotateY(180deg);
		}

		to {
			-ms-transform: rotateY(360deg);
		}
	}

	@keyframes anim {
		from {
			transform: rotateY(180deg);
		}

		to {
			transform: rotateY(360deg);
		}
	}
	
	.hidden {
		display: none;
	}
</style>