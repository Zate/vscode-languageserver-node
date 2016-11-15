import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import * as SocketIOClient from 'socket.io-client';

export interface WebSocketConnectionOptions {
	// possibly provide an option to spawn
	// the languageserver in websocket mode

	secure?: boolean,
	host?: string;
	port?: string;
	namespace?: string;
	path?: string;
}

export class WebSocketConnection {
	private socket: SocketIOClient.Socket;
	private options: WebSocketConnectionOptions;

	public constructor(options: WebSocketConnectionOptions) {
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
				resolve(this.socket);
			});

			this.socket.on('error', (err) => {
				reject(err);
			});
			this.socket.on('disconnect', (err) => {
				reject(err);
			});
			this.socket.on('connect_error', (err) => {
				reject(err);
			});
			this.socket.on('connect_timeout', (err) => {
				reject(err);
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
			autoConnect: false
		};
	}

	private addCallbacks() {
		this.socket.on('ping', (msgs) => {
			console.log('WebSocketMessageReader:ping - ', msgs);
		});
		this.socket.on('pong', (msgs) => {
			console.log('WebSocketMessageReader:pong - ', msgs);
		});
	}

	private getConnectUri() {
		// returns something like: 'ws://localhost:8080/jsonrpc'
		let { secure, host, port, namespace, path } = this.options;
		let protocol = secure ? 'wss' : 'ws';

		let uri = `${protocol}://${host}:${port}/`;
		return uri;
	}
}