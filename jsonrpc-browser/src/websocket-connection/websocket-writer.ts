import { AbstractMessageWriter, MessageWriter, Message } from 'vscode-jsonrpc-common';
import * as WebSocket from 'ws';

export class WebSocketMessageWriter extends AbstractMessageWriter implements MessageWriter {
	private errorCount: number = 0;

	public constructor(private socket: WebSocket) {
		super();
	}

	public write(msg: Message): void {
		let json: string = JSON.stringify(msg);
		let data = this.toRpc(json);
		let options = {
			mask: true,
			binary: false
		};

		try {
			this.socket.send(data, options, (err: Error) => {
				if (!err) {
					this.onSendError(err, msg);
				}
			});
		} catch (err) {
			this.onSendError(err, msg);
		}
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

	private onSendError(err, msg) {
		this.errorCount++;
		this.fireError(err, msg, this.errorCount);
	}
}