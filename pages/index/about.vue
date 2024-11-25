<template>
	<view>
		<com-nav-bar title="关于我们" backgroundColor="#fff" border="true"></com-nav-bar>
		<view class="content">
			<view class="men">加密货币之门</view>
			<view class="men2">安全，快捷，轻松交易多种加密货币</view>
			<view class="lianxi">联系我们</view>
			<view class="flex items-center t1">
				<view class="t1-item">
					<view class="t1-item_view">
						<view class="t1-item_view_amount">$78.46</view>
						<view class="t1-item_view_txt">亿</view>
					</view>
					<view class="t1-item_volume">
						日交易量
					</view>
				</view>
				<view class="t1-item">
					<view class="t1-item_view">
						<view class="t1-item_view_amount">1300+</view>
						<view class="t1-item_view_txt">万</view>
					</view>
					<view class="t1-item_volume">
						全球用户
					</view>
				</view>
				<view class="t1-item">
					<view class="t1-item_view">
						<view class="t1-item_view_amount">48410%</view>
					</view>
					<view class="t1-item_volume">
						理财利率
					</view>
				</view>
			</view>

			<view class="who">
				我们是谁？
			</view>
			<view class="norton">
				Norton 創立於2013年，是全球真實交易量TOP10的加密貨憋交易平辜，向全球数千用戶提供安全可靠、真實透明的數字资產交易服務。
			</view>

			<view class="card">
				<view class="card_title">创新</view>
				<view class="card_content">重构概念，以找出痛点的解决之道，挑战成见，以保持产品服务的敏捷。</view>
			</view>
			<view class="card">
				<view class="card_title">合作</view>
				<view class="card_content">以共赢思维看待问题，主动开放分享信息，真诚帮助所有用户和伙伴，营造良性行业生态。</view>
			</view>
			<view class="card">
				<view class="card_title">洞察</view>
				<view class="card_content">明辨用户需求，创造长远价值，洞察行业异动，满足用户需求。</view>
			</view>
			<view class="who">
				联系我们
			</view>
			<view class="contact">
				<view class="contact_title">
					官方邮箱1
				</view>
				<view class="contact_view">
					<input type="text" class="contact_input" value="norton001@gmail.com">
					<image class="contact_img" src="@/static/images/left/copy6@2x.png" mode="aspectFit"
						style="width: 27rpx; height: 27rpx;"></image>
				</view>
			</view>
			<view class="contact">
				<view class="contact_title">
					官方客服UID
				</view>
				<view class="contact_view">
					<input type="text" class="contact_view_input" value="00000001">
					<image class="contact_view_img" src="@/static/images/left/copy6@2x.png" mode="aspectFit"
						style="width: 27rpx; height: 27rpx;"></image>
				</view>
			</view>
			<view class="h-[50px]"></view>
		</view>


	</view>
</template>

<script setup>

</script>

<style lang="scss" scoped>
	.content {
		padding: 0 29rpx;

		.men {
			font-family: MicrosoftYaHei-Bold;
			font-weight: bold;
			font-size: 48rpx;
			color: #000000;

			margin-top: 65rpx;
		}

		.men2 {
			font-family: MicrosoftYaHei;
			font-weight: 400;
			font-size: 32rpx;
			color: #000000;

			margin-top: 28rpx;
		}

		.lianxi {
			width: 208rpx;
			height: 80rpx;
			background: #7F17FE;
			border-radius: 40rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			font-family: SourceHanSansCN-Medium;
			font-weight: 500;
			font-size: 28rpx;
			color: #FFFFFF;

			margin-top: 73rpx;
		}

		.t1 {
			margin-top: 122rpx;

			&-item {
				margin-right: 41rpx;

				&_view {
					display: flex;
					align-items: flex-end;
					justify-content: center;
					
					&_amount {
						font-family: Gilroy-Bold;
						font-weight: bold;
						font-size: 44rpx;
						color: #000000;
					}
					&_txt {
						font-family: SourceHanSansCN-Regular;
						font-weight: 400;
						font-size: 30rpx;
						color: #000000;
						
						margin-left: 9rpx;
					}
				}
				
				&_volume {
					font-family: SourceHanSansCN-Regular;
					font-weight: 400;
					font-size: 24rpx;
					color: #999;
					
					margin-top: 22rpx;
				}
			}
		}
		
		.who {
			font-family: SourceHanSansCN-Bold;
			font-weight: bold;
			font-size: 36rpx;
			color: #000000;
			
			margin-top: 116rpx;
		}
		
		.norton {
			margin-top: 64rpx;
			
			font-family: Gilroy-Regular;
			font-weight: 400;
			font-size: 30rpx;
			color: #999;
			
			margin-bottom: 115rpx;
		}
		
		.card {
			
			// width: 694rpx;
			height: 254rpx;
			
			background: #F8F8F8;
			border-radius: 24rpx;
			border: 3rpx solid #EEEEEE;
			
			
			margin-bottom: 46rpx;
			
			&_title {
				font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 40rpx;
				
				margin-top: 50rpx;
				margin-left: 54rpx;
			}
			
			&_content {
				font-family: SourceHanSansCN-Regular;
				font-weight: 400;
				font-size: 28rpx;
				color: #999;
				
				margin-top: 22rpx;
				margin-left: 54rpx;
				
				padding-right: 54rpx;
			}
		}
		
		.contact {
			
			margin-top: 79rpx;
			
			&_title {
				font-family: SourceHanSansCN-Bold;
				font-weight: bold;
				font-size: 30rpx;
				color: #000000;
			}
			
			&_view {
				// height: 90rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				padding: 35rpx 45rpx 26rpx 34rpx;
				border-radius: 14rpx;
				
				border: 2rpx solid #EEEEEE;
				
				margin-top: 42rpx;
				
				&_input {
					font-family: Gilroy-Regular;
					font-weight: 400;
					font-size: 30rpx;
					color: #000000;
					
				}
				
				&_img {
					
				}
			}
		}
	}
</style>