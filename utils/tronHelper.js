export default {
	handTronContractData(data) {
		let arr = [];
		if (data) {
			for (let i = 0; i < data.token_transfers.length; i++) {
				let transfer = data.token_transfers[i];
				arr.push({
					block: transfer.block,
					amount: transfer.quant,
					from: transfer.from_address,
					to: transfer.to_address,
					result: transfer.confirmed,
					time: transfer.block_ts,
					hash: transfer.transaction_id,
					decimals: transfer.tokenInfo.tokenDecimal,
					symbol: transfer.tokenInfo.tokenAbbr
				})
			}
		}
		return arr;
	},
	handTronTrxData(data) {
		let arr = [];
		if (data) {
			for (let i = 0; i < data.data.length; i++) {
				let transfer = data.data[i];
				arr.push({
					block: transfer.block,
					amount: transfer.amount,
					from: transfer.transferFromAddress,
					to: transfer.transferToAddress,
					result: transfer.confirmed,
					time: transfer.timestamp,
					hash: transfer.transactionHash,
					decimals: transfer.tokenInfo.tokenDecimal,
					symbol: transfer.tokenInfo.tokenAbbr
				})
			}
		}

		return arr;
	},
}