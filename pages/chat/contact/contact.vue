<template>
	<view>
		<view class="row-top-list">
			<view class="row-top-list-container">
				<view class="space"></view>
				<com-row-item left="新的朋友" border="true" :len="appStore.newFriendRecords"
					@click="tools.navigateTo('/pages/chat/contact/new')"></com-row-item>
				<com-row-item left="群聊列表" @click="tools.navigateTo('/pages/chat/group/index')"></com-row-item>
				<view class="space"></view>
			</view>
		</view>
		<com-chat-contact></com-chat-contact>
	</view>
</template>

<script setup>
	import {
		computed,
		ref
	} from "vue";
	import {
		onShow
	} from '@dcloudio/uni-app'
	import tools from '@/utils/tools'
	import {
		getNewFriendList
	} from "@/config/api";
	import {
		useAppStore
	} from "@/stores/modules/app";
	const appStore = useAppStore()


	// let urls = [
	// 	'/static/faces/01.jpg',
	// 	'/static/faces/02.jpg',
	// 	'/static/faces/03.jpg',
	// 	'/static/faces/04.jpg',
	// 	'/static/faces/05.jpg',
	// 	'/static/faces/06.jpg',
	// 	'/static/faces/07.jpg',
	// 	'/static/faces/08.jpg',
	// 	'/static/faces/09.jpg',
	// 	'/static/faces/10.jpg',
	// ]
	// let names : string[] = ["勇往无敌", "疯狂的迪飙", "磊爱可", "梦幻梦幻梦", "枫中飘瓢", "飞翔天使",
	// 	"曾经第一", "追风幻影族长", "麦小姐", "胡格罗雅", "Red磊磊", "乐乐立立", "青龙爆风", "跑跑卡叮车", "山里狼", "supersonic超"
	// ]
	const getIndexList = () => {
		const indexList = []
		const charCodeOfA = 'A'.charCodeAt(0)
		indexList.push("↑")
		indexList.push("☆")
		for (let i = 0; i < 26; i++) {
			indexList.push(String.fromCharCode(charCodeOfA + i))
		}
		indexList.push('#')
		return indexList
	}
	// const indexList = ["↑", "☆", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",
	// 	"S", "T", "U", "V", "W", "X", "Y", "Z", "#"];

	// const indexList = getIndexList()

	// let add = () => {
	// 	return indexList.map(item => {
	// 		const arr = []
	// 		for (let i = 0; i < 10; i++) {
	// 			arr.push({
	// 				name: names[uni.$u.random(0, names.length - 1)],
	// 				url: urls[uni.$u.random(0, urls.length - 1)]
	// 			})
	// 		}
	// 		return arr
	// 	})
	// }
	// const itemArr = add()

	const dataList = ref([]);
	const friendCount = ref(0)
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}

	.row-top-list {
		height: 241rpx;

		.row-top-list-container {
			.space {
				width: 100%;
				height: 20rpx;
				background-color: $uni-bg-color-grey;
			}

			position: fixed;
			top: calc(var(--status-bar-height + 100rpx + 44px));
			left: 0;
			right: 0;
			width: 750rpx;

			background-color: #fff;

			z-index: 999;
		}
	}
</style>