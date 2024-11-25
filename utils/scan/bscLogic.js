import {
	bscscan, okxlink
} from '@/config/http.js'
import uniHelper from '@/utils/uniHelper';
import {
	TabTransfer
} from '@/enums/TabTransfer.ts';
import tools from '@/utils/tools.js';

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
				symbol: transfer.symbol,
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
				// console.log('TabTransfer.Out', transfer.from.toLowerCase(), transfer.to.toLowerCase(), myAddress.toLowerCase())
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
			})
		}

		return arr;
	},
	async handRequestContract(typeIndex, tokenAddress, myAddress) {
		let params = tools.httpBuild({
			chainShortName: "BSC",
			address: myAddress,
			protocolType: "token_20",
			tokenContractAddress: tokenAddress,
			limit: 100
		});
		console.log('handRequestContract params', params);
		
		//使用欧易提供的API
		let url = okxlink + '/api/v5/explorer/address/token-transaction-list?' + params
		

		let result = await uniHelper.okxRequestAsync(url);		
		console.log('handRequestContract okx', result);
		// dataList.value = tronHelper.handTronContractData(result)
		if (result && result.code == "0") {
			return this.handContractData(result.data[0]['transactionList'], typeIndex, myAddress)
		}
		return [];
	},
	async handRequestEth(typeIndex, myAddress) {
		let params = tools.httpBuild({
			chainShortName: "BSC",
			address: myAddress,
			limit: 100
		});
		//使用欧易提供的API
		let url = okxlink + '/api/v5/explorer/address/transaction-list?' + params

		let result = await uniHelper.okxRequestAsync(url);
		console.log('handRequestEth', result);
		if (result && result.code == "0") {
			return this.handEthData(result.data[0]['transactionLists'], typeIndex, myAddress)
		}
		return [];
	}
}