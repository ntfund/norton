import {
	bscscan, okxlink
} from '@/config/http.js'
import uniHelper from '@/utils/uniHelper';
import {
	TabTransfer
} from '@/enums/TabTransfer.ts';
import tools from './tools';

export default {
	handContractData(dataArr, typeIndex, myAddress) {
		let arr = [];
		for (let i = 0; i < dataArr.length; i++) {
			let transfer = dataArr[i];
			if (typeIndex == TabTransfer.In) {
				if (transfer.from.toLowerCase() == myAddress.toLowerCase())
				{
					continue;
				}
			} else if (typeIndex == TabTransfer.Out) {
				console.log('TabTransfer.Out', transfer.from.toLowerCase(), transfer.to.toLowerCase(), myAddress.toLowerCase())
				if (transfer.from.toLowerCase() != myAddress.toLowerCase())
				{
					continue;
				}
			}
			arr.push({
				height: transfer.height,
				block: transfer.blockHash,
				amount: transfer.amount,
				from: transfer.from,
				to: transfer.to,
				result: 1,
				time: transfer.transactionTime,
				hash: transfer.txId,
				decimals: 0,
				symbol: transfer.symbol,
				fee: transfer.gasUsed * transfer.gasPrice
			})
		}
		return arr;
	},
	handEthData(dataArr, typeIndex, myAddress) {
		console.log('handEthData', dataArr)
		let arr = [];
		for (let i = 0; i < dataArr.length; i++) {
			let transfer = dataArr[i];
			if (typeIndex == TabTransfer.In) {
				if (transfer.from.toLowerCase() == myAddress.toLowerCase())
				{
					continue;
				}
			} else if (typeIndex == TabTransfer.Out) {
				console.log('TabTransfer.Out', transfer.from.toLowerCase(), transfer.to.toLowerCase(), myAddress.toLowerCase())
				if (transfer.from.toLowerCase() != myAddress.toLowerCase())
				{
					continue;
				}
			}
			if (transfer.amount == "0")
			{
				continue;
			}
			arr.push({
				height: transfer.height,
				block: transfer.blockHash,
				amount: transfer.amount,
				from: transfer.from,
				to: transfer.to,
				result: 1,
				time: transfer.transactionTime,
				hash: transfer.txId,
				decimals: 0,
				symbol: transfer.transactionSymbol,
				fee: transfer.gasUsed * transfer.gasPrice
			})
		}

		return arr;
	},
	// API 文档地址 https://www.oklink.com/docs/zh/#explorer-api-general-address-query-address-token-transaction-list
	async handRequestContract(typeIndex, tokenAddress, myAddress) {
		let params = tools.httpBuild({
			chainShortName: "ETH",
			address: myAddress,
			protocolType: "token_20",
			tokenContractAddress: tokenAddress,
			limit: 100
		});
		console.log('handRequestContract params', params);
		
		let url = okxlink + '/api/v5/explorer/address/token-transaction-list?' + params
		
		let result = await uniHelper.okxRequestAsync(url);		
		console.log('handRequestContract okx', result);
		// dataList.value = tronHelper.handTronContractData(result)
		if (result && result.code == "0") {
			return this.handContractData(result.data[0]['transactionList'], typeIndex, myAddress)
		}
		return [];
	},
	// API 文档地址 https://www.oklink.com/docs/zh/#explorer-api-general-address-query-address-token-transaction-list
	async handRequestEth(typeIndex, myAddress) {
		let params = tools.httpBuild({
			chainShortName: "ETH",
			address: myAddress,
			limit: 100
		});
		let url = okxlink + '/api/v5/explorer/address/transaction-list?' + params

		let result = await uniHelper.okxRequestAsync(url);
		console.log('handRequestEth', result);
		if (result && result.code == "0") {
			return this.handEthData(result.data[0]['transactionLists'], typeIndex, myAddress)
		}
		return [];
	}
}