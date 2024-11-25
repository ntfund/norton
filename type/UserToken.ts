interface IUserToken {
	id : number,
	token_id : number,
	name ?: string,
	balance : number,
	freeze : number,
}

class UserToken implements IUserToken {
	id : number
	token_id : number
	name ?: string
	balance : number
	freeze : number
}

export {
	IUserToken,
	UserToken
}