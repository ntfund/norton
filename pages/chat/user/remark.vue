<template>
	<view>
		<com-nav-bar title="修改备注" border="true" backgroundColor="#fff"></com-nav-bar>
		<view class="content">
			<view class="n-input" style="margin-top: 52rpx;">
				<view class="n-input-txt_label">为好友"{{user.nickname}}"设置备注</view>
				<view class="n-input_view">
					<input type="text" v-model="name" class="n-input_input" placeholder="设置备注">
					<image class="n-input_close" src="@/static/images/input-close@2x.png" mode="aspectFit" 
					style="width: 34rpx; height: 34rpx;" @click="name = ''" v-if="name != ''"></image>
				</view>
			</view>
			<view class="confirmed">
				<button type="button" class="n-btn" :class="{'disabled': disabled}" :disabled="disabled"
					@click="confirmed">
					<text>完成</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { computed, ref } from "vue";
	import tools from "@/utils/tools";
	const props = defineProps(['id'])

	let user = ref({
		friend: null,
		id: 0,
		nickname: '',
		avatar: '',
		uid: '',
	})

	const name = ref(user.value.friend ? user.value.friend.remark : '')
	if (props.id) {
		uni.$u.http.get('/chat/user/' + props.id).then(data => {
			console.log('get chat user', data);
			user.value = data;
			name.value = user.value.friend ? user.value.friend.remark : ''
		})
	}

	const disabled = computed(() => {
		return name.value == user.value.friend ? user.value.friend.remark : ''
	})

	const confirmed = () : void => {
		console.log("confirmed", "update name")

		uni.$u.http.put('/chat/friend/' + user.value.friend.id, { remark: name.value }).then(data => {
			console.log(data)
		})

		tools.navigateBack();
	}
</script>

<style lang="scss" scoped>
	.n-input {
		margin: 0 28rpx;
		
		
		
		
		&-txt {

			&_label {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 28rpx;
				color: #999;
				
				padding-bottom: 23rpx;
			}
		}
		
		&_view {
			position: relative;
		}

		&_input {
			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 30rpx;
			color: #000000;
			
			background: #FFFFFF;
			border-radius: 8rpx;
			border: 2rpx solid #7F17FE;
			
			height: 80rpx;
			
			padding-left: 34rpx;
		}


		&_close {
			position: absolute;
			
			right: 23rpx;
			top: 23rpx;
			bottom: 23rpx;
		}
	}
	
	.confirmed {
		margin-top: 105rpx;
	}
</style>