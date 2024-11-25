// 使用内置SQLite数据库操作工具类
import dbUtils from '@/uni_modules/zjy-sqlite-manage/components/zjy-sqlite-manage/dbUtils.js'
import chainList from '@/data/chainData';
import dbWalletH5 from './dbH5/dbWalletH5';
import secret from '@/utils/secret.js';
import tools from './tools';
import {
	useWalletStore
} from '@/stores/modules/wallet.js'

const dbName = "norton"
const tableName = "wallet_balances"
export default {
	async createWalletBalance(address, token_address, chain_id) {
		let data = {
			chain_id: chain_id,
			token_address: token_address,
			address: address,
			balance: 0,
			price: 0,
			total: 0,
			created_at: tools.dateFormat('YYYY-mm-dd HH:MM:SS', new Date())
		}
		await dbUtils.addTabItem(dbName, tableName, data)
	},

	async getWalletBalanceItem(address, token_address, chain_id) {
		const list = await dbUtils.selectDataList(dbName, tableName, {
			address,
			token_address
			chain_id
		}, "id", "asc")

		if (list.length == 0) {
			await this.createWalletBalance(address, token_address, chain_id)
			return await getWalletBalanceItem(address, token_address, chain_id)
		}
		return list[0]
	},

	//根据区块网络获取钱包列表
	async getBalance(address, token_address, chain_id) {
		// #ifdef H5
		return 0;
		// #endif

		let item = await this.getWalletBalanceItem(address, token_address, chain_id)
		return item.balance;

	}
}