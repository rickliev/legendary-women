import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Woman } from '../types.ts';
import women from '../data/women.json' with { type: 'json' };

const MONTH_DAY_YEAR = /^[A-Z][a-z]+ \d{1,2}, \d{4}$/;

function expectedDisplay(isoDate: string): string {
	const [year, month, day] = isoDate.split('-').map(Number);
	const date = new Date(Date.UTC(year, month - 1, day));
	return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

describe('birth and death date consistency', () => {
	for (const woman of women as Woman[]) {
		for (const key of ['born', 'died'] as const) {
			const lifeDate = woman[key];
			// Entries without a precise ISO date (year-only or ambiguous dates, e.g.
			// Emmeline Pankhurst's "July 14 or 15, 1858") are intentionally exempt
			// from the strict "Month D, YYYY" format checked below.
			if (!lifeDate?.date) continue;

			it(`${woman.slug} ${key}.display matches "Month D, YYYY" format`, () => {
				assert.match(lifeDate.display, MONTH_DAY_YEAR);
			});

			it(`${woman.slug} ${key}.display matches its ISO date`, () => {
				assert.equal(lifeDate.display, expectedDisplay(lifeDate.date!));
			});
		}
	}
});
