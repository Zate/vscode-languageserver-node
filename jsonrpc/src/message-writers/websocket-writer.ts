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

		let errorHandler = (error:any) => {
			debugger;
			this.fireError(error);
		};
		let closeHandler = () => {
			debugger;
			this.fireClose();
		};

		this.errorCount = 0;
		this.socket.on('error', errorHandler);
		this.socket.on('close', closeHandler);
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