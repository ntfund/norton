interface IHttpRequest<T>
{
	code: number,
	msg?: string,
	data: T[]
}

export {IHttpRequest};