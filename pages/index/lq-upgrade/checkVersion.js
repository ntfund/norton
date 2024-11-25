/**
 * 检查app版本是否需要升级
 */
const checkVersion = ({
	name, //最新版本名称
	content, //更新内容
	url, //下载链接
	forceUpdate, //是否强制升级,
	ios,
	type
}) => {
	// const selfVersionCode = Number(uni.getSystemInfoSync().appVersionCode); //当前App版本号
	let selfVersion = uni.getSystemInfoSync().appWgtVersion || uni.getSystemInfoSync().appVersion
	console.log(selfVersion, name)
	//线上版本号高于当前，进行在线升级
	if (name != selfVersion) {
		if (getCurrentPageRoute() !== 'pages/index/lq-upgrade/upgrade') {
			uni.navigateTo({
				url: '/pages/index/lq-upgrade/upgrade',
				success() {
					uni.$emit('upgrade-app', {
						name,
						content,
						url,
						forceUpdate,
						ios,
						type
					})
				}
			})
		}	
		
		// let platform = uni.getSystemInfoSync().platform //手机平台
		// //安卓手机弹窗升级
		// if (platform === 'android') {
  //               //当前页面不是升级页面跳转防止多次打开
		// 	if (getCurrentPageRoute() !== 'pages/index/lq-upgrade/upgrade') {
		// 		uni.navigateTo({
		// 			url: '/pages/index/lq-upgrade/upgrade',
		// 			success() {
		// 				uni.$emit('upgrade-app', {
		// 					name,
		// 					content,
		// 					url,
		// 					forceUpdate
		// 				})
		// 			}
		// 		})
		// 	}

		// }
		// //IOS无法在线升级提示到商店下载
		// else {
		// 	uni.showModal({
		// 		title: '发现新版本 ' + newVersionName,
		// 		content: '请到App store进行升级',
		// 		showCancel: false
		// 	})
		// }
	}
}

//获取当前页面url
const getCurrentPageRoute = () => {
	let currentRoute;
	let pages = getCurrentPages() // 获取栈实例
	if (pages&&pages.length) {
		currentRoute = pages[pages.length - 1].route;

	}
	return currentRoute
}

export default checkVersion