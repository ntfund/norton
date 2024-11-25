enum C2COrderType {
	Success = 0, //成功
	New = 1, //新订单
	Paid = 2, //已支付
	Cancel = 3, //已取消
	Timeout = 4, //超时已取消
	Disputed = 5, //争议
	Resolved = 6 //争议已处理
}

export { C2COrderType };