import { WebSocketOptions } from '../websocket-options';

export class WebSocketConnection {
	private options: WebSocketOptions;

	public constructor(options: WebSocketOptions) {
		this.options = options;
	}
}