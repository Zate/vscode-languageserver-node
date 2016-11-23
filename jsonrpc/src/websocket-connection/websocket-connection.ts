import * as WebSocket from 'ws';

// rexport all
import { WebSocketMessageReader } from './websocket-reader';
import { WebSocketMessageWriter } from './websocket-writer';
export { WebSocketMessageReader, WebSocketMessageWriter };

export interface WebSocketConnectionOptions {
	secure?: boolean;
	host?: string;
	port?: string;
	namespace?: string;
	path?: string;
}

export class WebSocketConnection {
	private socket: WebSocket;
	public connection: Promise<WebSocket>;

	// public constructor(private options: WebSocketConnectionOptions) {
	public constructor() {
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
}