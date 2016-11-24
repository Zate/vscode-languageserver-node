import { PartialMessageInfo } from './message-info';
import { DataCallback } from './data-callback';
import { Event, Emitter } from '../events';

export interface MessageReader {
	onError: Event<Error>;
	onClose: Event<void>;
	onPartialMessage: Event<PartialMessageInfo>;
	listen(callback: DataCallback): void;
}
