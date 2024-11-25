/**
 * @description H5+下载App
 * @param downloadUrl:App下载链接
 * @param progressCallBack:下载进度回调
 */
export const downloadApp = (downloadUrl, progressCallBack = () => {}, ) => {

	return new Promise((resolve, reject) => {
		const downloadTask = uni.downloadFile({
			url: downloadUrl, //仅为示例，并非真实的资源
			success: (res) => {
				if (res.statusCode === 200) {
					// console.log('下载成功');
					resolve(res.tempFilePath)
				}
			}
		});

		downloadTask.onProgressUpdate((res) => {
			progressCallBack(res.progress)
			// 	console.log('下载进度' + res.progress);
			// 	console.log('已经下载的数据长度' + res.totalBytesWritten);
			// 	console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);

			// 	// 满足测试条件，取消下载任务。
			// 	if (res.progress > 50) {
			// 		downloadTask.abort();
			// 	}
		});
	})



	// return new Promise((resolve, reject) => {
	// 	//创建下载任务
	// 	const downloadTask = plus.downloader.createDownload(downloadUrl, {
	// 		method: "GET"
	// 	}, (task, status) => {
	// 		console.log(status,'status')
	// 		if (status == 200) { //下载成功
	// 			resolve(task.filename)

	// 		} else {
	// 			reject('fail')
	// 			uni.showToast({
	// 				title: '下载失败',
	// 				duration: 1500,
	// 				icon: "none"
	// 			});
	// 		}
	// 	})
	// 	//监听下载过程
	// 	downloadTask.addEventListener("statechanged", (task, status) => {
	// 		switch (task.state) {
	// 			case 1: // 开始  
	// 				break;
	// 			case 2: //已连接到服务器  
	// 				break;
	// 			case 3: // 已接收到数据  
	// 			console.log(task,'task')
	// 				let hasProgress = task.totalSize && task.totalSize > 0 //是否能获取到App大小
	// 				if (hasProgress) {
	// 					let current = parseInt(100 * task.downloadedSize / task.totalSize); //获取下载进度百分比
	// 					progressCallBack(current,task.downloadedSize,task.totalSize)
	// 				}
	// 				break;
	// 			case 4: // 下载完成       
	// 				break;
	// 		}
	// 	});
	// 	//开始执行下载
	// 	downloadTask.start();
	// })

}
/**
 * @description H5+安装APP
 * @param filePath:app文件路径
 * @param callBack:安装成功回调
 */
export const installApp = (filePath, callBack = () => {}) => {
	//注册广播监听app安装情况
	// onInstallListening(callBack);
	//开始安装
	//plus.io.convertLocalFileSystemURL(fileName)	
	plus.runtime.install(filePath, {force: true}, () => {
		//成功跳转到安装界面
		plus.runtime.restart();
		return;
	}, function(error) {
		uni.showModal({
			title: '更新失败',
			content: err.message,
			showCancel: false
		});
	})
	

}
/**
 * @description 注册广播监听APP是否成功
 * @param callBack:安装成功回调函数
 */
const onInstallListening = (callBack = () => {}) => {

	let mainActivity = plus.android.runtimeMainActivity(); //获取activity
	//生成广播接收器
	let receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
		onReceive: (context, intent) => { //接收广播回调  
			plus.android.importClass(intent);
			mainActivity.unregisterReceiver(receiver); //取消监听
			callBack()
		}
	});
	let IntentFilter = plus.android.importClass('android.content.IntentFilter');
	let Intent = plus.android.importClass('android.content.Intent');
	let filter = new IntentFilter();
	filter.addAction(Intent.ACTION_PACKAGE_ADDED); //监听apk安装     
	filter.addDataScheme("package");
	mainActivity.registerReceiver(receiver, filter); //注册广播


}