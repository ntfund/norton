import tools from "./tools"

export default {
	async uniRquestAsync(url, headers = {}) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: url,
				header: headers,
				success: (res) => {
					resolve(res.data)
				},
				fail: error => {
					reject(error)
				}
			})
		})
	},
	async bnbRequestAsync(url)
	{
		let result = await this.uniRquestAsync(url);
		if (result && result.status == 1) {
			return result;
		}
		await tools.sleep(1000);
		return await this.uniRquestAsync(url);
	},
	//f2bdaf8e-371e-49e1-a6e9-556f105a1680
	async okxRequestAsync(url)
	{
		const headers = {'Ok-Access-Key': 'f2bdaf8e-371e-49e1-a6e9-556f105a1680'}
		let result = await this.uniRquestAsync(url, headers);
		if (result && result.code == "0") {
			return result;
		}
		await tools.sleep(1000);
		return await this.uniRquestAsync(url, headers);
	},
}