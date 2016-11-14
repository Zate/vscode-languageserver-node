import { Message } from '../messages';

export interface DataCallback {
	(data: Message): void;
}
