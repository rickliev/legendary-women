import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Woman } from '../types.ts';
import { categorySlug, listedWomen } from './catalog.ts';

describe('catalog visibility', () => {
	it('excludes hidden entries from normal catalog surfaces', () => {
		const women = [
			{ slug: 'listed' },
			{ slug: 'hidden', hidden: true },
		] as Woman[];

		assert.deepEqual(listedWomen(women).map((woman) => woman.slug), ['listed']);
	});
});

describe('category URLs', () => {
	it('creates stable, readable slugs', () => {
		assert.equal(categorySlug('Science & Technology'), 'science-and-technology');
		assert.equal(categorySlug('Civil Rights'), 'civil-rights');
	});
});
