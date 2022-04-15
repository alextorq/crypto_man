export function isEmpty(collection: Array<unknown>) {
	return collection.length === 0;
}
export function takeRight(array: Array<number>, limit: number) {
	return array.slice(-limit);
}
export function take(array: Array<number>, limit: number) {
	return array.slice(0, limit);
}
