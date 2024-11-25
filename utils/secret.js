import CryptoJS from 'crypto-js';
// #ifdef APP-PLUS
const uuid = CryptoJS.MD5(plus.device.uuid).toString().substr(0, 16);
// #endif
// #ifndef APP-PLUS
const uuid = "NORTONIMIMNORTON"
// #endif

const key = CryptoJS.enc.Utf8.parse(uuid); //十六位十六进制数作为密钥  
const iv = CryptoJS.enc.Utf8.parse('IMNORTONNORTONIM'); //十六位十六进制数作为密钥偏移量
export default {
	//加密方法
	encrypt(word) {
		let srcs = CryptoJS.enc.Utf8.parse(word);
		let encrypted = CryptoJS.AES.encrypt(srcs, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return encrypted.ciphertext.toString().toUpperCase();
	},

	//解密方法
	decrypt(word) {
		let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
		let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
		let decrypt = CryptoJS.AES.decrypt(srcs, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
		return decryptedStr.toString();
	},

	//加密方法
	encode(word) {
		let srcs = CryptoJS.enc.Utf8.parse(word);
		let encrypted = CryptoJS.AES.encrypt(srcs, CryptoJS.enc.Utf8.parse("NORTONIMIMNORTON"), {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return encrypted.ciphertext.toString().toUpperCase();
	},

	//解密方法
	decode(word) {
		let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
		let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
		let decrypt = CryptoJS.AES.decrypt(srcs, CryptoJS.enc.Utf8.parse("NORTONIMIMNORTON"), {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
		return decryptedStr.toString();
	},

	//md5
	md5(word) {
		return CryptoJS.MD5(word).toString();
	}
}