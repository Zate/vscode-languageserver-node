import { PartialMessageInfo } from './message-info';
import { DataCallback } from './data-callback';
import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import { AbstractMessageReader } from './abstract-reader';
import { MessageReader } from './message-reader';
import { Message } from '../messages';
import * as WebSocket from 'ws';

export class WebSocketMessageReader extends AbstractMessageReader implements MessageReader {
	private socket: WebSocket;
	private callback: DataCallback;

	public constructor(socket: WebSocket) {
		super();
		this.socket = socket;
		this.attachHandlers();
	}

	public listen(callback: DataCallback): void {
		this.callback = callback;
	}

	private attachHandlers() {
		this.socket.on('message', (data: any) => {
			if (!this.callback) {
				return;
			}

			let CRLF = '\r\n';
			let SEPARATOR = `${CRLF}${CRLF}`;

			let response: string[] = data.split(SEPARATOR, 2);
			let headers = response[0];
			let json = response[1];

			// let msg: Message = JSON.parse(json);
			let msg = JSON.parse(json);
			this.callback(msg);
		});
	}
}