<template>
	<view class="liu-list">
		<scroll-view class="liu-scroll-left" scroll-y="true" :scroll-with-animation="true"
			:scroll-into-view="scrollIntoView">
			<!-- <view class="liu-search" id="TOP">
				<image class="liu-search-img" src="../../static/search.png"></image>
				<input class="liu-input" @input="search" v-model="searchStr" placeholder="请输入搜索信息" maxlength="50"
					placeholder-class="liu-placeholder" />
			</view> -->

			<view class="left-list" v-for="(item,index) of scrollLeftObj" :key="index" :id="index!='#'?index:'BOTTOM'">
				<view class="left-item-title" v-if="item && item.length">{{index}}</view>
				<view class="left-item-card" v-for="(mess,inx) in item" @click.stop="chooseItem(mess)">
					<!--  @click.stop="preview(mess[imgKey])" -->
					<image :style="'border-radius:'+radius" class="left-item-card-img img-info" :src="mess[imgKey]"
						v-if="mess[imgKey]"></image>
					<view :style="'border-radius:'+radius" class="left-item-card-img" v-else>
						{{mess[nameKey] && mess[nameKey].slice(0,1) || ''}}
					</view>
					<view class="left-item-card-container" :style="inx<item.length-1?'border-bottom: solid #F4F4F4 1rpx;':''">
						<view class="left-item-card-info">
							<view class="left-item-card-name">{{mess[nameKey] || ''}}</view>
							<view class="left-item-card-phone" v-if="mess[phoneKey]">{{mess[phoneKey]}}</view>
						</view>
						<image v-if="mess[officialKey] && mess[officialKey] == 1" class="left-item-card-official"
							src="@/static/images/official@2x.png" mode="aspectFit" style="width: 70rpx; height: 23rpx;">
						</image>
					</view>
				</view>
			</view>
			<view class="no-data" v-if="!hasData">
				<image class="no-data-img" src="../../static/noData.png"></image>
				<view class="no-data-name">暂无数据</view>
			</view>
		</scroll-view>
		<view class="liu-scroll-right" v-if="hasData">
			<!-- <image class="liu-scroll-right-top" src="../../static/top.png" @click.stop="scrollIntoView = 'TOP'"></image> -->
			<view :class="{'liu-scroll-right-name':true,'liu-scroll-right-select':item==scrollIntoView}"
				v-for="(item,index) in scrollRightList" :key="index" @click.stop="chooseType(item)">{{item}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		pinyinUtil
	} from './pinyinUtil.js';
	export default {
		props: {
			//数据源
			dataList: {
				// type: Array,
				required: true,
				default: () => {
					return []
				}
			},
			//显示的主键key值
			idKey: {
				type: String,
				default: 'id'
			},
			//显示的名字key值
			nameKey: {
				type: String,
				default: 'name'
			},
			//显示的电话key值
			phoneKey: {
				type: String,
				default: 'phone'
			},
			//显示的头像key值
			imgKey: {
				type: String,
				default: 'img'
			},
			//显示的官方认证key值
			officialKey: {
				type: String,
				default: 'official'
			},
			//头像圆角(rpx、px、%)
			radius: {
				type: String,
				default: '10rpx'
			},
		},
		data() {
			return {
				searchStr: '',
				scrollIntoView: '',
				scrollLeftObj: {},
				oldObj: {},
				scrollRightList: [],
				hasData: true
			};
		},
		watch: {
			dataList: {
				immediate: true,
				deep: true,
				handler(newList) {
					if (newList && newList.length) this.cleanData(newList)
				},
			},
		},
		methods: {
			search() {
				if (this.searchStr) {
					let has = false
					this.scrollLeftObj = JSON.parse(JSON.stringify(this.oldObj))
					for (let i in this.scrollLeftObj) {
						this.scrollLeftObj[i] = this.scrollLeftObj[i].filter(item => {
							return (item[this.nameKey].indexOf(this.searchStr) != -1) || item[this.phoneKey]
								.indexOf(this.searchStr) != -1
						})
						if (this.scrollLeftObj[i].length) has = true
					}
					if (has) this.hasData = true
					else this.hasData = false
				} else {
					this.hasData = true
					this.scrollLeftObj = JSON.parse(JSON.stringify(this.oldObj))
				}
			},
			cleanData(list) {
				this.scrollRightList = this.getLetter()
				let newList = []
				list.forEach(res => {
					let initial = pinyinUtil.getFirstLetter(res.name.trim())
					let firsfirs = initial ? initial.substring(0, 1) : ''
					if (res[this.officialKey] == 1) {
						firsfirs = "↑"
					}
					if (!newList[firsfirs]) newList[firsfirs] = []
					newList[firsfirs].push({
						[this.idKey]: res[this.idKey] || '',
						[this.nameKey]: res[this.nameKey].trim() || '',
						[this.phoneKey]: res[this.phoneKey] || '',
						[this.imgKey]: res[this.imgKey] || '',
						[this.officialKey]: res[this.officialKey] || ''
					})
				})
				this.scrollRightList.forEach(t => {
					if (newList[t]) {
						this.$set(this.scrollLeftObj, t, newList[t])
					} else {
						this.$set(this.scrollLeftObj, t, [])
					}
				})
				let surplusList = []
				for (var i in newList) {
					let han = this.scrollRightList.find(v => {
						return v == i
					})
					if (!han) surplusList.push(newList[i])
				}
				surplusList.forEach(item => {
					this.scrollLeftObj['#'] = this.scrollLeftObj['#'].concat(item)
				})
				this.oldObj = JSON.parse(JSON.stringify(this.scrollLeftObj))
			},
			getLetter() {
				let list = []
				list.push('↑')
				list.push('☆')
				for (var i = 0; i < 26; i++) {
					list.push(String.fromCharCode(65 + i))
				}
				list.push('#')
				return list
			},
			chooseType(item) {
				if (item == '#') item = 'BOTTOM'
				this.scrollIntoView = item
			},
			preview(img) {
				return; //不预览图片
				uni.previewImage({
					current: 0,
					urls: [img]
				})
			},
			chooseItem(item) {
				this.$emit('change', item)
			}
		},
	};
</script>
<style>
	/deep/ ::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
		display: none;
	}
</style>
<style lang="scss" scoped>
	.liu-list {
		width: 100%;
		height: calc(100vh - 241rpx - 44px - 100rpx - 112rpx);
		background-color: #F8F8F8;
		box-sizing: border-box;
		padding-top: 1px;

		.liu-scroll-left {
			height: 100%;

			.liu-search {
				width: 100%;
				height: 106rpx;
				background-color: #FFFFFF;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;

				.liu-search-img {
					width: 32rpx;
					height: 32rpx;
					position: absolute;
					left: 64rpx;
				}

				.liu-input {
					width: calc(100% - 64rpx);
					height: 72rpx;
					background: #EEEEEE;
					border-radius: 36rpx;
					padding: 0 32rpx 0 80rpx;
					box-sizing: border-box;
					color: #333333;
				}

				.liu-placeholder {
					color: #777777;
				}
			}

			.left-list {
				height: auto;

				.left-item-title {
					width: calc(100% - 24rpx);
					height: 60rpx;
					padding-left: 24rpx;
					text-align: left;
					line-height: 60rpx;
					font-size: 30rpx;
					color: #666666;
				}

				.left-item-card {
					width: 100%;
					height: 112rpx;
					background-color: #FFFFFF;
					box-sizing: border-box;
					padding-left: 24rpx;
					display: flex;
					align-items: center;
					justify-content: flex-start;

					.left-item-card-img {
						width: 80rpx;
						min-width: 80rpx;
						height: 80rpx;
						background-color: #CFCFCF;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 36rpx;
						font-weight: bold;
						color: #FFFFFF;
					}

					.img-info {
						background: none;
						border: solid #f0f0f0 1rpx;
					}
					
					.left-item-card-container {
						width: 100%;
						height: 100%;
						// flex: 1;
						// background: green;
						
						display: flex;
						align-items: center;
						justify-content: flex-start;
						
						
						.left-item-card-info {
							margin-left: 32rpx;
							height: 100%;
							display: flex;
							align-items: flex-start;
							justify-content: center;
							flex-direction: column;
						
							.left-item-card-name {
								font-size: 30rpx;
								// line-height: 30rpx;
								// color: #333333;
								color: #000;
						
								font-family: SourceHanSansCN-Medium;
								font-weight: 500;
							}
						
							.left-item-card-phone {
								margin-top: 14rpx;
								font-size: 28rpx;
								line-height: 28rpx;
								color: #999999;
							}
						}
						
						.left-item-card-official {
							margin-left: 20rpx;
						}
					}

					
				}
			}

			.no-data {
				width: 100%;
				display: flex;
				align-items: center;
				justify-items: center;
				flex-direction: column;
				margin-top: 25%;

				.no-data-img {
					width: 200rpx;
					height: 200rpx;
				}

				.no-data-name {
					margin-top: 20rpx;
					font-size: 28rpx;
					color: #666666;
				}
			}
		}

		.liu-scroll-right {
			position: fixed;
			right: 0rpx;
			top: 54%;
			transform: translateY(-43%);
			z-index: 999 !important;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			.liu-scroll-right-top {
				width: 32rpx;
				height: 32rpx;
				margin-right: 14rpx;
				z-index: 999 !important;
			}

			.liu-scroll-right-name {
				width: 32rpx;
				padding-right: 14rpx;
				// height: 28rpx;
				height: 26rpx;
				font-size: 22rpx;
				color: #333333;
				line-height: 22rpx;
				margin-top: 8rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.liu-scroll-right-select {
				padding: 0;
				margin-right: 14rpx;
				width: 28rpx;
				height: 28rpx;
				border-radius: 50%;
				background: #7F17FE;
				color: #FFFFFF;
			}
		}
	}
</style>