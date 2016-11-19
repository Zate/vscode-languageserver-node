import { AbstractMessageWriter } from './abstract-writer';
import { MessageWriter } from './message-writer';
import { Message } from '../messages';
import * as WebSocket from 'ws';

export class WebSocketMessageWriter extends AbstractMessageWriter implements MessageWriter {
	private errorCount: number = 0;
	private socket: WebSocket;

	public constructor(socket: WebSocket) {
		super();
		this.socket = socket;
	}

	public write(msg: Message): void {
		let json: string = JSON.stringify(msg);
		let data = this.toRpc(json);
		let options = {
			mask: true,
			binary: false
		};

		this.socket.send(data);
	}

	private toRpc(json: string) {
		const CONTENT_LENGTH: string = 'Content-Length: ';
		const CRLF = '\r\n';
		let encoding = 'utf-8';

		let contentLength = Buffer.byteLength(json, encoding);
		let contents: string[] = [
			CONTENT_LENGTH, contentLength.toString(), CRLF, CRLF,
			json
		];

		let rpc: string = contents.join('');
		return rpc;
	}

	private doSend(msg: Message) {
		let json: string = JSON.stringify(msg);
		let data = this.toRpc(json);
		let options = {
			mask: true,
			binary: false
		};

		this.socket.send(data);
	}
}