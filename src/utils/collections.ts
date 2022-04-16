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
