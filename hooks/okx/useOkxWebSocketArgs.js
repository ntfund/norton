import useOkxWebSocket from "./useOkxWebSocket";
import {
	wsOkxPublic
} from '@/config/http.js'

export default function(args, callback, url = wsOkxPublic) {
	let params = null;
	if (args) {
		params = {
			op: 'subscribe',
			args: args
		}
	}
	return useOkxWebSocket(params, callback, url)
}