import { Event, Emitter } from '../events';
import { PartialMessageInfo } from './message-info';
import * as is from '../is';

export abstract class AbstractMessageReader {
	private errorEmitter: Emitter<Error>;
	private closeEmitter: Emitter<void>;
	private partialMessageEmitter: Emitter<PartialMessageInfo>;

	constructor() {
		this.errorEmitter = new Emitter<Error>();
		this.closeEmitter = new Emitter<void>();
		this.partialMessageEmitter = new Emitter<PartialMessageInfo>();
	}

	public get onError(): Event<Error> {
		return this.errorEmitter.event;
	}

	protected fireError(error: any): void {
		this.errorEmitter.fire(this.asError(error));
	}

	public get onClose(): Event<void> {
		return this.closeEmitter.event;
	}

	protected fireClose(): void {
		this.closeEmitter.fire(undefined);
	}

	public get onPartialMessage(): Event<PartialMessageInfo> {
		return this.partialMessageEmitter.event;
	}

	protected firePartialMessage(info: PartialMessageInfo): void {
		this.partialMessageEmitter.fire(info);
	}

	private asError(error: any): Error {
		if (error instanceof Error) {
			return error;
		} else {
			return new Error(`Reader recevied error. Reason: ${is.string(error.message) ? error.message : 'unknown'}`);
		}
	}
}
