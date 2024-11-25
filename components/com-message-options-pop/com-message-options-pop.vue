<template>
	<view class="options" v-if="props.show && !showDelete">
		<!-- 遮罩层 -->
		<!-- <view class="mask" @touchmove.stop.prevent="discard" @longpress="close()" @tap="close()"></view> -->
		<view class="mask" @touchstart.stop.prevent="discard" @click="close()"></view>
		<!-- <view class="mask" @touchmove.native="discard" @click="close()"></view> -->
		<view class="layer">
			<view class="options-list" :style="optStyle">
				<view class="options-list-item border" v-if="showCopy" @click="copyText()">
					<!-- <view class="iconfont icon-copy"></view> -->
					<view class="title">复制</view>
					<image src="@/static/images/chat/copy@2x.png" mode="aspectFit" style="width: 33rpx; height: 37rpx;">
					</image>
				</view>
				<view class="options-list-item border" v-if="showReply" @click="reply()">
					<view class="title">回复</view>
					<image src="@/static/images/chat/reply@2x.png" mode="aspectFit"
						style="width: 33rpx; height: 35rpx;"></image>
				</view>
				<view class="options-list-item border" @click="relay()">
					<view class="title">转发</view>
					<view class="iconfont icon-response"></view>
					<!-- <image src="@/static/images/chat/copy@2x.png" mode="aspectFit" style="width: 33rpx; height: 37rpx;"></image> -->
				</view>
				<view class="options-list-item border" @click="revoke" v-if="isMe">
					<view class="title">撤回</view>
					<!-- <view class="iconfont icon-delete1"></view> -->
					<image src="@/static/images/chat/revoke@2x.png" mode="aspectFit"
						style="width: 34rpx; height: 38rpx;"></image>
				</view>
				<view class="options-list-item border" @click="showDelete = true;">
					<view class="title">删除</view>
					<!-- <view class="iconfont icon-delete1"></view> -->
					<image src="@/static/images/chat/delete@2x.png" mode="aspectFit"
						style="width: 34rpx; height: 38rpx;"></image>
				</view>
				<view class="options-list-item" @click="close();emit('change', 'multiple')">
					<view class="title">多选</view>
					<view class="iconfont icon-message-multi-language"></view>
				</view>
			</view>
		</view>
	</view>

	<com-confirm v-model:show="showDelete" :showAll="showAll" title="是否删除该条消息?" :allText="allText" @confirmed="deleteMsg" @close="close()"></com-confirm>
</template>

<script setup>
	import {
		onPageScroll
	} from '@dcloudio/uni-app';
	import {
		computed,
		inject,
		ref,
		watchEffect
	} from 'vue';
	import {
		useUserStore
	} from '@/stores/modules/user'
	import tools from '@/utils/tools';
	import {
		destoryChatMessage
	} from '@/config/api';
	import project from '@/utils/project';
	import {
		useTalkStore
	} from '@/stores/modules/talk';
	const props = defineProps(['show', 'data', 'event', 'top']);
	const emit = defineEmits(['update:show', 'change', 'update:data']);
	const showOptions = ref(true)
	const showDelete = ref(false)
	const showAll = ref(false)
	const userStore = useUserStore()
	const showCopy = ref(props.data.msg.type == "text" || props.data.msg.type == "img")
	const showReply= ref(props.data.msg.userinfo.id != userStore.user.id)
	const optionsHeight = ref(276);
	const isMe = ref(false)
	const room_id = inject('room_id');
	const room = inject('room');
	const allText = ref('从我和对方的设备删除')
	// console.log('room_id', room_id)
	
	const roomType = project.getRoomType(room_id);
	if (roomType == "user") {
		showAll.value = true;
	} else if (roomType == "group") {
		showAll.value = props.data.msg.userinfo.id == userStore.user.id || project.isRoomAdminByRoomAndMe(room);
		allText.value = '从所有用户的设备中删除'
	}

	watchEffect(() => {
		if (!showCopy.value) {
			optionsHeight.value = optionsHeight.value - 45;
		}
		// if (userStore.user.id) {
		// 	isMe.value = props.data.msg.userinfo.id == userStore.user.id
		// }
		if (!isMe.value) {
			optionsHeight.value = optionsHeight.value - 45;
		}
		if (!showReply.value) {
			optionsHeight.value = optionsHeight.value - 45;
		}
	})
	console.log('props.data', props.data)

	// console.log(props.event.currentTarget, uni.getSystemInfoSync().windowHeight);


	const optStyle = computed(() => {
		if (props.event && props.event.currentTarget) {
			// return 'right:10px; top: ' + props.event.changedTouches[0].clientY + 'px';
			// let offsetTop = props.event.currentTarget.offsetTop + 62;
			const windowHeight = uni.getSystemInfoSync().windowHeight
			let offsetTop = props.top + 62;
			console.log('props.top', props.top, optionsHeight.value, windowHeight)
			if (props.top + optionsHeight.value + 55 > windowHeight - 100) {
				offsetTop -= (optionsHeight.value + 55);
			}
			if (props.data.msg.userinfo.id == userStore.user.id) {
				//复制自己的消息，右对齐
				return 'right:100rpx; top: ' + offsetTop + 'px';
			}
			//复制别人的消息
			return 'left:100rpx; top: ' + offsetTop + 'px';
		}
		return ''
	})

	const discard = () => {
		close()
		return false;
	}

	const copyText = () => {
		if (props.data.msg.type == 'text') {
			close()
			tools.copyClick(props.data.msg.content.text, false)
		}
	}

	const reply = () => {
		const talkStore = useTalkStore();
		talkStore.setMsg(props.data)
		close();
	}

	//转发消息
	const relay = () => {
		close()
		tools.navigateToWithEncode('/pages/chat/user/share', {
			type: 2,
			data: props.data
		})
	}

	//撤回消息
	const revoke = () => {
		close()
		let newData = props.data;
		newData.hide = true;
		emit('update:data', newData)
		uni.$u.http.delete('/chat/message/revoke/' + props.data.msg.id)

	}

	const deleteMsg = (type) => {
		//模拟消息发送，先删除本地
		if (props.data.temp) {
			tools.toast("请重试");
			return;
		}
		uni.$emit('talk', 'delete', {id: props.data.msg.id})
		uni.$emit('chat', 'delete', {id: props.data.msg.id})
		destoryChatMessage(props.data.msg.id, type)
	}

	const close = () => {
		console.log('close')
		emit('update:show', false);
	}
	// onPageScroll(() => {
	// 	console.log('onPageScroll')
	// 	close()
	// })
</script>

<style lang="scss" >
	@keyframes opacity2 {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	.options {
		// position: absolute;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9999999;

		// background: gray;


		.mask {
			position: fixed;
			left: 0;
			top: 0;
			right: 0;

			width: 100vw;
			height: 100vh;
			z-index: 10001;
			// background-color: green;

			background-color: rgba(0, 0, 0, .6);
			opacity: 1;
			animation: opacity2 .2s ease-out;
		}

		.options-list {
			// padding: 0 20rpx;
			// height: 60px;
			border-radius: 10px;
			background: white;
			display: flex;
			flex-direction: column;

			align-items: center;

			position: absolute;
			z-index: 10002;

			.options-list-item {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				// margin: 10px 15px;
				width: 450rpx;
				padding: 0 45rpx;
				height: 90rpx;



				.iconfont {
					font-size: 22px;
				}

				.title {
					// @apply text-xs;
					font-family: SourceHanSansCN-Medium;
					font-weight: 500;
					font-size: 28rpx;
					color: #000000;
				}
			}

			.options-list-item:active {
				background: #eee;
			}

			.border {
				border-bottom: 1rpx solid #eee;
			}
		}
	}
</style>