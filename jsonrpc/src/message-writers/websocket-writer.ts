import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import { AbstractMessageWriter } from './abstract-writer';
import { MessageWriter } from './message-writer';
import { Message } from '../messages';
import * as WebSocket from 'ws';

export class WebSocketMessageWriter extends AbstractMessageWriter implements MessageWriter {
	private errorCount: number;
	private ws: WebSocket;

	public constructor(ws: WebSocket) {
		super();
		this.ws = ws;
		this.attachHandlers();
	}

	public write(msg: Message): void {
		try {
			// let event: string = '';
			// let args: any[] = [msg];
			// this.socket.emit(event, args);

			this.ws.send(this.toRpc(msg));
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
		let contents: string[] = [
			CONTENT_LENGTH, contentLength.toString(), CRLF,
			CRLF,
			json
		];

		let rpc: string = contents.join('');
		return rpc;
	}

	private attachHandlers() {
		let errorHandler = this.createErrorHandler();
		let closeHandler = this.createCloseHandler();

		this.errorCount = 0;
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