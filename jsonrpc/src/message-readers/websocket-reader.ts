import { PartialMessageInfo } from './message-info';
import { DataCallback } from './data-callback';
import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import { AbstractMessageReader } from './abstract-reader';
import { MessageReader } from './message-reader';
import * as SocketIOClient from 'socket.io-client';
import { Message } from '../messages';

export class WebSocketMessageReader extends AbstractMessageReader implements MessageReader {
	private socket: SocketIOClient.Socket;
	private callback: DataCallback;

	public constructor(socket: SocketIOClient.Socket) {
		super();
		this.socket = socket;
		this.attachHandlers();
	}

	public listen(callback: DataCallback): void {
		// store callback:
		// - connection happens as async callback?
		// - connection dies?
		this.callback = callback;
		if (this.socket) {
			this.socket.on('message', (msg) => {
				let data: Message = JSON.parse(msg);
				callback(data);
			});
		}
	}

	private attachHandlers() {
		if (!this.socket) {
			return;
		}
		let errorHandler = this.createErrorHandler();
		let closeHandler = this.createCloseHandler();

		this.socket.on('error', errorHandler);
		this.socket.on('close', closeHandler);
		this.socket.on('disconnect', errorHandler);
		this.socket.on('connect_error', errorHandler);
		this.socket.on('connect_timeout', errorHandler);
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