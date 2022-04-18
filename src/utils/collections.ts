export function isEmpty(collection: Array<unknown>) {
	return collection.length === 0;
}
export function takeRight<T>(array: Array<T>, limit: number) {
	return array.slice(-limit);
}
export function take<T>(array: Array<T>, limit: number) {
	return array.slice(0, limit);
}

export function last<T = unknown>(array: Array<T>) {
	return array[array.length - 1];
}

export function first<T = unknown>(array: Array<T>) {
	return array[0];
}

export function getDifference<T>(array: Array<T>, other?: Array<T>) {
	const a = array || [];
	const b = other || [];
	const added = a.filter(item => !b.includes(item));
	const removed = b.filter(item => !a.includes(item));
	return { added, removed };
}
