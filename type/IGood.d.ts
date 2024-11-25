interface IGood {
	id : number,
	name : string,
	level : string,
	cycle : number,
	rate : number,
	img : string,
	total : number,
	number : number,
	buyAmount : number,
	amount : number,
	min : number,
	address : string,
	auto_rate : number,
	status : number,
	end_time : string | null,
	min_buy_level : number,
	platform : number,
	payType: number
}

export {
	IGood
}