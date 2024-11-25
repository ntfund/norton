<template>
	<view class="data-list" v-if="data && data.length > 0">
		<view v-for="(item, index) in data" :key="index">
			<view :class="{'border_heng': index > 0 && item.weight == 0 && data[index-1].weight > 0}">
			</view>
			<view class="data-list-item"  @click="itemClick(item)">
				<view class="data-list-item_avatars">
					<image v-for="(itemImg, i) in item.avatar_list" :src="project.getFullURL(itemImg)" mode="aspectFit"
						class="avatarItem" :class="'avatarItem--' + item.avatar_list.length"></image>
				</view>
				<view class="data-list-item-right flex-1">
					<view class="flex align-center justify-between data-list-item-right-row1">
						<view class="nickname">{{item.title}}</view>
						<view class="time">{{ tools.time2Chat(item.created_at) }}</view>
					</view>
					<view class="info">
						<view class="msg">{{getNote(item)}}</view>
						<view class="number" v-if="item.unread > 0">{{item.unread}}</view>
					</view>
				</view>
			</view>			
		</view>		
	</view>
</template>

<script setup>
	import tools from '@/utils/tools';
	import project from '@/utils/project';
	import {
		useUserStore
	} from '@/stores/modules/user';
	const props = defineProps(['data'])
	const userStore = useUserStore()

	const getAvatarList = (avatarArr) => {
		let arr = [];
		for (var i = 0; i < avatarArr.length; i++) {
			let url = uni.$u.http.config.baseURL + avatarArr[i]
			arr.push(url)
		}
		return arr;
	}

	const getNote = (item) => {
		if (!item.message) {
			//如果消息被删除则为空
			return '';
		}
		const msg = item.message.data
		// console.log('getNote',  msg)
		if (msg.type == "system") {
			if (msg.msg.type == "friend" || msg.msg.type == "new-group" || msg.msg.type == "rename") {
				return msg.msg.content.text;
			} else if (msg.msg.type == "invite") {
				// return "有新成员加入"
				return msg.msg.content.text
			} else if (msg.msg.type == "redEnvelope") {
				if (msg.msg.userinfo.id == userStore.user.id) {
					return "[红包]被领取"
				} else if (msg.msg.content.receiver.id == userStore.user.id) {
					return "[红包]已领取"
				}
			}
		} else if (msg.type == "user" || msg.type == "c2c" || msg.type == "group") //用户消息
		{
			//文本
			if (msg.msg.type == "text") {
				return msg.msg.content.text
			} else if (msg.msg.type == "img") {
				//图片
				return '图片'
			} else if (msg.msg.type == "transfer") {
				//
				if (msg.msg.content.type == "transfer") {
					if (msg.msg.userinfo.id == userStore.user.id) {
						return '[转账]你发起了一笔转账'
					} else {
						if (msg.msg.content.status == 1) {
							return '[转账]请收款'
						} else if (msg.msg.content.status == 2) {
							return '[转账]已收款'
						} else if (msg.msg.content.status == 3) {
							return '[转账]已过期'
						} else {
							return '[转账]已收款'
						}
					}
				} else if (msg.msg.content.type == "receiver") {
					if (msg.msg.userinfo.id == userStore.user.id) {
						return '[转账]已收款'
					} else {
						return '[转账]已被接收'
					}
				}

			} else if (msg.msg.type == "card") {
				//图片
				return '[个人名片]'
			} else if (msg.msg.type == "redEnvelope") {
				//图片
				return '[红包]待领取'
			} else if (msg.msg.type == "file") {
				//文件
				return '[文件]' + msg.msg.content.name
			}
		}

		return '您收到一条新的消息';
	}

	//计算头像布局
	// const computedAvatar = (avatarList) => {
	// 	if (avatarList.length > 4) {
	// 		return "avatarItem--3"
	// 	} else if (avatarList.length > 1) {
	// 		return "avatarItem--2"
	// 	} else {
	// 		return "avatarItem--1"
	// 	}
	// }

	const itemClick = (item) => {
		console.log('chat join')
		item.unread = 0;
		tools.navigateToWithEncodeMultiply('/pages/chat/talk/talk', {
			room_id: item.room_id
		})
	}
</script>

<style lang="scss" scoped>
	.data-list {
		padding: 20rpx 0;

		&-item {
			display: flex;
			justify-content: space-between;
			align-items: stretch;
			padding: 20rpx 28rpx;

			// width: 750rpx;
			// height: 140rpx;

			// 可行，暂时不用
			// &_avatars {
			// 	width: 100rpx;
			// 	height: 100rpx;

			// 	display: grid;
			// 	grid-template-columns: repeat(auto-fit, minmax(30rpx, 1fr));
			// 	grid-auto-rows: 100rpx;
			// 	grid-gap: 2rpx;

			// 	image {
			// 		width: 100%;
			// 		height: 100%;
			// 		object-fit: cover;
			// 		border-radius: 5px;
			// 	}
			// }

			//走微信九宫格样式
			&_avatars {
				width: 100rpx;
				height: 100rpx;
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
					width: 100rpx;
					height: 100rpx;
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

			&-right {
				// flex-shrink: 1;
				padding-left: 32rpx;
				// padding-bottom: 7rpx;
				height: 100rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				&-row1 {
					margin-top: 10rpx;

					.nickname {
						font-family: SourceHanSansCN-Medium;
						font-weight: 500;
						font-size: 30rpx;
						color: #000000;
					}

					.time {
						font-family: Gilroy-Medium;
						font-weight: 500;
						font-size: 24rpx;
						color: #666666;
					}
				}


				.info {
					display: flex;
					justify-content: space-between;
					align-items: center;

					height: 28rpx;
					margin-bottom: 7rpx;

					.msg {
						font-family: SourceHanSansCN-Medium;
						font-weight: 500;
						font-size: 24rpx;
						color: #999999;
						
						max-width: 450rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;												
					}

					.number {
						width: 48rpx;
						height: 28rpx;
						background: #FC465C;
						border-radius: 14rpx;

						display: flex;
						justify-content: center;
						align-items: center;

						font-family: Gilroy-Bold;
						font-weight: bold;
						font-size: 18rpx;
						color: #FFFFFF;
					}
				}
			}
		}
		
		&-item:active {
			background: #eee;
		}
	}

	.border_heng {
		// width: 750rpx;
		// height: 20rpx;
		// background: #F9F9F9;
		border-top: 20rpx solid #F9F9F9;
	}
</style>