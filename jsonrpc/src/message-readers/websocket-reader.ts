import { PartialMessageInfo } from './message-info';
import { DataCallback } from './data-callback';
import { AbstractMessageReader } from './abstract-reader';
import { MessageReader } from './message-reader';
import { Message } from '../messages';
import * as WebSocket from 'ws';
import * as _ from 'lodash';

let CRLF = '\r\n';
let SEPARATOR = `${CRLF}${CRLF}`;

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
		let self = this;
		this.socket.on('message', (data: any) => {
			// data:
			// "Content-Length: 207\r\nContent-Type: application/vscode-jsonrpc; charset=utf8\r\n\r\n{\"id\":0,\"result\":{\"capabilities\":{\"textDocumentSync\":1,\"hoverProvider\":true,\"definitionProvider\":true,\"referencesProvider\":true,\"documentSymbolProvider\":true,\"workspaceSymbolProvider\":true}},\"jsonrpc\":\"2.0\"}"

			if (!self.callback) {
				return;
			}
			if (data.length === 0) {
				return;
			}

			self.onMessage(data);
		});
	}

	private onMessage(data: any) {
		let response: string[] = data.split(SEPARATOR, 2);
		let headers = response[0];
		let json = response[1];

		// let msg: Message = JSON.parse(json);
		let msg = JSON.parse(json);
		this.callback(msg);
	}
}