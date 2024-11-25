<template>
	<view class="form-code flex justify-between items-center" style="">
		<input type="number" class="form-code_input"  @input="input" cursor-spacing="20" placeholder="请填写验证码">
		<view class="flex form-code_right">
			<view class="form-code_right_txt" v-if="bcanSendYzm" @click="sendYzm">获取验证码</view>
			<view class="flex items-center" v-else>
				<u-count-down ref="countDown" :time="60 * 1000" format="ss" @finish="finish"></u-count-down>
				<view class="ml-1">s</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	const bcanSendYzm = ref(true);
	const props = defineProps(['code', 'mobile', 'type'])
	const emit = defineEmits(['update:code']);

	const input = (e) => {
		emit('update:code', e.detail.value);
	}

	//发送验证码
	const sendYzm = () => {
		if (props.mobile == '') {
			return uni.$u.toast('请输入手机号码');
		}
		if (!uni.$u.test.mobile(props.mobile)) {
			return uni.$u.toast('手机号码格式不正确');
		}
		uni.$u.http.put('/smsCode', { mobile: props.mobile, type: props.type ? props.type : 0 }).then(res => {
			bcanSendYzm.value = false;
			uni.$u.toast('验证码已发送')
		})
	}

	const countDown = ref(null)
	const finish = () => {
		bcanSendYzm.value = true;
		countDown.value.reset();
	}
</script>

<style lang="less" scoped>
	.form-code {
		
		&_input {
			padding-left: 32rpx;
			
			width: 450rpx;
			height: 96rpx;
			background: #FFFFFF;
			border-radius: 8rpx;
			border: 2rpx solid #EEEEEE;
			
			display: flex;
			align-items: center;
			justify-content: center;
			
			
			flex: 1;
			
		}
		
		&_right {
			width: 220rpx;
			height: 96rpx;
			background: #FFFFFF;
			border-radius: 8rpx;
			border: 2rpx solid #EEEEEE;
			
			display: flex;
			align-items: center;
			justify-content: center;
			
			margin-left: 24rpx;
			
			&_txt {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 30rpx;
				color: #7F17FE;
			}
		}
	}
</style>