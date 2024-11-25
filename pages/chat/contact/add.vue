<template>
	<view>
		<com-nav-bar title="添加朋友" backgroundColor="#fff"></com-nav-bar>
		<com-input-search v-model="keyword" placeholder="搜索 UID或者昵称" @search="search"></com-input-search>
		<view class="scan flex justify-between items-center" @click="scan">
			<view class="flex items-center scan_left">
				<image src="@/static/images/chat/scan@2x.png" mode="aspectFit" style="width: 44rpx; height: 44rpx;">
				</image>
				<view class="flex items-center">
					<view class="scan_left_sao">扫一扫</view>
					<view class="scan_left_sao2">（扫描二维码名片加好友）</view>
				</view>
			</view>
			<view class=" flex right">
				<image src="@/static/images/chat/arrow-right22@2x.png" mode="aspectFit"
					style="width: 12rpx; height: 20rpx;"></image>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import tools from "@/utils/tools";
	const props = defineProps(['keyword']);
	const keyword = ref(props.keyword)
	// console.log('props', props)

	onMounted(() => {
		if (keyword.value) {
			search(keyword.value)
		}
	})

	const scan = () => {
		uni.scanCode({
			success: function (res) {
				console.log('条码类型：' + res.scanType);
				console.log('条码内容：' + res.result);

				if (res.scanType == 'QR_CODE') {
					keyword.value = res.result;
					search(keyword.value)
				}
			}
		});
	}

	const search = (value) => {
		// console.log('search', value)
		if (!value) {
			return;
		}
		uni.$u.http.get('/chat/user/getUser?search=' + value).then(data => {
			if (data.length == 0) {
				return uni.$u.toast('查找用户不存在');
			}
			console.log(data)
			tools.navigateTo('/pages/chat/user/info?id=' + data.id);
		})
	}
</script>

<style lang="less" scoped>
	page {
		background: #F8F8F8;
	}

	

	.scan {
		height: 100rpx;
		background: #FFFFFF;

		padding: 0 28rpx;

		margin-top: 41rpx;

		&_left {
			&_sao {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 30rpx;
				color: #000000;

				padding-left: 37rpx;
			}

			&_sao2 {
				font-family: SourceHanSansCN-Medium;
				font-weight: 500;
				font-size: 24rpx;
				color: #999;

				padding-left: 19rpx;
			}
		}
	}
</style>