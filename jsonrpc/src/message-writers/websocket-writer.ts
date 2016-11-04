import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import { AbstractMessageWriter } from './abstract-writer';
import { MessageWriter } from './message-writer';
import { Message } from '../messages';
import * as SocketIOClient from 'socket.io-client';

export class WebSocketMessageWriter extends AbstractMessageWriter implements MessageWriter {
	// private _process: NodeJS.Process | ChildProcess;
	private errorCount: number;
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

		this.errorCount = 0;
		this.socket.on('error', (error) => this.fireError(error));
		this.socket.on('close', () => this.fireClose);
	}

	public write(msg: Message): void {
		if (!this.socket) {
			return;
		}

		try {
			let event: string = '';
			let args: any[] = [msg];
			this.socket.emit(event, args);

			this.errorCount = 0;
		} catch (error) {
			this.errorCount++;
			this.fireError(error, msg, this.errorCount);
		}
	}
}