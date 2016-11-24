import {
	AbstractMessageReader, MessageReader,
	DataCallback,
	MessageBuffer,
	Message, PartialMessageInfo,
	Event, Emitter
} from 'vscode-jsonrpc-common';
import { ChildProcess } from 'child_process';

export class StreamMessageReader extends AbstractMessageReader implements MessageReader {
	private readable: NodeJS.ReadableStream;
	private callback: DataCallback;
	private buffer: MessageBuffer;
	private nextMessageLength: number;
	private messageToken: number;
	private partialMessageTimer: NodeJS.Timer;
	private _partialMessageTimeout: number;

	public constructor(readable: NodeJS.ReadableStream, encoding: string = 'utf-8') {
		super();
		this.readable = readable;
		this.buffer = new MessageBuffer(encoding);
		this._partialMessageTimeout = 10000;
	}

	public set partialMessageTimeout(timeout: number) {
		this._partialMessageTimeout = timeout;
	}

	public get partialMessageTimeout(): number {
		return this._partialMessageTimeout;
	}

	public listen(callback: DataCallback): void {
		this.nextMessageLength = -1;
		this.messageToken = 0;
		this.partialMessageTimer = undefined;
		this.callback = callback;
		this.readable.on('data', (data:Buffer) => {
			this.onData(data);
		});
		this.readable.on('error', (error: any) => this.fireError(error));
		this.readable.on('close', () => this.fireClose());
	}

	private onData(data:Buffer|String): void {
		this.buffer.append(data);
		while(true) {
			if (this.nextMessageLength === -1) {
				let headers = this.buffer.tryReadHeaders();
				if (!headers) {
					return;
				}
				let contentLength = headers['Content-Length'];
				if (!contentLength) {
					throw new Error('Header must provide a Content-Length property.');
				}
				let length = parseInt(contentLength);
				if (isNaN(length)) {
					throw new Error('Content-Length value must be a number.');
				}
				this.nextMessageLength = length;
			}
			var msg = this.buffer.tryReadContent(this.nextMessageLength);
			if (msg === null) {
				/** We haven't recevied the full message yet. */
				this.setPartialMessageTimer();
				return;
			}
			this.clearPartialMessageTimer();
			this.nextMessageLength = -1;
			this.messageToken++;
			var json = JSON.parse(msg);
			this.callback(json);
		}
	}

	private clearPartialMessageTimer(): void {
		if (this.partialMessageTimer) {
			clearTimeout(this.partialMessageTimer);
			this.partialMessageTimer = undefined;
		}
	}

	private setPartialMessageTimer(): void {
		this.clearPartialMessageTimer();
		if (this._partialMessageTimeout <= 0) {
			return;
		}
		this.partialMessageTimer = setTimeout((token, timeout) => {
			this.partialMessageTimer = undefined;
			if (token === this.messageToken) {
				this.firePartialMessage({ messageToken: token, waitingTime: timeout });
				this.setPartialMessageTimer();
			}
		}, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout);
	}
}