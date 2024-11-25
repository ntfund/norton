<template>
	<view>
		<u-popup :show="props.show" @close="close" @open="open" mode="center" round="20" zIndex="9999999">
			<view class="content">
				<view class="content_msg" v-html="content"></view>
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
		ref, watchEffect
	} from 'vue';
	const props = defineProps(['show', 'msg', 'red'])
	const emit = defineEmits(['update:show', "confirm", "cancel"]);
	const content = ref(props.msg)
	const close = () => {
		console.log('close')
		emit('update:show', false);
	}
	
	watchEffect(() => {
		content.value = props.msg
	})
	
	const highLightWord = (text, keyword) => {
		const _reg = new RegExp(keyword, "g");
		const newText = text.replace(_reg, `<span class="text-red">${keyword}</span>`)
	
		return newText;
	}
	
	
	const open = () => {
		console.log('props.red', props.red)
		
		if (props.red) {			
			if (Array.isArray(props.red)) {
				for (var i = 0; i < props.red.length; i++) {
					let keyword = props.red[i]
		
					content.value = highLightWord(content.value, keyword);
				}
			} else {
				content.value = highLightWord(content.value, props.red);
			}
		}
	}
	
	const cancel = () => {
		close()
		emit('cancel');
	}
	
	const confirm = () => {
		close()
		emit('confirm');
	}
	
</script>

<style lang="scss" scoped>
	.content {
		width: 656rpx;
		height: 270rpx;

		background: #FFFFFF;
		border-radius: 18rpx;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;

		&_msg {
			margin-top: 53rpx;

			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 32rpx;
		}

	}

	.options {
		display: flex;
		justify-content: center;
		align-items: center;

		margin-bottom: 50rpx;

		&_btn {
			height: 78rpx;
			width: 268rpx;
			border-radius: 39rpx;

			display: flex;
			justify-content: center;
			align-items: center;

			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 28rpx;

			margin: auto 7.5rpx;
		}

		&_cancel {
			background: #EEEEEE;

			color: #000000;
		}

		&_confirm {
			background: #FC465C;

			color: #FFFFFF;
		}
	}
	
</style>