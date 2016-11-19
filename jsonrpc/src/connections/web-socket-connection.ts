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
	private options: WebSocketConnectionOptions;
	private socket: WebSocket;

	public connection: Promise<WebSocket>;

	public constructor(options: WebSocketConnectionOptions) {
		this.options = options;
		this.connection = new Promise((resolve, reject) => {
			try {
				let uri = 'ws://localhost:4389/'
				this.socket = new WebSocket(uri);
				this.socket.on('open', () => {
					resolve(this.socket);
				});
			} catch (err) {
				reject(err);
			}
		});
	}
}