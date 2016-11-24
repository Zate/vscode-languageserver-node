import {
	AbstractMessageWriter, MessageWriter,
	DataCallback,
	MessageBuffer,
	Message, PartialMessageInfo,
	Event, Emitter
} from 'vscode-jsonrpc-common';
import { ChildProcess } from 'child_process';

export class IPCMessageWriter extends AbstractMessageWriter implements MessageWriter {

	private process: NodeJS.Process | ChildProcess;
	private errorCount: number;

	public constructor(process: NodeJS.Process | ChildProcess) {
		super();
		this.process = process;
		this.errorCount = 0;
		this.process.on('error', (error) => this.fireError(error));
		this.process.on('close', () => this.fireClose);
	}

	public write(msg: Message): void {
		try {
			this.process.send(msg);
			this.errorCount = 0;
		} catch (error) {
			this.errorCount++;
			this.fireError(error, msg, this.errorCount);
		}
	}
}
