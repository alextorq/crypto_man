export enum Sort {
	ASC = 'asc',
	DESC = 'desc',
	DEFAULT = 'default',
}

export const sortOptions = Object.values(Sort).map((value) => ({
	value,
	label: value,
}));
