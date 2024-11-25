<template>
	<view :class="{'nav_bar_border': border}">
		<uni-nav-bar :fixed="true" :border="false" height="110rpx" :backgroundColor="getBgColor()" :statusBar="true"
			:leftWidth="props.leftWidth" :rightWidth="props.rightWidth" @clickLeft="clickLeft"
			@clickRight="emit('clickRight')" v-bind="$attrs">
			<template #default>
				<slot name="default">
					<view class="w-[100%] h-[100%] flex align-center justify-center p-0 m-0"
						style="align-items: center;">
						<view class="nav-title" :class="getTitleColor()">{{title}}</view>
					</view>
				</slot>
			</template>
			<template #left>
				<view class="pl-[10px]">
					<view class="w-[100%] h-[100%] p-0 m-0 nav-left ">
						<image src="./back_white@2x.png" mode="aspectFit" style="width: 30rpx; height: 23rpx;"
							v-if="getTitleColor() == 'nav-white'"></image>
						<image src="./back@2x.png" mode="aspectFit" style="width: 30rpx; height: 23rpx;" v-else></image>
					</view>
				</view>
			</template>
			<template #right>
				<view class="pr-[10px]">
					<slot name="right">
						<view class="right-title flex items-center justify-end w-[100%] h-[100%]"
							:class="getTitleColor()" v-if="right">{{right}}</view>
					</slot>
				</view>
			</template>
		</uni-nav-bar>
	</view>
</template>

<script setup>
	import {
		ref,
		useAttrs,
		watch
	} from 'vue';
	import {
		onPageScroll
	} from '@dcloudio/uni-app';


	const props = defineProps(['title', 'safeAreaInsetTop', 'right', 'border', 'backgroundColor', 'color', 'leftWidth',
		'rightWidth', "moveBg", "moveColor", "navColor", "moveNavColor"
	])
	const emit = defineEmits(['clickRight'])
	const attrs = useAttrs();
	// console.log(attrs, attrs.onClickLeft);

	const clickLeft = () => {
		if (attrs.onClickLeft) {
			emit('clickLeft')
			attrs.onClickLeft()
		} else {
			emit('clickLeft navigateBack')
			uni.navigateBack();
		}
	}

	const isTop = ref(true)

	onPageScroll((e) => {
		isTop.value = e.scrollTop == 0
	})

	const getTitleColor = () => {
		if (props.color) {
			// if (props.backgroundColor == "transparent" && !isTop.value) {
			// 	return "nav-"
			// }

			if (props.moveColor) {
				if (props.backgroundColor == "transparent" && !isTop.value && props.moveBg) {
					// return "#F8F8F8"
					return 'nav-' + props.moveColor
				}
			}

			return 'nav-' + props.color;
		}

		return "nav-"
	}

	const getBgColor = () => {
		if (props.backgroundColor) {
			if (props.backgroundColor == "transparent" && !isTop.value && props.moveBg) {
				// return "#F8F8F8"
				return props.moveBg
			}
			return props.backgroundColor;
		}

		return "#F8F8F8"
	}

	watch(() => isTop.value, (newVal, oldVal) => {
		// console.log('watdch isTop', newVal, oldVal)

		if (props.navColor && props.moveNavColor) {
			uni.setNavigationBarColor({
				backgroundColor: newVal ? props.navColor : props.moveNavColor
			})
		}		

		// uni.setNavigationBarColor({
		// 	frontColor: newVal ? '#ffffff' : '#000000',
		// 	backgroundColor: newVal ? '#ffffff' : '#000000'
		// })
	})
</script>

<style lang="scss">
	.nav-title {
		font-family: SourceHanSansCN-Heavy;
		font-weight: 800;
		font-size: 30rpx;
		color: #000000;
	}

	.nav-white {
		color: white !important;
	}

	.nav-black {
		color: #000;
	}

	.right-title {
		font-family: SourceHanSansCN-Medium;
		font-weight: 500;
		font-size: 30rpx;
		color: #000000;
		margin-right: 7rpx;
	}

	.nav_bar_border {
		// border-bottom: 1px solid #EEEEEE;
		position: relative;
	}

	.nav_bar_border::after {
		content: '';
		width: 750rpx;
		height: 2rpx;
		position: absolute;
		left: 0;
		bottom: 0;
		background: #EEEEEE;
		z-index: 999;
	}
</style>