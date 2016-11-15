import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import * as WebSocket from 'ws';

export interface WebSocketConnectionOptions {
	// possibly provide an option to spawn
	// the languageserver in websocket mode

	secure?: boolean,
	host?: string;
	port?: string;
	namespace?: string;
	path?: string;
}

export class WebSocketConnection {
	private ws: WebSocket;
	private options: WebSocketConnectionOptions;

	public constructor(options: WebSocketConnectionOptions) {
		this.options = options;
	}

	public listen(): Promise<WebSocket> {
		let uri = this.getConnectUri();

		this.ws = new WebSocket(uri);
		this.attachHandlers();

		// resolve this.socket only when we've got a connection
		return new Promise((resolve, reject) => {
			this.ws.on('open', () => {
				resolve(this.ws);
			});
		});
	}

	private getConnectUri() {
		// returns something like: 'ws://localhost:8080/jsonrpc'
		let { secure, host, port, namespace, path } = this.options;
		let protocol = secure ? 'wss' : 'ws';

		let uri = `${protocol}://${host}:${port}/`;
		return uri;
	}

	private attachHandlers() {
		let errorHandler = this.createErrorHandler();
		let closeHandler = this.createCloseHandler();

		this.ws.on('error', errorHandler);
		this.ws.on('close', closeHandler);
	}

	private createErrorHandler() {
		return (err: any): void => {
			// this.fireError(err);
		};
	}

	private createCloseHandler() {
		return (): void => {
			// this.fireClose();
		};
	}
}