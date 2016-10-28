import { Event, Emitter } from '../events';
import { ChildProcess } from 'child_process';
import { AbstractMessageWriter } from './abstract-writer';
import { MessageWriter } from './message-writer';
import { Message } from '../messages';

import * as SocketIOClient from 'socket.io-client';

export class WebSocketMessageWriter extends AbstractMessageWriter implements MessageWriter {
	// private process: NodeJS.Process | ChildProcess;
	// private errorCount: number;

	public constructor(process: NodeJS.Process | ChildProcess) {
		super();
		// this.process = process;
		// this.errorCount = 0;
		// this.process.on('error', (error) => this.fireError(error));
		// this.process.on('close', () => this.fireClose);
	}

	public write(msg: Message): void {
		// try {
		// 	this.process.send(msg);
		// 	this.errorCount = 0;
		// } catch (error) {
		// 	this.errorCount++;
		// 	this.fireError(error, msg, this.errorCount);
		// }
	}
}
