// 使用内置SQLite数据库操作工具类
import dbUtils from '@/uni_modules/zjy-sqlite-manage/components/zjy-sqlite-manage/dbUtils.js'
import chainList from '@/data/chainData';
import tools from './tools';
import {
	useWalletStore
} from '@/stores/modules/wallet.js'
import dbTokenH5 from './dbH5/dbTokenH5';

const dbName = "norton"
const tableName = "tokens"
export default {
	//根据区块网络获取钱包列表
	async getTokens(chain_id) {
		// #ifdef H5
		return dbTokenH5.getTokens(chain_id);
		// #endif
		return await dbUtils.selectDataList(dbName, tableName, {
			"chain_id": chain_id
		}, "id", "asc")
	},
	//获取单个token
	async getToken(address, chain_id) {
		// #ifdef H5
		return dbTokenH5.getToken(address, chain_id);
		// #endif
		const list = await dbUtils.selectDataList(dbName, tableName, {address, chain_id}, "id", "asc")
		
		return list[0];
	},
	async getTokenBy(params) {
		// #ifdef H5
		return dbTokenH5.getTokenBy(params);
		// #endif
		const list = await dbUtils.selectDataList(dbName, tableName, params, "id", "asc")
		
		return list[0];
	},
	async updateBalance(params) {
		// #ifdef H5
		return null;
		// #endif
		// const list = await dbUtils.updateSQL(dbName, tableName, params, {address: wallet.address, chain_id})
		
		// return list[0];
	}
}