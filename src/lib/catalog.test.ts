import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Woman } from '../types.ts';
import { listedWomen } from './catalog.ts';

describe('catalog visibility', () => {
	it('excludes hidden entries from normal catalog surfaces', () => {
		const women = [
			{ slug: 'listed' },
			{ slug: 'hidden', hidden: true },
		] as Woman[];

		assert.deepEqual(listedWomen(women).map((woman) => woman.slug), ['listed']);
	});
});
