interface IFixed {
	id: number,
	cycle : number,
	amount : number,
	status : number,
	created_at : string,
	updated_at : string,
	end_time : string,
	rate : number,
	profit : number,
	last_profit : number,
	subscribe : boolean,
	order : {
		order_number : string
	}
}
export {
	IFixed
}