import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { dailyIndex, dayNumber } from './daily.ts';

describe('daily selection', () => {
	it('returns the same day number throughout a local calendar day', () => {
		assert.equal(dayNumber(new Date(2026, 7, 20, 0, 1)), dayNumber(new Date(2026, 7, 20, 23, 59)));
	});

	it('selects deterministically within catalog bounds', () => {
		const date = new Date(2026, 7, 20);
		const first = dailyIndex(date, 31);
		assert.equal(first, dailyIndex(date, 31));
		assert.ok(first >= 0 && first < 31);
	});

	it('rejects an empty catalog', () => {
		assert.throws(() => dailyIndex(new Date(), 0), RangeError);
	});
});
