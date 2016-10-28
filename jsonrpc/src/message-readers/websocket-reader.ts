import { PartialMessageInfo } from './message-info';
import { DataCallback } from './data-callback';
import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import { AbstractMessageReader } from './abstract-reader';
import { MessageReader } from './message-reader';

import * as SocketIOClient from 'socket.io-client';

export class WebSocketMessageReader extends AbstractMessageReader implements MessageReader {

	private socket: SocketIOClient.Socket;
	public constructor(process: NodeJS.Process | ChildProcess) {
		super();
		this._initConnection();
	}

	public listen(callback: DataCallback): void {
		// this.process.on('message', callback);
	}

	private _getConnectionOpts(): SocketIOClient.ConnectOpts {
		return {
			transports: ['websocket'],
			upgrade: false
		};
	}

	private _initConnection() {
		let opts = this._getConnectionOpts();
		this.socket = SocketIOClient.connect('ws://localhost:8080/jsonrpc', opts);

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

		this.socket.on('connect', () => {
			console.log('client connected');

			let jsonrpc_message = messages_samples[0];
			this.socket.emit('jsonrpc', jsonrpc_message, (reply) => {
				console.log('emit:jsonrpc - reply - ', reply);
			});
		});
	}
}
