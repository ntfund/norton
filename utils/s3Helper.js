import CryptoJS from 'crypto-js';
import {
	useUserStore
} from '../stores/modules/user';
import tools from './tools';
import project from './project';

const AWSAccessKeyId = ""
const AWSSecretAccessKey = ""
const bucket = "appnorton"
const region = "ap-east-1"

export default {
	// function getPolicy() {
	// 	const now = new Date("2015-12-29T12:00:00.000Z")
	// 	let expiration = new Date(now.getTime() + 86400000).toISOString();
	// 	console.log('expiration', expiration)
	// 	const bucket = "sigv4examplebucket"
	// 	const success_action_redirect = "http://sigv4examplebucket.s3.amazonaws.com/successful_upload.html"
	// 	const contentType = "image/"
	// 	const uuid = "14365123651274"
	// 	const startPath = "user/user1/"
	// 	const AWSAccessKeyId = "AKIAIOSFODNN7EXAMPLE"
	// 	const time = now.getFullYear() + "" +  (now.getMonth() + 1) + "" + now.getDate();
	// 	let policy = Base64.encode(`{ "expiration": "${expiration}",\r\n  "conditions": [\r\n    {"bucket": "${bucket}"},\r\n    ["starts-with", "$key", "${startPath}"],\r\n    {"acl": "public-read"},\r\n    {"success_action_redirect": "${success_action_redirect}"},\r\n    ["starts-with", "$Content-Type", "${contentType}"],\r\n    {"x-amz-meta-uuid": "${uuid}"},\r\n    {"x-amz-server-side-encryption": "AES256"},\r\n    ["starts-with", "$x-amz-meta-tag", ""],\r\n\r\n    {"x-amz-credential": "${AWSAccessKeyId}/${time}/us-east-1/s3/aws4_request"},\r\n    {"x-amz-algorithm": "AWS4-HMAC-SHA256"},\r\n    {"x-amz-date": "${time}T000000Z" }\r\n  ]\r\n}`);

	// 	return policy;
	// }
	getMimeTypeFromExtension(extension = "txt") {
		if (extension[0] === ".") {
			extension = extension.substr(1);
		}
		return {
			"aac": "audio/aac",
			"abw": "application/x-abiword",
			"arc": "application/x-freearc",
			"avi": "video/x-msvideo",
			"azw": "application/vnd.amazon.ebook",
			"bin": "application/octet-stream",
			"bmp": "image/bmp",
			"bz": "application/x-bzip",
			"bz2": "application/x-bzip2",
			"cda": "application/x-cdf",
			"csh": "application/x-csh",
			"css": "text/css",
			"csv": "text/csv",
			"doc": "application/msword",
			"docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"eot": "application/vnd.ms-fontobject",
			"epub": "application/epub+zip",
			"gz": "application/gzip",
			"gif": "image/gif",
			"htm": "text/html",
			"html": "text/html",
			"ico": "image/vnd.microsoft.icon",
			"ics": "text/calendar",
			"jar": "application/java-archive",
			"jpeg": "image/jpeg",
			"jpg": "image/jpeg",
			"js": "text/javascript",
			"json": "application/json",
			"jsonld": "application/ld+json",
			"mid": "audio/midi audio/x-midi",
			"midi": "audio/midi audio/x-midi",
			"mjs": "text/javascript",
			"mp3": "audio/mpeg",
			"mp4": "video/mp4",
			"mpeg": "video/mpeg",
			"mpkg": "application/vnd.apple.installer+xml",
			"odp": "application/vnd.oasis.opendocument.presentation",
			"ods": "application/vnd.oasis.opendocument.spreadsheet",
			"odt": "application/vnd.oasis.opendocument.text",
			"oga": "audio/ogg",
			"ogv": "video/ogg",
			"ogx": "application/ogg",
			"opus": "audio/opus",
			"otf": "font/otf",
			"png": "image/png",
			"pdf": "application/pdf",
			"php": "application/x-httpd-php",
			"ppt": "application/vnd.ms-powerpoint",
			"pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
			"rar": "application/vnd.rar",
			"rtf": "application/rtf",
			"sh": "application/x-sh",
			"svg": "image/svg+xml",
			"swf": "application/x-shockwave-flash",
			"tar": "application/x-tar",
			"tif": "image/tiff",
			"tiff": "image/tiff",
			"ts": "video/mp2t",
			"ttf": "font/ttf",
			"txt": "text/plain",
			"vsd": "application/vnd.visio",
			"wav": "audio/wav",
			"weba": "audio/webm",
			"webm": "video/webm",
			"webp": "image/webp",
			"woff": "font/woff",
			"woff2": "font/woff2",
			"xhtml": "application/xhtml+xml",
			"xls": "application/vnd.ms-excel",
			"xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"xml": "application/xml",
			"xul": "application/vnd.mozilla.xul+xml",
			"zip": "application/zip",
			"3gp": "video/3gpp",
			"3g2": "video/3gpp2",
			"7z": "application/x-7z-compressed"
		} [extension] || "application/octet-stream";
	},
	getTime() {
		const now = new Date()
		let year = now.getFullYear();
		let month = now.getMonth() + 1;
		let day = now.getDate();
		if (month < 10) {
			month = "0" + month
		}
		if (day < 10) {
			day = "0" + day
		}
		return year + "" + month + "" + day
	},
	getMonthTime() {
		const now = new Date()
		let year = now.getFullYear();
		let month = now.getMonth() + 1;
		let day = now.getDate();
		if (month < 10) {
			month = "0" + month
		}
		return year + "" + month
	},
	getPolicy(uuid) {
		const now = new Date()
		let expiration = new Date(now.getTime() + 86400000).toISOString();
		const success_action_status = 200

		const time = this.getTime();
		let words = CryptoJS.enc.Utf8.parse(
			`{ "expiration": "${expiration}",\r\n  "conditions": [\r\n    {"bucket": "${bucket}"},\r\n    ["starts-with", "$key", "chat/"],\r\n    {"acl": "public-read"},\r\n    {"success_action_status": "${success_action_status}"},\r\n    ["starts-with", "$Content-Type", ""],\r\n    {"x-amz-meta-uuid": "${uuid}"},\r\n    {"x-amz-server-side-encryption": "AES256"},\r\n    ["starts-with", "$x-amz-meta-tag", ""],\r\n\r\n    {"x-amz-credential": "${AWSAccessKeyId}/${time}/${region}/s3/aws4_request"},\r\n    {"x-amz-algorithm": "AWS4-HMAC-SHA256"},\r\n    {"x-amz-date": "${time}T000000Z" }\r\n  ]\r\n}`
		);

		return CryptoJS.enc.Base64.stringify(words)
	},
	getSigntureKey() {
		const time = this.getTime();
		let dateKey = CryptoJS.HmacSHA256(time, "AWS4" + AWSSecretAccessKey)
		let dateRegionKey = CryptoJS.HmacSHA256(region, dateKey)
		let dateRegionServiceKey = CryptoJS.HmacSHA256("s3", dateRegionKey)
		let signingKey = CryptoJS.HmacSHA256("aws4_request", dateRegionServiceKey)
		return signingKey;
	},
	getSign(StringToSign) {
		const signingKey = this.getSigntureKey()
		return CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(StringToSign, signingKey))
	},
	getFormData(file) {
		const uuid = tools.randomString(10) + new Date().getTime()

		const now = new Date();
		const time = this.getTime();
		const credential = AWSAccessKeyId + "/" + time + "/" + region + "/s3/aws4_request"

		const StringToSign = this.getPolicy(uuid)
		const sign = this.getSign(StringToSign)

		return {
			"key": file.new_path,
			"acl": "public-read",
			"success_action_status": 200,
			"Content-Type": file.type,
			"x-amz-meta-uuid": uuid,
			"x-amz-server-side-encryption": "AES256",
			"x-amz-Credential": credential,
			"x-amz-algorithm": "AWS4-HMAC-SHA256",
			"x-amz-date": time + "T000000Z",
			"x-amz-meta-tag": "",
			"Policy": StringToSign,
			"x-amz-signature": sign
		}
	},
	getHost() {
		const url = 'https://' + bucket + '.s3.' + region + '.amazonaws.com/'
		return url;
	},
	/**
	 * @param {Object} params
	 * filePath string 文件路径
	 * progress callback 上传进度
	 * success callback 上传成功
	 * complete callback 上传完成
	 */
	upload(params, disk = "files") {
		let file = params.file;
		if (!file.name) {
			let pos = file.path.lastIndexOf('/')
			file.name = file.path.substr(pos + 1)
			let extension = file.name.substr(file.name.lastIndexOf(".") + 1);
			file.type = this.getMimeTypeFromExtension(extension);
		}
		const userStore = useUserStore();
		file.new_path = "chat/" + disk + "/" + this.getMonthTime() + "/" + userStore.user.id + "/" + tools.randomString(
				16) + file.name;
		let url = this.getHost();
		const fullPath = url + file.new_path;
		
		// console.log('s3 upload', file)		
		
		let header = {
			'Accept': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'content-type': 'multipart/form-data'
		}
		let formData = this.getFormData(params.file)
		
		let platform = uni.getSystemInfoSync().platform;
		if (platform == "ios") {
			//ios 走的服务器上传，什么时候uniapp 修复了bug，再切换回来
			url = project.getFullURL("/api/upload/chat")
			formData.type = disk;
			header.Authorization = `Bearer ${uni.getStorageSync('token')}`			
		}
		
		let uploadTask = uni.uploadFile({
			url: url,
			filePath: params.file.path,
			name: 'file',
			header: header,
			formData: formData,
			success: (uploadFileRes) => {
				console.log('uploadFileRes', uploadFileRes);
				if (params.success) {
					
					if (platform == "ios") {
						//ios 走的服务器上传，什么时候uniapp 修复了bug，再切换回来
						let data = uploadFileRes.data;
						if (typeof(data) == "string") {
							data = JSON.parse(data)
						}						
						params.success({
							path: file.new_path,
							fullPath: data.src,
							...uploadFileRes
						})
					} else if (uploadFileRes.statusCode == 200) {
						params.success({
							path: file.new_path,
							fullPath,
							...uploadFileRes
						})
					}					
				}
			},
			fail: (res) => {
				console.log(res)
				if (params.fail) {
					params.fail(res)
				}
			},
			complete: () => {
				console.log('complete')
				if (params.complete) {
					params.complete()
				}
			}
		})

		uploadTask.onProgressUpdate((res) => {
			// console.log('上传进度' + res.progress);
			// console.log('已经上传的数据长度' + res.totalBytesSent);
			// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

			if (params.progress) {
				params.progress(res, uploadTask)
			}
		});
	},
	getEmoji(url) {
		return this.getHost() + 'chat/emoji/' + url;
	}
}