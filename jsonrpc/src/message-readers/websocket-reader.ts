import { PartialMessageInfo } from './message-info';
import { DataCallback } from './data-callback';
import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import { AbstractMessageReader } from './abstract-reader';
import { MessageReader } from './message-reader';
import { Message } from '../messages';
import * as WebSocket from 'ws';

export class WebSocketMessageReader extends AbstractMessageReader implements MessageReader {
	private ws: WebSocket;
	private callback: DataCallback;

	public constructor(ws: WebSocket) {
		super();
		this.ws = ws;
		this.attachHandlers();
	}

	public listen(callback: DataCallback): void {
		this.callback = callback;

		if (this.ws) {
			this.ws.on('message', (data: any, flags: { binary: boolean }) => {
				let msg: Message = JSON.parse(data);
				callback(msg);
			});
		}
	}

	private attachHandlers() {
		let errorHandler = this.createErrorHandler();
		let closeHandler = this.createCloseHandler();

		this.ws.on('error', errorHandler);
		this.ws.on('close', closeHandler);
	}

	private createErrorHandler() {
		return (err: any): void => {
			this.fireError(err);
		};
	}

	private createCloseHandler() {
		return (): void => {
			this.fireClose();
		};
	}
}