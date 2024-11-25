interface IHuoqiData {
	id ?: number,
	rate ?: number,
	total ?: number,
	number ?: number,
	min ?: number,
	buyAmount ?: number,	
}
class HuoqiData implements IHuoqiData {
	id ?: number
	rate ?: number
	total ?: number
	number ?: number
	min ?: number
	buyAmount ?: number
}
export { HuoqiData, IHuoqiData };