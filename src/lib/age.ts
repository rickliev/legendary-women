interface CalendarDate {
	year: number;
	month: number;
	day: number;
}

function parseIsoDate(value: string): CalendarDate {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (!match) throw new RangeError(`Invalid ISO date: ${value}`);

	const [, yearText, monthText, dayText] = match;
	const year = Number(yearText);
	const month = Number(monthText);
	const day = Number(dayText);
	const date = new Date(Date.UTC(year, month - 1, day));

	if (
		date.getUTCFullYear() !== year
		|| date.getUTCMonth() + 1 !== month
		|| date.getUTCDate() !== day
	) {
		throw new RangeError(`Invalid ISO date: ${value}`);
	}

	return { year, month, day };
}

export function calculateAge(birthDate: string, asOfDate: string): number {
	const birth = parseIsoDate(birthDate);
	const asOf = parseIsoDate(asOfDate);

	let age = asOf.year - birth.year;
	if (
		asOf.month < birth.month
		|| (asOf.month === birth.month && asOf.day < birth.day)
	) {
		age--;
	}

	if (age < 0) throw new RangeError('The as-of date cannot precede the birth date');
	return age;
}

export function localIsoDate(date = new Date()): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}
