import {
	bscscan
} from '@/config/http.js'
import uniHelper from '@/utils/uniHelper';
import {
	TabTransfer
} from '@/enums/TabTransfer.ts';

export default {
	handContractData(dataArr, typeIndex, myAddress) {
		let arr = [];
		for (let i = 0; i < dataArr.length; i++) {
			let transfer = dataArr[i];			
			if (typeIndex == TabTransfer.In) {
				if (transfer.from.toLowerCase() == myAddress.toLowerCase()) {
					continue;
				}
			} else if (typeIndex == TabTransfer.Out) {
				console.log('TabTransfer.Out', transfer.from.toLowerCase(), transfer.to.toLowerCase(), myAddress
					.toLowerCase())
				if (transfer.from.toLowerCase() != myAddress.toLowerCase()) {
					continue;
				}
			}
			arr.push({
				block: transfer.blockNumber,
				amount: transfer.value,
				from: transfer.from,
				to: transfer.to,
				result: 1,
				time: transfer.timeStamp * 1000,
				hash: transfer.hash,
				decimals: transfer.tokenDecimal,
				symbol: transfer.tokenSymbol == 'BSC-USD' ? 'USDT' : transfer.tokenSymbol,
				fee: transfer.gasUsed * transfer.gasPrice
			})
		}
		return arr;
	},
	handEthData(dataArr, typeIndex, myAddress) {
		let arr = [];
		for (let i = 0; i < dataArr.length; i++) {
			let transfer = dataArr[i];
			if (typeIndex == TabTransfer.In) {
				if (transfer.from.toLowerCase() == myAddress.toLowerCase()) {
					continue;
				}
			} else if (typeIndex == TabTransfer.Out) {
				console.log('TabTransfer.Out', transfer.from.toLowerCase(), transfer.to.toLowerCase(), myAddress
					.toLowerCase())
				if (transfer.from.toLowerCase() != myAddress.toLowerCase()) {
					continue;
				}
			}
			if (transfer.value == 0) {
				continue;
			}
			arr.push({
				block: transfer.blockNumber,
				amount: transfer.value,
				from: transfer.from,
				to: transfer.to,
				result: transfer.txreceipt_status,
				time: transfer.timeStamp * 1000,
				hash: transfer.hash,
				decimals: 18,
				symbol: 'BNB',
				fee: transfer.gasUsed * transfer.gasPrice
			})
		}

		return arr;
	},
	async handRequestContract(typeIndex, tokenAddress, myAddress) {
		let url = bscscan + '/api?module=account&action=tokentx&contractaddress=' + tokenAddress +
			'&address=' + myAddress +
			'&page=1&offset=50&startblock=0&endblock=999999999&sort=desc&apikey=YourApiKeyToken';

		console.log('url', url)
		let result = await uniHelper.bnbRequestAsync(url);
		// console.log('handRequestContract', result);
		// dataList.value = tronHelper.handTronContractData(result)
		if (result && result.status == 1) {
			return this.handContractData(result.result, typeIndex, myAddress)
		}
		return [];
	},
	async handRequestEth(typeIndex, myAddress) {
		let url = bscscan + '/api?module=account&action=txlist&address=' + myAddress +
			'&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=YourApiKeyToken'

		console.log('url', url)
		let result = await uniHelper.bnbRequestAsync(url);
		// console.log('handRequestEth', result);
		if (result && result.status == 1) {
			return this.handEthData(result.result, typeIndex, myAddress)
		}
		return [];
	}
}