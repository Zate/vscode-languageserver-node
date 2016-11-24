import {
	AbstractMessageReader, MessageReader,
	DataCallback,
	MessageBuffer,
	Message, PartialMessageInfo,
	Event, Emitter
} from 'vscode-jsonrpc-common';
import { ChildProcess } from 'child_process';

export class IPCMessageReader extends AbstractMessageReader implements MessageReader {
	private process: NodeJS.Process | ChildProcess;

	public constructor(process: NodeJS.Process | ChildProcess) {
		super();
		this.process = process;
		this.process.on('error', (error:any) => this.fireError(error));
		this.process.on('close', () => this.fireClose());
	}

	public listen(callback: DataCallback): void {
		this.process.on('message', callback);
	}
}