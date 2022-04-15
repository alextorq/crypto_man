export type cb = (...params: Array<unknown>) => unknown

class EventEmitter {
	private readonly events: Record<string, Array<cb>>;

	constructor() {
		this.events = {};
	}

	on(eventName: string, callback: cb) {
		if (!this.events[eventName]) {
			this.events[eventName] = [];
		}
		this.events[eventName].push(callback);
	}

	emit(eventName: string, ...args: Array<unknown>) {
		if (this.events[eventName]) {
			this.events[eventName].forEach(callback => {
				callback(...args);
			});
		}
	}

	off(eventName: string, callback: cb) {
		if (this.events[eventName]) {
			this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
		}
	}

	once(eventName: string, callback: cb) {
		const onceCallback = (...args: Array<unknown>) => {
			callback(...args);
			this.off(eventName, onceCallback);
		};
		this.on(eventName, onceCallback);
	}

	offEvent(eventName: string) {
		this.events[eventName] = [];
	}

	getEventHandlerAmount(eventName: string) {
		return this.events[eventName].length;
	}
}

const eventEmitter = new EventEmitter();

export default eventEmitter;
