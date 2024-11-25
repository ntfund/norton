<template>
	<view>
		<com-nav-bar title="实名认证" :border="true" backgroundColor="#fff"></com-nav-bar>

		<view class="form-list" v-if="!isVerify">
			<view class="form-item">
				<view class="form-item_label">姓名</view>
				<input class="form-item_input" type="text" v-model="formData.nickname" placeholder="请输入姓名">
			</view>
			<view class="form-item">
				<view class="form-item_label">身份证号</view>
				<input class="form-item_input" type="text" v-model="formData.id_number" placeholder="请输入身份证号">
			</view>

			<view class="form-item">
				<view class="form-item_label">手机号</view>
				<input class="form-item_input" type="text" v-model="formData.mobile" placeholder="请输入手机号">
			</view>

			<view class="form-item">
				<view class="form-item_label">验证码</view>
				<com-input-code :mobile="formData.mobile" v-model:code="formData.sms_code" :type="1"></com-input-code>
			</view>

			<view class="btn-bottom">
				<button type="button" class="n-btn" @click="submit">确认提交</button>
			</view>
		</view>

		<view v-else>
			<view class="flex justify-center mt-10">
				<u-icon name="checkbox-mark" color="#00d868" size="48"></u-icon>
			</view>
			<view class="flex justify-center mt-4 text-[#00d868]">
				实名认证提交成功
			</view>
		</view>

	</view>

</template>

<script setup lang="ts">
	import { reactive, ref, toRaw } from "vue";
	import { useUserStore } from "@/stores/modules/user";

	const props = defineProps(["identity"])
	let imgs = JSON.parse(decodeURIComponent(props.identity))
	console.log('imgs', imgs)
	
	let userStore = useUserStore()

	const isVerify = ref(false)

	const formData = reactive({
		nickname: '',
		id_number: '',
		card_img_front: imgs.card_img_front,
		card_img_back: imgs.card_img_back,
		mobile: '',
		sms_code: ''
	})

	const submit = () : any => {
		// console.log(toRaw(formData))
		if (!formData.nickname) {
			return uni.$u.toast('请填写姓名');
		}
		if (!formData.id_number) {
			return uni.$u.toast('请填写身份证号码');
		}
		if (!uni.$u.test.idCard(formData.id_number)) {
			return uni.$u.toast('身份证号码格式不正确');
		}
		if (!formData.card_img_front) {
			return uni.$u.toast('请上传身份证人头像');
		}
		if (!formData.card_img_back) {
			return uni.$u.toast('请上传身份证国徽像');
		}
		if (!formData.mobile) {
			return uni.$u.toast('请填写手机号');
		}
		if (!uni.$u.test.mobile(formData.mobile)) {
			return uni.$u.toast('手机号码格式不正确');
		}
		if (!formData.sms_code) {
			return uni.$u.toast('请填写验证码');
		}
		if (!uni.$u.test.code(formData.sms_code, 6)) {
			return uni.$u.toast('验证码格式不正确');
		}
		// isVerify.value = true;
		uni.$u.http.post('/userIdentity', formData).then(user => {
			isVerify.value = true;
			// uni.$u.toast('认证成功');
			userStore.setUser(user)
		})
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}

	.form-list {
		padding: 28rpx;
		margin-top: 24rpx;


		.form-item {
			margin-bottom: 76rpx;

			&_label {
				margin-bottom: 30rpx;
			}

			&_input {
				height: 96rpx;
				background: #FFFFFF;
				border-radius: 8rpx;
				border: 2rpx solid #EEEEEE;
				
				padding-left: 32rpx;
			}
		}
	}
</style>