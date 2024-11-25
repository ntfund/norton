// 使用内置SQLite数据库操作工具类
import dbUtils from '@/uni_modules/zjy-sqlite-manage/components/zjy-sqlite-manage/dbUtils.js'
import {
	MD5
} from 'crypto-js'

const dbName = "norton"
const tableName = "settings"
export default {
	openDb() {
		dbUtils.openDb(dbName);
	},
	async getPassword() {
		// #ifdef APP-PLUS
		let list = await dbUtils.selectDataList(dbName, tableName, {}, "id", "asc")
		// console.log('getPassword', list[0])
		return list[0]['pair_value'];
		// #endif		
	},
	async hasPassword() {
		// #ifdef APP-PLUS
		let passwd = await this.getPassword()
		console.log('passwd', passwd)
		return passwd != 'NULL' && !!passwd == true;
		// #endif

		return false;
	},
	async verify(password) {
		let passwd = await this.getPassword()
		return MD5(password).toString() == passwd;
	},
	async getAuth() {
		// #ifdef APP-PLUS		
		let fingerPrint = await dbUtils.selectDataList(dbName, tableName, {
			pair_key: 'fingerPrint'
		}, "id", "asc")
		console.log('fingerPrint', fingerPrint)
		if (!fingerPrint || fingerPrint.length == 0) {
			await this.insertValue("fingerPrint", "0")
			return false;
		}
		if (fingerPrint[0]['pair_value'] == "1") {
			return "fingerPrint";
		}

		let facial = await dbUtils.selectDataList(dbName, tableName, {
			pair_key: 'facial'
		}, "id", "asc")
		if (!facial || facial.length == 0) {
			await this.insertValue("facial", "0")
			return false;
		}
		if (facial[0]['pair_value'] == "1") {
			return "facial";
		}

		// #endif

		return false;
	},
	async updateValue(field, value) {
		// #ifdef H5
		return;
		// #endif
		await dbUtils.updateSQL(dbName, tableName, {
			'pair_value': value
		}, {
			'pair_key': field
		});
	},
	async insertValue(field, value) {
		// #ifdef H5
		return;
		// #endif
		await dbUtils.addTabItem(dbName, tableName, {
			'pair_key ': field,
			'pair_value': value
		});
	}
}