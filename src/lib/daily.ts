export function dayNumber(date: Date): number {
	return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

export function dailyIndex(date: Date, itemCount: number): number {
	if (!Number.isInteger(itemCount) || itemCount < 1) {
		throw new RangeError('itemCount must be a positive integer.');
	}
	const day = dayNumber(date);
	const mixed = Math.imul(day ^ (day >>> 16), 0x45d9f3b);
	return Math.abs(mixed ^ (mixed >>> 16)) % itemCount;
}
