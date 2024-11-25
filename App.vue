<script>
	import {
		watch
	} from 'vue'
	import dbHelper from './utils/dbHelper'
	import dbUtils from '@/uni_modules/zjy-sqlite-manage/components/zjy-sqlite-manage/dbUtils.js'
	import dbWallet from './utils/dbWallet'
	import {
		useAppStore
	} from './stores/modules/app'
	import {
		useUserStore
	} from './stores/modules/user'
	import tools from './utils/tools'
	import push from './utils/push'
	import socketHelper from './utils/socketHelper'
	import project from './utils/project'
	export default {
		globalData: {
			isLaunch: false
		},
		onLaunch: async function() {
			console.log('App Launch')

			//打开数据库
			// #ifdef APP-PLUS			
			await push.init();
			this.getQuanxian();
			let isOpen = await dbUtils.isOpen("norton");
			if (isOpen) {
				await dbUtils.closeSQL("norton");
			}
			await dbUtils.openDb("norton");
			await dbHelper.initTables(); //初始化数据表
			// #endif
			//全局websocket
			socketHelper.init();

			//是否存在钱包，不存在就到欢迎页
			try {
				const wallets = await dbWallet.getWallets(3);
				console.log('wallets', wallets)
				if (wallets.length == 0) {
					console.log('钱包为空')
					uni.redirectTo({
						url: '/pages/login/welcome'
					})
					return;
				}
			} catch (e) {
				//TODO handle the exception
				console.log('App vue error: ', e)
				uni.redirectTo({
					url: '/pages/login/welcome'
				})
				return;
			}
			
			if (!uni.getStorageSync('token')) {
				console.log('App Launch token null ')
				uni.redirectTo({
					url: '/pages/login/loading'
				})
				return;
			}

			//首页启动跳转
			this.globalData.isLaunch = true
			uni.$emit('onLaunch')
		},
		onShow: function() {
			console.log('App Show')
			if (uni.getStorageSync('token')) {
				//这个后期改到websocket里面。
				console.log('App Show has Token')
				const appStore = useAppStore();
				appStore.getNewFirendRecords();
				appStore.getC2CShopOrderCount();

				//获取用户信息和资产，因为有内部转账等信息
				project.getUser()
			}
			// if (socketHelper.bInit && !socketHelper.isOpen)[
			// 	socketHelper.webConnect()
			// ]
		},
		onHide: function() {
			console.log('App Hide')
		},
		onExit: async function() {
			console.log('App Exit')
			// #ifdef APP-PLUS
			// const isOpen = await dbUtils.isOpen("norton");
			// if (isOpen) {
			// 	await dbUtils.closeSQL("norton");
			// }
			// #endif
		},
		methods: {
			getQuanxian() {
				let platform = uni.getSystemInfoSync().platform; //首先判断app是安卓还是ios
				console.log(platform);
				if (platform == "ios") { //这里是ios的方法
					var isOn = undefined;
					var types = 0;
					var app = plus.ios.invoke('UIApplication', 'sharedApplication');
					var settings = plus.ios.invoke(app, 'currentUserNotificationSettings');
					if (settings) {
						types = settings.plusGetAttribute('types');
						plus.ios.deleteObject(settings);
					} else {
						types = plus.ios.invoke(app, 'enabledRemoteNotificationTypes');
					}
					plus.ios.deleteObject(app);
					isOn = (0 != types);
					if (isOn == false) {
						uni.showModal({
							title: '通知权限开启提醒',
							content: '您还没有开启通知权限，无法接收到消息通知，请前往设置！',
							showCancel: true,
							confirmText: '去设置',
							success: function(res) {
								if (res.confirm) {
									var app = plus.ios.invoke('UIApplication', 'sharedApplication');
									var setting = plus.ios.invoke('NSURL', 'URLWithString:', 'app-settings:');
									plus.ios.invoke(app, 'openURL:', setting);
									plus.ios.deleteObject(setting);
									plus.ios.deleteObject(app);
								}
							}
						});
					}
				} else if (platform == "android") { //下面是安卓的方法
					var main = plus.android.runtimeMainActivity();
					var pkName = main.getPackageName();
					var uid = main.getApplicationInfo().plusGetAttribute("uid");
					var NotificationManagerCompat = plus.android.importClass(
						"android.support.v4.app.NotificationManagerCompat");
					//android.support.v4升级为androidx
					if (NotificationManagerCompat == null) {
						NotificationManagerCompat = plus.android.importClass(
							"androidx.core.app.NotificationManagerCompat");
					}
					var areNotificationsEnabled = NotificationManagerCompat.from(main).areNotificationsEnabled();
					// 未开通‘允许通知’权限，则弹窗提醒开通，并点击确认后，跳转到系统设置页面进行设置  
					if (!areNotificationsEnabled) {
						uni.showModal({
							title: '通知权限开启提醒',
							content: '您还没有开启通知权限，无法接受到消息通知，请前往设置！',
							showCancel: true,
							confirmText: '去设置',
							success: function(res) {
								if (res.confirm) {
									var Intent = plus.android.importClass('android.content.Intent');
									var Build = plus.android.importClass("android.os.Build");
									//android 8.0引导  
									if (Build.VERSION.SDK_INT >= 26) {
										var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
										intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
									} else if (Build.VERSION.SDK_INT >= 21) { //android 5.0-7.0  
										var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
										intent.putExtra("app_package", pkName);
										intent.putExtra("app_uid", uid);
									} else { //(<21)其他--跳转到该应用管理的详情页  
										intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
										var uri = Uri.fromParts("package", mainActivity.getPackageName(),
											null);
										intent.setData(uri);
									}
									// 跳转到该应用的系统通知设置页  
									main.startActivity(intent);
								}
							}
						});
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* @import "tailwindcss/base"; */
	/* @import "tailwindcss/utilities"; */
	// @import url('./pages/tailwind.css');
	@import "uview-plus/index.scss";
	@import "@/static/css/iconfont.css";

	.border-bb {
		@apply border-0 border-solid border-b border-gray-200;
	}

	.rounded-button {
		@apply rounded-full my-2 border border-solid border-gray-200;

		button {
			@apply rounded-full border-none outline-none border-0;
		}

		button::after {
			border: none;
		}
	}

	page {
		width: 750rpx;
	}

	.row-title {
		font-family: SourceHanSansCN-Regular;
		font-weight: 400;
		font-size: 30rpx;
		color: #1C172F;
	}

	.btn-bottom {
		position: fixed;
		bottom: 84rpx;
		width: 750rpx;
		left: 0;
		right: 0;

		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.n-bottom-white {
		position: fixed;
		bottom: 0;
		width: 750rpx;
		left: 0;
		right: 0;
		background: white;

		// height: 190rpx;

		display: flex;
		flex-direction: column;
		align-items: center;

		// background: green;

		padding: 45rpx 0;
	}

	.n-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto 60rpx;
		// width: 100%;
		width: calc(100% - 120rpx);
		height: 100rpx;
		background: #7F17FE;

		// font-family: SourceHanSansCN-Medium;
		font-weight: 500;
		font-size: 34rpx;
		color: #FFFFFF;

		// margin-top: 30rpx;		
		border-radius: 4px;
	}

	.n-btn-full {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		// width: 100%;
		height: 100rpx;
		background: #7F17FE;

		// font-family: SourceHanSansCN-Medium;
		font-weight: 500;
		font-size: 34rpx;
		color: #FFFFFF;

		// margin-top: 30rpx;		
		border-radius: 4px;
	}

	.n-btn-delete {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto 60rpx;
		// width: 100%;
		height: 100rpx;
		background: #FC465C;

		// font-family: SourceHanSansCN-Medium;
		font-weight: 500;
		font-size: 34rpx;
		color: #FFFFFF;

		margin-top: 30rpx;
	}

	.n-btn-full:active,
	.n-btn:active {
		background: #CDCDCD;
	}

	.highlight:active {
		color: #7F17FE;
	}

	.highlight-bg:active {
		background: #CDCDCD;
	}

	.disabled {
		background: #CDCDCD !important;
		color: #FFFFFF;
	}

	.mt-box {
		margin-top: 100rpx;
	}

	.text-red {
		color: #FC465C;
	}

	.text-green {
		color: #00C688;
	}
</style>