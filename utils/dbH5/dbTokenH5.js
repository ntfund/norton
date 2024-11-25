// 使用内置SQLite数据库操作工具类
import tokenList from '@/data/tokenList'
export default {
	//根据区块网络获取钱包列表
	async getTokens(chain_id) {
		return tokenList.filter(item => item.chain_id == chain_id)
	},
	async getToken(address, chain_id) {
		return tokenList.filter(item => item.chain_id == chain_id && item.address == address)[0]
	},
	async getTokenBy(params) {
		return tokenList.filter(item => item.chain_id == params.chain_id && item.symbol == params.symbol)[0]
	}
}