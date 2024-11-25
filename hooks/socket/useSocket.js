import tools from "@/utils/tools";
import {
	socketUrl
} from "@/config/http.js";

export default function(options, url = socketUrl) {
	let socketOpen = false;
	let socketMsgQueue = [];
	let socketTask;
	const sendSocketMessage = (msg) => {
		if (!msg) return;
		if (socketOpen) {
			socketTask.send({
				data: msg
			});
		} else {
			socketMsgQueue.push(msg);
		}
	}
	//申请一个WebSocket对象，参数是服务端地址，同http协议使用http://开头一样，WebSocket协议的url使用ws://开头，另外安全的WebSocket协议使用wss://开头
	const webConnect = () => {
		console.log("Socket connect");
		// if (params) {
		// 	socketMsgQueue.push(JSON.stringify(params))
		// }

	};

	socketTask = uni.connectSocket({
		// url: 'wss://norton.im/wss',
		url,
		header: {
			'content-type': 'application/json'
		},
		// protocols: ['protocol1'],
		// method: 'GET',
		success: () => {
			console.log("Socket connect success");
		},
		complete: () => {
			if (options.complete) {
				options.complete();
			}
		}
	});

	socketTask.onOpen(() => {
		//当WebSocket创建成功时，触发onopen事件
		console.log("Socket open");
		socketOpen = true;
		for (var i = 0; i < socketMsgQueue.length; i++) {
			sendSocketMessage(socketMsgQueue[i]);
		}
		if (options.onOpen) {
			options.onOpen(sendSocketMessage);
		}
		socketMsgQueue = [];
	})


	socketTask.onMessage(function(message) {
		//当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
		// console.log(e.data);
		// console.log(message);
		if (message.data) {
			if (tools.isJSON(message.data)) {
				let dataJson = JSON.parse(message.data);
				// console.log(message.data)
				if (dataJson.type === 'ping') {
					// console.log('ping from server');
					sendSocketMessage(JSON.stringify({
						type: 'pong'
					}))
				} else {
					// callback(dataJson)
					if (options.onMessage) {
						options.onMessage(dataJson)
					}
				}
			}
		}
	})
	socketTask.onClose(e => {
		//当客户端收到服务端发送的关闭连接请求时，触发onclose事件
		console.log("socketTask close");

		// if (socketOpen) {
		// 	console.log('reconnect start')
		// 	setTimeout(() => {
		// 		webConnect();
		// 	}, 3000)
		// }
		if (options.onClosed) {
			options.onClosed(e)
		}

	})
	socketTask.onError(function(e) {
		//如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
		console.log(e);
	})

	return {
		sendSocketMessage,
		socketTask
	};
}