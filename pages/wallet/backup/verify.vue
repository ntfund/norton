<template>
	<view>
		<com-nav-bar title="验证助记词" :border="true"></com-nav-bar>
		<view class="content">
			<view class="text-1">请根据您备份的助记词，按顺序选择填充</view>
			<view class="content_words">
				<view class="content_words_item" :class="'content_words_item' + (index + 1)"
					v-for="(item, index) in inputWords">
					<view class="index" v-if="item">{{index + 1}}</view>
					<view class="word">{{item}}</view>
					<view class="content_words_item_error" v-if="isError(index, item)" @click="unSelect(index)"></view>
				</view>
				<view class="content_words_tip">
					<view v-if="isAnyError()">助记词顺序错误，请检查您备份的助记词是否正确</view>
				</view>
			</view>
			<view class="content_words content_words2">
				<view class="content_words_item " :class="{'content_words_item_disabled': isSelected(item)}"
					@click="selectWord(index, item)" v-for="(item, index) in randomWords">
					<view class="word">{{item}}</view>
				</view>
			</view>
		</view>

		<view class="n-bottom-white">
			<button type="button" class="n-btn " :class="{'disabled': inputWords[11] == '' || isAnyError() || loading}"
				:disabled="inputWords[11] == '' || isAnyError() || loading" @click="ok">确认</button>
		</view>
		<com-watch-user-login v-if="isFirst" ref="loginRef"></com-watch-user-login>
	</view>
</template>

<script setup>
	import {
		onMounted,
		reactive,
		ref,
		toRaw
	} from 'vue';
	import arrayTools from '@/utils/arrayTools';
	import dbSetting from '@/utils/dbSetting';
	import {
		MD5
	} from 'crypto-js';
	import dbWallet from '@/utils/dbWallet';

	const props = defineProps(['params']);
	const loginRef = ref(null)
	const loading = ref(false);
	const isFirst = ref(false);
	const walletCreateData = uni.getStorageSync('newWallet');
	const walletNew = reactive(JSON.parse(decodeURIComponent(props.params)))
	// console.log('walletCreateData', walletCreateData, walletNew)

	// const mnemonics = ['divide', 'evolve', 'feel', 'into', 'say', 'hi', 'fuck', 'made', 'cao', 'go', 'fell', 'youck'];
	const mnemonics = walletNew.mnemonic.split(' ');

	const current = ref(0)
	const inputWords = reactive(['', '', '', '', '', '', '', '', '', '', '', ''])
	const randomWords = reactive(arrayTools.shuffle(mnemonics))

	//选中助记词
	const selectWord = (index, word) => {
		if (isSelected(word)) {
			return;
		}
		for (var i = 0; i < inputWords.length; i++) {
			if (inputWords[i] === '') {
				inputWords[i] = word;
				break;
			}
		}
	}

	//取消选中
	const unSelect = (index) => {
		for (var i = index; i < inputWords.length; i++) {
			if (i == inputWords.length - 1) {
				inputWords[i] = '';
			} else {
				inputWords[i] = inputWords[i + 1];
			}
		}
	}


	//查看是否被选中了
	const isSelected = (word) => {
		return inputWords.findIndex(x => x == word) > -1;
	}

	const isError = (index, word) => {
		return word != '' && mnemonics[index] != word;
	}

	const isAnyError = () => {
		let erros = false;
		for (var i = 0; i < inputWords.length; i++) {
			if (inputWords[i] == '') {
				break;
			}
			if (inputWords[i] != mnemonics[i]) {
				erros = true;
				break;
			}
		}
		return erros;
	}


	onMounted(async () => {
		const wallets = await dbWallet.getWallets(walletCreateData.chain_id);
		if (wallets.length == 0) {
			isFirst.value = true;
		}
	})

	const ok = async () => {
		loading.value = true;
		//设置密码
		if (walletCreateData.password) {
			await dbSetting.updateValue('password', MD5(walletCreateData.password).toString())
		}
		//设置密码提示
		if (walletCreateData.tip) {
			await dbSetting.updateValue('password_tip', walletCreateData.tip)
		}

		//添加钱包到数据库
		await dbWallet.createWallet({
			...walletNew,
			name: walletCreateData.name
		}, walletCreateData.chain_id);

		loading.value = false;

		//返回
		const wallets = await dbWallet.getWallets(walletCreateData.chain_id);
		if (wallets.length == 1) {
			
			if (isFirst.value) {
				await loginRef.value.login(walletNew.address, walletNew.privateKey);
			}
			
			//初次创建。
			uni.switchTab({
				url: '/pages/wallet/index'
			})

		} else {
			//返回
			uni.navigateBack({
				delta: 4
			});
		}

	}
</script>

<style lang="scss">
	page {
		background: #F8F8F8;
		
		padding-bottom: 300rpx;
	}

	.content {
		.text-1 {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 28rpx;
			color: #000000;
			opacity: 0.8;

			margin: 43rpx 28rpx 0 29rpx;
		}

		&_words {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: repeat(4, 90rpx);
			grid-row-gap: 20rpx;
			grid-column-gap: 15rpx;

			margin: 33rpx 28rpx 42rpx 28rpx;
			border-radius: 16rpx;

			padding: 30rpx 32rpx 30rpx 32rpx;
			background: #EEEEEE;

			border: 1rpx solid #EEEEEE;

			// justify-items: stretch;
			// align-items: stretch;
			// place-content: stretch;

			&_item {
				background: white;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;

				// border: 1rpx solid #EEEEEE;
				border-radius: 16rpx;


				.index {
					font-family: Gilroy-Medium;
					font-weight: 500;
					font-size: 32rpx;
					color: #666666;
				}

				.word {
					font-family: Gilroy-Bold;
					font-weight: 500;
					font-size: 32rpx;
					color: #000000;
					margin-left: 10rpx;
				}

				&_error {
					content: '';
					width: 42rpx;
					height: 42rpx;
					// background: red;
					background: url('/static/images/wallet/error@2x.png') no-repeat;
					background-size: 100% 100%;
					position: absolute;
					right: -20rpx;
					top: -20rpx;
					z-index: 2;
				}
			}



			&_item_disabled {
				background: #EEEEEE;

				.word {
					color: #999999;
				}
			}

			&_item1 {
				border-top-left-radius: 16rpx;
			}

			&_item3 {
				border-top-right-radius: 16rpx;
			}

			&_item10 {
				border-bottom-left-radius: 16rpx;
			}

			&_item12 {
				border-bottom-right-radius: 16rpx;
			}

			&_tip {
				grid-column: 1/4;
				height: 24rpx;

				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 24rpx;
				color: #FC465C;

				text-align: center;
			}
		}

		&_words2 {
			background: #F8F8F8;
			border: none;
		}

		.copy-btn {
			display: flex;
			justify-content: center;
			align-items: center;

			padding: 14rpx 26rpx;
			font-family: SourceHanSansCN-Medium;
			font-weight: 600;
			font-size: 26rpx;
			color: #7F17FE;

			border-radius: 8rpx;
			border: 2rpx solid #7F17FE;
			width: 180rpx;
		}

		.copy-btn:active {
			background: #cdcdcd;
		}

		.row-item {
			padding: 0 28rpx;
			margin-bottom: 49rpx;

			&_title {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 30rpx;
				color: #1D2637;
			}

			&_info {
				margin-top: 10rpx;

				font-family: Source Han Sans CN;
				font-weight: 400;
				font-size: 26rpx;
				color: #999999;
			}
		}
	}
</style>