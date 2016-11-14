import { PartialMessageInfo } from './message-info';
import { DataCallback } from './data-callback';
import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import { AbstractMessageReader } from './abstract-reader';
import { MessageReader } from './message-reader';

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