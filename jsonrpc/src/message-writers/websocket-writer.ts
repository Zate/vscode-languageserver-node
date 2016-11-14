import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import { AbstractMessageWriter } from './abstract-writer';
import { MessageWriter } from './message-writer';
import { Message } from '../messages';
import * as SocketIOClient from 'socket.io-client';

export class WebSocketMessageWriter extends AbstractMessageWriter implements MessageWriter {
	private errorCount: number;
	private socket: SocketIOClient.Socket;

	public constructor(socket: SocketIOClient.Socket) {
		super();
		this.socket = socket;
		this.attachHandlers();
	}

	public write(msg: Message): void {
		if (!this.socket) {
			return;
		}

		try {
			// let event: string = '';
			// let args: any[] = [msg];
			// this.socket.emit(event, args);

			this.socket.send(this.toRpc(msg));
			// this.errorCount = 0;
		} catch (error) {
			this.errorCount++;
			this.fireError(error, msg, this.errorCount);
		}
	}

	private toRpc(msg: Message) {
		const CONTENT_LENGTH: string = 'Content-Length: ';
		const CRLF = '\r\n';
		let encoding = 'utf-8';

		let json = JSON.stringify(msg);
		let contentLength = Buffer.byteLength(json, encoding);

		let rpc: string = ([
			CONTENT_LENGTH, contentLength.toString(), CRLF,
			CRLF,
			json
		]).join('');

		return rpc;
	}

	private attachHandlers() {
		if (!this.socket) {
			return;
		}

		let errorHandler = this.createErrorHandler();
		let closeHandler = this.createCloseHandler();

		this.errorCount = 0;
		this.socket.on('error', errorHandler);
		this.socket.on('close', closeHandler);
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