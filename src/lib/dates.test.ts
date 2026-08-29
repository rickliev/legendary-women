import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Woman } from '../types.ts';
import women from '../data/women.json' with { type: 'json' };

const MONTH_DAY_YEAR = /^[A-Z][a-z]+ \d{1,2}, \d{4}$/;
const INTENTIONALLY_IMPRECISE = new Set([
	'amelia-earhart:died',
	'anna-m-gomez:born',
	'anne-frank:died',
	'emily-lievano:born',
	'emmeline-pankhurst:born',
	'harriet-tubman:born',
	'sacagawea:born',
	'sacagawea:died',
	'sojourner-truth:born',
]);

function expectedDisplay(isoDate: string): string {
	const [year, month, day] = isoDate.split('-').map(Number);
	const date = new Date(Date.UTC(year, month - 1, day));
	return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

describe('birth and death date consistency', () => {
	for (const woman of women as Woman[]) {
		for (const key of ['born', 'died'] as const) {
			const lifeDate = woman[key];
			if (!lifeDate) continue;

			if (!lifeDate.date) {
				it(`${woman.slug} ${key} is intentionally imprecise`, () => {
					assert.ok(
						INTENTIONALLY_IMPRECISE.has(`${woman.slug}:${key}`),
						`${woman.slug} ${key} needs a precise date or an explicit exemption`,
					);
				});
				continue;
			}

			it(`${woman.slug} ${key}.display matches "Month D, YYYY" format`, () => {
				assert.match(lifeDate.display, MONTH_DAY_YEAR);
			});

			it(`${woman.slug} ${key}.display matches its ISO date`, () => {
				assert.equal(lifeDate.display, expectedDisplay(lifeDate.date!));
			});
		}
	}
});
