import { PartialMessageInfo } from './message-info';
import { DataCallback } from './data-callback';
import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import { AbstractMessageReader } from './abstract-reader';
import { MessageReader } from './message-reader';
import { WebSocketOptions } from '../websocket-options';
import * as SocketIOClient from 'socket.io-client';

export class WebSocketMessageReader extends AbstractMessageReader implements MessageReader {
	private _socket: SocketIOClient.Socket;
	private _options: WebSocketOptions;
	private _callback: DataCallback;

	public constructor(options: WebSocketOptions) {
		super();
		this._options = options;
	}

	public listen(callback: DataCallback): void {
		debugger;

		this._callback = callback;
		if (this._callback) {
			this._initConnection();
		}
	}

	private _getConnectOpts(): SocketIOClient.ConnectOpts {
		return {
			transports: ['websocket'],
			upgrade: false,
			path: '/ws'
		};
	}

	private _initConnection() {
		let opts = this._getConnectOpts();
		let uri = this._getConnectUri();
		this._socket = SocketIOClient.connect(uri, opts);

		this._addCallbacks();
	}

	private _addCallbacks() {
		if (!this._socket) {
			return;
		}

		this._socket.on('connect', this._onConnect.bind(this));
		this._socket.on('disconnect', this._onDisconnect.bind(this));

		this._socket.on('connect_error', (msgs) => {
			this.fireError(msgs);
			console.log('WebSocketMessageReader:connect_error - ', msgs);
		});
		this._socket.on('connect_timeout', (msgs) => {
			this.fireError(msgs);
			console.log('WebSocketMessageReader:ping - ', msgs);
		});
		this._socket.on('ping', (msgs) => {
			this.fireError(msgs);
			console.log('WebSocketMessageReader:ping - ', msgs);
		});
		this._socket.on('pong', (msgs) => {
			this.fireError(msgs);
			console.log('WebSocketMessageReader:pong - ', msgs);
		});
	}

		// this.process.on('error', (error:any) => this.fireError(error));
		// this.process.on('close', () => this.fireClose());

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
		this._socket.emit('jsonrpc', jsonrpc_message, (reply) => {
			console.log('emit:jsonrpc - reply - ', reply);
		});
	}

	private _onDisconnect(msgs) {
		this.fireError(msgs);
		console.log('WebSocketMessageReader:_onDisconnect - ', msgs);
	}

	private _getConnectUri() {
		// returns something like: 'ws://localhost:8080/jsonrpc'
		let { secure, host, port, namespace, path } = this._options;
		let protocol = secure ? 'wss' : 'ws';

		// let uri = `${protocol}://${host}:${port}/${namespace}`;
		// return uri;

		let uri = `${protocol}://${host}:${port}`;
		return uri;
	}
}