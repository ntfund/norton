<template>
	<uni-nav-bar :fixed="true" :border="false" left-icon="left" @clickLeft="clickLeft" backgroundColor="#F8F8F8"
		:statusBar="true" title="选择联系人">
		<template #right>
			<view>
				<u-button type="primary" :disabled="loading" color="#00aa00" text="完成" size="small"
					@click="rightClick"></u-button>
			</view>
		</template>
	</uni-nav-bar>
	<u-index-list :indexList="indexList">
		<template :key="index" v-for="(item, index) in dataList">
			<!-- #ifdef APP-NVUE -->
			<u-index-anchor :text="index"></u-index-anchor>
			<!-- #endif -->
			<u-checkbox-group placement="column" v-model="item.checkList" @change="checkboxChange">
				<u-index-item v-if="item.data && item.data.length > 0">
					<!-- #ifndef APP-NVUE -->
					<u-index-anchor :text="index"></u-index-anchor>
					<!-- #endif -->

					<view class="list" v-for="(item1, index1) in item.data" :key="index + '_' + item1.id">
						<view class="list__item">
							<label class="radio">
								<u-checkbox v-model="item1.checked" :checked="item1.checked" :name="item1.id"
									shape="circle" label="" size="24"></u-checkbox>
								<view class="flex items-center" @click="rowClick(item, item1.id)">
									<image class="list__item__avatar" :src="item1.avatar"></image>
									<text class="list__item__user-name">{{item1.name}}</text>
								</view>
							</label>
						</view>
						<u-line></u-line>
					</view>
				</u-index-item>
			</u-checkbox-group>
		</template>
		<view slot="footer" class="u-safe-area-inset--bottom">
			<text class="list__footer">共{{friendCount}}位好友</text>
		</view>
	</u-index-list>
</template>

<script setup lang="ts">
	import { computed, ref, nextTick, toRaw } from "vue";
	import tools from "@/utils/tools";
	import { getFriendList } from "../../../config/api";

	// const disabled = computed(() => {
	// 	return name.value == userStore.user.nickname;
	// })
	const props = defineProps(['id'])

	const dataList = ref([]);
	const friendCount = ref(0)

	let urls = [
		'/static/faces/01.jpg',
		'/static/faces/02.jpg',
		'/static/faces/03.jpg',
		'/static/faces/04.jpg',
		'/static/faces/05.jpg',
		'/static/faces/06.jpg',
		'/static/faces/07.jpg',
		'/static/faces/08.jpg',
		'/static/faces/09.jpg',
		'/static/faces/10.jpg'
	]
	let names : string[] = ["勇往无敌", "疯狂的迪飙", "磊爱可", "梦幻梦幻梦", "枫中飘瓢", "飞翔天使",
		"曾经第一", "追风幻影族长", "麦小姐", "胡格罗雅", "Red磊磊", "乐乐立立", "青龙爆风", "跑跑卡叮车", "山里狼", "supersonic超"
	];
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
	const indexList = ["↑", "☆", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",
		"S", "T", "U", "V", "W", "X", "Y", "Z", "#"];
	// const indexList = getIndexList()

	let add = () => {
		return indexList.map(item => {
			const arr = []
			for (let i = 0; i < 3; i++) {
				arr.push({
					name: names[uni.$u.random(0, names.length - 1)],
					url: urls[uni.$u.random(0, urls.length - 1)],
					checked: false,
					index: 0
				})
			}
			return arr
		})
	}
	const itemArr = ref(add())


	const checkboxChange = (e, value) => {
		console.log('checkboxChange', e, value)
	}

	const clickLeft = () : void => {
		console.log("click left")
		tools.navigateBack()
	}

	const loading = ref(false);
	const rightClick = async () => {
		// await nextTick();
		console.log("rightClick", "update name")
		let ids = [];
		for (let key in dataList.value) {
			let item = dataList.value[key]
			for (let id of item.checkList) {
				ids.push(id);
			}
			// for (let item1 of item.data) {
			// 	if (item1.checked) {
			// 		ids.push(item1.id);
			// 	}
			// }
		}


		ids.sort((a, b) => { return a - b });


		console.log(ids);

		loading.value = true;
		uni.$u.http.post('/chat/group/invite', { ids, id: props.id }).then(data => {
			uni.showToast({
				title: '已发送邀请'
			})
			loading.value = false;
			tools.navigateBack();
		}).catch(err=> loading.value = false)

	}

	const rowClick = async (item, id) => {
		console.log('rowClick', item)
		// await nextTick();
		// item.checked = !item.checked;

		const index = item.checkList.indexOf(id);
		if (index > -1) {
			item.checkList.splice(index, 1); // 第二个参数为删除的次数，设置只删除一次
		} else {
			item.checkList.push(id)
		}

		// await nextTick();
	}



	getFriendList().then(data => {
		console.log('gerFriendList', data.list);

		dataList.value = data.list;
		friendCount.value = data.count;
	})
</script>

<style lang="less">
	.list {
		.list__item {
			display: flex;
			flex-direction: row;
			align-items: center;

			.radio {
				display: flex;
				flex-direction: row;
				align-items: center
			}
		}

		&__item {
			@include flex;
			padding: 6px 12px;
			align-items: center;

			&__avatar {
				height: 35px;
				width: 35px;
				border-radius: 3px;
			}

			&__user-name {
				font-size: 16px;
				margin-left: 10px;
				color: #000;
			}
		}

		&__footer {
			color: #ccc;
			font-size: 14px;
			text-align: center;
			margin: 15px 0;
		}
	}
</style>