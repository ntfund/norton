<template>	
	<view class="options shadow" v-if="show">
		<view class="options_item" v-for="(item, index) in list" :key="index" @click="select(item)">
			<view class="options_item_left" :class="{'options_item_active': selected == item}">{{item}}</view>
			<view class="options_item_right">
				<image src="@/static/images/chat/check@2x.png" mode="aspectFit" style="width: 26rpx; height: 22rpx;"
					v-if="selected == item"
				>
				</image>
			</view>
		</view>
		
		<view class="overlay" @click="close">			
		</view>
	</view>

</template>

<script setup>
	import {
		ref
	} from 'vue';
	const props = defineProps(["list", "show"])
	const emit = defineEmits("update:show", "change")
	const selected = ref(props.list[0])
	
	const select = (item) => {
		selected.value = item
		emit('change', item)
		close()
	}
	
	const close = () => {
		emit("update:show", false)
	}
	
</script>

<style lang="scss">
	.options {
		width: 100vw;
		background: white;
		// height: 200px;

		position: fixed;

		&_item {
			display: flex;
			justify-content: space-between;
			align-items: center;

			margin: auto 28rpx;

			height: 106rpx;

			border-bottom: 2rpx solid #EEEEEE;

			&_left {
				font-family: Gilroy;
				font-weight: 500;
				font-size: 30rpx;
				color: #000000;
			}
			
			&_active {
				color: #7F17FE;
			}
		}

	}
	
	.overlay {
		position: absolute;
		height: 100vh;
		// min-height: 100px;
		background: rgba(0, 0, 0, 0.5);
		width: 100vw;
		
	}
</style>