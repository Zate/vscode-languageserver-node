import { WebSocketMessageReader } from './websocket-reader';
import { WebSocketMessageWriter } from './websocket-writer';
export { WebSocketMessageReader, WebSocketMessageWriter };
import * as WebSocket from 'ws';

export interface WebSocketConnectionOptions {
	secure?: boolean;
	host?: string;
	port?: string;
	namespace?: string;
	path?: string;
}

export class WebSocketConnection {
	private socket: WebSocket;
	public readonly connection: Promise<WebSocket>;

	// public constructor(private options: WebSocketConnectionOptions) {
	private constructor() {
		this.connection = new Promise((resolve, reject) => {
			let onOpenError = (err: Error) => {
				reject(err);
			};

			try {
				let uri = 'ws://localhost:4389/';
				this.socket = new WebSocket(uri);

				this.socket.on('open', () => {
					resolve(this.socket);
				});

				this.socket.on('error', (err: Error) => {
					onOpenError(err);
				});
				this.socket.on('close', (code: number, message: string) => {
					let err = new Error(`${code}: ${message}`);
					onOpenError(err);
				});
			} catch (err) {
				onOpenError(err);
			}
		});
	}

	public static create(): Promise<{ reader: WebSocketMessageReader, writer: WebSocketMessageWriter }> {
		// let options: WebSocketConnectionOptions = {
		//     secure: false,
		//     host: 'localhost',
		//     port: '4389'
		// };
		// let ws = new WebSocketConnection(options);
		let ws = new WebSocketConnection();

		return ws.connection.then((socket: WebSocket) => {
			let reader = new WebSocketMessageReader(socket);
			let writer = new WebSocketMessageWriter(socket);

			return {
				reader,
				writer
			};
		});
	}
}