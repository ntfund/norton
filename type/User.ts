interface IIdentity {
	nickname?: string,
	status?: number,
}
interface IUserInfo {
	user_id: number,
	current: number,
	fixed: number,
	deposit: number,
	team_deposit: number,
	total_profit: number,
	team_month_profit: number,
	team_total_profit: number,
	swap_amount: number,
	pending_profit: number,
	freeze: number,
	profit: number,
	team_profit: number,
	vip_profit: number,
}
interface IUser {
	id : number,
	uid: string,
	account : string,
	mobile : string,
	username : string,
	nickname : string,
	avatar : string,
	token : string,
	pid : number,
	yqm : string
	ip : string,
	team_total : number,
	vip : number,
	svip : number,
	real_vip : number,
	shop_level : number,
	is_cash : number,
	is_transfer : number,
	is_swap : number,
	is_buy : number,
	is_redeem : number,
	is_pending : number,
	valid_invite : number,
	status : number,
	created_at : string,
	updated_at : string,
	api_time : string | null,
	balance ?: number,
	deposit ?: number,
	floatAmount ?: number,
	fixedAmount ?: number,
	team_deposit ?: number,
	identity?: IIdentity
	info?: IUserInfo
}
class User implements IUser {
	id : number
	uid: string
	account : string
	mobile : string
	username : string
	nickname : string
	avatar : string
	token : string
	pid : number
	yqm : string
	ip : string
	team_total : number
	vip : number
	svip : number
	real_vip : number
	shop_level : number
	is_cash : number
	is_transfer : number
	is_swap : number
	is_buy : number
	is_redeem : number
	is_pending : number
	valid_invite : number
	status : number
	created_at : string
	updated_at : string
	api_time : string | null
	balance ?: number
	deposit ?: number
	floatAmount ?: number
	fixedAmount ?: number
	team_deposit ?: number
	identity?: IIdentity
	info?: IUserInfo
}

export { User, IUser, IUserInfo };