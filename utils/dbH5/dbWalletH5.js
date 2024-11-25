import secret from '@/utils/secret.js';
import chainList from '@/data/chainData';


//0x0F3b4922d66D1fe00AF952752418aa204Bd5CAFC
let defaultAccount2 = {
	name: 'BNB-2',
	address: '0x540CF7efb53c46B9FD355C85e8753dc884aB63d7',
	mnemonic: secret.encrypt('because before energy decrease input pride employ worry laugh small media minute'),
	private_key: secret.encrypt('0xcc39b5cdc4b736c96e13b7272880614e2fb803fac3752351632a23b45f837617'),
	chain_id: 3,
	selected: 0
}
let defaultAccount3 = {
	name: 'BNB-3',
	address: '0x0F3b4922d66D1fe00AF952752418aa204Bd5CAFC',
	mnemonic: secret.encrypt('hazard fever pluck grab solar blue dentist across actual load interest profit'),
	private_key: secret.encrypt('0x85c8109976e3e37293f11fa0ba7bde0bdfc5f7fcbdade95a3d8086b150a934aa'),
	chain_id: 3,
	selected: 0
}
let defaultAccount4 = {
	name: 'BNB-4',
	address: "0x9B89f877Cc3C250832FB41AD4Ae7652D5E83c45B",
	mnemonic: secret.encrypt("eagle still bike depth daughter breeze fine siege fish border share save"),
	private_key: secret.encrypt("0x45df08b4ad05f618ff2689865c7a4a225ff180a77877311be98e6982366c41c8"),
	chain_id: 3,
	selected: 1
}

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
	getWalletName(chain_id) {
		const symbol = this.getChainSymbol(chain_id);
		return symbol + '-' + 1;
	},
	//根据区块网络获取钱包列表
	getWallets(chain_id) {
		defaultAccount2.chain_id = chain_id;
		defaultAccount3.chain_id = chain_id;
		defaultAccount4.chain_id = chain_id;
		return [defaultAccount2, defaultAccount3, defaultAccount4]
	},
	getDefaultWallet(chain_id) {
		defaultAccount4.chain_id = chain_id
		return defaultAccount4;
	},
	getWallet(chain_id) {
		defaultAccount4.chain_id = chain_id;
		return defaultAccount;
	}
}