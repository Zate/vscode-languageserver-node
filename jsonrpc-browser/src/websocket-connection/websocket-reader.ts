import {
	AbstractMessageReader, MessageReader,
	DataCallback,
	MessageBuffer,
	Message
} from 'vscode-jsonrpc-common';
import * as WebSocket from 'ws';

let CRLF = '\r\n';
let SEPARATOR = `${CRLF}${CRLF}`;

export class WebSocketMessageReader extends AbstractMessageReader implements MessageReader {
	private callback: DataCallback;

	public constructor(private socket: WebSocket) {
		super();
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
		// let headers = response[0];
		let json = response[1];

		let msg: Message = JSON.parse(json);
		// let msg = JSON.parse(json);
		this.callback(msg);
	}
}