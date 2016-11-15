import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import { AbstractMessageWriter } from './abstract-writer';
import { MessageWriter } from './message-writer';
import { Message } from '../messages';

let ContentLength:string = 'Content-Length: ';
let CRLF = '\r\n';

export class StreamMessageWriter extends AbstractMessageWriter implements MessageWriter {

	private writable: NodeJS.WritableStream;
	private encoding: string;
	private errorCount: number;

	public constructor(writable: NodeJS.WritableStream, encoding: string = 'utf8') {
		super();
		this.writable = writable;
		this.encoding = encoding;
		this.errorCount = 0;
		this.writable.on('error', (error) => this.fireError(error));
		this.writable.on('close', () => this.fireClose());
	}

	public write(msg: Message): void {
		let json = JSON.stringify(msg);
		let contentLength = Buffer.byteLength(json, this.encoding);

		let headers: string[] = [
			ContentLength, contentLength.toString(), CRLF,
			CRLF
		];
		try {
			// Header must be written in ASCII encoding
			this.writable.write(headers.join(''), 'ascii');

			// Now write the content. This can be written in any encoding
			this.writable.write(json, this.encoding);
			this.errorCount = 0;
		} catch (error) {
			this.errorCount++;
			this.fireError(error, msg, this.errorCount);
		}
	}
}
