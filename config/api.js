// const http = uni.$u.http

// post请求，获取菜单
import { useAppStore } from '../stores/modules/app';
import {
	restOkx,
	baseURL
} from '@/config/http.js'

export const getFullPath = (path) => uni.$u.http.config.baseURL + path;

export const postMenu = (params, config = {}) => uni.$u.http.post('/ebapi/public_api/index', params, config)

// get请求，获取菜单，注意：get请求的配置等，都在第二个参数中，详见前面解释
export const getMenu = (data) => uni.$u.http.get('/ebapi/public_api/index', data)

export const getVersion = () => uni.$u.http.get('/version')
export const getApiList = () => uni.$u.http.get('/userApi')
export const deleteUserApi = (id) => uni.$u.http.delete('/userApi/' + id)
export const getUserInfo = () => uni.$u.http.get('/user/info')
export const getServer = () => uni.$u.http.get('/chat/user/server')
export const getUserBaseInfo = (user_id) => uni.$u.http.get('/user/base/' + user_id)
export const getUserData = () => uni.$u.http.get('/user/getData')
export const getUserTeam = (page, pageSize = 6) => uni.$u.http.get('/user/getMyTeam', {
	params: {
		page,
		pageSize
	}
})
export const getBillList = (params, page, pageSize = 10) => uni.$u.http.get('/bill', {
	params: {
		...params,
		page,
		pageSize
	}
})
export const getNewFriendList = (page, pageSize = 10, search = '') => uni.$u.http.get('/chat/newFriend', {
	params: {
		page,
		pageSize,
		search
	}
})

export const getNewFriendCount = () => uni.$u.http.get('/chat/newFriend/newRecords')

export const getRoomVerifyList = (room_id, page, pageSize = 10) => uni.$u.http.get('/chat/chatRoomVerify', {
	params: {
		room_id,
		page,
		pageSize
	}
})

export const acceptFriend = (item) => {
	item.status = 2;
	uni.$u.http.put('/chat/newFriend/' + item.id, {
		status: 2
	}).then(data => {
		const appStore = useAppStore();
		appStore.decreaseNewFriendRecords();
		uni.showToast({
			title: "已通过对方好友申请",
			icon: 'none'
		});
	})
}




export const getContentList = (nav_id = 5, page, pageSize = 15) => uni.$u.http.get('/content', {
	params: {
		page,
		pageSize,
		nav_id
	}
})
export const getMarketList = () => uni.$u.http.get('/market')



export const getOkxCandles = (instId = 'BTC-USD', bar = "1D") => {
	const http = uni.$u.http;

	const params = {
		params: {
			instId: instId,
			bar: bar,
			limit: 200
		},
		custom: {
			baseURL: restOkx,
			noPrefix: true,
			catch: false
		}
	}

	return http.get('/api/v5/market/candles', params)
	// return http.get('https://aws.okx.com/api/v5/market/index-candles', params)
	// return http.get('https://aws.okx.com/api/v5/market/history-index-candles', params)
}

export const getOkxTrades = (instId = 'BTC-USD', limit = 100) => {
	const http = uni.$u.http;

	const params = {
		params: {
			instId: instId,
			limit: limit
		},
		custom: {
			baseURL: restOkx,
			noPrefix: true,
			catch: false
		}
	}
	return http.get('/api/v5/market/trades', params)
	// return http.get('https://aws.okx.com/api/v5/market/index-candles', params)
	// return http.get('https://aws.okx.com/api/v5/market/history-index-candles', params)
}

export const getUsdtPrice = () => uni.$u.http.get('/setting/getUsdtPrice')
export const getChainList = () => uni.$u.http.get('/chain')
export const getPaymentList = () => uni.$u.http.get('/userPayment')
export const getWalletListByChain = (chain_id) => uni.$u.http.get('/userWallet', {
	params: {
		chain_id
	}
})
export const getWalletBalance = (UserWalletId) => uni.$u.http.get('/userWallet/getBalance/' + UserWalletId)
export const getRoomInfo = (RoomId) => uni.$u.http.get('/chat/chatRoom/' + RoomId)
export const getMessageList = (page, pageSize = 10) => uni.$u.http.get('/chat/messageList', {
	params: {
		page,
		pageSize
	}
})

export const getMyGroupList = () => uni.$u.http.get('/chat/group')

export const getChatMessageList = (room_id, page, pageSize = 10) => uni.$u.http.get('/chat/message', {
	params: {
		room_id,
		page,
		pageSize
	}
})
export const getChatRoom = (id) => uni.$u.http.get('/chat/chatRoom/' + id)
export const updateChatRomAdmins = (roomId, admins) => uni.$u.http.put('/chat/chatRoom/' + roomId, {admins})
export const updateChatRom= (roomId, data) => uni.$u.http.put('/chat/chatRoom/' + roomId, data)
export const updateGroupInfo= (roomId, field, value) => uni.$u.http.put('/chat/chatRoom/setting/' + roomId, {field, value})

export const destoryChatMessage = (id, type = "me") => uni.$u.http.delete('/chat/message/' + id, {
	type
})

export const getFriendList = () => uni.$u.http.get('/chat/friend')
export const getFriendAll = () => uni.$u.http.get('/chat/friend/all')
export const getChainData = (chain_id) => uni.$u.http.get('/chain/' + chain_id)

export const getC2CList = (params) => uni.$u.http.get('/c2c', {
	params: params
})

export const getGoodList = (params) => uni.$u.http.get('/good', {
	params: params
})

export const getC2CShopOrderList = (params) => uni.$u.http.get('/c2cShop/orderList', {
	params: params
})

export const getUnreadCountList = () => uni.$u.http.get('/content/unreadTotal')

export const getC2cOrderInfo = () => uni.$u.http.get('/c2cOrder/info')

export const addOrder = (data) => uni.$u.http.post('/order', data)

export const getPendingCount = () => uni.$u.http.get('/order/pending')

export const homeRequest = (url) => {
	let params = {
		custom: {
			baseURL: baseURL, //域名前缀更换
			noPrefix: true,
			catch: true
		}
	}
	return uni.$u.http.get(url, params)
}

export const getWithdrawTokens = () => uni.$u.http.get('/token/getWithdrawTokens')