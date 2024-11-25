import tokenData from "@/data/tokenData";
import {
	ethers, Contract
} from "ethers";
import {
	ref
} from "vue";
import useProvider from "@/hooks/ehters/useProvider.js";

export default {
	async getEthBalance(account, Rpc) {
		console.log('getEthBalance', account, Rpc)
		let provider = useProvider(Rpc);
		const balance = await provider.getBalance(account)
		return parseFloat(ethers.formatEther(balance));
	},
	async getBalance(account, tokenAddress, Rpc) {
		if (tokenAddress == null) {
			return this.getEthBalance(account, Rpc);
		}
		let provider = useProvider(Rpc);
		const token = new ethers.Contract(tokenAddress, tokenData.abi, provider);
		const balance = await token.balanceOf(account).catch(errors => console.log(errors.message));
		return ethers.formatEther(balance);
	},
	async waitUntilEthereum() {
		return await new Promise((resolve, reject) => {
			let timeout = 0;
			let interval = setInterval(() => {
				let {
					ethereum
				} = window;
				if (typeof ethereum != "undefined") {
					resolve(ethereum)
					clearInterval(interval);
				}
				timeout += 200;
				if (timeout > 3000) {
					clearInterval(interval)
					reject("time out to get ethereum");
				}
			}, 200)
		});
	}
}