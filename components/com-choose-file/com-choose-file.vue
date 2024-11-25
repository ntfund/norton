<template>
	<view>
		<view class="item22">
			<!-- #ifdef APP -->
			<view class="box" @tap="attchChoose.onClick">
				<!-- <view class="iconfont icon-file" style="font-size: 32px;"></view> -->
				<image class="img" src="@/static/images/chat/file@2x.png" mode="aspectFit"></image>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="box" @tap="attchChoose.onClick">
				<!-- <view class="iconfont icon-file" style="font-size: 32px;"></view> -->
				<image class="img" src="@/static/images/chat/file@2x.png" mode="aspectFit"></image>
			</view>
			<!-- #endif -->
			<view class="name">文件</view>
		</view>
	</view>
</template>

<script>
	import tools from '@/utils/tools';
	export default {
		name: "com-choose-file",
		data() {
			return {
				filename: ''
			};
		},
		methods: {
			async chooseFileH5() {
				uni.chooseFile({
					success: res => {
						// console.log(res, res.tempFilePaths);
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							let file = res.tempFiles[i];
							this.$emit('selected', {
								file,
								readyStatus: true,
								h5: true
							})
							// screenMsgFile(file, res.tempFilePaths[i]);
						}
					}
				})
			},
			async chooseFile(file) {
				console.log('chooseFile end', file)
				this.$emit('selected', {
					path: this.getLocalPath(this.filename),
					...file,
					attachName: this.filename,
					readyStatus: true
				})

				// try {
				// 	const fileUrl = await this.base64toPath(data.base64Str, data.name);
				// 	console.log(fileUrl.localAbsolutePath)
				// 	// this.upload(fileUrl.localAbsolutePath)
				// 	this.$emit('selected', {
				// 		path: fileUrl.localAbsolutePath,
				// 		...data
				// 	})
				// } catch (e) {
				// 	console.log("err", e);
				// }
			},
			async loadstart(file) {
				console.log('chooseFile load start')
				this.filename = tools.randomString(10) + file.name;
				console.log(this.filename, this.getLocalPath(this.filename))
				this.$emit('selected', {
					path: this.getLocalPath(this.filename),
					...file,
					attachName: this.filename,
					readyStatus: false
				})
			},
			progress(data) {
				console.log('progress', data.index)
				// console.log(buffer)
				this.bufferToPath(data.buffer, this.filename, data.index)
			},
			/**
			 * @param {Object} base64 文件base64
			 * @param {Object} attachName //文件名需要后缀，如：张三.jpg
			 * 内部存储空间目录
			 * plus.io.PRIVATE_WWW 对应绝对路径 file:///data/user/0/%PACKAGENAME%/files/apps/%APPID%/www
			 * plus.io.PRIVATE_DOC 对应绝对路径 file:///data/user/0/%PACKAGENAME%/files/apps/%APPID%/doc
			 * 外部存储空间目录
			 * plus.io.PUBLIC_DOCUMENTS 对应绝对路径 file:///storage/emulated/0/Android/data/%PACKAGENAME%/.%APPID%/documents
			 * plus.io.PUBLIC_DOWNLOADS 对应绝对路径 file:///storage/emulated/0/Android/data/%PACKAGENAME%/.%APPID%/downloads
			 */
			async base64toPath(base64, attachName) {
				let _that = this;
				return new Promise(function(resolve, reject) {
					const filePath = `_doc/uniapp_temp/compressed/${attachName}`;
					plus.io.resolveLocalFileSystemURL('_doc', function(entry) {
						entry.getDirectory("uniapp_temp/compressed", {
							create: true,
							exclusive: false,
						}, function(entry) {
							entry.getFile(attachName, {
								create: true,
								exclusive: false,
							}, function(entry) {
								entry.createWriter(function(writer) {
									writer.onwrite = function(res) {
										const obj = {
											relativePath: filePath,
											localAbsolutePath: plus.io
												.convertLocalFileSystemURL(
													filePath)
										}
										resolve(obj);
									}
									writer.onerror = reject;
									writer.seek(0);
									writer.writeAsBinary(_that
										.getSymbolAfterString(base64,
											','));
								}, reject)
							}, reject)
						}, reject)
					}, reject)
				})
			},
			getAbsolutePath(attachName) {
				const filePath = `_doc/uniapp_temp/compressed/${attachName}`;
				return plus.io.convertAbsoluteFileSystem(filePath)
			},
			getLocalPath(attachName) {
				const filePath = `_doc/uniapp_temp/compressed/${attachName}`;
				return plus.io.convertLocalFileSystemURL(filePath)
			},
			getSystemPath(attachName) {				
				return "file://" + this.getLocalPath(filePath)
			},
			async bufferToPath(arrayBuffer, attachName, index) {
				let _that = this;
				let step = 1024 * 1024 * 10;
				let seek = index * step;
				return new Promise(function(resolve, reject) {
					const filePath = `_doc/uniapp_temp/compressed/${attachName}`;
					plus.io.resolveLocalFileSystemURL('_doc', function(entry) {
						entry.getDirectory("uniapp_temp/compressed", {
							create: true,
							exclusive: false,
						}, function(entry) {
							entry.getFile(attachName, {
								create: true,
								exclusive: false,
							}, function(entry) {
								entry.createWriter(function(writer) {
									writer.onwrite = function(res) {
										const obj = {
											relativePath: filePath,
											localAbsolutePath: plus.io
												.convertLocalFileSystemURL(
													filePath)
										}
										resolve(obj);
									}
									writer.onerror = reject;
									// writer.seek(writer.length - 1);
									writer.seek(seek);
									writer.writeAsBinary(arrayBuffer);
								}, reject)
							}, reject)
						}, reject)
					}, reject)
				})
			},
			// 取某个符号后面的字符
			getSymbolAfterString(val, symbolStr) {
				if (val == undefined || val == null || val == "") {
					return "";
				}
				val = val.toString();
				const index = val.indexOf(symbolStr);
				if (index != -1) {
					val = val.substring(index + 1, val.length);
					return val;
				} else {
					return val
				}
			}
		}
	}
</script>

<script module="attchChoose" lang="renderjs">
	let fileInputDom = null;
	export default {
		data() {
			return {
				file: {},
				arrayBuffer: [],
				step: 1024 * 1024 * 2
			}
		},
		methods: {
			createFileInputDom() {
				fileInputDom = document.createElement("input");
				fileInputDom.setAttribute('type', 'file');
				fileInputDom.setAttribute('accept', '*');
			},
			_arrayBufferToBase64(buffer) {
				var binary = '';
				var bytes = new Uint8Array(buffer);
				var len = bytes.byteLength;
				for (var i = 0; i < len; i++) {
					binary += String.fromCharCode(bytes[i]);
				}
				return window.btoa(binary);
			},
			async sliceBlob(index, ownerInstance) {
				let start = index * this.step;
				let end = start + this.step;
				if (end > this.file.size) {
					end = this.file.size;
				}
				let blob = this.arrayBuffer.slice(start, end)
				this.$ownerInstance.callMethod('progress', {
					index,
					buffer: this._arrayBufferToBase64(blob)
				})
			},
			onClick(event, ownerInstance) {
				if (!fileInputDom) {
					this.createFileInputDom();
				}
				fileInputDom.click(); // 模拟click
				fileInputDom.addEventListener('change', (e) => {
					fileInputDom = null;
					this.file = e.target.files[0];
					// console.log(choicesFiles, e.target)
					let reader = new FileReader();
					//读取图像文件 result 为 DataURL, DataURL 可直接 赋值给 img.src


					reader.onloadstart = event => {
						ownerInstance.callMethod('loadstart', {
							lastModified: this.file.lastModified,
							lastModifiedDate: this.file.lastModifiedDate,
							name: this.file.name,
							size: this.file.size,
							type: this.file.type,
							webkitRelativePath: this.file.webkitRelativePath
						})
					}

					reader.onload = async event => {
						console.log('onload', event)
						// const result = event.target.result; // 文件的base64
						// let buffer = new Uint8Array(result);
						// let buffer = event.target.result;
						// let buffer = uni.arrayBufferToBase64(event.target.result)

						this.arrayBuffer = event.target.result;
						let count = Math.ceil(this.file.size / this.step);
						for (var i = 0; i < count; i++) {
							await this.sliceBlob(i, ownerInstance)
						}

						ownerInstance.callMethod('chooseFile', {
							lastModified: this.file.lastModified,
							lastModifiedDate: this.file.lastModifiedDate,
							name: this.file.name,
							size: this.file.size,
							type: this.file.type,
							webkitRelativePath: this.file.webkitRelativePath
						})
					}

					e.target.value = "";

					reader.readAsArrayBuffer(this.file);
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.item22 {
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		// width: 100%;
		// background: green;
		.box{
			// width: 18vw;
			// height: 18vw;
			width: 112rpx;
			height: 112rpx;
			background: #F2F2F2;
			border-radius: 38rpx;
			// border-radius: 20upx;
			display: flex;
			justify-content: center;
			align-items: center;
			// margin: 3vw 3vw 2vw 3vw;
			.icon{
				font-size: 70upx;
			}
			
			.img {
				width: 40rpx;
				height: 40rpx;
			}
		}
		
		.name {
			font-family: SourceHanSansCN-Regular;
			font-weight: 400;
			font-size: 24rpx;
			color: #000000;
			margin-top: 16rpx;
		}
	}
</style>