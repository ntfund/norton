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
const tableName = "wallets"
export default {
	//获取链symbol
	getChainSymbol(chain_id) {
		for (var i = 0; i < chainList.length; i++) {
			if (chainList[i].id == chain_id) {
				return chainList[i].symbol;
			}
		}
		return 'NONE'
	},
	//获取链
	getChain(chain_id) {
		for (var i = 0; i < chainList.length; i++) {
			if (chainList[i].id == chain_id) {
				return chainList[i];
			}
		}
		return {}
	},
	//获取创建钱包时的名称
	async getWalletName(chain_id) {
		// #ifdef H5
		return dbWalletH5.getWalletName(chain_id);
		// #endif
		const list = await dbUtils.selectDataList(dbName, tableName, {
			chain_id
		}, "id", "desc")
		const symbol = this.getChainSymbol(chain_id);
		return symbol + '-' + (list.length + 1);
	},
	//根据区块网络获取钱包列表
	async getWallets(chain_id, orderby = "asc") {		
		// #ifdef H5
		return dbWalletH5.getWallets(chain_id);
		// #endif
		return await dbUtils.selectDataList(dbName, tableName, {
			"chain_id": chain_id
		}, "id", orderby)
	},
	//根据区块网络获取 默认钱包 选中的钱包
	async getDefaultWallet(chain_id) {
		// #ifdef H5
		return dbWalletH5.getDefaultWallet(chain_id);
		// #endif
		const list = await dbUtils.selectDataList(dbName, tableName, {
			'selected': 1,
			"chain_id": chain_id
		}, "id", "asc")
		if (list.length > 0) {
			return list[0];
		}

		return null;
	},
	//根据区块网络获取 默认钱包 选中的钱包
	async getWallet(address, chain_id) {
		// #ifdef H5
		return dbWalletH5.getWallet(chain_id);
		// #endif
		const list = await dbUtils.selectDataList(dbName, tableName, {
			'address': address,
			"chain_id": chain_id
		}, "id", "asc")
				
		if (list.length > 0) {
			return list[0];
		}

		return null;
	},
	//根据区块网络获取 默认钱包 选中的钱包
	async getAnyWallet(chain_id) {
		// #ifdef H5
		return null;
		// #endif
		const list = await dbUtils.selectDataList(dbName, tableName, {
			"chain_id": chain_id
		}, "id", "asc")
				
		if (list.length > 0) {
			return list[0];
		}
	
		return null;
	},
	//根据区块网络获取 默认钱包 选中的钱包
	async exists(address, chain_id) {
		// #ifdef H5
		return false;
		// #endif
		return await this.getWallet(address, chain_id) != null;
	},	
	//钱包选择
	async selectWallet(wallet, chain_id) {
		//设置默认链
		const walletStore = useWalletStore();
		walletStore.setChainById(chain_id);
		walletStore.setWallet(wallet)
		// #ifdef H5
		return;
		// #endif
		await dbUtils.updateSQL(dbName, tableName, {'selected': 0});
		await dbUtils.updateSQL(dbName, tableName, {'selected': 1}, {address: wallet.address, chain_id});
	},
	//创建钱包
	async createWallet(wallet, chain_id) {
		
		// #ifdef H5
		return;
		// #endif
		
		let data = {
			chain_id: chain_id,
			name: wallet.name,
			address: wallet.address,
			mnemonic: wallet.mnemonic ? secret.encrypt(wallet.mnemonic) : null,
			private_key: secret.encrypt(wallet.privateKey),
			keystore: wallet.keystore ? secret.encrypt(wallet.keystore) : null,
			keystore_password: wallet.keystore_password ? secret.encrypt(wallet.keystore_password) : null,
			selected: 1,
			created_at: tools.dateFormat('YYYY-mm-dd HH:MM:SS', new Date())
		}
		await dbUtils.addTabItem(dbName, tableName, data)
		await this.selectWallet(data, chain_id)
						
		//设置默认钱包和链
		// const wallets = await this.getWallets(chain_id, 'desc');
		// await this.selectWallet(wallets[0], chain_id)
		
	},
	//修改名称
	async updateWalletName(name, address, chain_id) {
		// #ifdef H5
		return;
		// #endif
		await dbUtils.updateSQL(dbName, tableName, {name}, {address, chain_id});
	},
	//删除钱包
	async deleteWallet(address, chain_id) {
		// #ifdef H5
		return;
		// #endif
		let oldWallet = await this.getWallet(address, chain_id);
		await dbUtils.delData(dbName, tableName, {address, chain_id});
		
		if (oldWallet.selected == 1) {
			//删除了默认钱包， 设置其他钱包为默认
			let newWalletList = await this.getWallets(chain_id, "desc");
			let newWallet = newWalletList[0];
			await this.selectWallet(newWallet, chain_id)
		}		
	},
	//同步钱包
	async syncWallet(from_chain_id, to_chain_id) {
		// #ifdef H5
		return;
		// #endif
		//设置默认链
		// const walletStore = useWalletStore();
		// walletStore.setChainById(to_chain_id);
		
		let wallets = await this.getWallets(from_chain_id);
		for (let wallet of wallets) {
			console.log('wallet', wallet)
			const exists = await this.exists(wallet.address, to_chain_id)
			if (!exists) {			
				// await dbUtils.addTabItem(dbName, tableName, {
				// 	chain_id: to_chain_id,
				// 	name: wallet.name,
				// 	address: wallet.address,
				// 	mnemonic: wallet.mnemonic,
				// 	private_key: wallet.private_key,
				// 	keystore: wallet.keystore,
				// 	keystore_password: wallet.keystore_password,
				// 	selected: 0,
				// 	created_at: tools.dateFormat('YYYY-mm-dd HH:MM:SS', new Date())
				// })
				delete wallet.id;
				wallet.chain_id = to_chain_id;
				wallet.selected = 0;
				wallet.created_at = tools.dateFormat('YYYY-mm-dd HH:MM:SS', new Date());
				await  dbUtils.addTabItem(dbName, tableName, wallet)
			}
		}
	}
}