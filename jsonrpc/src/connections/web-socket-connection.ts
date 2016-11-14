import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import { WebSocketOptions } from '../websocket-options';
import * as SocketIOClient from 'socket.io-client';

export class WebSocketConnection {
	private socket: SocketIOClient.Socket;
	private options: WebSocketOptions;

	public constructor(options: WebSocketOptions) {
		this.options = options;
	}

	public listen(): Promise<SocketIOClient.Socket> {
		let opts = this.getConnectOpts();
		let uri = this.getConnectUri();
		this.socket = SocketIOClient.connect(uri, opts);
		this.addCallbacks();

		// resolve this.socket only when we've got a connection
		return new Promise((resolve, reject) => {
			this.socket.on('connect', (connect_args) => {
				return resolve(this.socket);
			});

			this.socket.on('error', (err) => {
				return reject(err);
			});
			this.socket.on('disconnect', (err) => {
				return reject(err);
			});
			this.socket.on('connect_error', (err) => {
				return reject(err);
			});
			this.socket.on('connect_timeout', (err) => {
				return reject(err);
			});

			this.socket.open();
			// this.socket.connect();
		});
	}

	private getConnectOpts(): SocketIOClient.ConnectOpts {
		return {
			transports: ['websocket'],
			upgrade: false,
			forceNew: true,
			autoConnect: false,
		};
	}

	private addCallbacks() {
		if (!this.socket) {
			return;
		}

		this.socket.on('ping', (msgs) => {
			console.log('WebSocketMessageReader:ping - ', msgs);
		});
		this.socket.on('pong', (msgs) => {
			console.log('WebSocketMessageReader:pong - ', msgs);
		});
	}

	private _onConnect(msgs) {
		console.log('WebSocketMessageReader:_onConnect - ', msgs);

		let messages_samples = [
			{
				'Content-Length': '',
				'body': {
					"jsonrpc": "2.0",
					"id": 1,
					"method": "textDocument/didOpen",
					"params": {

					}
				}
			}
		];

		console.log('client connected');

		let jsonrpc_message = messages_samples[0];
		this.socket.emit('jsonrpc', jsonrpc_message, (reply) => {
			console.log('emit:jsonrpc - reply - ', reply);
		});
	}

	private _onDisconnect(msgs) {
		console.log('WebSocketMessageReader:_onDisconnect - ', msgs);
	}

	private getConnectUri() {
		// returns something like: 'ws://localhost:8080/jsonrpc'
		let { secure, host, port, namespace, path } = this.options;
		let protocol = secure ? 'wss' : 'ws';

		let uri = `${protocol}://${host}:${port}/`;
		return uri;
	}
}