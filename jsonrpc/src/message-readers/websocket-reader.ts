import { PartialMessageInfo } from './message-info';
import { DataCallback } from './data-callback';
import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import { AbstractMessageReader } from './abstract-reader';
import { MessageReader } from './message-reader';
import * as SocketIOClient from 'socket.io-client';

export class WebSocketMessageReader extends AbstractMessageReader implements MessageReader {
	private socket: SocketIOClient.Socket;

	public constructor(socket: SocketIOClient.Socket) {
		super();
		this.socket = socket;

		this.attachHandlers();
	}

	private attachHandlers() {
		if (!this.socket) {
			return;
		}

		let errorHandler = (error:any) => this.fireError(error);
		let closeHandler = () => this.fireClose();

		this.socket.on('error', errorHandler);
		this.socket.on('close', closeHandler);
		this.socket.on('disconnect', errorHandler);
		this.socket.on('connect_error', errorHandler);
		this.socket.on('connect_timeout', errorHandler);
	}

	public listen(callback: DataCallback): void {
		if (!this.socket) {
			return;
		}

		this.socket.on('message', callback);
	}
}