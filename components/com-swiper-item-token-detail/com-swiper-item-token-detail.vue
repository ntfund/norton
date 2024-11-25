<template>
	<swiper-item>

		<scroll-view scroll-y="true" class="scroll-view-height list-content">
			<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption" :down="upOption">
				<!-- <mescroll-empty v-if="dataList.length==0"></mescroll-empty> -->
				<com-token-detail-item v-for="(item, index) in dataList" :data="item" :account="wallet.address"
					@click="goDeital(item)"></com-token-detail-item>
			</mescroll-body>
		</scroll-view>

	</swiper-item>
</template>

<script setup>
	import {
		onPageScroll,
		onReachBottom
	} from '@dcloudio/uni-app';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {
		onMounted,
		reactive,
		ref,
		toRaw,
		watch
	} from 'vue';
	import tronHelper from '@/utils/tronHelper';
	import uniHelper from '@/utils/uniHelper';
	import tools from '@/utils/tools';
	import bscLogic from '@/utils/scan/bscLogic.js';
	import {
		ChainType
	} from '@/enums/ChainType';
	import okxLogic from '@/utils/okxLogic';
	import polygonLogic from '@/utils/okxLogic';
	import ethLogic from '@/utils/ethLogic';
	import {
		useWalletStore
	} from '@/stores/modules/wallet';

	// 调用mescroll的hook (注: mescroll-uni不用传onPageScroll,onReachBottom, 而mescroll-body必传)
	const upOption = reactive({
		auto: false,
		empty: {
			use: true,
			icon: null,
			tip: "暂无相关数据",
			btnText: "",
			fixed: false,
			top: "100rpx",
			zIndex: 99
		}
	})
	const downOption = reactive({
		use: false,
		auto: false,
		empty: {
			use: true,
			icon: null,
			tip: "暂无相关数据",
			btnText: "",
			fixed: false,
			top: "100rpx",
			zIndex: 99
		}
	})
	const {
		mescrollInit,
		downCallback,
		getMescroll
	} = useMescroll(onPageScroll, onReachBottom)


	const props = defineProps(['wallet', 'token', 'current', 'index'])
	// const walletStore = useWalletStore();
	// console.log("props.wallet", props.wallet)
	const wallet = props.wallet
	// console.log(wallet)
	
	const token = toRaw(props.token)
	const dataList = ref([])

	// 上拉加载的回调: 其中num:当前页 从1开始, size:每页数据条数,默认10
	const upCallback = async (mescroll) => {
		console.log('upCallback', mescroll)
		// apiGoods(mescroll.num, mescroll.size).then(res => {
		// 	const curPageData = res.list || [] // 当前页数据
		// 	if (mescroll.num == 1) goods.value = []; // 第一页需手动制空列表
		// 	goods.value = goods.value.concat(curPageData); //追加新数据
		// 	//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
		// 	//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;

		// 	//方法一(推荐): 后台接口有返回列表的总页数 totalPage
		// 	//mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

		// 	//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
		// 	//mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

		// 	//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
		// 	//mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)

		// 	//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据.
		// 	mescroll.endSuccess(curPageData.length); // 请求成功, 结束加载
		// }).catch(() => {
		// 	mescroll.endErr(); // 请求失败, 结束加载
		// })
		dataList.value = []
		await handRequest();
		mescroll.endSuccess(dataList.value.length, false)
		if (dataList.value.length == 0) {
			mescroll.showEmpty()
			mescroll.endUpScroll(false)
		} else {
			mescroll.removeEmpty()
			mescroll.endUpScroll(true)
		}
	}


	const handRequestTronContract = async () => {
		let url
		if (props.index == 0) {
			url =
				'https://apilist.tronscanapi.com/api/new/token_trc20/transfers?limit=10&start=0&contract_address=' +
				token.address +
				'&start_timestamp=&end_timestamp=&confirm=&filterTokenValue=1&relatedAddress=' +
				wallet.address;
		} else if (props.index == 1) {
			url =
				'https://apilist.tronscanapi.com/api/new/token_trc20/transfers?limit=10&start=0&contract_address=' +
				token.address + '&start_timestamp=&end_timestamp=&confirm=&filterTokenValue=1&toAddress=' +
				wallet.address;
		} else if (props.index == 2) {
			url =
				'https://apilist.tronscanapi.com/api/new/token_trc20/transfers?limit=10&start=0&contract_address=' +
				token.address +
				'&start_timestamp=&end_timestamp=&confirm=&filterTokenValue=1&fromAddress=' + wallet.address;
		}

		// uni.request({
		// 	url: url,
		// 	success: (res) => {
		// 		console.log(res.data);


		// 		dataList.value = tronHelper.handTronContractData(res.data);
		// 		currentMescroll.value.endSuccess(res.data.length, false);
		// 		// getMescroll().resetUpScroll();
		// 	}
		// })
		console.log('url', url)
		let result = await uniHelper.uniRquestAsync(url);
		console.log(result);
		dataList.value = tronHelper.handTronContractData(result)

	}
	const handRequestTronTrx = async () => {
		let url
		if (props.index == 0) {
			url =
				'https://apilist.tronscanapi.com/api/new/transfer?sort=-timestamp&count=true&limit=20&start=0&filterTokenValue=1&address=' +
				wallet.address
		} else if (props.index == 1) {
			url =
				'https://apilist.tronscanapi.com/api/new/transfer?sort=-timestamp&count=true&limit=20&start=0&filterTokenValue=1&address=' +
				wallet.address +
				'&toAddress' + wallet.address
		} else if (props.index == 2) {
			url =
				'https://apilist.tronscanapi.com/api/new/transfer?sort=-timestamp&count=true&limit=20&start=0&filterTokenValue=1&address=' +
				wallet.address +
				'&fromAddress' + wallet.address
		}

		// uni.request({
		// 	url: url,
		// 	success: (res) => {
		// 		console.log(res.data);
		// 		dataList.value = tronHelper.handTronTrxData(res.data, false);

		// 		// getMescroll().resetUpScroll();
		// 	}
		// })

		let result = await uniHelper.uniRquestAsync(url);
		console.log(result);
		dataList.value = tronHelper.handTronTrxData(result)
	}

	const handRequest = async () => {
		// console.log('handRequest wallet', wallet)
		if (wallet.chain_id == ChainType.TRON) {
			//波场
			if (token.address) {
				await handRequestTronContract()
			} else {
				await handRequestTronTrx();
			}
		} else if (wallet.chain_id == ChainType.BNB) {
			//币安
			if (token.address) {
				dataList.value = await bscLogic.handRequestContract(props.index, token.address, wallet.address)
			} else {
				dataList.value = await bscLogic.handRequestEth(props.index, wallet.address)
			}
		} else if (wallet.chain_id == ChainType.Okxchain) {
			//okx
			if (token.address) {
				dataList.value = await okxLogic.handRequestContract(props.index, token.address, wallet.address)
			} else {
				dataList.value = await okxLogic.handRequestEth(props.index, wallet.address)
			}
		} else if (wallet.chain_id == ChainType.Polygon) {
			//matic
			if (token.address) {
				dataList.value = await polygonLogic.handRequestContract(props.index, token.address, wallet.address)
			} else {
				dataList.value = await polygonLogic.handRequestEth(props.index, wallet.address)
			}
		} else if (wallet.chain_id == ChainType.ETH) {
			//eth
			if (token.address) {
				dataList.value = await ethLogic.handRequestContract(props.index, token.address, wallet.address)
			} else {
				dataList.value = await ethLogic.handRequestEth(props.index, wallet.address)
			}
		}
	}


	const goDeital = item => {
		uni.navigateTo({
			url: '/pages/wallet/txDetail?tx=' + encodeURIComponent(JSON.stringify(item)) + '&account=' + wallet.address
		})
	}

	onMounted(async () => {
		if (props.index === 0) {
			getMescroll().triggerUpScroll()
		}
	})

	watch(() => props.current, async (newVal, oldVal) => {
		console.log('watch props.current', newVal, oldVal)
		if (newVal == props.index) {
			getMescroll().triggerUpScroll()
		}
		// await handRequest();
	})	
</script>



<style lang="scss">
	.scroll-view-height {
		/* 页面高度减去包含状态栏、标题、tab组件的高度 */
		height: calc(100vh - 240px);
	}
</style>