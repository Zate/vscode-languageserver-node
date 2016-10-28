import { Event, Emitter } from '../events';
import { Message } from '../messages';

export interface MessageWriter {
	onError: Event<[Error, Message, number]>;
	onClose: Event<void>;
	write(msg: Message): void;
}
