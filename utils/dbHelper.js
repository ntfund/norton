// 使用内置SQLite数据库操作工具类
import dbUtils from '@/uni_modules/zjy-sqlite-manage/components/zjy-sqlite-manage/dbUtils.js'
const dbName = "norton"
export default {
	async openDb() {
		// #ifdef H5
		return;
		// #endif
		await dbUtils.openDb(dbName);
	},
	async initTables() {
		// #ifdef H5
		return;
		// #endif
		await dbUtils.init(dbName, [{
				tableName: 'wallets',
				sql: [
					`CREATE TABLE "wallets" (
					  id INTEGER PRIMARY KEY AUTOINCREMENT, --id
					  chain_id INTEGER NOT NULL, --钱包链路
					  address TEXT NOT NULL, --钱包账户
					  name TEXT NOT NULL, --钱包名称
					  mnemonic TEXT DEFAULT NULL, --助记词
					  private_key TEXT DEFAULT NULL, --私钥
					  keystore TEXT DEFAULT NULL, --keystore
					  keystore_password TEXT DEFAULT NULL, --keystore密码
					  balance REAL DEFAULT 0, --余额
					  selected INTEGER DEFAULT 0, --是否当前
					  created_at TEXT, --创建时间
					  owner REAL DEFAULT 1, --拥有者
					  UNIQUE(chain_id,address)
					);`,
					`create index wallet_chain_id_index on wallets(chain_id);`
				]
			},
			{
				tableName: 'settings',
				sql: [
					`CREATE TABLE "settings" (
					  id INTEGER PRIMARY KEY AUTOINCREMENT, --id
					  pair_key TEXT NOT NULL UNIQUE, --钱包账户
					  pair_value TEXT DEFAULT NULL --钱包名称
					);`,
					`INSERT INTO settings (pair_key,pair_value) VALUES (
					  'password',
					  NULL
					);`,
					`INSERT INTO settings (pair_key,pair_value) VALUES (
					  'password_tip',
					  NULL
					);`,
					`INSERT INTO settings (pair_key,pair_value) VALUES (
					  'facial',
					  '0'
					);`,
					`INSERT INTO settings (pair_key,pair_value) VALUES (
					  'fingerPrint',
					  '0'
					);`
				]
			},
			{
				tableName: 'chains',
				sql: [
					`CREATE TABLE "chains" (
					  id INTEGER PRIMARY KEY AUTOINCREMENT, --id
					  name TEXT NOT NULL, --名称
					  symbol TEXT, --代币符号
					  img TEXT, --选中图标
					  img2 TEXT, --默认图标
					  rpc TEXT, --rpx
					  type TEXT, --类型
					  tag TEXT, --标记
					  chain_id TEXT, --链ID
					  scan TEXT, --浏览器地址
					  fee REAL DEFAULT 0 --申购手续费
					);`
				]
			},
			{
				tableName: 'tokens',
				sql: [
					`CREATE TABLE "tokens" (
					  id INTEGER PRIMARY KEY AUTOINCREMENT, --id
					  name TEXT, --名称
					  symbol TEXT, --代币符号
					  icon TEXT, --图标
					  address TEXT, --代币地址
					  decimals REAL DEFAULT 18, --精度
					  balance REAL DEFAULT 0, --余额[废弃]
					  price REAL DEFAULT 1, --代币U单价
					  total REAL DEFAULT 1, --代币U总价[废弃]
					  fee REAL DEFAULT 0, --代币转账手续费
					  digits REAL DEFAULT 6, --小数保留位
					  chain_id REAL DEFAULT 0 --链ID
					);`,
					`create index token_chain_id_index on tokens(chain_id);`,
					`INSERT INTO tokens (name,symbol,icon,address,decimals,chain_id) VALUES (
					  'NRT',
					  'NRT',
					  '/static/img/chain/nrt-on.png',
					  '',
					  18,
					  1
					);`,
					`INSERT INTO tokens (name,symbol,icon,address,decimals,chain_id) VALUES (
					  'USDT',
					  'USDT',
					  '/static/images/token/usdt.png',
					  '',
					  18,
					  1
					);`,
					`INSERT INTO tokens (name,symbol,icon,address,decimals,chain_id) VALUES (
					  'ETH',
					  'ETH',
					  '/static/images/token/eth.png',
					  '',
					  18,
					  2
					);`,
					`INSERT INTO tokens (name,symbol,icon,address,decimals,chain_id) VALUES (
					  'USDT',
					  'USDT',
					  '/static/images/token/usdt.png',
					  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
					  6,
					  2
					);`,
					`INSERT INTO tokens (name,symbol,icon,address,decimals,chain_id) VALUES (
					  'BNB',
					  'BNB',
					  '/static/images/token/bnb.png',
					  '',
					  18,
					  3
					);`,
					`INSERT INTO tokens (name,symbol,icon,address,decimals,chain_id) VALUES (
					  'USDT',
					  'USDT',
					  '/static/images/token/usdt.png',
					  '0x55d398326f99059fF775485246999027B3197955',
					  18,
					  3
					);`,
					`INSERT INTO tokens (name,symbol,icon,address,decimals,chain_id) VALUES (
					  'Matic',
					  'Matic',
					  '/static/images/token/matic.png',
					  '',
					  18,
					  4
					);`,
					`INSERT INTO tokens (name,symbol,icon,address,decimals,chain_id) VALUES (
					  'USDT',
					  'USDT',
					  '/static/images/token/usdt.png',
					  '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
					  6,
					  4
					);`,
					`INSERT INTO tokens (name,symbol,icon,address,decimals,chain_id) VALUES (
					  'OKTC',
					  'OKTC',
					  '/static/images/token/okx.png',
					  '',
					  18,
					  5
					);`,
					`INSERT INTO tokens (name,symbol,icon,address,decimals,chain_id) VALUES (
					  'USDT',
					  'USDT',
					  '/static/images/token/usdt.png',
					  '0x382bB369d343125BfB2117af9c149795C6C65C50',
					  18,
					  5
					);`,
					`INSERT INTO tokens (name,symbol,icon,address,decimals,chain_id) VALUES (
					  'TRX',
					  'TRX',
					  '/static/images/token/trx.png',
					  '',
					  6,
					  6
					);`,
					`INSERT INTO tokens (name,symbol,icon,address,decimals,chain_id) VALUES (
					  'USDT',
					  'USDT',
					  '/static/images/token/usdt.png',
					  'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
					  6,
					  6
					);`
				]
			},
			{
				tableName: 'wallet_balances',
				sql: [
					`CREATE TABLE "wallet_balances" (
						  id INTEGER PRIMARY KEY AUTOINCREMENT, --id
						  chain_id INTEGER NOT NULL, --钱包网络
						  address TEXT NOT NULL, --钱包账户
						  token_address TEXT, --代币地址
						  balance REAL DEFAULT 0, --余额
						  price REAL DEFAULT 0, --代币U单价
						  total REAL DEFAULT 0, --代币U总价
						  created_at TEXT, --创建时间
						  UNIQUE(chain_id,address,token_address)
						);`,
					`create index balances_chain_id_index on wallet_balances(chain_id);`,
					`create index balances_address_index on wallet_balances(address);`,
					`create index balances_token_address_index on wallet_balances(chain_id);`,
				]
			}
		]);
	}
}