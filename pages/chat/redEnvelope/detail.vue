<template>
	<com-nav-bar title="" backgroundColor="#cf3c35" color="white"></com-nav-bar>
	<view>		
		<view class="top">
			<view class="blessing">
				{{redEnvelope.blessing}}
			</view>
			<view class="money flex items-center" v-if="myMoney > 0">
				<image :src="project.getFullURL(redEnvelope.token.icon)" mode="widthFix"
					style="width: 60rpx; height: 60rpx;"></image>
				<text class="ml-1">{{tools.floorAmountMinDigits(myMoney, 2)}}</text>
			</view>
			<view class="face" :style="{'border-radius':radius}">
				<image :src="tools.getAvatar(redEnvelope.user.avatar)"></image>
			</view>
			<view class="username">
				{{redEnvelope.user.nickname}}的红包
			</view>
		</view>
		<view class="info">
			<text v-if="redEnvelope.user.id == userStore.user.id && redEnvelope.received < 0.0001">红包金额{{tools.floorAmountMinDigits(redEnvelope.total, 2)}}{{redEnvelope.token.name}}, 等待对方领取</text>
			<text
				v-else>已领取{{redEnvelope.details.length}}/{{redEnvelope.number}}个，共{{redEnvelope.received}}/{{tools.floorAmountMinDigits(redEnvelope.total, 2)}}{{redEnvelope.token.name}}</text>
		</view>
		<view class="list">
			<view class="row" v-for="(row,index) in redEnvelope.details" :key="index">
				<view class="left">
					<image :src="tools.getAvatar(row.user.avatar)"></image>
				</view>
				<view class="right">
					<view class="r1">
						<view class="username">
							{{row.user.nickname}}
						</view>
						<view class="money flex items-center">
							<image :src="project.getFullURL(redEnvelope.token.icon)" mode="widthFix"
								style="width: 30rpx; height: 30rpx;"></image>
							{{row.amount}}
						</view>
					</view>
					<view class="r2">
						<view class="time">
							{{row.updated_at}}
						</view>
						<view class="lucky" v-if="row.is_lucky">
							手气王
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { reactive, ref } from "vue";
	import tools from '@/utils/tools'
	import project from '@/utils/project'
	import { useUserStore } from "@/stores/modules/user";
	// const blessing = ref("恭喜发财")
	// const money = ref(0.01)
	// const username = ref("大黑哥")
	// const receivedNumber = ref(8)
	// const SumNumber = ref(10)
	// const receivedMoney = ref(5.43)
	// const SumMoney = ref(10)
	// const fromFace = ref('/static/faces/06.jpg')
	// const receivedList = ref([
	// 	{ username: "大黑哥", face: "/static/faces/06.jpg", time: "2019-04-12 12:54:12", money: 0.01, islucky: false },
	// 	{ username: "路人甲", face: "/static/faces/05.jpg", time: "2019-04-12 12:54:13", money: 1.82, islucky: true },
	// 	{ username: "高级黑", face: "/static/faces/04.jpg", time: "2019-04-12 12:55:10", money: 0.23, islucky: false },
	// 	{ username: "低级黑", face: "/static/faces/03.jpg", time: "2019-04-12 12:56:10", money: 0.56, islucky: false },
	// 	{ username: "大明哥", face: "/static/faces/02.jpg", time: "2019-04-12 12:56:15", money: 0.96, islucky: false },
	// 	{ username: "小姐姐", face: "/static/faces/01.jpg", time: "2019-04-12 12:56:17", money: 1.02, islucky: false },
	// 	{ username: "大哥哥", face: "/static/faces/07.jpg", time: "2019-04-12 12:56:19", money: 0.05, islucky: false },
	// 	{ username: "抢红包", face: "/static/faces/08.jpg", time: "2019-04-12 12:56:22", money: 0.78, islucky: false }
	// ])
	
	const myMoney = ref(0)

	const userStore = useUserStore();
	const props = defineProps(['rid']);
	let redEnvelope = reactive({
		blessing: '恭喜发财',
		amount: '',
		received: '',
		total: '',
		number: 1,
		user: {
			nickname: '',
			avatar: ''
		},
		token: {
			name: '',
			icon: ''
		},
		details: []
	})

	const getData = () => {
		uni.$u.http.get('/chat/chatRedEnvelope/' + props.rid).then(res => {
			console.log(res)
			for (let key in res) {
				redEnvelope[key] = res[key]
			}
			// redEnvelope = res;
			
			for (let item of redEnvelope.details) {
				if (item.user_id == userStore.user.id)
				{
					myMoney.value = item.amount;
					break;
				}
			}
		})
	}

	getData()


	//动画效果
	const radius = ref('100% 100% 0 0')

	const onPageScroll = (e) => {
		//e.scrollTop;
		if (e.scrollTop > 100) { return; }
		let radiusTmp = 100 - e.scrollTop;
		radius.value = radiusTmp + '% ' + radiusTmp + '% 0 0';
	}
</script>

<style lang="less" scoped>
	view {
		display: flex;
		flex-wrap: wrap;
	}

	.top {
		width: 100%;
		background-color: #cf3c35;
		flex-wrap: wrap;

		.blessing,
		.money {
			width: 100%;
			color: #f8d757;
			padding: 20upx 0;
			justify-content: center;
			font-size: 34upx;
		}

		.money {
			font-size: 100upx;
		}

		.face {
			background-color: #fff;
			justify-content: center;
			width: 100%;
			height: 130upx;
			margin-top: 65upx;
			border-radius: 100% 100% 0 0;
			transition: border-radius .15s;

			image {
				width: 130upx;
				height: 130upx;
				border-radius: 100%;
				margin-top: -65upx;
			}
		}

		.username {
			width: 100%;
			justify-content: center;
			background-color: #fff;
			margin-top: -50upx;
			font-size: 38upx;
		}
	}

	.info {
		margin-top: 30upx;
		width: 96%;
		height: 50upx;
		padding-left: 4%;
		font-size: 28upx;
		color: #999;
		border-bottom: solid 1upx #dfdfdf;
	}

	.list {
		width: 100%;

		.row {
			width: 92%;
			padding: 0 4%;
			height: 120upx;
			border-bottom: solid 1upx #dfdfdf;
			justify-content: flex-start;
			flex-wrap: nowrap;

			.left {
				flex-shrink: 0;
				width: 100upx;
				height: 120upx;
				justify-content: flex-start;
				align-items: center;

				image {
					width: 80upx;
					height: 80upx;
					border-radius: 100%;
				}
			}

			.right {
				width: 100%;
				height: 150upx;

				.r1 {
					width: 100%;
					height: 75upx;
					justify-content: space-between;
					align-items: center;
					font-size: 34upx;
				}

				.r2 {
					width: 100%;
					height: 75upx;
					justify-content: space-between;
					font-size: 26upx;

					.time {
						color: #8F8F94;
					}

					.lucky {
						padding: 3upx 8upx;
						border-radius: 5upx;
						background-color: #F8D757;
						align-items: center;
						height: 30upx;
						font-size: 24upx;
						color: #CF3C35;
					}
				}
			}
		}
	}
</style>