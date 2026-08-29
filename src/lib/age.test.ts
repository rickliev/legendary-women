import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateAge, localIsoDate } from './age.ts';

describe('age calculation', () => {
	it('uses the most recent birthday for a living person', () => {
		assert.equal(calculateAge('1943-11-22', '2026-08-29'), 82);
	});

	it('increments age on the birthday', () => {
		assert.equal(calculateAge('1943-11-22', '2026-11-22'), 83);
	});

	it('calculates age at death', () => {
		assert.equal(calculateAge('1820-02-15', '1906-03-13'), 86);
	});

	it('rejects invalid and reversed dates', () => {
		assert.throws(() => calculateAge('2000-02-30', '2026-08-29'), RangeError);
		assert.throws(() => calculateAge('2000-01-01', '1999-12-31'), RangeError);
	});

	it('formats a date using its local calendar day', () => {
		assert.equal(localIsoDate(new Date(2026, 7, 29, 23, 59)), '2026-08-29');
	});
});
