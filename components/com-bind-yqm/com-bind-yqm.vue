<template>
	<view>
		<u-popup :show="userStore.user.pid == 0" @close="close" @open="open" mode="center" round="20"
			overlayOpacity="0.3" bgColor="transparent">
			<view class="content">
				<view class="content_title">绑定关系</view>
				<view class="content_input_box">
					<input class="content_input" type="text" v-model="yqm" placeholder="请输入邀请人的邀请码">
				</view>
				<view class="content_input_label">
					<text @click="yqm = defaultYqm">绑定到系统账户</text>
				</view>
				<view class="options">
					<view class="options_btn options_cancel" @click="cancel">取消</view>
					<view class="options_btn options_confirm" @click="confirm">确认</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		useUserStore
	} from '@/stores/modules/user';
	import tools from '@/utils/tools';
	import project from '@/utils/project';
	const userStore = useUserStore();


	const yqm = ref('');
	const defaultYqm = ref('');
	uni.$u.http.get('/setting/defaultYqm').then(data => {
		defaultYqm.value = data
	})

	const open = () => {
		// console.log('open');

	}
	const close = () => {
		console.log('close')
	}

	const confirm = () => {
		if (yqm.value == '') {
			tools.toast('请填写邀请码或绑定到系统账户');
			return;
		}
		uni.$u.http.post('/user/bind', {
			yqm: yqm.value
		}).then(res => {
			project.getUser();
			tools.toast('成功绑定')
		})
	}
	
	const cancel = () => {
		tools.navigateBack()
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 656rpx;
		height: 390rpx;
		background: #FFFFFF;
		border-radius: 10rpx;

		margin-bottom: 200px;
		position: relative;

		&_title {
			font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 36rpx;
			color: #000000;

			text-align: center;
			padding-top: 28rpx;
		}

		&_input {
			padding-left: 23rpx;
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 30rpx;
			color: #000000;
			opacity: 0.4;

			&_box {
				margin: 0 auto;
				margin-top: 27rpx;

				width: 576rpx;
				height: 90rpx;

				background: #FFFFFF;
				border-radius: 10rpx;
				border: 2rpx solid #EEEEEE;

				display: flex;
				align-items: center;
			}

			&_label {
				text-align: right;

				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 24rpx;
				color: #7F17FE;

				padding-right: 50rpx;
				padding-top: 18rpx;
				

			}
		}

		.options {
			border-top: 2rpx solid #EEEEEE;
			height: 90rpx;
			width: 656rpx;
			position: absolute;
			bottom: 0;

			display: flex;


			&_btn {

				height: 90rpx;
				flex: 1;

				font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 30rpx;

				display: flex;
				justify-content: center;
				align-items: center;
			}

			&_cancel {
				border-left: 1rpx solid #EEEEEE;

				color: #999;
			}

			&_confirm {
				border-right: 1rpx solid #EEEEEE;
				color: #7F17FE;

			}
		}
	}
</style>