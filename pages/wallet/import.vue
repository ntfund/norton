<template>
	<view>
		<!-- <uni-nav-bar :fixed="true" :border="false" left-icon="left" right-icon="scan" @clickLeft="clickLeft"
			backgroundColor="#F8F8F8" status-bar :title="title" @clickRight="rightClick">
		</uni-nav-bar> -->
		<com-nav-bar title="导入钱包" :border="true" @clickRight="rightClick">
			<template #right>
				<view>
					<image src="@/static/images/wallet/import_scan@2x.png" mode="aspectFit"
						style="width: 34rpx; height: 34rpx;"></image>
				</view>
			</template>
		</com-nav-bar>
		<com-wallet-tab v-model:current="current" :list="list" style="margin: 0 28rpx;"
			@change="swtichSwiper"></com-wallet-tab>
		<view class="">
			<!-- <com-tab ref="tab" :current="current" @change="swtichSwiper"></com-tab> -->
			<swiper class="scroll-view-height" @change="swipeIndex" :acceleration="true" :current="current"
				:circular="false" :duration="300" :skip-hidden-item-layout="true">
				<swiper-item key="0" id="index0" class="swiper-item">
					<Mnemonic ref="import1" :chain_id="props.chain_id"></Mnemonic>
				</swiper-item>
				<swiper-item key="1" id="index1" class="swiper-item">
					<privateKey ref="import2" :chain_id="props.chain_id"></privateKey>
				</swiper-item>
				<swiper-item key="2" id="index2" class="swiper-item" v-if="props.chain_id != 6">
					<keystore ref="import3" :chain_id="props.chain_id"></keystore>
				</swiper-item>
			</swiper>
		</view>

		<!-- <view v-if="binit" :mnemonic="mnemonic" :change:mnemonic="ethers.receiveMnemonicWallet"></view> -->
		<!-- <view v-if="binit" :privateKey="privateKey" :change:privateKey="ethers.receivePrivateKeyWallet"></view> -->
		<!-- <view :chain="chain" :change:chain="ethers.receiveChain"></view> -->
	</view>
</template>

<script setup>
	import Mnemonic from "./import/mnemonic.vue";
	import privateKey from "./import/private.vue";
	import keystore from "./import/keystore.vue";
	import {
		nextTick,
		onMounted,
		ref
	} from "vue";
	import {onShow, onLoad} from '@dcloudio/uni-app'

	const props = defineProps(['data', 'current', 'chain_id'])
	const current = ref(props.current ? props.current : 0)
	console.log('current', props.current)
	
	const list = ref(props.chain_id == 6 ? ['助记词', '私钥'] : ['助记词', '私钥', 'Keystore']);
	
	const import1 = ref(null);
	const import2 = ref(null);
	const import3 = ref(null);
	// console.log(current)

	// onMounted(async () => {
		// await nextTick();
		// current.value = 0;
		// await nextTick();
	// })
	
	onLoad(async options => {
		console.log('onLoad', options)
		
		current.value = options.current ? props.current : 0;
	})

	const swipeIndex = (index) => {
		// 获得swiper切换后的current索引				
		// this.$refs.tab.switchTab(index.detail.current)
		// this.$nextTick()

		console.log(index)

		current.value = index.detail.current;
	}

	const swtichSwiper = (index) => {
		// 通过tab组件回调点击切换的index同步swiper的current索引
		// current.value = index
	}

	const rightClick = () => {
		console.log("right left")
		uni.scanCode({
			success: (res) => {
				console.log('条码类型：' + res.scanType);
				console.log('条码内容：' + res.result);

				if (current.value == 0) {
					import1.value.formData.mnemonic = res.result;
				} else
				if (current.value == 1) {
					import2.value.formData.privateKey = res.result;
				} else
				if (current.value == 2) {
					import3.value.formData.keystore = res.result;
				}
			}
		})
	}
</script>



<style lang="scss">
	page {
		background-color: #F8F8F8;
	}

	.scroll-view-height {
		/* 页面高度减去包含状态栏、标题、tab组件的高度 */
		height: calc(100vh - var(--status-bar-height) - 220rpx);



		// width: 750rpx;

		// display: flex;
		// flex-direction: row;
		// align-items: center;
		// justify-content: center;
	}

	.swiper-item {
		width: 750rpx;
		height: 750rpx;

		// background: green;

		// display: flex;
		// align-items: center;
		// justify-content: center;
		// margin: 0 auto;
	}

	// swiper {
	// 	width: calc(100vw - 1rem);
	// }
</style>