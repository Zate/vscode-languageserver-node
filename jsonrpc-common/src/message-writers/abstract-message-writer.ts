import { Event, Emitter } from '../events';
import * as is from '../is';
import { Message } from '../messages';

export abstract class AbstractMessageWriter {
	private errorEmitter: Emitter<[Error, Message, number]>;
	private closeEmitter: Emitter<void>;

	constructor() {
		this.errorEmitter = new Emitter<[Error, Message, number]>();
		this.closeEmitter = new Emitter<void>();
	}

	public get onError(): Event<[Error, Message, number]> {
		return this.errorEmitter.event;
	}

	protected fireError(error: any, message?: Message, count?: number): void {
		this.errorEmitter.fire([this.asError(error), message, count]);
	}

	public get onClose(): Event<void> {
		return this.closeEmitter.event;
	}

	protected fireClose(): void {
		this.closeEmitter.fire(undefined);
	}

	private asError(error: any): Error {
		if (error instanceof Error) {
			return error;
		} else {
			return new Error(`Writer recevied error. Reason: ${is.string(error.message) ? error.message : 'unknown'}`);
		}
	}
}